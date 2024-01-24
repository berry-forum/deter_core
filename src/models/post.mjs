import {
    useSequelize,
} from "../init/sequelize.mjs";

import {
    DataTypes,
    Model,
} from "sequelize";

import discord from "discord.js";
import {attachmentToMedia} from "./media.mjs";

const sequelize = useSequelize();

/**
 * Post
 */
export default class Post extends Model { }
Post.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    content: DataTypes.TEXT,
}, {
    sequelize,
    modelName: "post",
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
        attachments,
    } = message;

    const {id: userId} = author;
    const media = attachments.map(attachmentToMedia);

    return {
        id,
        content,
        userId,
        createdAt,
        discussionId,
        media,
    };
}
