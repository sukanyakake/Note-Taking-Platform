import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaStickyNote,
  FaBell,
  FaTags,
  FaStar,
  FaShareAlt,
  FaTrash,
  FaSignOutAlt,
  FaHome,
  FaArchive,
} from "react-icons/fa";

import { useAuth } from "../Context/ContextProvider";

const Sidebar = ({ isOpen }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // clear auth tokens, user state
    navigate("/"); // send user back to login/homepage
  };

  return (
    <div className={`fixed top-16 left-0 h-full bg-white shadow-lg transition-transform duration-300 z-20 w-64 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
      <ul className="p-4 space-y-4">
      <li>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-colors duration-200 w-full"
          >
            <FaHome className="text-blue-600 text-lg" />
            <span className="text-md font-medium">Home</span>
          </button>
        </li>        <SidebarItem to="/" icon={<FaStickyNote className="text-blue-600" />} label="Notes" />
        <SidebarItem to="/reminders" icon={<FaBell className="text-blue-600" />} label="Reminders" />
        <SidebarItem to="/labels" icon={<FaTags className="text-blue-600" />} label="Labels" />
        <SidebarItem to="/archive" icon={<FaArchive className="text-blue-600" />} label="Archive" />
        <SidebarItem to="/important" icon={<FaStar className="text-blue-600" />} label="Important" />
        <SidebarItem to="/shared" icon={<FaShareAlt className="text-blue-600" />} label="Shared" />
        
        <SidebarItem to="/trash" icon={<FaTrash className="text-blue-600" />} label="Trash" />
        
        <li>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-colors duration-200 w-full"
          >
            <FaSignOutAlt className="text-blue-600 text-lg" />
            <span className="text-md font-medium">Logout</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

const SidebarItem = ({ to, icon, label }) => (
  <li>
    <Link
      to={to}
      className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-colors duration-200"
    >
      <span className="text-lg">{icon}</span>
      <span className="text-md font-medium">{label}</span>
    </Link>
  </li>
);

export default Sidebar;
