import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { callApi } from '../utils/api.util';
import { adminApi } from '../apis/_index';
import { useAdmin } from '../hooks/_index';
import notify from '../utils/notify';
import './Login.scss';

const Login = () => {
  const { setAdminToken } = useAdmin();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setIsLoggingIn(true);
    const result = await callApi(adminApi.login(formData));
    setIsLoggingIn(false);

    if (result?.data?.token) setAdminToken(result?.data?.token);

    notify.success('Login successful');
    navigate(0);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  return (
    <div className="login-page">
      <div className="login-pane">
        <h1>LOGIN</h1>

        <form className="login-form" onSubmit={handleLogin} onChange={handleChange}>
          <div className="login-form__input">
            <label>Username</label>
            <input
              id="username"
              placeholder="Enter username . . ."
              value={formData.username}
              onChange={() => {}}
              required
            />
          </div>

          <div className="login-form__input">
            <label>Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter password . . ."
              value={formData.password}
              onChange={() => {}}
              required
            />
          </div>

          <button className="login-form__submit" type="submit" disabled={isLoggingIn}>
            {isLoggingIn ? 'Please wait . . .' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

