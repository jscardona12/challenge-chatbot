import React from 'react';
import './App.css';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Authentication from './pages/authentication/Authentication.jsx';
import Chat from './pages/chat/Chat.jsx';
import ChatRoom from './pages/chat/ChatRoom.jsx';
import NotFound from "./pages/notfound/NotFound";

function App() {
  return (
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={Authentication} />
          <Route path="/chat/" exact component={Chat} />
          <Route path="/chat/:userId/:room" component={ChatRoom} />
          <Route component={NotFound} />
        </Switch>
      </BrowserRouter>
  );
}

export default App;
