import {
  USER,
  USER_LIST,
  MESSAGE,
  CHAT,
  CHAT_LIST,
  AUTHORISE_CHAT,
  UPDATE_CHAT,
  REMOVE_CHAT,
  REMOVE_ALL_CHATS,
} from './actionTypes';

const setUser = (user) => ({
  type: USER,
  payload: user
});

const setUserList = (userList) => ({
  type: USER_LIST,
  payload: userList
});

const addMessage = (data) => ({
  type: MESSAGE,
  payload: data
});

const setChatList = (chat) => ({
  type: CHAT_LIST,
  payload: chat
});

const setCurrentChat = (chat) => ({
  type: CHAT,
  payload: chat
});

const authoriseChat = (chat) => ({
  type: AUTHORISE_CHAT,
  payload: chat.id,
});

const updateCurrentChat = (chatId) => ({
  type: UPDATE_CHAT,
  payload: chatId
});

const removeChat = (chatId) => ({
  type: REMOVE_CHAT,
  payload: chatId
});

const removeAllChats = (chatId) => ({
  type: REMOVE_ALL_CHATS,
  payload: chatId,
});

export default {
  authoriseChat,
  setUser,
  setUserList,
  addMessage,
  setChatList,
  setCurrentChat,
  updateCurrentChat,
  removeChat,
  removeAllChats,
}