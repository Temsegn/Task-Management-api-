const tasksDOM = document.querySelector('.tasks');
const loadingDOM = document.querySelector('.loading-text');
const formDOM = document.querySelector('.task-form');
const taskInputDOM = document.querySelector('.task-input');
const formAlertDOM = document.querySelector('.form-alert');

// Load tasks from /api/tasks
const showTasks = async () => {
  loadingDOM.style.visibility = 'visible';
  try {
    const { data: tasks } = await axios.get('/api/tasks'); // Backend returns { tasks: [...] }
    if (tasks.length < 1) {
      tasksDOM.innerHTML = '<h5 class="text-center">No tasks in your list</h5>';
      loadingDOM.style.visibility = 'hidden';
      return;
    }
    const allTasks = tasks
      .map((task) => {
        const { completed, _id: taskID, title } = task; // Changed `name` to `title`
        return `
          <div class="card mb-2 single-task ${completed ? 'task-completed' : ''}">
            <div class="card-body d-flex justify-content-between align-items-center">
              <h5 class="mb-0">
                <span><i class="far fa-check-circle"></i></span> ${title}
              </h5>
              <div class="task-links">
                <button type="button" class="btn btn-sm btn-outline-primary edit-btn" data-id="${taskID}">
                  <i class="fas fa-edit"></i> Edit
                </button>
                <button type="button" class="btn btn-sm btn-outline-danger delete-btn" data-id="${taskID}">
                  <i class="fas fa-trash"></i> Delete
                </button>
              </div>
            </div>
          </div>`;
      })
      .join('');
    tasksDOM.innerHTML = allTasks;
  } catch (error) {
    let errorMessage = 'Error fetching tasks. Please try again.';
    if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
      if (error.response.data.details) {
        errorMessage += `: ${error.response.data.details.join(', ')}`;
      }
    }
    tasksDOM.innerHTML = `<h5 class="text-center text-danger">${errorMessage}</h5>`;
    console.error('Error fetching tasks:', error.response || error.message);
  }
  loadingDOM.style.visibility = 'hidden';
};

// Initial load
showTasks();

// Delete task
tasksDOM.addEventListener('click', async (e) => {
  const el = e.target.closest('.delete-btn');
  if (el) {
    loadingDOM.style.visibility = 'visible';
    const id = el.dataset.id;
    try {
      await axios.delete(`/api/tasks/${id}`);
      showTasks();
      displayAlert('Task deleted', 'success');
    } catch (error) {
      let errorMessage = 'Error deleting task';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      displayAlert(errorMessage, 'danger');
      console.error('Error deleting task:', error.response || error.message);
    }
    loadingDOM.style.visibility = 'hidden';
  }
});

// Edit task
tasksDOM.addEventListener('click', async (e) => {
  const el = e.target.closest('.edit-btn');
  if (el) {
    const id = el.dataset.id;
    try {
      const { data: { task } } = await axios.get(`/api/tasks/${id}`);
      const newTitle = prompt('Edit task title:', task.title); // Changed `name` to `title`
      if (newTitle && newTitle.trim()) {
        await axios.put(`/api/tasks/${id}`, { title: newTitle, description: task.description }); // Changed `patch` to `put`, use `title`
        showTasks();
        displayAlert('Task updated', 'success');
      }
    } catch (error) {
      let errorMessage = 'Error updating task';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
        if (error.response.data.details) {
          errorMessage += `: ${error.response.data.details.join(', ')}`;
        }
      }
      displayAlert(errorMessage, 'danger');
      console.error('Error updating task:', error.response || error.message);
    }
  }
});

// Form submission to add task
formDOM.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = taskInputDOM.value.trim(); // Changed `name` to `title`
  if (!title) {
    displayAlert('Please enter a task title', 'danger');
    return;
  }
  try {
    // Hardcode description to meet backend requirements (min 20 characters)
    const description = `Description for task: ${title}`.slice(0, 100);
    await axios.post('/api/tasks', { title, description }); // Send `title` and `description`
    showTasks();
    taskInputDOM.value = '';
    displayAlert('Task added successfully', 'success');
  } catch (error) {
    let errorMessage = 'Error adding task';
    if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
      if (error.response.data.details) {
        errorMessage += `: ${error.response.data.details.join(', ')}`;
      }
    }
    displayAlert(errorMessage, 'danger');
    console.error('Error adding task:', error.response || error.message);
  }
});

// Display alert
const displayAlert = (text, type) => {
  formAlertDOM.textContent = text;
  formAlertDOM.classList.add(`alert-${type}`);
  formAlertDOM.style.display = 'block';
  setTimeout(() => {
    formAlertDOM.style.display = 'none';
    formAlertDOM.classList.remove(`alert-${type}`);
  }, 3000);
};