import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useUserContext } from '../../contexts/userContext';

const PublicRoute = ({ component: Component, ...rest }: RouteProps): JSX.Element | null => {
  const { user } = useUserContext();

  if (!Component) return null;
  return (
    <Route
      {...rest}
      render={
        (props) => (user
          ? <Redirect to="/" />
          : <Component {...rest} {...props} />)
      }
    />
  );
};

export default PublicRoute;
