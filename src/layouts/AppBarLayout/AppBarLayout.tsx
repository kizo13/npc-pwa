import React, { useMemo, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';

import Alert from '@material-ui/lab/Alert';
import AppBarComponent from '@material-ui/core/AppBar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Snackbar from '@material-ui/core/Snackbar';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import Description from '@material-ui/icons/Description';
import FindReplace from '@material-ui/icons/FindReplace';
import ExitToApp from '@material-ui/icons/ExitToApp';
import MenuIcon from '@material-ui/icons/Menu';
import Panorama from '@material-ui/icons/Panorama';
import SettingsIcon from '@material-ui/icons/Settings';

import Avatar from '../../components/Avatar';

import apiService from '../../shared/services/api.service';
import { useUserContext } from '../../contexts/userContext';
import { useToolbarContext } from '../../contexts/toolbarContext';
import { ROUTES } from '../../shared/constants';
import { version } from '../../../package.json';
import { LoginResponseDto } from '../../shared/dtos/api-responses.dto';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  drawer: {
    width: 300,
  },
  drawerPaper: {
    width: 300,
  },
  footer: {
    position: 'fixed',
    bottom: 0,
    textAlign: 'center',
    paddingBottom: 10,
    width: 300,
  },
  footerVersion: {
    fontSize: 9,
  },
}));

const AppBar: React.FunctionComponent<{}> = ({ children }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const classes = useStyles();
  const { user, setUser } = useUserContext();
  const { actions } = useToolbarContext();
  const [leftOpen, setLeftOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const localtionLabel: string = useMemo(() => {
    const label = location.pathname.substring(1);
    return t(!label ? 'common.layout.drawer.images' : `common.layout.drawer.${label}`);
  }, [location, t]);

  const handleLeftDrawerOpen = (): void => {
    setLeftOpen(true);
  };

  const handleLeftDrawerClose = (): void => {
    setLeftOpen(false);
  };

  const handleLogout = (): void => {
    apiService.logout()
      .then(() => setUser(null))
      .catch(() => {
        setSnackbarOpen(true);
      });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <AppBarComponent position="sticky">
        <Toolbar variant="dense">
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={handleLeftDrawerOpen}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {t('common.title')}
            {` - ${localtionLabel}`}
          </Typography>
          {actions.map(({
            label, onClick, icon: Icon, className, isVisible,
          }) => (isVisible === undefined || isVisible === true ? (
            <IconButton
              key={`action-button-${label}`}
              className={className}
              aria-label={label}
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={onClick}
              color="inherit"
            >
              <Icon />
            </IconButton>
          ) : null))}
        </Toolbar>
      </AppBarComponent>

      <SwipeableDrawer
        className={classes.drawer}
        classes={{ paper: classes.drawerPaper }}
        anchor="left"
        open={leftOpen}
        onOpen={handleLeftDrawerOpen}
        onClose={handleLeftDrawerClose}
      >
        <Card elevation={0}>
          <CardHeader
            avatar={
              <Avatar src={(user as LoginResponseDto).data.avatar?.blob} user={(user as LoginResponseDto).data.username} />
            }
            action={(
              <IconButton aria-label="settings">
                <SettingsIcon />
              </IconButton>
            )}
            title={(user as LoginResponseDto).data.username}
            subheader={(user as LoginResponseDto).data.email}
          />
        </Card>
        <Divider />
        <List>
          <ListItem button component={NavLink} to={ROUTES.images} activeClassName="Mui-selected" exact onClick={handleLeftDrawerClose}>
            <ListItemIcon><Panorama /></ListItemIcon>
            <ListItemText primary={t('common.layout.drawer.images')} />
          </ListItem>
          <ListItem button component={NavLink} to={ROUTES.notes} activeClassName="Mui-selected" exact onClick={handleLeftDrawerClose}>
            <ListItemIcon><Description /></ListItemIcon>
            <ListItemText primary={t('common.layout.drawer.notes')} />
          </ListItem>
          <Divider />
          <ListItem
            button
            component={NavLink}
            to={ROUTES.namegenerator}
            activeClassName="Mui-selected"
            exact
            onClick={handleLeftDrawerClose}
          >
            <ListItemIcon><FindReplace /></ListItemIcon>
            <ListItemText primary={t('common.layout.drawer.namegenerator')} />
          </ListItem>
          <Divider />
          <ListItem button onClick={handleLogout}>
            <ListItemIcon><ExitToApp /></ListItemIcon>
            <ListItemText primary={t('common.layout.drawer.logout')} />
          </ListItem>
          <div className={classes.footer}>
            <Typography className={classes.footerVersion}>
              {`v${version}`}
              {process.env.REACT_APP_GIT_SHA && `-${process.env.REACT_APP_GIT_SHA}`}
            </Typography>
          </div>
        </List>
      </SwipeableDrawer>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
      >
        <Alert severity="error" elevation={6} variant="filled">
          {t('pages.logout.logoutFailedMessage.title')}
          <br />
          <small>{t('pages.logout.logoutFailedMessage.description')}</small>
        </Alert>
      </Snackbar>
      {children}
    </>
  );
};

export default AppBar;
