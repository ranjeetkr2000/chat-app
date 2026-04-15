import "server-only";
import prisma from "@/lib/server/prisma";

// ── Auth Service ───────────────────────────────────────────────────────────
export const conversationsService = {
  async getConversationsByUser({ userId }) {
    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            userId,
          },
        },
      },
    });
    return conversations;
  },
};
