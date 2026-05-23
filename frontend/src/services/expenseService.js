import axios from 'axios';

const API = 'http://localhost:5000/api/expenses';

export const getExpenses = async () => {

  const token = localStorage.getItem('token');

  const response = await axios.get(API, {
    headers: {
      authorization: token,
    },
  });

  return response.data;
};

export const addExpense = async (expenseData) => {

  const token = localStorage.getItem('token');

  const response = await axios.post(
    API,
    expenseData,
    {
      headers: {
        authorization: token,
      },
    }
  );

  return response.data;
};

export const deleteExpense = async (id) => {

  const token = localStorage.getItem('token');

  const response = await axios.delete(
    `${API}/${id}`,
    {
      headers: {
        authorization: token,
      },
    }
  );

  return response.data;
};

export const updateExpense = async (id, expenseData) => {

  const token = localStorage.getItem('token');

  const response = await axios.put(
    `${API}/${id}`,
    expenseData,
    {
      headers: {
        authorization: token,
      },
    }
  );

  return response.data;
};