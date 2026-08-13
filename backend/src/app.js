import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

const app = express();

app.use(express.json());
app.use(cors({
    origin:[
      "http://localhost:5173",
        "https://skillsy-delta.vercel.app"
     ], // Use environment variable or default to '*'
    credentials: true
}));
app.use(helmet());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'API is running' });
});

//routes
import { userRoutes } from './modules/user/index.js';
import { skillRoutes } from './modules/skill/index.js';
import { swapRoutes } from './modules/swap/index.js';
import { adminRoutes } from './modules/admin/index.js';
import { feedbackRoutes } from './modules/feedback/index.js';
import { chatRoutes } from './modules/chat/index.js';


// User routes (frontend expects /users/*)
app.use('/api/users', userRoutes);

// Swap routes (frontend expects /swaps/*)
app.use('/api/swaps', swapRoutes);

// Skill routes
app.use('/api/skills', skillRoutes);

// Admin routes
app.use('/api/admin', adminRoutes);

// Feedback routes
app.use('/api/feedback', feedbackRoutes);

// Private conversations for accepted swaps
app.use('/api/chats', chatRoutes);

export default app;
