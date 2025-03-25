import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from 'dotenv';
import expressListEndpoints from "express-list-endpoints";
import passport from "./config/passport.js";
import session from "express-session";
import GoogleStrategy from "passport-google-oauth20";
import LocalStrategy from "passport-local";
dotenv.config();

//routes
import userRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';
import commentRoutes from './routes/comments.js';
import authRoutes from './routes/auth.js';


const server = express();


//middleware
server.use(cors());
server.use(express.json());

server.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // true in produzione
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 ore
    }
}));

//passport
server.use(passport.initialize());
server.use(passport.session());



//mongo
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    tls: true 
  });

mongoose.connection.on("connected", () => {
    console.log("Connesso a mongoDB");
});

mongoose.connection.on("error", (err) => {
    console.log("Errore di connessione a MongoDb", err);
});

// Registrazione delle route
server.use("/auth", authRoutes);
server.use('/users', userRoutes);
server.use('/posts', postRoutes);
server.use('/comments', commentRoutes);

// Log delle route disponibili
console.log('Route disponibili:', expressListEndpoints(server));

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server avviato sulla porta ${PORT}`);
    console.table(expressListEndpoints(server));
});

