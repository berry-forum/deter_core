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

export default () => client.on("threadCreate", async (thread) => {
    if (
        thread.guild.id !== guildId &&
        thread.parent.type !== ChannelType.GuildForum &&
        thread.parent.id !== channelIdForum
    ) {
        return;
    }

    console.log(thread);
});
