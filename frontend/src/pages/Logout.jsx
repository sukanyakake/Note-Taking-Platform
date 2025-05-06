import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/ContextProvider";

const Sidebar = ({ isOpen }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className={`fixed top-16 left-0 h-full bg-white shadow-lg transition-transform duration-300 z-20 w-64 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
      <ul className="p-4 space-y-4">
        {/* Your other SidebarItems here */}
        <SidebarItem onClick={handleLogout} icon={<FaSignOutAlt className="text-red-600" />} label="Logout" />
      </ul>
    </div>
  );
};

export default Sidebar;
