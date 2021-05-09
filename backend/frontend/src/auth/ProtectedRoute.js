import React from 'react';
import { Route } from 'react-router-dom';
import { withAuthenticationRequired } from '@auth0/auth0-react';

const ProtectedRoute = ({ component, ...args }) => (
  <Route
    render={(props) => {
      return withAuthenticationRequired(component);
    }}
    {...args}
  />
);

export default ProtectedRoute;
