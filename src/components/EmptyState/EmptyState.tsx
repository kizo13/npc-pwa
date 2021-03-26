import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { SvgIconTypeMap, Typography } from '@material-ui/core';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import grey from '@material-ui/core/colors/grey';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    minHeight: `calc(100vh - 48px - ${2 * theme.spacing(2)}px)`,
    color: grey[700],
  },
  icon: {
    marginBottom: theme.spacing(2),
    fontSize: theme.typography.fontSize * 5,
  },
  actions: {
    marginTop: theme.spacing(2),
  },
  actionButton: {
    '& + &': {
      marginLeft: theme.spacing(1),
    },
  },
}));

interface EmptyStateAction {
  label: string,
  func: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
}

interface EmptyStateProps {
  icon: OverridableComponent<SvgIconTypeMap>,
  title: string,
  subtitle?: string,
  actions?: Array<EmptyStateAction>,
}

const EmptyState = ({
  icon: Icon, title, subtitle, actions,
}: EmptyStateProps): JSX.Element => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.icon}><Icon fontSize="inherit" /></div>
      <Typography gutterBottom variant="h5" component="h2">{title}</Typography>
      {subtitle && (
        <Typography gutterBottom component="p">{subtitle}</Typography>
      )}
      {actions && (
        <div className={classes.actions}>
          {actions.map((action) => (
            <Button
              key={`empty-action-${action.label}`}
              className={classes.actionButton}
              variant="contained"
              color="primary"
              onClick={action.func}
            >
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
