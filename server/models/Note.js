import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  editedAt: { type: Date, default: Date.now },
  labels: [{ type: String }],
  reminderAt: { type: Date },
  archived: { type: Boolean, default: false },  // Added archived field
  isImportant: { type: Boolean, default: false },
  sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]

});

const Note = mongoose.model('Note', NoteSchema);
export default Note;
