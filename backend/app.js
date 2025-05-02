import express from 'express';
import mongoose from 'mongoose';
import taskRoutes from './routes/task.js';
import connectToDB from './db/connect.js';
import cors from 'cors'; // Import CORS middleware
import notFound from './middleware/notfound.js'; // Import notFound middleware
const app = express();
const PORT = 5000;

app.use(notFound); // Enable CORS for all routes
app.use(cors()); // Enable CORS for all routes
app.use(express.json());
app.use(express.static('./public'));
app.use('/api/tasks', taskRoutes);

// Start server only after DB connection
const startServer = async () => {
  try {
    await connectToDB(); // Ensure connectToDB is awaited
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1); // Exit if DB connection fails
  }
};

startServer();