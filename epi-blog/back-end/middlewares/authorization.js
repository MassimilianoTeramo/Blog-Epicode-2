import jwt from 'jsonwebtoken';
import User from '../modelli/Users.js';

export const authorization = async (req, res, next) => {
    // try {
    //     const authHeader = req.headers.authorization;
    //     console.log('Header di autorizzazione:', authHeader);

    //     if (!authHeader) {
    //         console.log('Header di autorizzazione mancante');
    //         return res.status(401).json({ message: 'Token non fornito' });
    //     }

    //     if (!authHeader.startsWith('Bearer ')) {
    //         console.log('Formato header non valido:', authHeader);
    //         return res.status(401).json({ message: 'Formato token non valido' });
    //     }

    //     const parts = authHeader.split(' ');
    //     const token = parts.length === 2 ? parts[1] : null;
    //     console.log('Token estratto:', token);

    //     if (!token) {
    //         console.log('Token vuoto o formato non valido dopo split');
    //         return res.status(401).json({ message: 'Token non valido' });
    //     }

    //     try {
    //         const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //         console.log('Token decodificato:', decoded);

    //         const user = await User.findById(decoded._id);
    //         if (!user) {
    //             console.log('Utente non trovato:', decoded._id);
    //             return res.status(404).json({ message: 'Utente non trovato' });
    //         }

    //         req.user = user;
    //         next();
    //     } catch (jwtError) {
    //         console.error('Errore verifica JWT:', jwtError.message);
    //         if (jwtError.name === 'TokenExpiredError') {
    //             return res.status(401).json({ message: 'Token scaduto' });
    //         }
    //         return res.status(401).json({ message: 'Token non valido' });
    //     }
    // } catch (error) {
    //     console.error('Errore generico autorizzazione:', error);
    //     res.status(500).json({ message: 'Errore del server' });
    // }
};