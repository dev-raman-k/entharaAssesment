const { Project, ProjectMember, Task, TaskComment, User } = require('../models');
const { serializeTask } = require('../utils/serializers');

const taskIncludes = [
  { model: User, as: 'assignedTo' },
  { model: User, as: 'assignedBy' },
  { model: Project, as: 'project', include: [{ model: User, as: 'owner' }, { model: ProjectMember, as: 'members', include: [{ model: User, as: 'user' }] }] },
  { model: TaskComment, as: 'comments', include: [{ model: User, as: 'user' }] },
];

const findTask = (id) => Task.findByPk(id, { include: taskIncludes });

const isProjectMember = async (projectId, userId) => {
  const project = await Project.findByPk(projectId);
  if (!project) return { project: null, isMember: false };

  if (Number(project.ownerId) === Number(userId)) {
    return { project, isMember: true };
  }

  const membership = await ProjectMember.findOne({ where: { projectId, userId } });
  return { project, isMember: Boolean(membership) };
};

const requireAdmin = (user, res) => {
  if (user.role !== 'Admin') {
    res.status(403).json({ success: false, message: 'Only admins can perform this action' });
    return false;
  }
  return true;
};

exports.createTask = async (req, res) => {
  try {
    if (!requireAdmin(req.user, res)) return;

    const { title, description, projectId, assignedTo, priority, dueDate } = req.body;

    const { project, isMember } = await isProjectMember(projectId, req.user.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (!isMember) {
      return res.status(403).json({ success: false, message: 'Not authorized to create tasks in this project' });
    }

    const assigneeMembership = await ProjectMember.findOne({
      where: { projectId, userId: assignedTo },
    });
    if (Number(project.ownerId) !== Number(assignedTo) && !assigneeMembership) {
      return res.status(400).json({ success: false, message: 'Assigned user must be a project member' });
    }

    const task = await Task.create({
      title,
      description,
      projectId,
      assignedToId: assignedTo,
      assignedById: req.user.id,
      priority,
      dueDate,
    });

    const savedTask = await findTask(task.id);

    res.status(201).json({
      success: true,
      data: serializeTask(savedTask),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProjectTasks = async (req, res) => {
  try {
    const { project, isMember } = await isProjectMember(req.params.projectId, req.user.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (!isMember) {
      return res.status(403).json({ success: false, message: 'Not authorized to view these tasks' });
    }

    const tasks = await Task.findAll({
      where: { projectId: req.params.projectId },
      include: taskIncludes,
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks.map(serializeTask),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { assignedToId: req.user.id },
      include: taskIncludes,
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks.map(serializeTask),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTask = async (req, res) => {
  try {
    const task = await findTask(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const { isMember } = await isProjectMember(task.projectId, req.user.id);
    if (!isMember) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this task' });
    }

    res.status(200).json({
      success: true,
      data: serializeTask(task),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const project = await Project.findByPk(task.projectId);
    const assignedBy = await User.findByPk(task.assignedById);
    const isAssignedMember =
      req.user.role === 'Member' &&
      assignedBy?.role === 'Admin' &&
      Number(task.assignedToId) === Number(req.user.id);
    const isAdminInProject =
      req.user.role === 'Admin' &&
      (Number(project.ownerId) === Number(req.user.id) ||
        Boolean(await ProjectMember.findOne({ where: { projectId: task.projectId, userId: req.user.id } })));
    const isAuthorized = isAssignedMember || isAdminInProject;

    if (!isAuthorized) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this task' });
    }

    if (isAssignedMember) {
      if (Object.keys(req.body).some((key) => key !== 'status') || req.body.status !== 'Completed') {
        return res.status(403).json({ success: false, message: 'Members can only mark assigned admin tasks as completed' });
      }

      await task.update({ status: 'Completed', completedAt: new Date() });
      const completedTask = await findTask(task.id);

      return res.status(200).json({
        success: true,
        data: serializeTask(completedTask),
      });
    }

    const allowedUpdates = ['title', 'description', 'assignedTo', 'status', 'priority', 'dueDate'];
    const updates = {};
    allowedUpdates.forEach((key) => {
      if (req.body[key] !== undefined) updates[key === 'assignedTo' ? 'assignedToId' : key] = req.body[key];
    });

    if (updates.status === 'Completed' && task.status !== 'Completed') {
      updates.completedAt = new Date();
    } else if (updates.status && updates.status !== 'Completed') {
      updates.completedAt = null;
    }

    await task.update(updates);
    const updatedTask = await findTask(task.id);

    res.status(200).json({
      success: true,
      data: serializeTask(updatedTask),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    if (!requireAdmin(req.user, res)) return;

    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const project = await Project.findByPk(task.projectId);
    const isAdminInProject =
      Number(project.ownerId) === Number(req.user.id) ||
      Boolean(await ProjectMember.findOne({ where: { projectId: task.projectId, userId: req.user.id } }));

    if (!isAdminInProject) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this task' });
    }

    await task.destroy();

    res.status(200).json({
      success: true,
      message: 'Task deleted',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    if (!requireAdmin(req.user, res)) return;

    const { text } = req.body;
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const { isMember } = await isProjectMember(task.projectId, req.user.id);
    if (!isMember) {
      return res.status(403).json({ success: false, message: 'Not authorized to comment on this task' });
    }

    await TaskComment.create({
      taskId: task.id,
      userId: req.user.id,
      text,
    });

    const updatedTask = await findTask(task.id);

    res.status(200).json({
      success: true,
      data: serializeTask(updatedTask),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const userTasks = await Task.findAll({ where: { assignedToId: req.user.id } });

    const total = userTasks.length;
    const completed = userTasks.filter((task) => task.status === 'Completed').length;
    const pending = userTasks.filter((task) => task.status === 'Pending').length;
    const inProgress = userTasks.filter((task) => task.status === 'In Progress').length;
    const overdue = userTasks.filter((task) => new Date(task.dueDate) < now && task.status !== 'Completed').length;

    res.status(200).json({
      success: true,
      data: {
        total,
        completed,
        pending,
        inProgress,
        overdue,
        tasksByStatus: {
          Pending: pending,
          'In Progress': inProgress,
          Completed: completed,
          'On Hold': userTasks.filter((task) => task.status === 'On Hold').length,
        },
        tasksByPriority: {
          Low: userTasks.filter((task) => task.priority === 'Low').length,
          Medium: userTasks.filter((task) => task.priority === 'Medium').length,
          High: userTasks.filter((task) => task.priority === 'High').length,
          Critical: userTasks.filter((task) => task.priority === 'Critical').length,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
