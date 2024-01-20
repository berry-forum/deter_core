import {
    useSequelize,
} from "../init/sequelize.mjs";

import {
    DataTypes,
    Model,
} from "sequelize";

import User from "./user.mjs";

const sequelize = useSequelize();

/**
 * Post
 */
export default class Post extends Model {}
Post.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    content: DataTypes.TEXT,
    authorId: DataTypes.STRING,
}, {
    sequelize,
    modelName: "post",
});
Post.belongsTo(User, {
    foreignKey: "authorId",
});
