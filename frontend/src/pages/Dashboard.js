import React, { useState, useEffect } from 'react';
import { taskService } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await taskService.getDashboardStats();
      setStats(response.data.data);
    } catch (err) {
      setError('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!stats) return <div>No data available</div>;

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <div className="stat-label">Total Tasks</div>
            <div className="stat-value">{stats.total}</div>
          </div>
        </div>

        <div className="stat-card completed">
          <div className="stat-icon">✓</div>
          <div className="stat-content">
            <div className="stat-label">Completed</div>
            <div className="stat-value">{stats.completed}</div>
          </div>
        </div>

        <div className="stat-card pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <div className="stat-label">Pending</div>
            <div className="stat-value">{stats.pending}</div>
          </div>
        </div>

        <div className="stat-card inprogress">
          <div className="stat-icon">⚙️</div>
          <div className="stat-content">
            <div className="stat-label">In Progress</div>
            <div className="stat-value">{stats.inProgress}</div>
          </div>
        </div>

        <div className="stat-card overdue">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <div className="stat-label">Overdue</div>
            <div className="stat-value">{stats.overdue}</div>
          </div>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-box">
          <h3>Tasks by Status</h3>
          <div className="status-breakdown">
            {Object.entries(stats.tasksByStatus).map(([status, count]) => (
              <div key={status} className="status-item">
                <span className="status-name">{status}:</span>
                <span className="status-count">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-box">
          <h3>Tasks by Priority</h3>
          <div className="priority-breakdown">
            {Object.entries(stats.tasksByPriority).map(([priority, count]) => (
              <div key={priority} className={`priority-item priority-${priority.toLowerCase()}`}>
                <span className="priority-name">{priority}:</span>
                <span className="priority-count">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
