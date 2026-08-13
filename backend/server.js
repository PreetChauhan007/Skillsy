import dotenv from 'dotenv';
dotenv.config();
import http from 'http';
import jwt from 'jsonwebtoken';
import { Server } from 'socket.io';
import app from './src/app.js';
import connectDB from './src/config/db.js';
import SwapRequest from './src/modules/swap/swap.model.js';
import { setIO } from './src/config/socket.js';

const PORT = process.env.PORT || 5000;

connectDB()
.then(()=>{
    const server = http.createServer(app);
    const io = new Server(server, {
      // Socket connections are authenticated with a JWT in the handshake.
      cors: { origin: true, credentials: true },
    });
    setIO(io);

    io.use((socket, next) => {
      try {
        const token = socket.handshake.auth?.token;
        if (!token) throw new Error('Authentication required');
        socket.userId = jwt.verify(token, process.env.JWT_SECRET).id;
        next();
      } catch {
        next(new Error('Authentication failed'));
      }
    });

    io.on('connection', (socket) => {
      socket.on('join-swap', async (swapId) => {
        try {
          if (typeof swapId !== 'string' || !/^[a-fA-F0-9]{24}$/.test(swapId)) return;
          const swap = await SwapRequest.findById(swapId);
          const participantIds = [swap?.requesterId, swap?.targetUserId].map((id) => String(id));
          const isParticipant = swap && participantIds.includes(String(socket.userId));
          if (swap?.status === 'accepted' && isParticipant) socket.join(`swap:${swap._id.toString()}`);
        } catch (error) {
          console.error('Unable to join chat room:', error.message);
        }
      });
    });

    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
.catch((error) => {
    console.error('Database connection failed:', error);
    process.exit(1);
});
// http://localhost:5000/api/health
