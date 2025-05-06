import React from 'react';
import Signup from './pages/Signup';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import { ToastContainer } from 'react-toastify';
import Login from './pages/Login';
import { useAuth } from './Context/ContextProvider';
import HomeBefore from './pages/HomeBefore';
import Archive from './pages/Archive'; // Import Archive page
import Important from './pages/Important'; // Import Important page
import Trash from './pages/Trash'; // Import Trash page
import Remainders from './pages/Remainders';
import Labels from './pages/Labels';
const App = () => {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <Home /> : <HomeBefore />} />
        <Route path="/register" element={user ? <Home /> : <Signup />} />
        <Route path="/login" element={user ? <Home /> : <Login />} />
        <Route path="/archive" element={user ? <Archive /> : <Login />} />
        <Route path="/reminders" element={<Remainders />} />
        <Route path="/labels" element={<Labels />} />
        <Route path="/important" element={user ? <Important /> : <Login />} />
        <Route path="/trash" element={user ? <Trash /> : <Login />} />

      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
};

export default App;
