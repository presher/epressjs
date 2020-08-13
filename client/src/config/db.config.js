module.exports = {
    HOST: process.env.EXPRESS_APP_DB_HOST,
    USER: process.env.USER_DB_USER,
    PASSWORD: process.env.USER_DB_PW,
    DB: process.env.EXPRESS_APP_DB_NAME,
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };