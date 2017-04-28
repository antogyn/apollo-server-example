
var winston = require('winston');
require('winston-logstash');
var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Logstash)({
      port: 10514,
      host: 'api.logmatic.io',
      meta: {
        logmaticKey: process.env.LOGMATIC_KEY,
        '@marker': ['nodejs','sourcecode'],
      },
      node_name: 'my node name',
    })
  ]
});

export default logger;