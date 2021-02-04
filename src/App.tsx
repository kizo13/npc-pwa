import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { UserProvider } from './hooks/useUser';
import ListNpc from './pages/ListNpc/ListNpc';
import './App.scss';

function App() {
  return (
    <UserProvider>
      <Switch>
        <Route exact path='/' component={ListNpc} />
      </Switch>
      
    </UserProvider>
  );
}

export default App;
