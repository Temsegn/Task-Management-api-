import  express from 'express';
import mongoose from 'mongoose';
 import { getAllTasks, getTaskById, createTask, deleteTaskById, updateTaskById } from '../controller/task.js';
// Connect to MongoDB
const router = express.Router();
// Get all tasks
router.get('/', getAllTasks );

// Get a single task by ID
router.get('/:id', getTaskById );
 

// Create a new task
router.post('/', createTask  );
 
// Delete task by ID
router.delete('/:id', deleteTaskById
);  

router.put('/:id',updateTaskById);
export default router;