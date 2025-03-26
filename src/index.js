import mongoose from 'mongoose'
import { config } from './configs/app.config.js';
import app from './app.js';

let server;
mongoose.connect(config.MONGODB_URI).then(() => {
  console.log('Connected to MongoDB');
  server = app.listen(config.PORT, () => {
    console.log(`Listening to port ${config.PORT}`);
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      console.log('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  console.log("error",error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  console.log('SIGTERM received');
  if (server) {
    server.close();
  }
});