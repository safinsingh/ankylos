"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HELP_MSG = void 0;
var chalk_1 = require("chalk");
exports.HELP_MSG = "Version: " + chalk_1.green(chalk_1.bold('0.1.0')) + "\nUsage:   " + chalk_1.cyan(chalk_1.bold('ankylos')) + " [command] [flags]\n         " + chalk_1.cyan(chalk_1.bold('ankylos')) + " [ -h | --help | -v | --version ]\n\nCommands:\n         " + chalk_1.bold('create, c') + " <directory> --template <tpl>\n         " + chalk_1.bold('bootstrap, b');
