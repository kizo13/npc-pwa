import React from 'react';
import MaterialAvatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import { DEFAULT_AVATAR_SRC } from '../../shared/constants';

interface AvatarProps {
  user: string;
  src: string | undefined;
  size?: 'small' | 'large';
}

const useStyles = makeStyles((theme) => ({
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));

const Avatar = ({ user, src, size }: AvatarProps): JSX.Element => {
  const classes = useStyles();
  const userSrc = src || DEFAULT_AVATAR_SRC;
  return (<MaterialAvatar alt={user} className={`${size ? classes[size] : ''}`} src={`data:image/png;base64,${userSrc}`} />);
};

export default Avatar;
