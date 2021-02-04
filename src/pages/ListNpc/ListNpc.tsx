import React from 'react';
import { Button } from '@material-ui/core';
import { useUserContext } from '../../contexts/userContext';
import apiService from '../../shared/services/api.service';
import logo from '../../logo.svg';

const ListNpc: React.FunctionComponent<{}> = () => {
  const API_URL = process.env.REACT_APP_API_URL;

  const { user, setUser } = useUserContext();

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    apiService.logout()
      .then(() => setUser(null));
  };

  const handleGetUsers = (e: React.MouseEvent) => {
    e.preventDefault();
    apiService.getUsers()
      .then((users) => console.table(users));
  };

  return (
    <div>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit
            {' '}
            <code>src/App.tsx</code>
            {' '}
            and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>

          <Button variant="contained" color="primary" disableElevation onClick={handleLogout}>
            Logout
          </Button>

          <Button variant="contained" color="primary" disableElevation onClick={handleGetUsers}>
            Get users
          </Button>
          <div style={{ fontSize: 10 }}>
            <p>{API_URL}</p>
            <p>user data from context:</p>
            <code>{JSON.stringify(user)}</code>
          </div>
        </header>
      </div>
    </div>
  );
};

export default ListNpc;
