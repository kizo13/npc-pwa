import React from 'react';
import { Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import apiService from '../../shared/services/api.service';
import { useUserContext } from '../../contexts/userContext';
import { RouteWithLocation } from '../../shared/types/route-with-location.type';

const Login: React.FunctionComponent<RouteWithLocation<{}>> = ({ location }) => {
  const { user, setUser } = useUserContext();
  const history = useHistory();

  if (user) history.push(location?.state?.from || '/');

  const handleLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    apiService.login('kizo13@gmail.com', 'admin')
      .then((res) => {
        setUser(res);
        history.push(location.state.from || '/');
      });
  };

  return (
    <div>
      <Button variant="contained" color="primary" disableElevation onClick={handleLogin}>
        Login
      </Button>
    </div>
  );
};

export default Login;
