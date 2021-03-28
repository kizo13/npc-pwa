import React from 'react';
import MatButton, { ButtonProps } from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  button: {
    textTransform: 'initial',
  },
}));

const Button = ({ children, ...rest }: ButtonProps<'button'>): JSX.Element => {
  const classes = useStyles();
  return <MatButton className={classes.button} {...rest}>{children}</MatButton>;
};

export default Button;
