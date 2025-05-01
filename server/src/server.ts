import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { errorHandler, notFound } from './middleware/errorMiddleware';
import { requestLogger, errorLogger } from './middleware/loggingMiddleware';
import { apiLimiter } from './middleware/rateLimitMiddleware';
import authRoutes from './routes/authRoutes';
import requestRoutes from './routes/requestRoutes';
import { createServer } from 'http';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*', // Możesz ograniczyć do adresu frontendu
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);

// Socket.IO obsługa połączeń
io.on('connection', (socket: import('socket.io').Socket) => {
  console.log('Nowe połączenie socket.io:', socket.id);
  // Możesz dodać obsługę eventów tutaj
});

// Error handling
app.use(notFound);
app.use(errorLogger);
app.use(errorHandler);

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/zlota-raczka')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 