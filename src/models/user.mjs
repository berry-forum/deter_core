import {
    useSequelize,
} from "../init/sequelize.mjs";

import {
    DataTypes,
    Model,
} from "sequelize";

import {
    createWriteStream,
} from "node:fs";

import discord from "discord.js";
import got from "got";

/**
 * Base urls for CDN and Media endpoints in Discord's API.
 */
const baseUrlCdn = "https://cdn.discordapp.com";

/**
 * Sequalise instance for database connection.
 */
const sequelize = useSequelize();

/**
 * User
 */
export default class User extends Model { }
User.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    username: DataTypes.STRING,
    displayName: DataTypes.STRING,
    avatarHash: DataTypes.STRING,
}, {
    sequelize,
    modelName: "user",
});

/**
 * Mapping avatar hash into imeage url.
 * @param {string} userId - The id of the discord user.
 * @param {string} avatarHash - The image hash of the avatar.
 * @return {string|null} - The url of the avatar image.
 */
function toAvatarUrl(userId, avatarHash) {
    if (!userId || !avatarHash) {
        return null;
    }
    const url = `${baseUrlCdn}/avatars/${userId}/${avatarHash}`;
    console.log(url);
    return url;
}

/**
 * Convert Discord's Member to Deter's User
 * @param {discord.Member} member Discord's Member
 * @return {Object}
 */
export async function memberToUser(member) {
    const {
        user,
        nickname: memberLocalDisplayName,
        avatar: memberLocalAvatarHash,
    } = member;

    const {
        id: userId,
        username,
        globalName: memberGlobalDisplayName,
        avatar: memberGlobalAvatarHash,
    } = user;

    const displayName = memberLocalDisplayName ||
        memberGlobalDisplayName ||
        username;
    let avatarHash = memberLocalAvatarHash ||
        memberGlobalAvatarHash;

    try {
        const avatarUrl = toAvatarUrl(userId, avatarHash);
        if (avatarUrl) {
            const targetPath = `assets/images/avatar-${userId}`;
            await new Promise((resolve, reject) => {
                got.
                    stream(avatarUrl).
                    pipe(createWriteStream(targetPath)).
                    once("finish", resolve).
                    on("error", reject);
            });
        } else {
            avatarHash = null;
        }
    } catch (e) {
        console.error(e);
        avatarHash = null;
    }

    return {
        id: userId,
        username,
        displayName,
        avatarHash,
    };
}
