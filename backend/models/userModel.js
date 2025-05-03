import { DataTypes } from 'sequelize';
import { sequelize } from '../config/mysql.js'; 

const User = sequelize.define('User', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    bio: {
        type: DataTypes.STRING,
        defaultValue: '',
    },
    profileImage: {
        type: DataTypes.STRING,
        defaultValue: '',
    },
    secretKey: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    timestamps: true,
    tableName: 'users' // optional: custom table name
});

export default User;
