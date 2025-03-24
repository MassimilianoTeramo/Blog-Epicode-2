import multer from 'multer';
import path from 'node:path';

const storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, callback) => { //si inventa il nome per il file che stiamo caricando
        callback(null, Date.now() + path.extname(file.originalname)); //setta l'errore a null, inserisce la data e l'estensione del file
    }
});

const uploadLocal = multer({ storage: storage });

export default uploadLocal;

