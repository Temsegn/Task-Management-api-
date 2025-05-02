import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import connectToDB from '../db/connect.js';

// Connect to MongoDB
connectToDB();
const taskSchema = new Schema({
  
  title: {
    type: String,
    required: [true, 'Title is required'],
    maxlength: [80, 'Title cannot exceed 100 characters'],
    minlength: [3, 'Title must be at least 3 characters long'], 
    validate: {
      validator: function (v) {
        return /^[a-zA-Z0-9 ]+$/.test(v); // Only alphanumeric characters and spaces
      },
      message: (props) => `${props.value} is not a valid title!`,
    },

  },
  description: {
    type: String,
    required: true,
    maxlength:[100,'the descritpioon should not exceed 500 character'],
    minlength:[20,'the deacription should not be less than 100 character']
  },
  completed: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });
const Task = mongoose.model('Task', taskSchema);    

export default Task;