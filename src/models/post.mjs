import {
    useSequelize,
} from "../init/sequelize.mjs";

import {
    DataTypes,
    Model,
} from "sequelize";

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
