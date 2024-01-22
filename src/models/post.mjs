import {
    useSequelize,
} from "../init/sequelize.mjs";

import {
    DataTypes,
    Model,
} from "sequelize";

import discord from "discord.js";

import User from "./user.mjs";

const sequelize = useSequelize();

/**
 * Post
 */
export default class Post extends Model {}
Post.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    content: DataTypes.TEXT,
    authorId: DataTypes.STRING,
}, {
    sequelize,
    modelName: "post",
});
Post.belongsTo(User, {
    foreignKey: "authorId",
});

/**
 * Convert Discord's Message to Deter's Post
 * @param {discord.Message} message Discord's Message
 * @return {Object}
 */
export function messageToPost(message) {
    const {
        id,
        content,
        author,
        createdTimestamp: createdAt,
        channelId: discussionId,
    } = message;

    const {
        id: authorId,
    } = author;

    return {
        id,
        content,
        authorId,
        createdAt,
        discussionId,
    };
}
