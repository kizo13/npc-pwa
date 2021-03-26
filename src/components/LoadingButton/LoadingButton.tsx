import React from 'react';
import { ButtonProps } from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Button from '../Button';

const useStyles = makeStyles((theme) => ({
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
  loading: boolean
}

const LoadingButton = ({ children, loading, ...rest }: LoadingButtonProps & ButtonProps): JSX.Element => (
  <Button {...rest}>
    {loading && <SpinnerAdornment />}
    {children}
  </Button>
);

export default LoadingButton;
