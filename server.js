const path = require('path');
const http = require('http');
const express = require('express');
const sockerio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getUsers } = require('./utils/users');
const { format } = require('path');

const app = express();
const server = http.createServer(app);
const io = sockerio(server);
const botName = 'HashBot';

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', socket => {
  socket.on('userJoin', (username) => {
    const user = userJoin(socket.id, username);
    const userList = getUsers();
    
    socket.broadcast.emit('userList', {userList});

    socket.emit('userJoined', {user, userList});

    socket.emit('message', {message: formatMessage(botName, 'Welcome to Hashtaag Chat!'), chat: {id: 'General'}});
    
    socket.broadcast
      .emit('message', {message: formatMessage(botName, `${user.username} has joined the chat!`), chat: {id: 'General'}});
  });

  // socket.on('joinRoom', ({ username, room }) => {
  //   const user = userJoin(socket.id, username, room)
    
  //   socket.join(user.room);

  //   socket.emit('message', formatMessage(botName, 'Welcome to Hashtaag Chat!'));
    
  //   socket.broadcast
  //     .to(user.room)
  //     .emit('message', formatMessage(botName, `${user.username} has joined the chat!`));

  //   io.to(user.room).emit('roomUsers', {
  //     room: user.room,
  //     users: getUsers(user.room)
  //   });
  // })

  socket.on('requestChat', (chatee) => {
    const user = getCurrentUser(socket.id);
    io.to(chatee.id).emit('authChat', {
      message: formatMessage(botName, `${user.username} requested for a chat`),
      chatee: user
    });
    socket.emit('requestPending', formatMessage(botName, `Request sent to ${chatee.username}`));
  });

  socket.on('stopChat', (chat) => {
    io.to(chat.chatee.id)
      .emit('stopChat', chat.id)
  })

  socket.on('chatMessage', ({message, chat}) => {
    const user = getCurrentUser(socket.id);
    if (chat.id === 'General'){
      io.emit('message', {message: formatMessage(user.username, message), chat});
    } else {
      socket.emit('message', {message: formatMessage(user.username, message), chat});
      io.to(chat.chatee.id)
        .emit('message', {message: formatMessage(user.username, message), chat});
    }
  });

  socket.on('disconnect', () => {
    const user = userLeave(socket.id);
    const userList = getUsers();

    if(user) {
      io.emit('message', {
        message: formatMessage(botName, `${user.username} has left the chat!`), 
        chat: {id: 'General'}
      });
      
      socket.broadcast.emit('removeAllChats', user);
      socket.broadcast.emit('userList', {userList});
    }
  });
})

const PORT = process.env.PORT || 3001

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));