const { DataTypes } = require("sequelize");
const db = require("../config/db");

const User = db.define(
  "users",
  {
    nama: DataTypes.STRING,
    email: DataTypes.STRING,
    role: DataTypes.CHAR(10),
    password: DataTypes.STRING,
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

const Class = db.define(
  "classes",
  {
    banner: DataTypes.STRING,
    title: DataTypes.STRING,
    teacher_id: DataTypes.INTEGER,
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

const Material = db.define(
  "material",
  {
    class_id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    file: DataTypes.STRING,
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

const Assignment = db.define(
  "assignments",
  {
    class_id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    expired: DataTypes.DATE,
    file: DataTypes.STRING,
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

const Works = db.define(
  "works",
  {
    assignment_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    file: DataTypes.STRING,
    status: DataTypes.STRING,
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

User.hasMany(Class, {
  foreignKey: "teacher_id",
});

Class.belongsTo(User, {
  foreignKey: "teacher_id",
});

Class.hasMany(Material, {
  foreignKey: "class_id",
});
Class.hasMany(Assignment, {
  foreignKey: "class_id",
});

Material.belongsTo(Class, {
  foreignKey: "class_id",
});
Assignment.belongsTo(Class, {
  foreignKey: "class_id",
});

Assignment.hasMany(Works, {
  foreignKey: "assignment_id",
});
Works.belongsTo(Assignment, {
  foreignKey: "assignment_id",
});

module.exports = {
  User,
  Class,
  Material,
  Assignment,
  Works,
};
