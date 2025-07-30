// config/config.cjs
require('dotenv').config();

const commonConfig = {
  use_env_variable: 'DATABASE_URL',
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
};

module.exports = {
  development: commonConfig,
  production: commonConfig,
};
