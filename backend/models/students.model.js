export default (sequelize, DataTypes) => {
  const Students = sequelize.define('Students', {
    snro: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name:  {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isFirstLogin: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    resetPasswordToken: DataTypes.STRING,
    resetPasswordExpiresAt: DataTypes.DATE,
    verificationToken: DataTypes.STRING,
    verificationTokenExpiresAt: DataTypes.DATE,
    studentId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  }, {
    tableName: 'Students',
    timestamps: false, 
  });

  return Students;
};
