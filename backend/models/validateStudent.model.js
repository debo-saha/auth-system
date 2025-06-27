// models/validStudent.model.js
export default (sequelize, DataTypes) => {
  const ValidStudent = sequelize.define('ValidStudent', {
    snro: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    studentId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    is_registered: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    tableName: 'ValidStudent',
    timestamps: false,
  });

  return ValidStudent;
};
