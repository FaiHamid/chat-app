import { sequelize } from './db.js';
// import './models/users.model.js';

export const syncSchema = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('Database schema synced');
  } catch (err) {
    console.error('Database sync failed:', err);
  }
};

syncSchema();
