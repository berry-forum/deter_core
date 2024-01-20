// Import modules
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
    const discussions = await modelDiscussion.findAll({
        order: [
            ["updatedAt", "DESC"],
        ],
    });
    res.send(discussions);
});

router.get("/:id", async (req, res) => {
    const {id: discussionId} = req.params;

    // Discussion
    const discussion = await modelDiscussion.findByPk(discussionId);

    // Post
    const posts = await modelPost.findAll({
        discussionId,
        order: [
            ["updatedAt", "DESC"],
        ],
    });

    // Author
    const authorIds = new Set(posts.map(({authorId}) => authorId));
    const authors = await Promise.all(
        Array.from(authorIds).map((i) => modelUser.findByPk(i)),
    );

    // Response
    res.send({discussion, posts, authors});
});

// Export routes mapper (function)
export default () => {
    // Use application
    const app = useApp();

    // Mount the router
    app.use("/discussions", router);
};
