import React, { useEffect, useState } from "react";
import {
  FaBell, FaDownload, FaImage, FaUserPlus, FaArchive,
  FaTags, FaClock, FaTrash, FaStar
} from 'react-icons/fa';
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md';
import { toast } from "react-toastify";
import DownloadNote from './DownloadNote'; // Import the component

const NoteModal = ({ closeModel, addNote, currentNote, editNote }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isImportant, setIsImportant] = useState(false);
  const [labels, setLabels] = useState([]);
  const [labelInput, setLabelInput] = useState('');
  const [reminderAt, setReminderAt] = useState('');
  const [clickLabel, setClickLabel] = useState(false);
  const [clickReminder, setClickReminder] = useState(false);
  const [isArchived, setIsArchived] = useState(false);
  const [clickUser, setClickUser] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [sharedUsers, setSharedUsers] = useState([]);

  const addUser = () => {
    if (userInput.trim() && !sharedUsers.includes(userInput.trim())) {
      setSharedUsers(prevUsers => [...prevUsers, userInput.trim()]);
      setUserInput('');
    }
  };

  const removeUser = (user) => {
    setSharedUsers(prevUsers => prevUsers.filter(u => u !== user));
  };

  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title || '');
      setDescription(currentNote.description || '');
      setIsImportant(currentNote.isImportant || false);
      setLabels(currentNote.labels || []);
      setReminderAt(currentNote.reminderAt || '');
      setIsArchived(currentNote.archived || false);
      setSharedUsers(currentNote.sharedWith || []); // <-- Add this
    } else {
      setTitle('');
      setDescription('');
      setIsImportant(false);
      setLabels([]);
      setReminderAt('');
      setIsArchived(false);
      setSharedUsers([]);
    }
  }, [currentNote]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const noteData = {
      title,
      description,
      isImportant,
      labels,
      reminderAt,
      isArchived,
      editedAt: new Date(),
      sharedWith: sharedUsers
    };

    currentNote ? editNote({ ...noteData, id: currentNote._id }) : addNote(noteData);
    closeModel();
  };

  const addLabel = () => {
    if (labelInput.trim() && !labels.includes(labelInput)) {
      setLabels([...labels, labelInput.trim()]);
      setLabelInput('');
    }
  };

  const removeLabel = (label) => {
    setLabels(labels.filter(l => l !== label));
  };

  const handleReminder = () => {
    if (!reminderAt) {
      toast.warn("Select a reminder time first.");
    } else {
      toast.info(`🔔 Reminder set for ${new Date(reminderAt).toLocaleString()}`);
    }
  };

  const toggleArchive = () => {
    setIsArchived(!isArchived);
    toast.info(isArchived ? "Note Archived" : "Note Unarchived");
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-sky-100 p-8 rounded-2xl w-[90%] max-w-lg relative shadow-xl">
        <button
          className="absolute top-3 right-5 text-blue-600 font-semibold hover:underline text-sm"
          onClick={closeModel}
        >
          Close
        </button>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-between items-center mb-3">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note Title"
              className="bg-transparent text-xl font-semibold text-gray-800 w-full focus:outline-none"
              required
            />
            <FaStar
              className={`ml-3 text-3xl cursor-pointer transition ${
                isImportant ? "text-yellow-400" : "text-gray-300"
              } hover:text-yellow-500`}
              onClick={() => setIsImportant(!isImportant)}
              title="Mark as Important"
            />
          </div>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write your description..."
            className="bg-transparent text-gray-700 w-full mt-2 h-40 resize-none focus:outline-none text-base"
            required
          />

          {/* Labels */}
          {clickLabel && (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={labelInput}
                  onChange={(e) => setLabelInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addLabel())}
                  placeholder="Add label"
                  className="border px-2 py-1 rounded"
                />
                <button
                  type="button"
                  onClick={addLabel}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                >
                  Add
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {labels.map(label => (
                  <span
                    key={label}
                    className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    {label}
                    <button onClick={() => removeLabel(label)} className="text-red-500 ml-1">×</button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Users */}
          {clickUser && (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addUser())}
                  placeholder="Enter user's email or username"
                  className="border px-2 py-1 rounded"
                />
                <button
                  type="button"
                  onClick={addUser}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {sharedUsers.map(user => (
                  <span
                    key={user}
                    className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    {user}
                    <button onClick={() => removeUser(user)} className="text-red-500 ml-1">×</button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Reminder */}
          {clickReminder && (
            <div className="flex items-center gap-3 mt-4">
              <input
                type="datetime-local"
                value={reminderAt}
                onChange={(e) => setReminderAt(e.target.value)}
                onBlur={handleReminder}
                className="border rounded px-2 py-1"
              />
            </div>
          )}

          {/* Toolbar */}
          <div className="flex justify-between items-center mt-6 text-gray-700 text-2xl">
            <div className="flex gap-x-4 items-center">
              <DownloadNote 
                title={title}
                description={description}
                labels={labels}
                reminderAt={reminderAt}
              />
              <FaImage className="cursor-pointer hover:text-black" />
              <FaUserPlus onClick={() => setClickUser(!clickUser)} className="cursor-pointer hover:text-black" />
              <FaTags onClick={() => setClickLabel(!clickLabel)} className="cursor-pointer hover:text-black" />
              <FaBell
                className="cursor-pointer hover:text-black"
                onClick={() => setClickReminder(!clickReminder)}
                title="Set Reminder"
              />
              <FaArchive
                className={`cursor-pointer hover:text-black ${isArchived ? "text-green-500" : "text-gray-500"}`}
                onClick={toggleArchive}
                title={isArchived ? "Unarchive" : "Archive"}
              />
            </div>

            <div className="flex gap-x-2 items-center">
              <MdNavigateBefore className="cursor-pointer hover:text-black" />
              <MdNavigateNext className="cursor-pointer hover:text-black" />
            </div>

            <div className="flex gap-x-2 items-center text-sm">
              <span>{new Date().toLocaleTimeString()}</span>
              <FaClock className="cursor-pointer hover:text-black text-xl" />
            </div>

            <button type="button" onClick={closeModel}>
              <FaTrash className="text-red-500 hover:text-red-700 text-2xl" />
            </button>
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 shadow-md"
            >
              {currentNote ? "Update Note" : "Add Note"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteModal;
