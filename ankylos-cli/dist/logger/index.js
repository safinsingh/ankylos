"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = exports.warn = exports.fail = exports.success = exports.rawInfo = exports.info = void 0;
var chalk_1 = require("chalk");
// :)
var log = console.log;
function logBuilder(ctx) {
    var time = new Date().toLocaleString();
    return "[ " + ctx + " : " + time + " ] =>";
}
function info(message) {
    log(chalk_1.cyan(chalk_1.bold(logBuilder('info'))), message);
}
exports.info = info;
function rawInfo() {
    return chalk_1.cyan(chalk_1.bold(logBuilder('info')));
}
exports.rawInfo = rawInfo;
function success(message) {
    log(chalk_1.green(chalk_1.bold(logBuilder('scss'))), message);
}
exports.success = success;
function fail(message) {
    log(chalk_1.red(chalk_1.bold(logBuilder('fail'))), message);
    process.exit(1);
}
exports.fail = fail;
function warn(message) {
    log(chalk_1.yellow(chalk_1.bold(logBuilder('warn'))), message);
}
exports.warn = warn;
function update(message) {
    log(chalk_1.magenta(chalk_1.bold(logBuilder('updt'))), message);
}
exports.update = update;
