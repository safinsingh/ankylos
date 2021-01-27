"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var gluegun_1 = require("gluegun");
var help_1 = require("./help");
gluegun_1.build('ankylos')
    .src(__dirname)
    .help({
    name: 'help',
    alias: 'h',
    dashed: true,
    run: function (toolbox) { return toolbox.print.info(help_1.HELP_MSG); }
})
    .version()
    .checkForUpdates(5)
    .defaultCommand()
    .create()
    .run();
