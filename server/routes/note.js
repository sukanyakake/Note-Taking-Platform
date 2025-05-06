import express from "express";
import Note from "../models/Note.js";
import User from "../models/User.js"; // Required for email to ObjectId conversion
import middleware from "../middleware/middleware.js";

const router = express.Router();

// 🚀 Add Note
router.post('/add', middleware, async (req, res) => {
  try {
    const { title, description, isImportant, labels, reminderAt, sharedWith = [] } = req.body;

    // Convert shared emails to ObjectIds
    const users = await User.find({ email: { $in: sharedWith } }).select("_id");
    const sharedUserIds = users.map(user => user._id);

    const newNote = new Note({
      title,
      description,
      isImportant: isImportant || false,
      labels: labels || [],
      reminderAt: reminderAt || null,
      sharedWith: sharedUserIds,
      userId: req.user._id,
      editedAt: new Date()
    });

    await newNote.save();

    return res.status(200).json({
      success: true,
      message: "Created Note Successfully",
      note: newNote
    });
  } catch (error) {
    console.error("❌ Error in /add route:", error);
    return res.status(500).json({
      success: false,
      message: "Error in Adding Note",
      error: error.message
    });
  }
});

// CORRECTED CODE
router.get('/', middleware, async (req, res) => {
  try {
    const notes = await Note.find({
      $or: [
        { userId: req.user._id },
        { sharedWith: req.user._id }
      ]
    }).populate('sharedWith', 'email name'); // Optional: show who it's shared with

    return res.status(200).json({ success: true, notes });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Cannot retrieve notes", error: error.message });
  }
});





router.put("/:id", middleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { sharedWith, ...noteData } = req.body;

    let sharedUserIds = [];
    if (Array.isArray(sharedWith)) {
      const users = await User.find({ email: { $in: sharedWith } }, '_id');
      sharedUserIds = users.map(u => u._id);
    }

    const updatedNote = await Note.findByIdAndUpdate(
      id,
      {
        ...noteData,
        sharedWith: sharedUserIds,
        editedAt: new Date()
      },
      { new: true }
    );

    return res.status(200).json({ success: true, updatedNote });
  } catch (error) {
    console.error("❌ Error updating note:", error);
    return res.status(500).json({ success: false, message: "Cannot update note", error: error.message });
  }
});


// ❌ Delete Note
router.delete("/:id", middleware, async (req, res) => {
  try {
    const { id } = req.params;

    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ success: false, message: "Note not found" });

    const isAuthorized = note.userId.equals(req.user._id) || note.sharedWith.some(id => id.equals(req.user._id));
    if (!isAuthorized) return res.status(403).json({ success: false, message: "Unauthorized" });

    await note.deleteOne();
    return res.status(200).json({ success: true, deletedNote: note });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Cannot delete note", error: error.message });
  }
});

// 📦 Get Archived Notes
router.get('/archived', middleware, async (req, res) => {
  try {
    const notes = await Note.find({
      archived: true,
      $or: [
        { userId: req.user._id },
        { sharedWith: req.user._id }
      ]
    });

    return res.status(200).json({ success: true, notes });
  } catch (error) {
    console.error("❌ Error fetching archived notes:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

// 🗂️ Archive/Unarchive Note
router.put('/note/:id', middleware, async (req, res) => {
  try {
    const { id } = req.params;

    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ success: false, message: "Note not found" });

    const isAuthorized = note.userId.equals(req.user._id) || note.sharedWith.some(id => id.equals(req.user._id));
    if (!isAuthorized) return res.status(403).json({ success: false, message: "Unauthorized" });

    note.archived = req.body.archived;
    await note.save();

    return res.status(200).json({ success: true, note });

  } catch (error) {
    console.error("❌ Error updating archived status:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

export default router;
