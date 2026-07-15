import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  byConversation: {},
  loading: {},
};

export const messageSlice = createSlice({
  name: "message",

  initialState,

  reducers: {
    setMessages: (state, action) => {
      const { conversationId, messages } = action.payload;

      state.byConversation[conversationId] = messages;
    },

    prependMessages: (state, action) => {
      const { conversationId, messages } = action.payload;

      if (!state.byConversation[conversationId]) {
        state.byConversation[conversationId] = [];
      }

      state.byConversation[conversationId] = [
        ...messages,
        ...state.byConversation[conversationId],
      ];
    },

    addMessage: (state, action) => {
      const message = action.payload;
      const conversationId = message.conversationId;

      if (!state.byConversation[conversationId]) {
        state.byConversation[conversationId] = [];
      }

      // Prevent duplicate messages (HTTP + Socket)
      const exists = state.byConversation[conversationId].some(
        (m) => m.id === message.id,
      );

      if (!exists) {
        state.byConversation[conversationId].push(message);
      }
    },

    updateMessage: (state, action) => {
      const message = action.payload;
      const conversationId = message.conversationId;

      const messages = state.byConversation[conversationId];

      if (!messages) return;

      const index = messages.findIndex(
        (m) => m.id === message.id,
      );

      if (index !== -1) {
        messages[index] = message;
      }
    },

    deleteMessage: (state, action) => {
      const { conversationId, messageId } = action.payload;

      const messages = state.byConversation[conversationId];

      if (!messages) return;

      state.byConversation[conversationId] = messages.filter(
        (m) => m.id !== messageId,
      );
    },

    clearMessages: (state, action) => {
      delete state.byConversation[action.payload];
    },

    clearAllMessages: (state) => {
      state.byConversation = {};
    },
  },
});

export const {
  setMessages,
  prependMessages,
  addMessage,
  updateMessage,
  deleteMessage,
  clearMessages,
  clearAllMessages,
} = messageSlice.actions;

export default messageSlice.reducer;