import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const Room = sequelize.define('room', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    inviteCode: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
    }
})
