var dbConfig = {
  server: process.env.DB_HOST,
  authentication: {
    type: 'default',
    options: {
      userName: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD
    }
  },
  options: {
    database: process.env.DB_NAME
  }
}

module.exports = dbConfig
