import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useUserContext } from '../../contexts/userContext';

const ProtectedRoute = ({ component: Component, ...rest }: RouteProps): JSX.Element | null => {
  const { user } = useUserContext();

  if (!Component) return null;
  return (
    <Route
      {...rest}
      render={
        (props) => (user
          ? <Component {...rest} {...props} />
          : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />)
      }
    />
  );
};

export default ProtectedRoute;
