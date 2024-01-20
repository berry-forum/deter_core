import {
    useSequelize,
} from "../init/sequelize.mjs";

import {
    DataTypes,
    Model,
} from "sequelize";

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
