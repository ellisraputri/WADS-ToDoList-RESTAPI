import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB, { sequelize } from './config/mysql.js';
import authRouter from './routes/authRouter.js';
import todoRouter from './routes/todoRouter.js';
import session from 'express-session';
import connectSessionSequelize from 'connect-session-sequelize';
import { swaggerUi, swaggerSpec } from './config/swagger.js';

const app = express();
connectDB();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Initialize session store
const SequelizeStore = connectSessionSequelize(session.Store);

const sessionStore = new SequelizeStore({
  db: sequelize,
  tableName: 'sessions',
  checkExpirationInterval: 15 * 60 * 1000, // Clean up expired sessions every 15 minutes
  expiration: 7 * 24 * 60 * 60 * 1000, // Session expires after 1 week
});

// Important: Wait for the store to sync before setting up the session middleware
await sessionStore.sync();

app.use(session({
  secret: process.env.SECRET || 'supersecret',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  }
}));

app.get('/', (req, res) => res.send("API get working"));
app.use('/api/auth', authRouter);
app.use('/api/todo', todoRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));