import React, { useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import Login from './pages/Login';
import ListNpc from './pages/ListNpc';
import ProtectedRoute from './components/ProtectedRoute';
import apiService from './shared/services/api.service';
import { LoginResponseDto } from './shared/dtos/api-responses.dto';
import { UserContext } from './contexts/userContext';
import './App.scss';

function App(): JSX.Element {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<LoginResponseDto | null>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      setLoading(false);
    }

    apiService.refreshAccessToken()
      .then((refreshData) => {
        setUser({ ...refreshData, access_token: accessToken } as LoginResponseDto);
        setLoading(false);
      });
  }, []);

  return (
    <>
      {loading
        ? <div>Loading app...</div>
        : (
          <UserContext.Provider value={{ user, setUser }}>
            <Switch>
              <ProtectedRoute exact path="/" component={ListNpc} />
              <Route exact path="/login" component={Login} />
            </Switch>
          </UserContext.Provider>
        )}
    </>
  );
}

export default App;
