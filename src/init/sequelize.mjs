import {
    Sequelize,
} from "sequelize";

import {
    getMust,
    isProduction,
} from "../config.mjs";

const sequelizeDbHost = getMust("SEQUELIZE_DB_HOST");
const sequelizeDbPort = getMust("SEQUELIZE_DB_PORT");
const sequelizeDbName = getMust("SEQUELIZE_DB_NAME");
const sequelizeDbUser = getMust("SEQUELIZE_DB_USER");
const sequelizeDbPass = getMust("SEQUELIZE_DB_PASS");

const allModelNames = [
    "discussion",
    "post",
    "user",
];

const sequelize = new Sequelize(
    sequelizeDbName,
    sequelizeDbUser,
    sequelizeDbPass,
    {
        host: sequelizeDbHost,
        port: sequelizeDbPort,
        logging: !isProduction(),
        dialect: "mysql",
    },
);

const loadModels = (names) => {
    return Promise.all(names.map((name) => {
        const filePath = new URL(`../models/${name}.mjs`, import.meta.url);
        return import(filePath);
    }));
};

export const initializePromise = (async () => {
    await loadModels(allModelNames);
    await sequelize.authenticate();
    await sequelize.sync();
})();
export const useSequelize = () => sequelize;
