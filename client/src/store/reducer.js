import initialState from './initialState';

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

export default function (state = initialState, action) {
  switch (action.type) {
    case USER:
      return {
        ...state,
        user: action.payload
      }
    case USER_LIST:
      return {
        ...state,
        userList: action.payload
      }
    case MESSAGE:
      return {
        ...state,
        chatList: {
          ...state.chatList,
          [action.payload.chat.id]: {
            ...state.chatList[action.payload.chat.id],
            messages: [
              ...state.chatList[action.payload.chat.id].messages,
              action.payload.message
            ]            
          }
        }
      }
    case CHAT: 
      return {
        ...state,
        currentChat: action.payload
      }
    case CHAT_LIST:
      return {
        ...state,
        chatList: {
          ...state.chatList, 
          [action.payload.id]: action.payload}
      }
    case AUTHORISE_CHAT:
      return {
        ...state,
        chatList: {
          ...state.chatList,
          [action.payload]: {
            ...state.chatList[action.payload],
            authorised: true
          }
        }
      }
    case UPDATE_CHAT:
      return {
        ...state,
        currentChat: state.currentChat.id === action.payload
          ? state.chatList[action.payload]
          : state.currentChat
      }
    case REMOVE_CHAT:
      const { [action.payload]: val, ...chatList} = state.chatList;
      return {
        ...state,
        chatList,
        currentChat: state.chatList['General']
      }
    case REMOVE_ALL_CHATS:
      const list = {...state.chatList};
      Object.values(list).forEach(chat => {
        if (chat.name !== 'General' && chat.chatee.id === action.payload) {
          delete list[chat.id];
        }
      });
      return {
        ...state,
        chatList: list,
        currentChat: state.chatList['General']
      }
    default:
      return state;
  }
}