const app = require('./app');
const config = require('../config');

const PORT = process.env.PORT || config.PORT;

const server = app.listen(PORT, () => {
  console.log('server is running on port', server.address().port);
});