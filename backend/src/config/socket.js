let io;

export const setIO = (socketServer) => {
  io = socketServer;
};

export const getIO = () => io;
