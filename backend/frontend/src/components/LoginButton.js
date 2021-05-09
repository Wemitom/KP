import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import 'dotenv/config';

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();
  return (
    <div className="login-logout" onClick={() => loginWithRedirect()}>
      Войти/Зарегистрироваться
    </div>
  );
};

export default LoginButton;
