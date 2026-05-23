import { useState } from 'react';
import { registerUser } from '../services/authService';

function Register() {

  const [formData, setFormData] = useState({
    name: '',
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

      const data = await registerUser(formData);

      alert('User Registered Successfully');

      console.log(data);

    } catch (error) {

      console.log(error);

      alert('Registration Failed');

    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">

      <div className="bg-gray-800 p-8 rounded-2xl w-[400px] shadow-xl">

        <h1 className="text-3xl font-bold mb-6 text-center">
          Register
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <input
            type="text"
            name="name"
            placeholder="Enter Name"
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-700 outline-none"
          />

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
            className="w-full bg-green-600 hover:bg-green-700 p-3 rounded-lg font-semibold"
          >
            Register
          </button>

        </form>

      </div>

    </div>

  );
}

export default Register;