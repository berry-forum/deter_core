// Import modules
import {StatusCodes} from "http-status-codes";

import {useApp, express} from "../init/express.mjs";

import modelDiscussion from "../models/discussion.mjs";
import modelPost from "../models/post.mjs";
import modelUser from "../models/user.mjs";

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
    const discussions = await modelDiscussion.findAll({
        order: [
            ["updatedAt", "DESC"],
        ],
    });

    // Authors
    const userIds = new Set(discussions.map(({ownerId}) => ownerId));
    const users = await Promise.all(Array.from(userIds).map(
        (i) => modelUser.findByPk(i),
    ));

    // Response
    res.send({
        discussions,
        users,
    });
});

router.get("/:id", async (req, res) => {
    const {id: discussionId} = req.params;

    // Discussion
    const discussion = await modelDiscussion.findByPk(discussionId);

    if (!discussion) {
        res.sendStatus(StatusCodes.NOT_FOUND);
        return;
    }

    // Post
    const posts = await modelPost.findAll({
        where: {
            discussionId,
        },
        order: [
            ["createdAt", "ASC"],
        ],
    });

    // Users
    const userIds = new Set(posts.map(({authorId}) => authorId));
    const users = await Promise.all(Array.from(userIds).map(
        (i) => modelUser.findByPk(i),
    ));

    // Response
    res.send({discussion, posts, users});
});

// Export routes mapper (function)
export default () => {
    // Use application
    const app = useApp();

    // Mount the router
    app.use("/discussions", router);
};
