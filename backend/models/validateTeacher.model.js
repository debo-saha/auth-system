export default (sequelize, DataTypes) => {
  const ValidTeachers = sequelize.define("ValidTeachers", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    teacherid: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    is_registered: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    tableName: "ValidTeachers",
    timestamps: false,
  });

  return ValidTeachers;
};
