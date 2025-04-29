import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js'
import authRouter from './routes/authRouter.js'
import todoRouter from './routes/todoRouter.js';


// Creating express object
const app = express();
connectDB();

app.use(
    cors({
        origin: "http://localhost:5173", 
        credentials: true, 
    })
);
app.use(express.json());
app.use(cookieParser());


//API Endpoints
app.get('/', (req, res) => res.send("API get working"));
app.use('/api/auth', authRouter);
app.use('/api/todo', todoRouter);



const PORT = process.env.PORT ||5000;
app.listen(PORT,console.log(`Server started on port ${PORT}`));
