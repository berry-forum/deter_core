import {
    useSequelize,
} from "../init/sequelize.mjs";

import {
    DataTypes,
    Model,
} from "sequelize";

import discord from "discord.js";

const sequelize = useSequelize();

/**
 * Media
 */
export default class Media extends Model { }
Media.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            len: [0, 1024],
        },
    },
    contentType: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    size: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    url: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    proxyUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    height: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    width: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    ephemeral: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    duration: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    waveform: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    sequelize,
    timestamps: false,
    modelName: "media",
});

/**
 * Convert Discord's Attachment to Deter's Media
 * @param {discord.Attachment} attachment Discord's Attachment
 * @return {Object}
 */
export function attachmentToMedia(attachment) {
    const {
        id,
        name, description,
        contentType, size,
        url, proxyURL: proxyUrl,
        height, width,
        ephemeral, duration, waveform,
    } = attachment;

    return {
        id,
        name, description,
        contentType, size,
        url, proxyUrl,
        height, width,
        ephemeral, duration, waveform,
    };
}
