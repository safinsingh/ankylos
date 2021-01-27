"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var stream_1 = __importDefault(require("stream"));
var util_1 = require("util");
var promises_1 = __importDefault(require("fs/promises"));
var path_1 = __importDefault(require("path"));
var get_npm_tarball_url_1 = __importDefault(require("get-npm-tarball-url"));
var got_1 = __importDefault(require("got"));
var tempy_1 = __importDefault(require("tempy"));
var cli_progress_1 = require("cli-progress");
var decompress_1 = __importDefault(require("decompress"));
var rmfr_1 = __importDefault(require("rmfr"));
var fast_glob_1 = __importDefault(require("fast-glob"));
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
var decompress_targz_1 = __importDefault(require("decompress-targz"));
var logger_1 = require("../logger");
var pipeline = util_1.promisify(stream_1.default.pipeline);
exports.default = {
    name: 'create',
    alias: 'c',
    run: function (toolbox) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, options, first, url, loc, downloadStream, fileStream, downloadBar, e_1, entries, _i, entries_1, file, dest, dir;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = toolbox.parameters, options = _a.options, first = _a.first;
                    if (!first) {
                        logger_1.fail('You must provide a directory to create a project!');
                        return [2 /*return*/];
                    }
                    if (options.template !== 'node' && options.template !== 'next') {
                        logger_1.fail("Key `template` must be of type 'node' | 'next'!");
                        return [2 /*return*/];
                    }
                    logger_1.info("Downloading tarball for @ankylos/template-" + options.template + "...");
                    url = get_npm_tarball_url_1.default("@ankylos/template-" + options.template, '0.1.0');
                    loc = tempy_1.default.file({ extension: '.tar.gz' });
                    downloadStream = got_1.default.stream(url);
                    fileStream = fs_1.createWriteStream(loc);
                    downloadBar = new cli_progress_1.SingleBar({
                        hideCursor: true,
                        format: logger_1.rawInfo() + " [{bar}] {percentage}%"
                    }, cli_progress_1.Presets.rect);
                    downloadBar.start(100, 0);
                    downloadStream.on('downloadProgress', function (_a) {
                        var percent = _a.percent;
                        var percentage = Math.round(percent * 100);
                        downloadBar.update(percentage);
                    });
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, pipeline(downloadStream, fileStream)];
                case 2:
                    _b.sent();
                    downloadBar.stop();
                    logger_1.success("Tarball streamed to " + loc);
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _b.sent();
                    downloadBar.stop();
                    logger_1.fail("Could not write file to system: " + e_1.message);
                    return [3 /*break*/, 4];
                case 4: return [4 /*yield*/, decompress_1.default(loc, first, {
                        plugins: [decompress_targz_1.default()]
                    })];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, fast_glob_1.default(first + "/package/**", {
                            dot: true,
                            onlyFiles: true
                        })];
                case 6:
                    entries = _b.sent();
                    _i = 0, entries_1 = entries;
                    _b.label = 7;
                case 7:
                    if (!(_i < entries_1.length)) return [3 /*break*/, 12];
                    file = entries_1[_i];
                    dest = file.replace("/package", '');
                    dir = path_1.default.dirname(path_1.default.resolve(dest));
                    if (!!fs_1.existsSync(dir)) return [3 /*break*/, 9];
                    // Promise.all with this seemed to cause issues...
                    return [4 /*yield*/, promises_1.default.mkdir(dir, { recursive: true })];
                case 8:
                    // Promise.all with this seemed to cause issues...
                    _b.sent();
                    _b.label = 9;
                case 9: return [4 /*yield*/, promises_1.default.rename(file, dest)];
                case 10:
                    _b.sent();
                    _b.label = 11;
                case 11:
                    _i++;
                    return [3 /*break*/, 7];
                case 12: 
                // TODO: what if they have a file/directory named 'package'?
                return [4 /*yield*/, rmfr_1.default(path_1.default.join(first, 'package'))];
                case 13:
                    // TODO: what if they have a file/directory named 'package'?
                    _b.sent();
                    logger_1.success("Unzipped and unwrapped tarball to " + first + "!");
                    return [2 /*return*/];
            }
        });
    }); }
};
