import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useSelector, useDispatch } from '../../services/store/store';
import { login } from '../../services/user/actions';
import { useNavigate, useLocation } from 'react-router-dom';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  if (isAuthenticated) {
    const from = location.state?.from || '/constructor';
    navigate(from, { replace: true });
  }

  return (
    <LoginUI
      errorText=''
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
