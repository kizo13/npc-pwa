import React from 'react';
import Button, { ButtonProps } from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles, Theme, WithStyles } from '@material-ui/core/styles';

const styles = (theme: Theme) => ({
  spinner: {
    marginRight: theme.spacing(1),
    color: '#286655',
  },
});

const SpinnerAdornment = withStyles(styles)(({ classes }: WithStyles<typeof styles>) => (
  <CircularProgress
    className={classes.spinner}
    size={20}
  />
));

interface LoadingButtonProps {
  children: React.ReactNode,
  loading: boolean
}

const LoadingButton = ({ children, loading, ...rest }: LoadingButtonProps & ButtonProps): JSX.Element => (
  <Button {...rest}>
    {loading && <SpinnerAdornment />}
    {children}
  </Button>
);

export default LoadingButton;
