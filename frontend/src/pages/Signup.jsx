import React, { useState } from 'react';
import axios from "axios";
import { Link,useNavigate } from 'react-router-dom';
const Signup = () => {
    const [name,setName]=useState('');
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const navigate=useNavigate();
    const handleSubmit=async(e)=>{
        e.preventDefault();
        try{
        const response=await axios.post('http://localhost:5000/api/auth/register', { name,email, password });
            console.log(response);
            if(response.data.success){
                navigate('/login');
            }
        }catch(error){
            console.log(error);
        }
    }
  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-100">
      <div className="w-96 p-6 bg-white rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold  text-blue-700 text-center mb-5">Create Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-blue-700">Name</label>
            <input
              type="text"
              onChange={(e)=> setName(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Enter your name"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-blue-700">Email</label>
            <input
                onChange={(e)=> setEmail(e.target.value)}
              type="email"
              className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="you@example.com"
            />
          </div>
          <div className="mb-5">
            <label className="block text-sm font-medium text-blue-700">Password</label>
            <input
              onChange={(e)=>{setPassword(e.target.value)}}
              type="password"
              className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="******"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
          <p className="text-sm text-center text-blue-600 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Signup
