import React from 'react';
import { Button } from '@material-ui/core';
import apiService from '../../shared/services/api.service';
import logo from '../../logo.svg';

const ListNpc: React.FunctionComponent<any> = () => {
  const API_URL = process.env.REACT_APP_API_URL;

  const handleLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    apiService.login('kizo13@gmail.com', 'admin')
    .then(res => console.log(res))
  };

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    apiService.logout()
    .then(() => console.log('logged out'))
  };

  const handleGetUsers = (e: React.MouseEvent) => {
    e.preventDefault();
    apiService.getUsers()
    .then(users => console.table(users))
  };

  return (
    <div>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <Button variant="contained" color="primary" disableElevation onClick={handleLogin}>
            Login
          </Button>

          <Button variant="contained" color="primary" disableElevation onClick={handleLogout}>
            Logout
          </Button>

          <Button variant="contained" color="primary" disableElevation onClick={handleGetUsers}>
            Get users
          </Button>
          <p>{API_URL}</p>
        </header>
      </div>
    </div>
  )
};

export default ListNpc;
