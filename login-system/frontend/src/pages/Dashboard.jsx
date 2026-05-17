import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
        <p className="mb-2">Welcome, {user?.email}</p>
        <p className="mb-6">Role: {user?.role}</p>
        <button
          onClick={handleLogout}
          className="px-6 py-2 bg-red-600 rounded-full hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}