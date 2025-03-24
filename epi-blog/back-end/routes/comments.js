import express from "express";
import Comment from "../modelli/Comment.js";
import { authorization } from "../middlewares/authorization.js";
import mongoose from 'mongoose';

const router = express.Router();

//GET
router.get('/post/:postId', async(req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.postId })
            .populate("author", "firstName lastName")
            .sort({ createdAt: -1});
        res.json(comments);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

//POST
router.post('/', async (req, res) => {
    try {
        const { content, author, post } = req.body;
        const newComment = new Comment({ content, author, post });
        const savedComment = await newComment.save();
        const populatedComment = await Comment.findById(savedComment._id)
            .populate("author", "firstName lastName");
        res.status(201).json(populatedComment);
    } catch (err) {
        console.error('Errore creazione commento:', err);
        res.status(500).json({ message: err.message });
    }
});

//DELETE
router.delete('/:id', async (req, res) => {
    try {
        const comment = await Comment.findByIdAndDelete(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: "Commento non trovato" });
        }
        res.json({ message: "Commento eliminato" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;