import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import { socket } from '../socket';
import actions from '../store/actionCreators';

export function ChatRoom ({
  addMessage,
  authoriseChat,
  setChatList,
  setCurrentChat,
  setUserList,
  updateCurrentChat,
  removeChat,
  removeAllChats,
  chatList,
  currentChat,
  user,
  users,
}) {
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    socket.on('userList', ({userList}) => {
      setUserList(userList);
    });

    socket.on('message', (data) => {
      authoriseChat(data.chat);
      updateCurrentChat(data.chat.id);
      addMessage(data)
    }); 

    socket.on('authChat', ({chatee, message}) => {
      const chat = {
        id: `${chatee.id}-${user.id}`,
        name: chatee.username,
        chatee,
        authorised: true,
        messages: [message]
      };
      setChatList(chat);
    });

    socket.on('stopChat', (chatId) => {
      removeChat(chatId);
    });

    socket.on('removeAllChats', (chatee) => {
      removeAllChats(chatee.id);
    })

    return () => socket.disconnect();

  }, []);

  const sendMessage = (e) => {
    e.preventDefault();

    if (currentChat.authorised) {
      socket.emit('chatMessage', {message, chat: currentChat});
      setMessage('')
      document.getElementById('msg').focus();
    }
  }

  const privateChat = (chatee) => {
    const keys = Object.keys(chatList);
    const check = keys.findIndex(chat => (chat === `${chatee.id}-${user.id}` || chat === `${user.id}-${chatee.id}`));
    if (check === -1) {
      socket.emit('requestChat', chatee);
      socket.on('requestPending', (message) => {
        const chat = {
          id: `${user.id}-${chatee.id}`,
          name: chatee.username,
          chatee,
          authorised: false,
          messages: [message]
        };
        setChatList(chat);
      })
    } else {
      setCurrentChat(chatList[keys[check]]);
    }
  }

  const stopChat = (chat) => {
    socket.emit('stopChat', chat);
    removeChat(chat.id);
  }
  
  return (
    <div className="chat-container">
      <header className="chat-header">
        <h1><i className="fab fa-slack-hash"></i> Hashtaag Chat</h1>
        <h3>{currentChat.name}</h3>
        <a href='/' className="btn">Exit Chat</a>
      </header>
      <main className="chat-main">
        <div className="chat-sidebar">
          <h3><i className="fas fa-comments"></i> Chats</h3>
          <ul id="chats">
            {Object.entries(chatList).map(([chat, value]) => {
              return (
              <li 
                key={chat} style={{
                  background: chat === currentChat.id ? '#667AFF' : '#7386FF',
                  color: value.authorised ? 'white'  : '#F6CBCF'
                }}
                onClick={()=>{setCurrentChat(value)}}
                >
                {value.name} {chat !== 'General' 
                  ? <i 
                    className="fas fa-comment-slash" 
                    style={{float: 'right'}}
                    onClick={(e) => {
                      e.stopPropagation();
                      stopChat(value)
                    }}
                  ></i>
                  : ''
                }
              </li>
              )
            }
            )}
          </ul>
          <h3><i className="fas fa-users"></i> Users</h3>
          <ul id="users">
            {users.map(onlineUser => (
              <li key={onlineUser.id}>
                {onlineUser.username} { onlineUser.id === user.id 
                  ? '' 
                  : <i 
                      className="far fa-comment-dots" 
                      style={{
                        float: 'right',
                        cursor: 'pointer'
                        }} 
                      onClick={() => (privateChat(onlineUser))}>
                    </i>
                  }
              </li>
            ))}
          </ul>
        </div> 
        <div className="chat-messages">
          {chatList[currentChat.id].messages
              .map((message, index) => (
                <div className="message" key={index}>
                  <p className="meta">{message.username} <span>{message.time}</span></p>
                  <p className="text">
                    {message.text}
                  </p>
                </div>
              )
            )
          }
        </div>
      </main>
      <div className="chat-form-container">
        <form id="chat-form">
          <input
            id="msg"
            type="text"
            placeholder="Enter Message"
            required
            autoComplete="off"
            value={message}
            onChange={(e) => (setMessage(e.target.value))}
          />
          <button className="btn" onClick={sendMessage}><i className="fas fa-paper-plane"></i> Send</button>
        </form>
      </div>
    </div>
  )
  
}

const mapStateToProps = state => ({
  user: state.user,
  users: state.userList,
  chatList: state.chatList,
  currentChat: state.currentChat,
});

export default connect(mapStateToProps, {
  setUserList: actions.setUserList,
  addMessage: actions.addMessage,
  setChatList: actions.setChatList,
  setCurrentChat: actions.setCurrentChat,
  authoriseChat: actions.authoriseChat,
  updateCurrentChat: actions.updateCurrentChat,
  removeChat: actions.removeChat,
  removeAllChats: actions.removeAllChats,
})(ChatRoom);
