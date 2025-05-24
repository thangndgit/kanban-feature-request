import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import notify from '../utils/notify';
import { callApi } from '../utils/api';
import { adminApi } from '../apis';
import { useAdmin } from '../hooks';
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
    notify.success('Login successful');
    if (result?.data?.token) setAdminToken(result?.data?.token);

    navigate(0);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  return (
    <div className="mtm-login-page">
      <div className="mtm-login-pane">
        <h1>LOGIN</h1>

        <form className="mtm-login-form" onSubmit={handleLogin} onChange={handleChange}>
          <div className="mtm-login-form__input">
            <label>Username</label>
            <input id="username" placeholder="Enter user name . . ." required value={formData.username} />
          </div>

          <div className="mtm-login-form__input">
            <label>Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter password . . ."
              required
              value={formData.password}
            />
          </div>

          <button className="mtm-login-form__submit" type="submit" disabled={isLoggingIn}>
            {isLoggingIn ? 'Please wait . . .' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
