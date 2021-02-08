import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import TextField from '@material-ui/core/TextField';
import Alert from '@material-ui/lab/Alert';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AxiosError } from 'axios';
import Logo from '../../components/Logo';
import apiService from '../../shared/services/api.service';
import { useUserContext } from '../../contexts/userContext';
import { RouteWithLocation } from '../../shared/types/route-with-location.type';
import { LoginResponseDto } from '../../shared/dtos/api-responses.dto';

const Login: React.FunctionComponent<RouteWithLocation<{}>> = ({ location }) => {
  const { t } = useTranslation();
  const { setUser } = useUserContext();
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setEmail(e.currentTarget.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setPassword(e.currentTarget.value);
  };

  const handleLogin = () => {
    apiService.login(email, password)
      .then((res) => {
        setUser(res);
        history.push(location.state.from || '/');
      })
      .catch((error: AxiosError<LoginResponseDto>) => {
        if (error.response?.status === 403) {
          setSnackbarOpen(true);
        }
      });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" m={1}>
        <Logo width="150" height="150" fill="#286655" />
        <TextField
          variant="outlined"
          size="small"
          id="email"
          label={t('common.labels.email')}
          value={email}
          onChange={handleEmailChange}
          autoFocus
          margin="normal"
        />
        <TextField
          variant="outlined"
          size="small"
          id="password"
          type="password"
          label={t('common.labels.password')}
          value={password}
          onChange={handlePasswordChange}
          onKeyDown={handleKeyDown}
          margin="normal"
        />
        <Button
          color="primary"
          variant="contained"
          disableElevation
          onClick={handleLogin}
          disabled={email === '' || password === ''}
        >
          {t('common.buttons.login')}
        </Button>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={5000}
          onClose={handleSnackbarClose}
        >
          <Alert severity="error" elevation={6} variant="filled">{t('pages.login.loginFailedMessage')}</Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default Login;
