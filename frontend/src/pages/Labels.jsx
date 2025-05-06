import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../Context/ContextProvider";
import NoteCard from "../components/NoteCard";
import Navbar from "../components/Navbar";
import emptyImage from "../images/empty.png";
import { useNavigate } from "react-router-dom";

const Labels = () => {
  const [notes, setNotes] = useState([]);
  const [labels, setLabels] = useState([]);
  const [query, setQuery] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/');
  }, [user, navigate]);

  const fetchNotes = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/note", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const labeledNotes = data.notes.filter(note => note.labels && note.labels.length > 0);
      setNotes(labeledNotes);

      const allLabels = new Set();
      labeledNotes.forEach(note => {
        (note.labels || []).forEach(label => allLabels.add(label));
      });
      setLabels([...allLabels]);
      
    } catch (error) {
      console.error("❌ Failed to fetch notes with labels:", error);
    }
  };

  useEffect(() => {
    if (user) fetchNotes();
  }, [user]);

  const getNotesByLabel = (label) => {
    return notes
      .filter(note => 
        note.labels && note.labels.includes(label)
      )
      .filter(note => {
        if (query.trim() === '') return true;
        const lowerQuery = query.toLowerCase();
        const matchesTitle = note.title?.toLowerCase().includes(lowerQuery);
        const matchesDescription = note.description?.toLowerCase().includes(lowerQuery);
        const matchesLabel = note.labels?.some(lab => lab.toLowerCase().includes(lowerQuery));
        return matchesTitle || matchesDescription || matchesLabel;
      });
  };

  const filteredLabels = labels.filter(label => {
    if (query.trim() === '') return true;
    return label.toLowerCase().includes(query.toLowerCase()) ||
           getNotesByLabel(label).length > 0;
  });

  return (
    <div className="bg-gray-100 min-h-screen w-full">
      <Navbar setQuery={setQuery} /> {/* Pass setQuery to Navbar */}
      <div className="p-6">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">Labels</h1>

        {filteredLabels.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <img
              src={emptyImage}
              alt="No Labels"
              className="w-64 h-64 mb-4"
            />
            <p className="text-lg text-gray-600">No Labels Found</p>
          </div>
        ) : (
          filteredLabels.map((label) => (
            <div key={label} className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">{label}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {getNotesByLabel(label).map((note) => (
                  <NoteCard
                    key={note._id}
                    note={note}
                    onEdit={() => {}}
                    deleteNote={() => {}}
                    toggleArchive={() => {}}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Labels;
