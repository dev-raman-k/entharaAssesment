const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');

class ProjectMember extends Model {
  toJSON() {
    const values = { ...this.get() };
    values._id = values.id;
    return values;
  }
}

ProjectMember.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('Admin', 'Member'),
      allowNull: false,
      defaultValue: 'Member',
    },
    addedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'ProjectMember',
    tableName: 'project_members',
    indexes: [
      {
        unique: true,
        fields: ['projectId', 'userId'],
      },
    ],
  }
);

module.exports = ProjectMember;
