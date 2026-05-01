const User = require('./User');
const Project = require('./Project');
const ProjectMember = require('./ProjectMember');
const Task = require('./Task');
const TaskComment = require('./TaskComment');

Project.belongsTo(User, { as: 'owner', foreignKey: 'ownerId', onDelete: 'CASCADE' });
Project.hasMany(ProjectMember, { as: 'members', foreignKey: 'projectId', onDelete: 'CASCADE' });

ProjectMember.belongsTo(Project, { as: 'project', foreignKey: 'projectId', onDelete: 'CASCADE' });
ProjectMember.belongsTo(User, { as: 'user', foreignKey: 'userId', onDelete: 'CASCADE' });

Task.belongsTo(Project, { as: 'project', foreignKey: 'projectId', onDelete: 'CASCADE' });
Task.belongsTo(User, { as: 'assignedTo', foreignKey: 'assignedToId', onDelete: 'CASCADE' });
Task.belongsTo(User, { as: 'assignedBy', foreignKey: 'assignedById', onDelete: 'CASCADE' });
Task.hasMany(TaskComment, { as: 'comments', foreignKey: 'taskId', onDelete: 'CASCADE' });

TaskComment.belongsTo(Task, { as: 'task', foreignKey: 'taskId', onDelete: 'CASCADE' });
TaskComment.belongsTo(User, { as: 'user', foreignKey: 'userId', onDelete: 'CASCADE' });

module.exports = {
  User,
  Project,
  ProjectMember,
  Task,
  TaskComment,
};
