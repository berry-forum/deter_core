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
        id,
        username,
        globalName: memberGlobalDisplayName,
        avatar: memberGlobalAvatarHash,
    } = user;

    const displayName = memberLocalDisplayName ||
        memberGlobalDisplayName ||
        username;
    let avatarHash = memberLocalAvatarHash ||
        memberGlobalAvatarHash;

    const avatarUrl = `https://cdn.discordapp.com/avatars/${id}/${avatarHash}`;
    try {
        await new Promise((resolve) => {
            got.
                stream(avatarUrl).
                pipe(createWriteStream(`assets/images/avatar-${id}`)).
                once("finish", resolve);
        });
    } catch (error) {
        console.log(error);
        avatarHash = null;
    }

    return {
        id,
        username,
        displayName,
        avatarHash,
    };
}
