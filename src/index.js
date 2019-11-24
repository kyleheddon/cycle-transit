import http from 'http';

let app = require('./server').default;
let makeWebSocketServer = require('./services/websocket').default;

const server = http.createServer(app);

let currentApp = app;
let httpServer = server.listen(process.env.PORT, error => {
  if (error) {
    console.log(error);
  }

  console.log('🚀 started');
});

makeWebSocketServer(httpServer);

if (module.hot) {
  console.log('✅  Server-side HMR Enabled!');

  module.hot.accept('./server', () => {
    console.log('🔁  HMR Reloading `./server`...');

    try {
      app = require('./server').default;
      // makeWebSocketServer = require('./services/websocket').default;
      server.removeListener('request', currentApp);
      server.on('request', app);
      currentApp = app;
    } catch (error) {
      console.error(error);
    }
  });
}
