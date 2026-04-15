import "server-only";
import prisma from "@/lib/server/prisma";

// ── User Service ───────────────────────────────────────────────────────────
export const searchService = {
  async searchConversations(query, currentUserId) {
    if (!query || !query.trim()) {
      return {
        groups: [],
        chats: [],
        newUsers: [],
      };
    }

    const search = `%${query}%`;

    // 🔥 Run all queries in parallel
    const [groups, chatsRaw, newUsers] = await Promise.all([
      // ✅ 1. GROUPS
      prisma.conversation.findMany({
        where: {
          isGroup: true,
          groupName: {
            contains: query,
            mode: "insensitive",
          },
          participants: {
            some: {
              userId: currentUserId,
            },
          },
        },
        select: {
          id: true,
          groupName: true,
        },
        take: 10,
      }),

      // ✅ 2. EXISTING 1-1 CHATS
      prisma.conversation.findMany({
        where: {
          isGroup: false,
          participants: {
            some: {
              userId: currentUserId,
            },
          },
          AND: [
            {
              participants: {
                some: {
                  user: {
                    OR: [
                      {
                        email: {
                          contains: query,
                          mode: "insensitive",
                        },
                      },
                      {
                        name: {
                          contains: query,
                          mode: "insensitive",
                        },
                      },
                    ],
                  },
                },
              },
            },
          ],
        },
        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  name: true,
                },
              },
            },
          },
        },
        take: 10,
      }),

      // ✅ 3. NEW USERS (RAW SQL)
      prisma.$queryRawUnsafe(
        `
      SELECT u.id, u.email, u.name
      FROM "User" u
      WHERE 
        (u.email ILIKE $1 OR u.name ILIKE $1)
        AND u.id != $2
        AND NOT EXISTS (
          SELECT 1
          FROM "Participant" p1
          JOIN "Participant" p2 
            ON p1."conversationId" = p2."conversationId"
          JOIN "Conversation" c 
            ON c.id = p1."conversationId"
          WHERE 
            c."isGroup" = false
            AND p1."userId" = $2
            AND p2."userId" = u.id
        )
      LIMIT 10
      `,
        search,
        currentUserId,
      ),
    ]);

    // 🔥 Format chats (extract other user)
    const chats = chatsRaw.map((conv) => {
      const otherUser = conv.participants.find(
        (p) => p.userId !== currentUserId,
      ).user;

      return {
        conversationId: conv.id,
        user: otherUser,
      };
    });

    return {
      groups,
      chats,
      users: newUsers,
    };
  },
};
