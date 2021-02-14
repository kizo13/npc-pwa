import React from 'react';
import Button from '@material-ui/core/Button';
import { useUserContext } from '../../contexts/userContext';
import apiService from '../../shared/services/api.service';

const ListImages: React.FunctionComponent<{}> = () => {
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
          <Button variant="contained" color="primary" disableElevation onClick={handleLogout}>
            Logout
          </Button>

          <Button variant="contained" color="primary" disableElevation onClick={handleGetUsers}>
            Get users
          </Button>
          <div style={{ fontSize: 10 }}>
            <p>user data from context:</p>
            <code>{JSON.stringify(user)}</code>
          </div>
        </header>
      </div>
    </div>
  );
};

export default ListImages;
