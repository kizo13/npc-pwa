import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Snackbar from '@material-ui/core/Snackbar';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Alert from '@material-ui/lab/Alert';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AxiosError } from 'axios';
import Logo from '../../components/Logo';
import LoadingButton from '../../components/LoadingButton';
import apiService from '../../shared/services/api.service';
import { useUserContext } from '../../contexts/userContext';
import { RouteWithLocation } from '../../shared/types/route-with-location.type';
import { LoginResponseDto } from '../../shared/dtos/api-responses.dto';

const useStyles = makeStyles(() => ({
  input: {
    width: 300,
  },
}));

const Login: React.FunctionComponent<RouteWithLocation<{}>> = ({ location }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { setUser } = useUserContext();
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [pending, setPending] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setEmail(e.currentTarget.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setPassword(e.currentTarget.value);
  };

  const handleLogin = () => {
    setPending(true);
    apiService.login(email, password)
      .then((res) => {
        setUser(res);
        setPending(false);
        history.push(location.state.from || '/');
      })
      .catch((error: AxiosError<LoginResponseDto>) => {
        setPending(false);
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

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" m={1}>
        <Logo width="150" height="150" fill="#286655" />
        <TextField
          className={classes.input}
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
          className={classes.input}
          variant="outlined"
          size="small"
          id="password"
          type={showPassword ? 'text' : 'password'}
          label={t('common.labels.password')}
          value={password}
          onChange={handlePasswordChange}
          onKeyDown={handleKeyDown}
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <LoadingButton
          loading={pending}
          color="primary"
          variant="contained"
          disableElevation
          onClick={handleLogin}
          disabled={email === '' || password === ''}
        >
          {t('common.buttons.login')}
        </LoadingButton>
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
