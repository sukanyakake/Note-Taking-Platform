import express from "express";
import Note from "../models/Note.js";
import middleware from "../middleware/middleware.js";

const router = express.Router();
router.post("/:id", middleware, async (req, res) => {
    try {
      const { id } = req.params;
      const { targetUserId } = req.body; // the user you want to share with
  
      const note = await Note.findById(id);
  
      if (!note) return res.status(404).json({ success: false, message: "Note not found" });
  
      note.sharedWith.push(targetUserId);
      await note.save();
  
      return res.status(200).json({ success: true, message: "Note shared successfully", note });
    } catch (error) {
      console.error("Error sharing note:", error);
      return res.status(500).json({ success: false, message: "Failed to share note", error: error.message });
    }
  });
  export default router;