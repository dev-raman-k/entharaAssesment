const serializeUser = (user) => {
  if (!user) return null;
  const values = typeof user.toJSON === 'function' ? user.toJSON() : user;
  return {
    id: values.id,
    _id: values.id,
    name: values.name,
    email: values.email,
    role: values.role,
    avatar: values.avatar,
    createdAt: values.createdAt,
    updatedAt: values.updatedAt,
  };
};

const serializeProjectMember = (member) => {
  const values = typeof member.toJSON === 'function' ? member.toJSON() : member;
  return {
    id: values.id,
    _id: values.id,
    role: values.role,
    addedAt: values.addedAt,
    user: serializeUser(values.user),
  };
};

const serializeProject = (project) => {
  const values = typeof project.toJSON === 'function' ? project.toJSON() : project;
  return {
    id: values.id,
    _id: values.id,
    name: values.name,
    description: values.description,
    owner: serializeUser(values.owner),
    members: (values.members || []).map(serializeProjectMember),
    status: values.status,
    priority: values.priority,
    startDate: values.startDate,
    endDate: values.endDate,
    createdAt: values.createdAt,
    updatedAt: values.updatedAt,
  };
};

const serializeComment = (comment) => {
  const values = typeof comment.toJSON === 'function' ? comment.toJSON() : comment;
  return {
    id: values.id,
    _id: values.id,
    text: values.text,
    createdAt: values.createdAt,
    updatedAt: values.updatedAt,
    user: serializeUser(values.user),
  };
};

const serializeTask = (task) => {
  const values = typeof task.toJSON === 'function' ? task.toJSON() : task;
  return {
    id: values.id,
    _id: values.id,
    title: values.title,
    description: values.description,
    project: values.project ? serializeProject(values.project) : values.projectId,
    assignedTo: serializeUser(values.assignedTo),
    assignedBy: serializeUser(values.assignedBy),
    status: values.status,
    priority: values.priority,
    dueDate: values.dueDate,
    completedAt: values.completedAt,
    comments: (values.comments || []).map(serializeComment),
    attachments: [],
    createdAt: values.createdAt,
    updatedAt: values.updatedAt,
  };
};

module.exports = {
  serializeUser,
  serializeProject,
  serializeTask,
};
