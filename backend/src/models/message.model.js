import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";
import { User } from "./user.model.js";
import { Room } from "./room.model.js";

export const Message = sequelize.define('message', {
    text: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

Message.belongsTo(User);
User.hasOne(Message);

Message.belongsTo(Room);
Room.hasOne(Message);