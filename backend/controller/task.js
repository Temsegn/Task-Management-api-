// controller/task.js
import Task from '../models/task.js';
import mongoose from 'mongoose';
// Get all tasks
const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find();  // Fetch all tasks from DB
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get task by ID
const getTaskById = async (req, res) => {
    try {
        const taskId = req.params.id;  // Correct way to extract id
        if (!checkValidId(taskId, res)) return;
          
        const task = await Task.findById(taskId);
          
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.status(200).json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create a new task
const createTask = async (req, res) => {
    try {
        const newTask = req.body;
        const task = await Task.create(newTask);
        res.status(201).json(task);  // Return the created task (not newTask directly)
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete task by ID
const deleteTaskById = async (req, res) => {
    try {
        const taskId = req.params.id;
        if (!checkValidId(taskId, res)) return;
        const deletedTask = await Task.findByIdAndDelete(taskId);

        if (!deletedTask) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update task by ID
const updateTaskById = async (req, res) => {
    try {
        const taskId = req.params.id;
        const updatedTask = req.body;
        if (!checkValidId(taskId, res)) return;
        const task = await Task.findByIdAndUpdate(taskId, updatedTask, {
            new: true,       // Return updated document
            runValidators: true // Run schema validators
        });

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.status(200).json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
const checkValidId = (id, res) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: 'Invalid task ID format' });
      return false; // Important: Signal invalid ID
    }
    return true;
  };


export { getAllTasks, getTaskById, createTask, deleteTaskById, updateTaskById };
