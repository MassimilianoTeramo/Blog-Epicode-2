import { Router } from 'express';
import mailer from 'nodemailer';
import User from '../modelli/Users.js';
import uploadCloudinary from '../middlewares/uploadCloudinary.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from "passport";
import bodyParser from 'body-parser';

const router = Router();


//GET
router.get('/', async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclude password from the response
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// //POST  registrazione
// router.post('/register', async (req, res) => {
//     try {
//         const newUser = new User({...req.body, password: await bcrypt.hash(req.body.password, 10)});
//         await newUser.save();
//         res.status(201).json(newUser);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// }
// );

// post immagini

router.post('/', 

    uploadCloudinary.single('profile'), async(req, res, next) => {

    const data = {...req.body, profile: req.file.path};
    try{
        const newUser = await User.create(data);
        res.send(newUser);

    } catch (err) {
        next(400);
    }
});

// PUT
router.put("/:id", async (req, res) => {
    try {
      const { firstName, lastName, currentPassword, newPassword } = req.body;
      const user = await User.findById(req.params.id);
  
      if (!user) {
        return res.status(404).json({ message: "Utente non trovato" });
      }
  
      // Verifica password attuale se si sta tentando di cambiarla
      if (newPassword) {
        if (user.password !== currentPassword) {
          return res.status(401).json({ message: "Password attuale non corretta" });
        }
        user.password = newPassword;
      }
  
      user.firstName = firstName;
      user.lastName = lastName;
  
      await user.save();
  
      // Non inviare la password nella risposta
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;
  
      res.json(userWithoutPassword);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

//DELETE

router.delete('/id'), async(req,res)=>{
    try{
        const user = await User.findByIdAndDelete(req.params.id);
        if(!user) {
            return res.status(404).json({message:"User not found"});
            
        }
        res.json({message: "User deleted"});

    }catch (err){
        res.status(500).json({error: err.message});
    }
};



export default router;

