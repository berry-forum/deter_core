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

import Discussion from "../models/discussion.mjs";
import Media, {attachmentToMedia} from "../models/media.mjs";
import Post, {messageToPost} from "../models/post.mjs";
import User, {memberToUser} from "../models/user.mjs";

const client = useClient();

const guildId = getMust("DISCORD_GUILD_ID");

export default () => client.on(Events.MessageCreate, async (message) => {
    if (
        message.guild.id !== guildId ||
        message.channel.type !== ChannelType.PublicThread
    ) {
        return;
    }

    if (!await Discussion.findByPk(message.channel.id)) {
        return;
    }

    const authorMember = await message.guild.members.fetch(message.author.id);
    await User.upsert(memberToUser(authorMember));

    const messageMedia = Array.from(
        message.attachments.values(),
    ).map(attachmentToMedia);
    await Media.bulkCreate(messageMedia, {ignoreDuplicates: true});

    await Post.create(messageToPost(message));
});
