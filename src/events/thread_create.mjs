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
import User from "../models/user.mjs";

const client = useClient();

const guildId = getMust("DISCORD_GUILD_ID");
const channelIdForum = getMust("DISCORD_CHANNEL_ID_FORUM");

const handleMembers = async (thread) => {
    const members = await thread.members.fetch();
    await Promise.all(Array.from(members.values()).map((m) => User.create({
        id: m.id,
    })));
};

const handleMessages = async (thread) => {
    const messages = await thread.messages.fetch();
    await Promise.all(Array.from(messages.values()).map((m) => Post.create({
        id: m.id,
        content: m.content,
        authorId: m.author.id,
        createdAt: m.createdTimestamp,
    })));
};

export default () => client.on("threadCreate", async (thread) => {
    if (
        thread.guild.id !== guildId ||
        thread.parent.id !== channelIdForum ||
        thread.parent.type !== ChannelType.GuildForum
    ) {
        return;
    }

    const {id, name} = thread;
    await Discussion.create({id, name});
    await Promise.all([
        handleMembers,
        handleMessages,
    ].map((fn) => fn(thread)));
});
