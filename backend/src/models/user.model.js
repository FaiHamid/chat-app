import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const User = sequelize.define('user', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Anonymous'
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    activationToken: {
        type: DataTypes.STRING,
    }
});