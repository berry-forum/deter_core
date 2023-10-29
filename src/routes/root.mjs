// Import modules
import {
    StatusCodes,
} from "http-status-codes";

import {
    useApp,
} from "../init/express.mjs";

// Export routes mapper (function)
export default () => {
    // Use application
    const app = useApp();

    // Redirect / to INDEX_REDIRECT_URL
    app.get("/", (_, res) => {
        const meetMessage = `
        Star Inc. Lavateinn Framework <br />
        <a href="https://github.com/buff-system/deter_core" target="_blank">
            https://github.com/buff-system/deter_core
        </a>
    `;
        res.status(StatusCodes.IM_A_TEAPOT).send(meetMessage);
    });

    // The handler for robots.txt (deny all friendly robots)
    app.get("/robots.txt", (_, res) => {
        res.type("txt").send("User-agent: *\nDisallow: /");
    });
};
