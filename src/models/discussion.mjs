import {
    useSequelize,
} from "../init/sequelize.mjs";

import {
    DataTypes,
    Model,
} from "sequelize";

import Post from "./post.mjs";
import User from "./user.mjs";

import discord from "discord.js";

const sequelize = useSequelize();

/**
 * Discussion
 */
export default class Discussion extends Model { }
Discussion.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    name: DataTypes.STRING,
    ownerId: DataTypes.STRING,
    lastMessageId: DataTypes.STRING,
    messageCount: DataTypes.INTEGER,
    memberCount: DataTypes.INTEGER,
}, {
    sequelize,
    modelName: "discussion",
});
Discussion.hasMany(Post);
Discussion.belongsTo(User, {
    foreignKey: "ownerId",
});

/**
 * Convert Discord's Thread to Deter's Discussion
 * @param {discord.Thread} thread Discord's Thread
 * @return {Object}
 */
export function threadToDiscussion(thread) {
    const {
        id, name, ownerId, lastMessageId,
        messageCount, memberCount,
        archiveTimestamp: createdAt,
    } = thread;

    return {
        id, name, ownerId, lastMessageId,
        messageCount, memberCount, createdAt,
    };
}
