import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="flex justify-between items-center px-8 py-4 border-b-2 border-blue-600 bg-blue-50 font-sans text-base">
      <div>
        <Link to="/" className="text-blue-600 font-semibold hover:underline">
          Home
        </Link>
      </div>

      <div>
        {user ? (
          <>
            <span className="mr-4 font-semibold text-gray-800">
              Hello, {user.username}
            </span>
            <button
              onClick={logout}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-blue-600 font-semibold mr-6 hover:underline"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-blue-600 font-semibold hover:underline"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
