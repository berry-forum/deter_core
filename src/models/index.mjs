import Discussion from "./discussion.mjs";
import Media from "./media.mjs";
import Post from "./post.mjs";
import User from "./user.mjs";

Discussion.belongsTo(User);
Discussion.hasMany(Post);

Post.belongsTo(User);
Post.belongsTo(Discussion);
Post.hasMany(Media);
Post.belongsToMany(Media, {
    through: "post_media",
});

Media.belongsToMany(Post, {
    through: "post_media",
});

User.hasMany(Discussion);
User.hasMany(Post);
