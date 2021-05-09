import { useAuth0 } from '@auth0/auth0-react';
import { Redirect } from 'react-router-dom';

function LoginPage() {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  if (!isAuthenticated) {
    loginWithRedirect();
  } else {
    <Redirect to="/" />;
  }
  return <div>{}</div>;
}

export default LoginPage;
