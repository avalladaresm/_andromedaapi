// @tsed/cli do not edit
import { ConnectionOptions, createConnection } from 'typeorm';
require('dotenv').config();

const conf: ConnectionOptions = {
  name: 'default',
  type: 'mssql',
  host: process.env.TYPEORM_HOST,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  synchronize: false,
  logging: false,
  entities: [
    `${__dirname}/entity/**/*.{js,ts}`,
  ],
  migrations: [
    '${rootDir}/migration/**/*.ts'
  ],
  subscribers: [
    '${rootDir}/subscriber/**/*.ts'
  ]
}

createConnection(conf).then(connection => {
}).catch(err => console.log('err', err))

export default [
  conf as ConnectionOptions
];
