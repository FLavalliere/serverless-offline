'use strict';

const debugLog = require('./debugLog');

module.exports = {
  getFunctionOptions(fun, funName, servicePath) {

    // Split handler into method name and path i.e. handler.run
    console.error("WWWW");
    console.error(fun);
    const handlerPath = fun.handler.split('.')[0];
    const handlerName = fun.handler.split('/').pop().split('.')[1];
    console.error("GE HANDLER TE");
    console.error(fun);
    return {
      funName: funName,
      handlerName: handlerName, // i.e. run
      handlerPath: `${servicePath}/${handlerPath}`,
      funTimeout: (fun.timeout || 6) * 1000,
      babelOptions: ((fun.custom || {}).runtime || {}).babel,
    };
  },

  // Create a function handler
  // The function handler is used to simulate Lambda functions
  createHandler(funOptions, options) {

    if (!options.skipCacheInvalidation) {
      debugLog('Invalidating cache...');

      for (const key in require.cache) {
        // Require cache invalidation, brutal and fragile.
        // Might cause errors, if so please submit an issue.
        if (!key.match('node_modules')) delete require.cache[key];
      }
    }

    debugLog(`Loading handler... (${funOptions.handlerPath})`);
    console.error("PATHT :" + funOptions.handlerPath);
    console.error(funOptions);
    var hand = require(funOptions.handlerPath);
    console.error(hand);
    var handler=hand[funOptions.funName];
    console.error("TA");
    console.error(handler);
    if (typeof handler !== 'function') {
      handler=hand['handler'];
    }
    console.error("TB");
    console.error(handler);
    if (typeof handler !== 'function') {
      handler=hand[funOptions.handlerName];
    }
    console.error("TC of.. " + hand);
    console.error(handler);
    if (typeof handler !== 'function') {
       hand = require(funOptions.handlerPath);
       console.error("ZE");
       console.error(hand);
       console.error("Z1 : " + funOptions.handlerName);
       handler=hand[funOptions.handlerName];
       console.error(handler);
       handler=handler[funOptions.funName];
       console.error(handler);
    }
       

    if (typeof handler !== 'function') {
      throw new Error(`Serverless-offline: handler for '${funOptions.funName}' is not a function`);
    }

    return handler;
  },
};
