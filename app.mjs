// Auto-load config
import "./src/init/config.mjs";

// Import modules
import {
    APP_NAME as appName,
} from "./src/init/const.mjs";
import {
    getOverview,
} from "./src/config.mjs";
import {
    invokeApp,
} from "./src/execute.mjs";

import {
    initializePromise as initDiscord,
} from "./src/init/discord.mjs";
import {
    initializePromise as initSequelize,
} from "./src/init/sequelize.mjs";

// Define plugin promises
const pluginPromises = [
    initDiscord,
    initSequelize,
];

// Define router names
const routerNames = [
    "root",
    "discussions",
];

// Define event names
const eventNames = [
    "message_create",
    "message_delete",
    "message_update",
    "thread_create",
    "thread_delete",
    "thread_update",
];

// Define display
const displayStatus = (protocolStatus) => {
    const viewIt = ({protocol, hostname, port}) => {
        const {node, runtime} = getOverview();
        console.info(appName, `(environment: ${node}, ${runtime})`);
        console.info("====");
        console.info(`Protocol "${protocol}" is listening at`);
        console.info(`${protocol}://${hostname}:${port}`);
    };
    protocolStatus.forEach(viewIt);
};

// Mount application and execute it
invokeApp().
    loadPromises(pluginPromises).
    loadRoutes(routerNames).
    loadEvents(eventNames).
    execute().
    then(displayStatus);
