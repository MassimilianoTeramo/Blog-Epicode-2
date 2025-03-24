import Router from "express";   
import bcrypt from 'bcrypt';
import User from '../modelli/Users.js'
import jwt from 'jsonwebtoken'
import passport from "../config/passport.js";
import express from 'express';
import { authorization } from "../middlewares/authorization.js";

const router = Router();

//GENERATE TOKEN

const generateToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
};



//LOGIN LOCALE

router.post('/login/local', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) { return res.status(400).json({ message: info.message });
    }

    const token = generateToken(user);
    const userToSend = {
        _id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
    };
    res.json({ user: userToSend, token });
})(req, res, next);
});

router.post('/register', async (request, response) => {
    try {
        const { firstName, lastName, email, password } = request.body;
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return response.status(400).json({message: ' User already registered'});
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User ({
            ...request.body, 
            password: hashedPassword
        });
        await newUser.save();

        const userToSend = {
            _id: newUser._id,
            email: newUser.email,
            role: newUser.role,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
        };

        const token = generateToken(newUser);
        response.status(201).json({user:userToSend, token});

        await mailer.sendMail({
            from: 'Massimiliano',
            to: request.body.email,
            subject: 'Welcome to our blog',
            text: `Welcome ${request.body.firstName} ${request.body.lastName}`,
            html: `<b>Thanks ${request.body.firstName} ${request.body.lastName} for registering to my blog! </b>`
        });

       
    } catch (err) {
        response.status(500).json({ error: err.message });
    }
});

//GOOGLE
router.get('/google',passport.authenticate('google', {scope: ['profile', 'email'] }));


router.get('/google/callback', passport.authenticate('google', {failureRedirect: '/login' }),
    (request, response)=> {
       const token = generateToken(request.user);
        response.redirect(`http://localhost:3000/login?token=${token}`) // pagina del frontend che salverá il JWT nel localStorage
    }
);


// Endpoint per ottenere le informazioni dell'utente corrente
router.get('/me', async (request, response) => {
    try {
        // Estrai il token dall'header Authorization
        const authHeader = request.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return response.status(401).json({ message: 'Token non fornito' });
        }
        
        const token = authHeader.split(' ')[1];
        
        // Verifica il token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Trova l'utente
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return response.status(404).json({ message: 'Utente non trovato' });
        }
        
        response.json({ user });
    } catch (err) {
        if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
            return response.status(401).json({ message: 'Token non valido o scaduto' });
        }
        response.status(500).json({ error: err.message });
    }
});

export default router;