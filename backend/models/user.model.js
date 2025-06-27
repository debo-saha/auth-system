export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      srno: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("student", "admin", "subadmin", "teacher"),
        allowNull: false,
      },
      collegeid: {
        type: DataTypes.STRING(20),
        allowNull: true, // Only needed for students
      },
      isverified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      lastlogin: {
        type: DataTypes.DATE,
      },
      resetpasswordtoken: {
        type: DataTypes.TEXT,
      },
      resetpasswordexpiresat: {
        type: DataTypes.DATE,
      },
      verificationtoken: {
        type: DataTypes.STRING(6),
      },
      verificationtokenexpiresat: {
        type: DataTypes.DATE,
      },
      createdat: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedat: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "Users",
      timestamps: false, // We’ll handle createdAt & updatedAt manually
    }
  );

  return User;
};
