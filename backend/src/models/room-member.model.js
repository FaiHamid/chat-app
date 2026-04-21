import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";
import { User } from "./user.model.js";
import { Room } from "./room.model.js";

export const RoomMember = sequelize.define('room-member', {})


RoomMember.belongsTo(User);
User.hasOne(RoomMember);

RoomMember.belongsTo(Room);
Room.hasOne(RoomMember);