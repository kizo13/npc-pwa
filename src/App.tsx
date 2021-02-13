import React, { useEffect, useState } from 'react';
import { Switch } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import Login from './pages/Login';
import ListNpc from './pages/ListNpc';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import apiService from './shared/services/api.service';
import { LoginResponseDto } from './shared/dtos/api-responses.dto';
import { UserContext } from './contexts/userContext';
import hu from './locale/hu.json';
import './App.scss';

i18next.init({
  interpolation: { escapeValue: false },
  lng: 'hu',
  resources: {
    hu: {
      translation: hu,
    },
  },
});

function App(): JSX.Element {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<LoginResponseDto | null>(null);

  useEffect(() => {
    apiService.refreshAccessToken()
      .then((refreshData) => {
        const accessToken = localStorage.getItem('access_token');
        setUser({ ...refreshData, access_token: accessToken } as LoginResponseDto);
        setLoading(false);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {loading
        ? <div>Loading app...</div>
        : (
          <I18nextProvider i18n={i18next}>
            <UserContext.Provider value={{ user, setUser }}>
              <Switch>
                <ProtectedRoute exact path="/" component={ListNpc} />
                <PublicRoute exact path="/login" component={Login} />
              </Switch>
            </UserContext.Provider>
          </I18nextProvider>
        )}
    </>
  );
}

export default App;
