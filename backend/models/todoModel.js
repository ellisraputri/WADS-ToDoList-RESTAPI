import { DataTypes } from "sequelize";
import {sequelize} from "../config/mysql.js"; // or your Sequelize instance
import User from "./userModel.js"; // your user model

const Todo = sequelize.define("Todo", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  completed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  userId: {
    type: DataTypes.UUID, // ✅ must match User.id type
    allowNull: false
  }
}, {
  timestamps: true
});

// Associations
Todo.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE"
});

export default Todo;
