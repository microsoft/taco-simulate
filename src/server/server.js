// Copyright (c) Microsoft Corporation. All rights reserved.

var path = require('path'),
    replaceStream = require('replacestream'),
    send = require('send'),
    simulateServer = require('taco-simulate-server');

module.exports.attach = function (app) {
    app.get('/simulator/sim-host.css', function (request, response, next) {
        // If target browser isn't Chrome (user agent contains 'Chrome', but isn't 'Edge'), remove shadow dom stuff from
        // the CSS file.
        var userAgent = request.headers['user-agent'];
        if (userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Edge/') === -1) {
            next();
        } else {
            send(request, path.resolve(simulateServer.dirs.hostRoot['sim-host'], 'sim-host.css'), {
                transform: function (stream) {
                    return stream
                        .pipe(replaceStream('> ::content >', '>'))
                        .pipe(replaceStream(/\^|\/shadow\/|\/shadow-deep\/|::shadow|\/deep\/|::content|>>>/g, ' '));
                }
            }).pipe(response);
        }
    });
};
