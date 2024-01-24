// Import modules
import {StatusCodes} from "http-status-codes";

import {useApp, express} from "../init/express.mjs";

import {parse} from "discord-markdown-parser";

import Discussion from "../models/discussion.mjs";
import Post from "../models/post.mjs";
import Media from "../models/media.mjs";
import User from "../models/user.mjs";

// Create router
const {Router: newRouter} = express;
const router = newRouter();

// Request body parser middleware
router.use(express.json());

/**
 * @openapi
 * /example/now:
 *   get:
 *     tags:
 *       - example
 *     summary: Get POSIX timestamp
 *     description: Example to show current POSIX timestamp.
 *     responses:
 *       200:
 *         description: Returns current POSIX timestamp.
 */
router.get("/", async (_, res) => {
    // Discussions
    const discussions = await Discussion.findAll({
        order: [
            ["updatedAt", "DESC"],
            ["createdAt", "DESC"],
        ],
        include: User,
    });

    // Response
    res.send(discussions);
});

router.get("/:id", async (req, res) => {
    const {id: discussionId} = req.params;

    // Discussion
    const discussion = await Discussion.findByPk(discussionId, {
        include: [User, {
            model: Post,
            where: {discussionId},
            order: [["createdAt", "ASC"]],
            include: [User, Media],
        }],
    });

    if (!discussion) {
        res.sendStatus(StatusCodes.NOT_FOUND);
        return;
    }

    // Post
    for (const post of discussion.posts) {
        post.content = parse(post.content);
    }

    // Response
    res.send(discussion);
});

// Export routes mapper (function)
export default () => {
    // Use application
    const app = useApp();

    // Mount the router
    app.use("/discussions", router);
};
