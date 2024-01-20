import {
    useSequelize,
} from "../init/sequelize.mjs";

import {
    DataTypes,
    Model,
} from "sequelize";

import Post from "./post.mjs";

const sequelize = useSequelize();

/**
 * Discussion
 */
export default class Discussion extends Model {}
Discussion.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    name: DataTypes.STRING,
}, {
    sequelize,
    modelName: "discussion",
});
Discussion.hasMany(Post);
