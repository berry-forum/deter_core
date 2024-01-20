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
    loginPromise,
} from "./src/init/discord.mjs";
import {
    initializePromise,
} from "./src/init/sequelize.mjs";

// Define plugin promises
const pluginPromises = [
    loginPromise,
    initializePromise,
];

// Define router names
const routerNames = [
    "root",
    "forum",
];

// Define event names
const eventNames = [
    "message_create",
    "thread_create",
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
