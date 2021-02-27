import React, { useEffect, useState } from 'react';
import { Switch } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import PublicRoute from './components/PublicRoute';
import ProtectedRoute from './components/ProtectedRoute';
import AppBar from './layouts/AppBarLayout';
import Login from './pages/Login';
import ListImages from './pages/ListImages';
import ListNpcs from './pages/ListNpcs';
import { ROUTES } from './shared/constants';
import apiService from './shared/services/api.service';
import { LoginResponseDto } from './shared/dtos/api-responses.dto';
import { UserContext } from './contexts/userContext';
import { FilterContext, FilterDto, initialFilterState } from './contexts/filterContext';
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
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [filter, setFilter] = useState<FilterDto>(initialFilterState);

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
              <FilterContext.Provider value={{
                open: filterOpen, setOpen: setFilterOpen, filter, setFilter,
              }}
              >
                <Switch>
                  <ProtectedRoute exact path={ROUTES.images} component={ListImages} layout={AppBar} />
                  <ProtectedRoute exact path={ROUTES.notes} component={ListNpcs} layout={AppBar} />
                  <PublicRoute exact path={ROUTES.login} component={Login} />
                </Switch>
              </FilterContext.Provider>
            </UserContext.Provider>
          </I18nextProvider>
        )}
    </>
  );
}

export default App;
