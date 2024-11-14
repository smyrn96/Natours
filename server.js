const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION...SHUTTING DOWN');
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then((con) => {
  console.log(con.connections);
  console.log('DB connection established');
});

const app = require('./app');

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log('listening on port ', port);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHADLED REJECTION...SHUTTING DOWN');

  server.close(() => {
    process.exit(1);
  });
});
