import {
    Events,
    ChannelType,
} from "discord.js";

import {
    useClient,
} from "../init/discord.mjs";

import {
    getMust,
} from "../config.mjs";

import Post from "../models/post.mjs";

const client = useClient();

const guildId = getMust("DISCORD_GUILD_ID");

export default () => client.on(Events.MessageDelete, async (message) => {
    if (
        message.guild.id !== guildId ||
        message.channel.type !== ChannelType.PublicThread
    ) {
        return;
    }

    const post = await Post.findByPk(message.id);
    if (!post) {
        return;
    }

    await post.destroy();
});
