
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

import studentsTable from '../models/students.model.js';
import validStudentTable from '../models/validateStudent.model.js';
import userTable from '../models/user.model.js';
import validTeacherTable  from '../models/validateTeacher.model.js';
dotenv.config();

// Log the environment variable
console.log('🔐 DATABASE_URL:', process.env.NEW_DATABASE_URL);

const sequelize = new Sequelize(process.env.NEW_DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false }
  },
  logging: console.log  // Enable Sequelize logging
});

// Extra test for authentication
sequelize.authenticate()
  .then(() => console.log('✅ Sequelize connected successfully'))
  .catch(err => console.error('❌ Sequelize auth error:', err));

const db = {
  Sequelize,
  sequelize,

  Students: studentsTable(sequelize, Sequelize),
  ValidStudents: validStudentTable(sequelize, Sequelize),
  Users:userTable(sequelize,Sequelize),
  ValidTeachers: validTeacherTable(sequelize, Sequelize)
 
};

export default db;