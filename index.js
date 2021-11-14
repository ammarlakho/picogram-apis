const app = require('./picogram-apis-template/app');
const config = require('./picogram-apis-template/config');

const PORT = process.env.PORT || config.port;

const server = app.listen(PORT, () => {
  console.log('server is running on port', server.address().port);
});
