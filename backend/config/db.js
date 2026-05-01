const path = require('path');
const { Sequelize } = require('sequelize');

const isProduction = process.env.NODE_ENV === 'production';
const databaseUrl = process.env.DATABASE_URL;

const sequelize = databaseUrl
  ? new Sequelize(databaseUrl, {
      dialect: 'postgres',
      protocol: 'postgres',
      logging: false,
      dialectOptions: isProduction
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          }
        : {},
    })
  : new Sequelize({
      dialect: 'sqlite',
      storage: process.env.SQLITE_FILE || path.join(__dirname, '..', 'database.sqlite'),
      logging: false,
    });

const connectDB = async () => {
  try {
    require('../models');
    await sequelize.authenticate();
    await sequelize.sync({ alter: process.env.DB_ALTER === 'true' });
    console.log(`SQL database connected (${sequelize.getDialect()})`);
  } catch (error) {
    console.error(`Database error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
module.exports.sequelize = sequelize;
