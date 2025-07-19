import { Sequelize } from 'sequelize';
import { config } from '../config/appconfig';

console.log('DB CONFIG:', config.db);

const sequelize = new Sequelize(
    config.db.name,
    config.db.user,
    config.db.pass,
    {
        host: config.db.host,
        dialect: 'postgres',
        logging:false,
    }
);

export default sequelize;
