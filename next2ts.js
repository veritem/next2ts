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
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { blue, green, red } from 'kolorist';
import spawn from 'cross-spawn';
var cwd = process.cwd();
function hasYarn() {
    try {
        var userAgent = process.env.npm_config_user_agent;
        if (userAgent) {
            return Boolean(userAgent && userAgent.startsWith('yarn'));
        }
        execSync('yarnpkg --version', { stdio: 'ignore' });
        return true;
    }
    catch (e) {
        return false;
    }
}
export function init() {
    return __awaiter(this, void 0, void 0, function () {
        var root, projectSource, componentSource, libComponentSource, allDependancies;
        return __generator(this, function (_a) {
            root = path.basename(cwd);
            if (!fs.existsSync(path.join(cwd + '/package.json'))) {
                console.log(red("\n" + root + " is not a next.js project"));
                process.exit(1);
            }
            console.log(blue("\nMigrating " + root + " to typescript"));
            if (!(fs.existsSync(path.join(cwd + '/pages')) ||
                fs.existsSync(path.join(cwd + '/src/pages')))) {
                console.log(red("\n" + root + " is not a next.js project"));
                process.exit(1);
            }
            projectSource = fs.existsSync(path.join(cwd + '/pages'))
                ? path.join(cwd + '/pages')
                : path.join(cwd + '/src/pages');
            componentSource = fs.existsSync(path.join(cwd + '/components'));
            libComponentSource = fs.existsSync(path.join(cwd + '/lib'));
            try {
                fs.copyFileSync(path.join(__dirname + '/template/tsconfig.json'), path.join(cwd + '/tsconfig.json'));
                console.log('\nInitilized ' + blue('tsconfig.json'));
            }
            catch (e) {
                console.log('\nFailed to initialze tsconfig.json');
                process.exit(1);
            }
            console.log('\n' + green('Renaming your files'));
            renameProjectFiles(projectSource);
            if (componentSource)
                renameComponentFiles(path.join(cwd + '/components'));
            if (libComponentSource)
                renameLibFiles(path.join(cwd + '/lib'));
            allDependancies = ['typescript', '@types/react', '@types/node'];
            console.log(green('\nInstalling required packages\n'));
            allDependancies.map(function (dep) { return console.log("- " + dep); });
            console.log('\n');
            return [2 /*return*/, install(root, hasYarn(), allDependancies).then(function () {
                    console.log(blue('\nYou are ready to go 🚀'));
                })];
        });
    });
}
function renameProjectFiles(source) {
    var files = [];
    var match = RegExp('^[^.]+.js|jsx$');
    var getFilesRecursively = function (directory) {
        var filesInDirectory = fs.readdirSync(directory);
        for (var _i = 0, filesInDirectory_1 = filesInDirectory; _i < filesInDirectory_1.length; _i++) {
            var file = filesInDirectory_1[_i];
            var absolute = path.join(directory, file);
            if (fs.statSync(absolute).isDirectory()) {
                getFilesRecursively(absolute);
            }
            else {
                files.push(absolute);
            }
        }
    };
    getFilesRecursively(source);
    return files
        .filter(function (file) { return file.match(match); })
        .forEach(function (file) {
        var filePath = (source, file);
        if (file.indexOf('/pages/api/') > -1) {
            var newFilename = file.split('.');
            var transformed = newFilename[0] + '.ts';
            fs.renameSync(filePath, transformed);
        }
        else {
            var newFilename = file.split('.');
            var transformed = newFilename[0] + '.tsx';
            fs.renameSync(filePath, transformed);
        }
    });
}
function renameComponentFiles(componentsSource) {
    var files = [];
    var match = RegExp('^[^.]+.js|jsx$');
    var getFilesRecursively = function (directory) {
        var filesInDirectory = fs.readdirSync(directory);
        for (var _i = 0, filesInDirectory_2 = filesInDirectory; _i < filesInDirectory_2.length; _i++) {
            var file = filesInDirectory_2[_i];
            var absolute = path.join(directory, file);
            if (fs.statSync(absolute).isDirectory()) {
                getFilesRecursively(absolute);
            }
            else {
                files.push(absolute);
            }
        }
    };
    getFilesRecursively(componentsSource);
    return files
        .filter(function (file) { return file.match(match); })
        .forEach(function (file) {
        var filePath = (componentsSource, file);
        var newFilename = file.split('.');
        var transformed = newFilename[0] + '.tsx';
        fs.renameSync(filePath, transformed);
    });
}
function renameLibFiles(libSource) {
    var files = [];
    var match = RegExp('^[^.]+.js$');
    var getFilesRecursively = function (directory) {
        var filesInDirectory = fs.readdirSync(directory);
        for (var _i = 0, filesInDirectory_3 = filesInDirectory; _i < filesInDirectory_3.length; _i++) {
            var file = filesInDirectory_3[_i];
            var absolute = path.join(directory, file);
            if (fs.statSync(absolute).isDirectory()) {
                getFilesRecursively(absolute);
            }
            else {
                files.push(absolute);
            }
        }
    };
    getFilesRecursively(libSource);
    return files
        .filter(function (file) { return file.match(match); })
        .forEach(function (file) {
        var filePath = (libSource, file);
        var newFilename = file.split('.');
        var transformed = newFilename[0] + '.ts';
        fs.renameSync(filePath, transformed);
    });
}
function install(root, useYarn, dependancies) {
    return new Promise(function (resolve, reject) {
        var command;
        var args = [];
        if (useYarn) {
            command = 'yarnpkg';
            args = ['add', '--dev'].concat(dependancies);
        }
        else {
            command = 'npm';
            args = ['install', '--save-dev'].concat(dependancies);
        }
        var child = spawn(command, args, { stdio: 'inherit' });
        child.on('close', function (code) {
            if (code !== 0) {
                reject({
                    command: command + " " + args.join(' ')
                });
                return;
            }
            resolve();
        });
    });
}
