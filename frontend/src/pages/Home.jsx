import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from "react-toastify";
import { useAuth } from '../Context/ContextProvider';
import Navbar from '../components/Navbar';
import NoteModal from '../components/NoteModal';
import NoteCard from '../components/NoteCard';
import noteImage from '../images/image.png';
import emptyImage from '../images/empty.png';

const Home = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState(null);
  const [view, setView] = useState('all');
  const [query, setQuery] = useState(''); // Added query state
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) navigate('/');
  }, [user, navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      notes.forEach((note) => {
        if (note.reminderAt && !note.reminded) {
          const reminderTime = new Date(note.reminderAt);
          if (Math.abs(now - reminderTime) < 10000) {
            toast.info(`⏰ Reminder: ${note.title}`, { autoClose: 5000 });
            note.reminded = true; // Prevent duplicate toasts in-session
          }
        }
      });
    }, 10000); // every 10s

    return () => clearInterval(interval);
  }, [notes]);

  const fetchNotes = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/note", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setNotes(data.notes);
    } catch (error) {
      console.error("❌ Failed to fetch notes:", error);
    }
  };

  useEffect(() => {
    if (user) fetchNotes();
    else setNotes([]);
  }, [user]);

  const filteredNotes = notes
  .filter(note => {
    switch (view) {
      case 'important':
        return note.isImportant;
      case 'reminders':
        return note.reminderAt && new Date(note.reminderAt) > new Date();
      case 'archived':
        return note.archived;
      case 'trashed':
        return note.trashed;
      case 'labels':
        return note.labels && note.labels.length > 0;
      default:
        return !note.trashed;
    }
  })
  .filter(note => {
    if (query.trim() === '') return true;
    const lowerQuery = query.toLowerCase();
    const matchesTitle = note.title?.toLowerCase().includes(lowerQuery);
    const matchesDescription = note.description?.toLowerCase().includes(lowerQuery);
    const matchesLabels = note.labels?.some(label => label.toLowerCase().includes(lowerQuery));
    return matchesTitle || matchesDescription || matchesLabels;
  });


  const openModal = (note = null) => {
    setCurrentNote(note);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentNote(null);
  };

  const addNote = async ({ title, description, isImportant, labels, reminderAt ,sharedWith}) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/note/add',
        { title, description, isImportant, labels, reminderAt ,sharedWith},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        toast.success("Note Added");
        fetchNotes();
        closeModal();
      }
    } catch (error) {
      console.error("❌ Error adding note:", error);
    }
  };

  const editNote = async ({ id, title, description, isImportant, labels, reminderAt,sharedWith }) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/note/${id}`,
        { title, description, isImportant, labels, reminderAt,sharedWith },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        toast.success("Note Edited Successfully");
        fetchNotes();
        closeModal();
      }
    } catch (error) {
      console.error("❌ Error editing note:", error);
    }
  };

  const deleteNote = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/note/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        toast.success("Note Deleted");
        fetchNotes();
      }
    } catch (error) {
      console.error("❌ Error deleting note:", error);
    }
  };

  const toggleArchive = async (id, archived) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/note/${id}`,
        { archived: !archived },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        toast.success(archived ? "Note Unarchived" : "Note Archived");
        fetchNotes();
      }
    } catch (error) {
      console.error("❌ Error updating archive status:", error);
    }
  };

  return (
    <div className="bg-gray-200 min-h-screen min-w-screen">
      {/* Pass setQuery prop to Navbar */}
      <Navbar setQuery={setQuery} />

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-4 justify-center mt-4">
        <button onClick={() => setView('all')} className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">All</button>
        <button onClick={() => setView('important')} className="bg-yellow-500 text-white px-4 py-2 rounded shadow hover:bg-yellow-600">Important</button>
        <button onClick={() => setView('reminders')} className="bg-purple-500 text-white px-4 py-2 rounded shadow hover:bg-purple-600">Reminders</button>
        <button onClick={() => setView('archived')} className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600">Archived</button>
        <button onClick={() => setView('trashed')} className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600">Trash</button>
        <button onClick={() => setView('labels')} className="bg-indigo-500 text-white px-4 py-2 rounded shadow hover:bg-indigo-600">Labels</button>
      </div>

      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center col-span-full py-20">
            <img src={noteImage} alt="No notes" className="w-64 h-64 mb-4 cursor-pointer" />
            <p className="text-lg text-gray-600">Looks like you haven't added any notes yet!</p>
            <button onClick={() => openModal()} className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition">
              Add Your First Note
            </button>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center col-span-full py-20">
            <img src={emptyImage} alt="No notes" className="w-64 h-64 mb-4 cursor-pointer" />
            <p className="text-lg text-gray-600">No Notes Match this category!</p>
          </div>
        ) : (
          filteredNotes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onEdit={() => openModal(note)}
              deleteNote={deleteNote}
              toggleArchive={() => toggleArchive(note._id, note.archived)}
            />
          ))
        )}
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => openModal()}
        className="fixed right-4 bottom-4 text-4xl bg-blue-700 text-white font-bold p-4 rounded-full shadow-lg"
      >
        +
      </button>

      {/* Note Modal */}
      {isModalOpen && (
        <NoteModal
          currentNote={currentNote}
          closeModel={closeModal}
          addNote={addNote}
          editNote={editNote}
        />
      )}
    </div>
  );
};

export default Home;
