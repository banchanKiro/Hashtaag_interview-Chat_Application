import React, { useState } from 'react';
import {socket} from '../socket';
import { connect } from 'react-redux';
import actions from '../store/actionCreators';

const Join = ({history, setUser, setUserList}) => {
  const [username, setUsername] = useState('');

  const joinChat = (e) => {
    e.preventDefault();
    socket.emit('userJoin', username);
    socket.on('userJoined', ({user, userList}) => {
      setUser(user);
      setUserList(userList);
      history.push('/chat');
    })
  }

  return (
		<div className="join-container">
			<header className="join-header">
				<h1><i className="fab fa-slack-hash"></i> Hashtaag Chat</h1>
			</header>
			<main className="join-main">
				<form action="chat.html">
					<div className="form-control">
						<label htmlFor="username">Username</label>
						<input
							type="text"
							name="username"
							id="username"
              placeholder="Enter username..."
              value={username}
              onChange={(e) => {setUsername(e.target.value)}}
							required
						/>
					</div>
					<button type="submit" className="btn" onClick={joinChat}>Join Chat</button>
				</form>
			</main>
		</div>
  )
}

export default connect(null, {
  setUserList: actions.setUserList,
  setUser: actions.setUser
})(Join);