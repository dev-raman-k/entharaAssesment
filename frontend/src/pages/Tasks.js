import React, { useState, useEffect, useContext } from 'react';
import { taskService } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import './Tasks.css';

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === 'Admin';

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await taskService.getMyTasks();
      setTasks(response.data.data);
      setError('');
    } catch (err) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskService.updateTask(taskId, { status: newStatus });
      fetchTasks();
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(taskId);
        fetchTasks();
      } catch (err) {
        setError('Failed to delete task');
      }
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'All') return true;
    return task.status === filter;
  });

  if (loading) return <div className="loading">Loading tasks...</div>;

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <h1>My Tasks</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="filter-section">
        <button
          className={`filter-btn ${filter === 'All' ? 'active' : ''}`}
          onClick={() => setFilter('All')}
        >
          All
        </button>
        <button
          className={`filter-btn ${filter === 'Pending' ? 'active' : ''}`}
          onClick={() => setFilter('Pending')}
        >
          Pending
        </button>
        <button
          className={`filter-btn ${filter === 'In Progress' ? 'active' : ''}`}
          onClick={() => setFilter('In Progress')}
        >
          In Progress
        </button>
        <button
          className={`filter-btn ${filter === 'Completed' ? 'active' : ''}`}
          onClick={() => setFilter('Completed')}
        >
          Completed
        </button>
      </div>

      <div className="tasks-list">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div key={task._id} className="task-item">
              <div className="task-main">
                <div className="task-title">
                  <h3>{task.title}</h3>
                  <span className={`priority-tag priority-${task.priority.toLowerCase()}`}>
                    {task.priority}
                  </span>
                </div>
                <p className="task-description">{task.description}</p>
                <div className="task-meta">
                  <span className="meta-item">
                    📅 Due: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                  <span className="meta-item">
                    🏢 Project: {task.project.name}
                  </span>
                  <span className="meta-item">
                    👤 Assigned by: {task.assignedBy.name}
                  </span>
                </div>
              </div>

              <div className="task-actions">
                {isAdmin ? (
                  <>
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task._id, e.target.value)}
                      className={`status-select status-${task.status.toLowerCase().replace(' ', '-')}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="On Hold">On Hold</option>
                    </select>
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="btn-delete"
                    >
                      Delete
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleStatusChange(task._id, 'Completed')}
                    className="btn-delete"
                    disabled={task.status === 'Completed'}
                  >
                    {task.status === 'Completed' ? 'Done' : 'Mark Done'}
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-tasks">
            <p>No tasks found. Take a break!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTasks;
