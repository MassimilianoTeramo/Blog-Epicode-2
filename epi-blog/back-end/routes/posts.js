import { Router } from "express";
import Post from "../modelli/Post.js";
import { upload } from '../utilities/cloudinary.js';
import express from "express";
import { authorization } from "../middlewares/authorization.js";



const router = Router();


//GET
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;
        const skip = (page - 1) * limit;

        //filtra i post per autore
        const filter = req.query.author ? {author: req.query.author} : {};



        //conta il numero di post
        const totalPosts = await Post.countDocuments(filter);
        const totalPages = Math.ceil(totalPosts / limit);

        //post pagination
        const posts = await Post.find(filter).populate('author', 'firstName lastName') // Include only firstName and lastName of the author
            .skip(skip)
            .limit(limit)
            .sort({createdAt: -1});

        res.json({
            posts, 
            currentPage: page, 
            totalPages, 
            totalPosts});
            
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//GET post per id   
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'firstName lastName'); // Include only firstName and lastName of the author
        if(!post){
            return res.status(404).json({message: "Post not found"});
        }               
        res.json(post); 
    }  catch (err) {
        res.status(500).json({ message: err.message });
    }       
});

//POST
router.post("/", upload.single('cover'), async (req, res) => {
    try {
        const { title, category, content, readTime, author } = req.body;
        
        // Validazione dei dati
        if (!title || !category || !content || !author || !req.file) {
            return res.status(400).json({ 
                message: "Tutti i campi sono obbligatori" 
            });
        }

        // Parse readTime da stringa a oggetto JSON
        const parsedReadTime = JSON.parse(readTime);

        const newPost = new Post({
            title,
            category,
            cover: req.file.path, // Usa il path del file caricato su Cloudinary
            content,
            readTime: parsedReadTime,
            author
        });

        const savedPost = await newPost.save();
        
        // Popola i dati dell'autore prima di inviare la risposta
        const populatedPost = await Post.findById(savedPost._id)
            .populate('author', 'firstName lastName');

        res.status(201).json(populatedPost);
    } catch (err) {
        console.error('Errore server:', err);
        res.status(500).json({ 
            message: "Errore durante il salvataggio del post",
            error: err.message 
        });
    }
});


//PUT
router.put('/:id', upload.single('cover'), async (req, res) => {
    try {
        const { title, category, content, readTime } = req.body;
        const updateData = { title, category, content, readTime };

        if (req.file) {
            updateData.cover = req.file.path; // Update cover if a new file is uploaded
        }

        const post = await Post.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!post) {
            return res.status(404).json({ message: "Post not found, errore qui" });
        }
        const updatedPost = await Post.findById(req.params.id).populate('author', 'firstName lastName');
        res.json(updatedPost);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//DELETE
router.delete('/:id', authorization, async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;