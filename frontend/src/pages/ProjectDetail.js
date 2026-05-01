import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectService, taskService } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import './ProjectDetail.css';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'Medium',
    dueDate: '',
  });
  const [memberForm, setMemberForm] = useState({
    userId: '',
  });

  const fetchProjectData = useCallback(async () => {
    try {
      const [projectRes, tasksRes] = await Promise.all([
        projectService.getProject(id),
        taskService.getProjectTasks(id),
      ]);
      setProject(projectRes.data.data);
      setTasks(tasksRes.data.data);
      setError('');
    } catch (err) {
      setError('Failed to load project data');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchAvailableUsers = useCallback(async () => {
    try {
      const res = await projectService.getAvailableUsers(id);
      setAvailableUsers(res.data.data);
    } catch (err) {
      console.error('Failed to fetch available users:', err);
    }
  }, [id]);

  useEffect(() => {
    fetchProjectData();
  }, [fetchProjectData]);

  const handleTaskFormChange = (e) => {
    setTaskForm({ ...taskForm, [e.target.name]: e.target.value });
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    try {
      await taskService.createTask({
        ...taskForm,
        projectId: id,
      });
      setTaskForm({ title: '', description: '', assignedTo: '', priority: 'Medium', dueDate: '' });
      setShowTaskForm(false);
      fetchProjectData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleMemberFormChange = (e) => {
    setMemberForm({ ...memberForm, [e.target.name]: e.target.value });
  };

  const handleMemberSubmit = async (e) => {
    e.preventDefault();
    try {
      await projectService.addMember(id, memberForm);
      setMemberForm({ userId: '' });
      setShowMemberForm(false);
      fetchProjectData();
      fetchAvailableUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (userId) => {
    if (window.confirm('Remove this member from project?')) {
      try {
        await projectService.removeMember(id, userId);
        fetchProjectData();
        fetchAvailableUsers();
      } catch (err) {
        setError('Failed to remove member');
      }
    }
  };

  const toggleMemberForm = () => {
    if (!showMemberForm) {
      fetchAvailableUsers();
    }
    setShowMemberForm(!showMemberForm);
  };

  if (loading) return <div className="loading">Loading project...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!project) return <div>Project not found</div>;

  const isProjectMember = project.members.some((member) => member.user._id === user.id);
  const isProjectAdmin = user?.role === 'Admin' && (project.owner._id === user.id || isProjectMember);

  return (
    <div className="project-detail-container">
      <button onClick={() => navigate('/projects')} className="back-btn">
        ← Back to Projects
      </button>

      <div className="project-detail-header">
        <div className="project-info">
          <h1>{project.name}</h1>
          <p>{project.description}</p>
          <div className="project-meta">
            <span>📅 {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}</span>
            <span className={`status-badge status-${project.status.toLowerCase()}`}>{project.status}</span>
            <span className={`priority-badge priority-${project.priority.toLowerCase()}`}>{project.priority}</span>
          </div>
        </div>
      </div>

      <div className="project-detail-content">
        <div className="section">
          <div className="section-header">
            <h2>Team Members ({project.members.length})</h2>
            {isProjectAdmin && (
              <button
                className="btn btn-primary btn-small"
                onClick={toggleMemberForm}
              >
                {showMemberForm ? 'Cancel' : '+ Add Member'}
              </button>
            )}
          </div>

          {showMemberForm && isProjectAdmin && (
            <form onSubmit={handleMemberSubmit} className="form-inline">
              <select
                name="userId"
                value={memberForm.userId}
                onChange={handleMemberFormChange}
                required
              >
                <option value="">Select a user to add</option>
                {availableUsers.map((availableUser) => (
                  <option key={availableUser.id} value={availableUser.id}>
                    {availableUser.name} ({availableUser.email})
                  </option>
                ))}
              </select>
              <button type="submit" className="btn btn-primary btn-small">Add</button>
            </form>
          )}

          {availableUsers.length === 0 && showMemberForm && (
            <div className="no-users-message">No available users to add</div>
          )}

          <div className="members-list">
            {project.members.map((member) => (
              <div key={member._id} className="member-item">
                <div className="member-info">
                  <span className="member-name">{member.user.name}</span>
                  <span className="member-email">{member.user.email}</span>
                  <span className="member-role">{member.role}</span>
                </div>
                {isProjectAdmin && member.user._id !== project.owner._id && (
                  <button
                    onClick={() => handleRemoveMember(member.user._id)}
                    className="btn btn-danger btn-small"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="section">
          <div className="section-header">
            <h2>Tasks ({tasks.length})</h2>
            {isProjectAdmin && (
              <button
                className="btn btn-primary btn-small"
                onClick={() => setShowTaskForm(!showTaskForm)}
              >
                {showTaskForm ? 'Cancel' : '+ Create Task'}
              </button>
            )}
          </div>

          {showTaskForm && (
            <form onSubmit={handleTaskSubmit} className="task-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Task Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={taskForm.title}
                    onChange={handleTaskFormChange}
                    placeholder="Enter task title"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Priority</label>
                  <select name="priority" value={taskForm.priority} onChange={handleTaskFormChange}>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Critical</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={taskForm.description}
                  onChange={handleTaskFormChange}
                  placeholder="Task description"
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Assign To *</label>
                  <select
                    name="assignedTo"
                    value={taskForm.assignedTo}
                    onChange={handleTaskFormChange}
                    required
                  >
                    <option value="">Select team member</option>
                    {project.members.map((member) => (
                      <option key={member._id} value={member.user._id}>
                        {member.user.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Due Date *</label>
                  <input
                    type="date"
                    name="dueDate"
                    value={taskForm.dueDate}
                    onChange={handleTaskFormChange}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary">Create Task</button>
            </form>
          )}

          <div className="tasks-table">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <div key={task._id} className="task-row">
                  <div className="task-col task-title">
                    <h4>{task.title}</h4>
                  </div>
                  <div className="task-col">
                    <span className={`priority-tag priority-${task.priority.toLowerCase()}`}>
                      {task.priority}
                    </span>
                  </div>
                  <div className="task-col">
                    <span className={`status-tag status-${task.status.toLowerCase().replace(' ', '-')}`}>
                      {task.status}
                    </span>
                  </div>
                  <div className="task-col">
                    {task.assignedTo.name}
                  </div>
                  <div className="task-col">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-tasks">No tasks yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
