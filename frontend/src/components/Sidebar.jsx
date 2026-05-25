import { Link } from 'react-router-dom';

function Sidebar() {

  return (

    <div className="w-64 h-screen sticky top-0 bg-gray-950 text-white p-6">

      <h1 className="text-3xl font-bold mb-10">
        ExpenseTracker
      </h1>

      <ul className="space-y-6">

        <li>

          <Link
            to="/dashboard"
            className="hover:text-blue-400 transition"
          >
            Dashboard
          </Link>

        </li>

        <li>

          <a
            href="#analytics"
            className="hover:text-blue-400 transition"
          >
            Analytics
          </a>

        </li>

        <li>

          <a
            href="#expenses"
            className="hover:text-blue-400 transition"
          >
            Expenses
          </a>

        </li>

        <li>

          <a
            href="#settings"
            className="hover:text-blue-400 transition"
          >
            Settings
          </a>

        </li>

      </ul>

    </div>

  );
}

export default Sidebar;