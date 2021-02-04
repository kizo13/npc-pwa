import { StaticContext } from 'react-router';
import { RouteComponentProps } from 'react-router-dom';
import { Location } from 'history';

type LocationState = {
  from: Location;
};

export type RouteWithLocation<P> = RouteComponentProps<P, StaticContext, LocationState>;
