import { useEffect, useState } from 'react';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { CSVLink } from 'react-csv';

import {
  Pie,
  Bar,
} from 'react-chartjs-2';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';

import Sidebar from '../components/Sidebar';

import {
  getExpenses,
  addExpense,
  deleteExpense,
  updateExpense,
} from '../services/expenseService';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

function Dashboard() {

  const [expenses, setExpenses] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    date: '',
  });

  const [editingId, setEditingId] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');

  const [selectedCategory, setSelectedCategory] = useState('');

  const totalExpenses = expenses.reduce(
    (total, expense) =>
      total + Number(expense.amount),
    0
  );

  const weeklyExpenses = expenses
    .slice(-7)
    .reduce(
      (total, expense) =>
        total + Number(expense.amount),
      0
    );

  const monthlyExpenses = expenses.reduce(
    (total, expense) =>
      total + Number(expense.amount),
    0
  );

  const filteredExpenses = expenses.filter((expense) => {

    const matchesSearch = expense.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === '' ||
      expense.category === selectedCategory;

    return matchesSearch && matchesCategory;

  });

  const categoryData = {};

  filteredExpenses.forEach((expense) => {

    if (categoryData[expense.category]) {

      categoryData[expense.category] += Number(expense.amount);

    } else {

      categoryData[expense.category] = Number(expense.amount);

    }

  });

  const chartData = {

    labels: Object.keys(categoryData),

    datasets: [
      {
        label: 'Expenses',

        data: Object.values(categoryData),

        backgroundColor: [
          '#3B82F6',
          '#10B981',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6',
        ],

        borderWidth: 1,
      },
    ],
  };

  const weekDays = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
  ];

  const weeklyData = new Array(7).fill(0);

  expenses.forEach((expense) => {

    if (!expense.date) return;

    const day = new Date(expense.date).getDay();

    weeklyData[day] += Number(expense.amount);

  });

  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const monthlyData = new Array(12).fill(0);

  expenses.forEach((expense) => {

    if (!expense.date) return;

    const month = new Date(expense.date).getMonth();

    monthlyData[month] += Number(expense.amount);

  });

  const weeklyBarData = {

    labels: weekDays,

    datasets: [
      {
        label: 'Weekly Expenses',

        data: weeklyData,

        backgroundColor: '#3B82F6',
      },
    ],
  };

  const monthlyBarData = {

    labels: monthNames,

    datasets: [
      {
        label: 'Monthly Expenses',

        data: monthlyData,

        backgroundColor: '#10B981',
      },
    ],
  };

  const fetchExpenses = async () => {

    try {

      const data = await getExpenses();

      setExpenses(data);

    } catch (error) {

      console.log(error);

    }
  };

  useEffect(() => {

    fetchExpenses();

  }, []);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      if (editingId) {

        await updateExpense(
          editingId,
          formData
        );

        alert('Expense Updated');

        setEditingId(null);

      } else {

        await addExpense(formData);

        alert('Expense Added');

      }

      fetchExpenses();

      setFormData({
        title: '',
        amount: '',
        category: '',
        date: '',
      });

    } catch (error) {

      console.log(error);

      alert('Operation Failed');

    }
  };

  const handleDelete = async (id) => {

    try {

      await deleteExpense(id);

      fetchExpenses();

    } catch (error) {

      console.log(error);

    }
  };

  const handleEdit = (expense) => {

    setEditingId(expense._id);

    setFormData({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      date: expense.date
        ? expense.date.split('T')[0]
        : '',
    });
  };

  const downloadPDF = () => {

    const doc = new jsPDF();

    doc.text(
      'Expense Tracker Report',
      14,
      15
    );

    const tableColumn = [
      'Title',
      'Amount',
      'Category',
      'Date',
    ];

    const tableRows = [];

    filteredExpenses.forEach((expense) => {

      const expenseData = [
        expense.title,
        expense.amount,
        expense.category,
        expense.date
          ? new Date(expense.date)
              .toLocaleDateString()
          : '',
      ];

      tableRows.push(expenseData);

    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 25,
    });

    doc.save('expenses-report.pdf');
  };

  const handleLogout = () => {

    localStorage.removeItem('token');

    window.location.href = '/';

  };

  return (

    <div className="flex bg-gray-900 text-white min-h-screen">

      <Sidebar />

      <div className="flex-1 p-8">

        <div className="flex justify-between items-center mb-8">

          <h1 className="text-4xl font-bold">
            Expense Tracker Dashboard
          </h1>

          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
          >
            Logout
          </button>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">

          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">

            <h2 className="text-xl font-semibold">
              Total Expenses
            </h2>

            <p className="text-3xl mt-4">
              ₹{totalExpenses}
            </p>

          </div>

          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">

            <h2 className="text-xl font-semibold">
              Total Transactions
            </h2>

            <p className="text-3xl mt-4">
              {filteredExpenses.length}
            </p>

          </div>

          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">

            <h2 className="text-xl font-semibold">
              Weekly Expenses
            </h2>

            <p className="text-3xl mt-4">
              ₹{weeklyExpenses}
            </p>

          </div>

          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">

            <h2 className="text-xl font-semibold">
              Monthly Expenses
            </h2>

            <p className="text-3xl mt-4">
              ₹{monthlyExpenses}
            </p>

          </div>

          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">

            <h2 className="text-xl font-semibold">
              Budget Status
            </h2>

            <p className="text-3xl mt-4">
              Active
            </p>

          </div>

        </div>

        <div
          id="analytics"
          className="bg-gray-800 p-6 rounded-2xl mb-8"
        >

          <h2 className="text-2xl font-bold mb-6">
            Expense Category Analytics
          </h2>

          <div className="max-w-md mx-auto">

            <Pie data={chartData} />

          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

          <div className="bg-gray-800 p-6 rounded-2xl">

            <h2 className="text-2xl font-bold mb-6">
              Weekly Expense Analytics
            </h2>

            <Bar data={weeklyBarData} />

          </div>

          <div className="bg-gray-800 p-6 rounded-2xl">

            <h2 className="text-2xl font-bold mb-6">
              Monthly Expense Analytics
            </h2>

            <Bar data={monthlyBarData} />

          </div>

        </div>

        <div className="flex gap-4 mb-8">

          <button
            onClick={downloadPDF}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg"
          >
            Download PDF
          </button>

          <CSVLink
            data={filteredExpenses}
            filename="expenses-report.csv"
            className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-lg"
          >
            Download CSV
          </CSVLink>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">

          <input
            type="text"
            placeholder="Search Expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-3 rounded-lg bg-gray-800"
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-3 rounded-lg bg-gray-800"
          >

            <option value="">
              All Categories
            </option>

            {[...new Set(expenses.map(exp => exp.category))]
              .map((category, index) => (

                <option
                  key={index}
                  value={category}
                >
                  {category}
                </option>

              ))}

          </select>

        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8"
        >

          <input
            type="text"
            name="title"
            placeholder="Expense Title"
            value={formData.title}
            onChange={handleChange}
            className="p-3 rounded-lg bg-gray-800"
          />

          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={formData.amount}
            onChange={handleChange}
            className="p-3 rounded-lg bg-gray-800"
          />

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            className="p-3 rounded-lg bg-gray-800"
          />

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="p-3 rounded-lg bg-gray-800"
          />

          <button
            className="bg-green-600 hover:bg-green-700 rounded-lg"
          >
            {editingId
              ? 'Update Expense'
              : 'Add Expense'}
          </button>

        </form>

        <div
          id="expenses"
          className="space-y-4"
        >

          {filteredExpenses.map((expense) => (

            <div
              key={expense._id}
              className="bg-gray-800 p-4 rounded-xl flex justify-between items-center"
            >

              <div>

                <h2 className="text-xl font-semibold">
                  {expense.title}
                </h2>

                <p>
                  ₹{expense.amount} • {expense.category}
                </p>

                <p className="text-sm text-gray-400 mt-1">
                  {expense.date
                    ? new Date(expense.date)
                        .toLocaleDateString()
                    : 'No Date'}
                </p>

              </div>

              <div className="flex gap-3">

                <button
                  onClick={() => handleEdit(expense)}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(expense._id)}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
                >
                  Delete
                </button>

              </div>

            </div>

          ))}

        </div>

        <div
          id="settings"
          className="bg-gray-800 p-6 rounded-2xl mt-8"
        >

          <h2 className="text-2xl font-bold mb-4">
            Settings
          </h2>

          <p>
            More settings features coming soon...
          </p>

        </div>

      </div>

    </div>

  );
}

export default Dashboard;