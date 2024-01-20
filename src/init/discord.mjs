import {
    Client,
    Partials,
    GatewayIntentBits,
} from "discord.js";

import {
    getMust,
} from "../config.mjs";

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
export const loginPromise = client.login(botToken);
export const useClient = () => client;
