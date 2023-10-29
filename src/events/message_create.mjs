import {
    ChannelType,
} from "discord.js";

import {
    client,
} from "../init/discord.mjs";

import {
    getMust,
} from "../config.mjs";

const guildId = getMust("DISCORD_GUILD_ID");
const channelIdForum = getMust("DISCORD_CHANNEL_ID_FORUM");

export default () => client.on("messageCreate", async (message) => {
    if (
        message.guild.id !== guildId &&
        message.channel.id !== channelIdForum &&
        message.channel.type !== ChannelType.PublicThread
    ) {
        return;
    }

    console.log(message);
});
