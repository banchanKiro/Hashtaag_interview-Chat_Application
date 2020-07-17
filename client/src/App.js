import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Join from './components/Join';
import ChatRoom from './components/ChatRoom';

function App() {
  const user = useSelector(state => state.user)
  return (
    <Router>
      <Switch>
        <Route exact path="/" name="Join Chat" component={Join}/>
        <Route exact path="/chat">
          {user ? <ChatRoom /> : <Redirect to="/" />}
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
