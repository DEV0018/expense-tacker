import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { loginUser } from '../services/authService';

function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const data = await loginUser(formData);

      localStorage.setItem(
        'token',
        data.token
      );

      alert('Login Successful');

      navigate('/dashboard');

    } catch (error) {

      console.log(error);

      alert('Login Failed');

    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">

      <div className="bg-gray-800 p-8 rounded-2xl w-[400px] shadow-xl">

        <h1 className="text-3xl font-bold mb-6 text-center">
          Login
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-700 outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-700 outline-none"
          />

          <button
            className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg font-semibold"
          >
            Login
          </button>

        </form>

      </div>

    </div>

  );
}

export default Login;