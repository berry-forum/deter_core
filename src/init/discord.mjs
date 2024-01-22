import {
    Client,
    Partials,
    GatewayIntentBits,
} from "discord.js";

import {
    getMust,
} from "../config.mjs";

import {Op} from "sequelize";
import Discussion, {threadToDiscussion} from "../models/discussion.mjs";
import Post, {messageToPost} from "../models/post.mjs";
import User, {memberToUser} from "../models/user.mjs";

const client = new Client({
    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.Reaction,
    ],
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.MessageContent,
    ],
});

const botToken = getMust("DISCORD_BOT_TOKEN");
const channelIdForum = getMust("DISCORD_CHANNEL_ID_FORUM");

export const initializePromise = (async () => {
    await client.login(botToken);

    const channel = await client.channels.fetch(channelIdForum);

    // Threads
    const channelThreadActivated = await channel.threads.fetch();
    const channelThreadArchived = await channel.threads.fetchArchived();
    const remoteActivatedThreads = Array.from(
        channelThreadActivated.threads.values(),
    );
    const remoteArchivedThreads = Array.from(
        channelThreadArchived.threads.values(),
    );
    const remoteThreads = remoteActivatedThreads.concat(remoteArchivedThreads);
    const remoteThreadIds = remoteThreads.map(({id}) => id);
    const localThreadIds = await Discussion.findAll({
        where: {
            id: {[Op.in]: remoteThreadIds},
        },
    });
    const appendThreadIds = remoteThreadIds.filter(
        (id) => !localThreadIds.includes(id),
    );
    const appendThreads = remoteThreads.filter(
        ({id}) => appendThreadIds.includes(id),
    ).map(threadToDiscussion);

    // Posts
    const messageThreads = remoteThreads.filter(
        ({id}) => appendThreadIds.includes(id),
    );
    const threadMessages = await Promise.all(messageThreads.map(
        (thread) => thread.messages.fetch(),
    ));
    const appendPosts = threadMessages.map(
        (messages) => messages.map(messageToPost),
    ).flat();

    // Users
    const remoteUserIds = Array.from(
        new Set(appendPosts.map(({authorId}) => authorId)),
    );
    const localUserIds = await User.findAll({
        where: {
            id: {[Op.in]: remoteUserIds},
        },
    });
    const appendUserIds = remoteUserIds.filter(
        (id) => !localUserIds.includes(id),
    );
    const remoteUsers = await channel.guild.members.fetch({
        user: appendUserIds,
    });
    const appendUsers = Array.from(
        remoteUsers.values(),
    ).map(memberToUser);

    // Bulk creation
    await User.bulkCreate(appendUsers, {ignoreDuplicates: true});
    await Discussion.bulkCreate(appendThreads, {ignoreDuplicates: true});
    await Post.bulkCreate(appendPosts, {ignoreDuplicates: true});
})();
export const useClient = () => client;
