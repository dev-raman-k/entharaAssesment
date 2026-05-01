const { Op } = require('sequelize');
const { Project, ProjectMember, User } = require('../models');
const { serializeProject } = require('../utils/serializers');

const projectIncludes = [
  { model: User, as: 'owner' },
  { model: ProjectMember, as: 'members', include: [{ model: User, as: 'user' }] },
];

const findProjectWithMembers = (id) => {
  return Project.findByPk(id, { include: projectIncludes });
};

const isProjectMember = (project, userId) => {
  return (
    Number(project.ownerId) === Number(userId) ||
    project.members.some((member) => Number(member.userId) === Number(userId))
  );
};

const isProjectAdmin = (project, user) => {
  return user.role === 'Admin' && isProjectMember(project, user.id);
};

exports.createProject = async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Only admins can create projects' });
    }

    const { name, description, startDate, endDate, priority } = req.body;

    const project = await Project.create({
      name,
      description,
      ownerId: req.user.id,
      startDate,
      endDate,
      priority,
    });

    await ProjectMember.create({
      projectId: project.id,
      userId: req.user.id,
      role: 'Admin',
    });

    const savedProject = await findProjectWithMembers(project.id);

    res.status(201).json({
      success: true,
      data: serializeProject(savedProject),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const memberships = await ProjectMember.findAll({
      where: { userId: req.user.id },
      attributes: ['projectId'],
    });
    const memberProjectIds = memberships.map((membership) => membership.projectId);

    const projects = await Project.findAll({
      where: {
        [Op.or]: [{ ownerId: req.user.id }, { id: { [Op.in]: memberProjectIds } }],
      },
      include: projectIncludes,
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects.map(serializeProject),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProject = async (req, res) => {
  try {
    const project = await findProjectWithMembers(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (!isProjectMember(project, req.user.id)) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this project' });
    }

    res.status(200).json({
      success: true,
      data: serializeProject(project),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const projectWithMembers = await findProjectWithMembers(req.params.id);
    if (!isProjectAdmin(projectWithMembers, req.user)) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this project' });
    }

    const allowedUpdates = ['name', 'description', 'startDate', 'endDate', 'priority', 'status'];
    const updates = {};
    allowedUpdates.forEach((key) => {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    });

    await project.update(updates);
    const updatedProject = await findProjectWithMembers(project.id);

    res.status(200).json({
      success: true,
      data: serializeProject(updatedProject),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const projectWithMembers = await findProjectWithMembers(req.params.id);
    if (!isProjectAdmin(projectWithMembers, req.user)) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this project' });
    }

    await project.destroy();

    res.status(200).json({
      success: true,
      message: 'Project deleted',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addMember = async (req, res) => {
  try {
    const { userId } = req.body;

    const project = await findProjectWithMembers(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (!isProjectAdmin(project, req.user)) {
      return res.status(403).json({ success: false, message: 'Not authorized to add members' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const existingMember = await ProjectMember.findOne({
      where: { projectId: project.id, userId },
    });
    if (existingMember) {
      return res.status(400).json({ success: false, message: 'User is already a member' });
    }

    await ProjectMember.create({
      projectId: project.id,
      userId,
      role: user.role,
    });

    const updatedProject = await findProjectWithMembers(project.id);

    res.status(200).json({
      success: true,
      data: serializeProject(updatedProject),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.removeMember = async (req, res) => {
  try {
    const project = await findProjectWithMembers(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (!isProjectAdmin(project, req.user)) {
      return res.status(403).json({ success: false, message: 'Not authorized to remove members' });
    }

    if (Number(req.params.userId) === Number(project.ownerId)) {
      return res.status(400).json({ success: false, message: 'Project owner cannot be removed' });
    }

    await ProjectMember.destroy({
      where: { projectId: project.id, userId: req.params.userId },
    });

    const updatedProject = await findProjectWithMembers(project.id);

    res.status(200).json({
      success: true,
      data: serializeProject(updatedProject),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
