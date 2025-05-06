import React ,{useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/ContextProvider";

import { FaBars } from "react-icons/fa"; // Import the hamburger icon
import Sidebar from "./Sidebar";

export const Navbar = ({ setQuery }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

 return (
    <>
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        
           
      {  user && <button className="text-2xl" onClick={toggleSidebar}><FaBars/></button>   }          
            <h1 className="text-2xl font-bold">Note Taking</h1>
        {user && (
          <input
            type="text"
            placeholder="Search notes..."
            onChange={(e) => setQuery(e.target.value)}
            className="bg-white text-black px-4 py-2 rounded mb-2 md:mb-0 md:mx-4 w-full md:w-auto"
          />
        )}

        <div className="flex items-center space-x-4">
          {!user ? (
            <>
              <Link to="#about" className="hover:underline">About</Link>
              <Link to="#features" className="hover:underline">Features</Link>
              <Link to="#contact" className="hover:underline">Contact</Link>
              <Link to="/login" className="bg-white text-blue-600 px-4 py-2 rounded-lg">Login</Link>
              <Link to="/register" className="bg-white text-blue-600 px-4 py-2 rounded-lg">Register</Link>
            </>
          ) : (
            <>
            <span className="font-medium text-2xl flex items-center space-x-2">
  <span className="text-yellow-400 ">👋</span>
  
  <span className="text-white-600">Hey!</span>
  <span className="text-white font-semibold px-3 py-1 rounded-lg shadow-lg">
  {user.name}
</span>
</span>

                <button onClick={logout} className="bg-white text-blue-600 px-4 py-2 rounded-lg">
                                Logout
                            </button>
            </>
          )}
        </div>
      </div>
    </nav>
    <Sidebar isOpen={isSidebarOpen}/>
    </>
  );
};

export default Navbar;
