import {
    ChannelType,
} from "discord.js";

import {
    useClient,
} from "../init/discord.mjs";

import {
    getMust,
} from "../config.mjs";

import Discussion from "../models/discussion.mjs";
import Post from "../models/post.mjs";

const client = useClient();

const guildId = getMust("DISCORD_GUILD_ID");

export default () => client.on("messageCreate", async (message) => {
    if (
        message.guild.id !== guildId ||
        message.channel.type !== ChannelType.PublicThread
    ) {
        return;
    }

    if (!await Discussion.findByPk(message.channel.id)) {
        return;
    }

    await Post.create({
        id: message.id,
        content: message.content,
        authorId: message.author.id,
        createdAt: message.createdTimestamp,
    });
});
