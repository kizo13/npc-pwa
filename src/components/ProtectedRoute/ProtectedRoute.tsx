/* eslint-disable no-nested-ternary */
import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useUserContext } from '../../contexts/userContext';

interface ProtectedRouteProps {
  layout?: React.FunctionComponent<{}>;
}

const ProtectedRoute = ({ component: Component, layout: Layout, ...rest }: ProtectedRouteProps & RouteProps): JSX.Element | null => {
  const { user } = useUserContext();

  if (!Component) return null;

  return (
    <Route
      {...rest}
      render={
        (props) => (user
          ? !Layout
            ? <Component {...rest} {...props} />
            : <Layout><Component {...rest} {...props} /></Layout>
          : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />)
      }
    />
  );
};

export default ProtectedRoute;
