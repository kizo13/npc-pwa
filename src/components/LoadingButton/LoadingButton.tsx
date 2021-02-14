import React from 'react';
import Button, { ButtonProps } from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  button: {
    textTransform: 'initial',
  },
  spinner: {
    marginRight: theme.spacing(1),
    color: '#286655',
  },
}));

const SpinnerAdornment = () => {
  const classes = useStyles();
  return (
    <CircularProgress
      className={classes.spinner}
      size={20}
    />
  );
};

interface LoadingButtonProps {
  children: React.ReactNode,
  loading: boolean
}

const LoadingButton = ({ children, loading, ...rest }: LoadingButtonProps & ButtonProps): JSX.Element => {
  const classes = useStyles();
  return (
    <Button className={classes.button} {...rest}>
      {loading && <SpinnerAdornment />}
      {children}
    </Button>
  );
};

export default LoadingButton;
