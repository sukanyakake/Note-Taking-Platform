import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { formatDistanceToNow, format } from 'date-fns';

const NoteCard = ({ note, onEdit, deleteNote }) => {
  const formatDate = (date) => date ? format(new Date(date), 'PPpp') : "N/A";
  const shareNote = async (noteId, targetUserId) => {
    try {
      const { data } = await axios.post(
        `http://localhost:5000/api/note/share/${noteId}`,
        { targetUserId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Note shared successfully!");
    } catch (error) {
      console.error("Error sharing note:", error);
      toast.error("Failed to share note");
    }
  };
  
  return (
    <div className="bg-white p-4 rounded-2xl shadow-md hover:shadow-lg transition-shadow relative">
      {/* Title + Important flag */}
      <div className="flex justify-between items-start">
        <h2 className="text-lg font-semibold text-gray-800">{note.title}</h2>
        {note.isImportant && (
          <span className="text-yellow-500 font-bold text-sm ml-2">★</span>
        )}
      </div>

      {/* Description */}
      <p className="text-gray-700 mt-2 text-sm whitespace-pre-line">{note.description}</p>

      {/* Labels */}
      {note.labels?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {note.labels.map(label => (
            <span key={label} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
              #{label}
            </span>
          ))}
        </div>
      )}

      {/* Reminder & Edited Info */}
      <div className="text-xs text-gray-500 mt-4 space-y-1">
        {note.reminderAt && (
          <p>
            ⏰ Reminder {formatDistanceToNow(new Date(note.reminderAt), { addSuffix: true })}
          </p>
        )}
        {note.editedAt && (
          <p>📝 Edited at {formatDate(note.editedAt)}</p>
        )}
      </div>

      {/* Actions */}
      <div className="absolute top-4 right-4 flex gap-3">
        <button
          onClick={() => onEdit(note)}
          className="text-blue-500 hover:text-blue-700"
          title="Edit"
        >
          <FaEdit />
        </button>
        <button
          onClick={() => deleteNote(note._id)}
          className="text-red-500 hover:text-red-700"
          title="Delete"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default NoteCard;
