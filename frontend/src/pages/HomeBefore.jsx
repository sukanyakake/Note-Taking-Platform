import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/ContextProvider';
import Navbar from '../components/Navbar';

const HomeBefore = () => {
  const { user } = useAuth(); // Get the user data from the Auth context
  const navigate = useNavigate();

  useEffect(() => {
    // If the user is logged in, navigate to Home.js (real home page)
    if (user) {
      navigate('/home'); // Redirect to home page (after login)
    }
  }, [user, navigate]);

  return (
    <div>
      <Navbar />

      {/* Hero Section */}
      <section className="bg-blue-600 text-white text-center py-20" id="home">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-3">Collaborate. Organize. Succeed.</h1>
          <p className="text-xl mb-6">Note Taking – Real-time note-taking for teams, students, and creators.</p>
          <a href="#features" className="bg-white text-blue-600 px-6 py-3 rounded-lg shadow-md">Explore Features</a>
        </div>
      </section>

      {/* Why Keep Notes Section */}
      <section className="bg-gray-100 py-16" id="about">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-8">Why  Note Taking?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              ['⚡', 'Speed', 'Instant collaboration without lag.'],
              ['🎯', 'Focus', 'Streamlined UI for productivity.'],
              ['📚', 'Flexibility', 'From study groups to startups.']
            ].map(([icon, title, desc], i) => (
              <div key={i} className="bg-white p-6 shadow-lg rounded-lg">
                <div className="text-4xl mb-4">{icon}</div>
                <h5 className="text-xl font-semibold mb-2">{title}</h5>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="py-16" id="features">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-8">Core Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              ['📝 Smart Notes', 'Create, tag, pin, and format notes intuitively.'],
              ['🤝 Real-Time Collaboration', 'Edit with your team instantly using WebSockets.'],
              ['📡 Sync Across Devices', 'Seamless experience on all platforms.'],
              ['🔍 Organize & Search', 'Tag, filter, and search with ease.'],
              ['⏰ Reminders & Alerts', 'Stay updated on tasks and shared edits.'],
              ['🔒 Secure Access', 'Authentication, permissions, and cloud safety.']
            ].map(([title, desc], i) => (
              <div key={i} className="p-6 bg-white rounded-lg shadow-md text-center">
                <h5 className="text-xl font-semibold mb-4">{title}</h5>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-600 text-white text-center py-4">
        <p>© 2025 Keep Notes. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomeBefore;
