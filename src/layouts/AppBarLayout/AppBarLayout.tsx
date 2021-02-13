import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBarComponent from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
}));

const AppBar: React.FunctionComponent<{}> = ({ children }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <>
      <AppBarComponent position="sticky">
        <Toolbar variant="dense">
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit">
            {t('common.title')}
          </Typography>
        </Toolbar>
      </AppBarComponent>
      {children}
    </>
  );
};

export default AppBar;
