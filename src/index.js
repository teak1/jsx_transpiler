/**
 * @typedef JSXStringLocation_args
 * @property {Number} Start - an Integer value to determine where in the string the start of the JSX expression is located at.
 * @property {Number} Stop - an Integer value to determine where in the string the end of the JSX expression is located at.
 * @property {String} JSXString - the jsx expression as a string.
 * @property {String} FilePath - the file path that the JSX expression was found in.
 * @property {Locations} Array - contains Array<Number> the start and stop points of all other JSX expressions in the file.
 */


/**
 * @param {JSXStringLocation_args}
 *
 * @class JSXStringLocation
 */
class JSXStringLocation {
    constructor({
        Start,
        Stop,
        JSXString,
        FilePath,
        Locations
    }) {
        this.start = Start;
        this.stop = Stop;
        this.string = JSXString;
        this.file = FilePath;
        this.tagLocations = Locations
        this.func = null;
    }
    setFunc(str) {
        this.func = str;
    }
}
let args = {
    base: process.cwd(),
    _unknown: []
};
for (let item of process.argv) {
    if (item[0] == "-") {
        let name = item.split("=", 2)[0];
        let value = item.split("=", 2)[1] || true;
        args[name.replace(/^-+/g, "").replace(/-/g, "_")] = value;
    } else {
        args._unknown.push(item);
    }
}
const jsdom = require("jsdom");
const fs = require("fs");
const path = require("path");
const col = require("./col.js");
let config = {
    "start_file": "./index.jsx",
    "outdir": "./build"
};
const default_config = {
    "start_file": "index.jsx",
    "outdir": "../build",
    "target_dir": "./"
};
/**
 *
 *
 * @param {*} error
 */
function sendError(error) {
    exitError(`${error.message}\n${error.stack.replace(/\n/g, "\n\t")}`);
}
/**
 *
 *
 * @param {*} error
 */
function exitError(error) {
    console.log(`${col.FgCyan}An Error has occured, process exiting${col.FgRed}\n\t${error.replace(/\n/g, "\n\t")}${col.FgWhite}`);
    process.exit(1);
}

process.on("uncaughtException", function (error) {
    sendError(error);
});
process.on("unhandledRejection", function (error) {
    sendError(error);
});

if (fs.existsSync(path.resolve(args.base, "jsxconfig.json"))) {
    config = require(path.resolve(args.base, "jsxconfig.json"));
    let config_strs = [],
        config_str = "";
    let changed_prefix = `${col.FgYellow}[${col.FgMagenta}CHANGED${col.FgYellow}]${col.FgWhite} `;
    let default_prefix = `${col.FgGreen}[${col.FgCyan}DEFAULT${col.FgGreen}]${col.FgWhite} `;
    for (let item in default_config) {
        config_str = "";
        if (config[item]) {
            config_str += changed_prefix;
            config_str += `${item} = '${config[item]}'`;
        } else {
            config_str += default_prefix;
            config_str += `${item} = '${default_config[item]}'`;
        }
        config_strs.push(config_str);
    }
    console.log(`${col.FgGreen}[${col.FgCyan}found jsxconfig.json${col.FgGreen}]\n${config_strs.join("\n")}${col.FgWhite}`);
}
if (!fs.existsSync(path.resolve(args.base, config.start_file))) {
    sendError(new Error(`unable to find file "${path.resolve(args.base, config.start_file)}"`));
}
let files = {};
let loaded_files = [];
//wrap async around loadfile so can await.
async function _run() {
    findJSXExpressionInString(await load_file(args.base, config.start_file));
}
_run();
async function load_file(basePath, fileName) {
    let location = path.resolve(basePath, fileName);
    if (loaded_files.includes(location)) return new Promise((resolve) => {
        resolve(null);
    });
    loaded_files.push(location);
    return new Promise((resolve, reject) => {
        console.log(`${col.FgGreen}[${col.FgCyan}LOG${col.FgGreen}] ${col.FgCyan}reading file "${col.FgWhite}${location}${col.FgCyan}"${col.FgWhite}`);
        fs.readFile(location, async (err, data) => {
            if (err) throw err;
            files[location] = data.toString();
            let lines = data.toString().split("\n");
            lines.forEach(async line => {
                let result = line.match(/from\s"(.+?)"/);
                if (result) {
                    console.log(`${col.FgGreen}[${col.FgCyan}LOG${col.FgGreen}] ${col.FgCyan}found import "${col.FgWhite}${result[1]}${col.FgCyan}"${col.FgWhite}`);
                    files[location] = files[location].replace(result[0], result[0].replace(".jsx", ".js"));
                    findJSXExpressionInString(await load_file(path.resolve(location, ".."), result[1]));
                }
            });
            resolve({
                text: files[location],
                FilePath: location
            });
        });
    });
}

function findJSXExpressionInString(data) {
    let string = data.text;
    let FilePath = data.FilePath;
    console.log(`${col.FgGreen}[${col.FgCyan}LOG${col.FgGreen}] ${col.FgCyan}parsing file "${col.FgWhite}${data.FilePath}${col.FgCyan}"${col.FgWhite}`);
    let potential_start_location = -1;
    let potential_end_location = -1;
    let in_string = null;
    let taglist = [];
    let JSXStrings = [];
    let JSXStringStart = -1;
    let Locations = [];
    for (let i = 0; i < string.length; i++) {
        let char = string[i];
        if (char == in_string && string[i - 1] != "\\") {
            in_string = null;
            continue;
        }
        if ((char == "`" || char == "'" || char == "\"") && (in_string != char && string[i - 1] != "\\")) {
            in_string = char;
            continue;
        }
        if (in_string) continue;
        if (potential_start_location > -1) {
            if (char == ";" || char == "\n") potential_start_location = -1;
            if (char == ">") {
                potential_end_location = i + 1;
                let tag = string.substr(potential_start_location, potential_end_location - potential_start_location)
                    .replace(/[^<>a-zA-Z\/]/g, "").split(" ")[0];
                let shortened = tag.replace(/\s/g, "");
                if (taglist.length == 0) JSXStringStart = i - string.substr(potential_start_location, potential_end_location - potential_start_location).length + 1;
                if (shortened[1] == "/") {
                    Locations.push([potential_start_location - JSXStringStart, potential_end_location - JSXStringStart - 1]);
                    taglist.pop();
                    if (taglist.length === 0) {
                        let End = i + 1;
                        let Start = JSXStringStart;
                        let JSXString = string.substr(Start, End - Start);
                        JSXStrings.push(new JSXStringLocation({
                            Start,
                            Stop: End,
                            JSXString,
                            FilePath,
                            Locations
                        }));
                        Locations = [];
                    }
                } else if (shortened[shortened.length - 2] == "/") {
                    Locations.push([potential_start_location - JSXStringStart, potential_end_location - JSXStringStart]);
                    if (taglist.length === 0) {
                        let End = i + 1;
                        let Start = JSXStringStart;
                        let JSXString = string.substr(Start, End - Start);
                        JSXStrings.push(new JSXStringLocation({
                            Start,
                            Stop: End,
                            JSXString,
                            FilePath,
                            Locations
                        }));
                        Locations = [];
                    }
                } else if (taglist[taglist.length - 1] != tag) {
                    Locations.push([potential_start_location - JSXStringStart, potential_end_location - JSXStringStart - 1]);
                    taglist.push(string.substr(potential_start_location, potential_end_location - potential_start_location));
                }
            }
        } else if (char == "<") potential_start_location = i;
    }
    JSXStrings.forEach(parseJSXExpression);
    let file = files[FilePath];
    while (JSXStrings.length > 0) {
        let current = JSXStrings.pop();
        let start = file.substr(0, current.start);
        let end = file.substr(current.stop);
        file = start + current.func + end;
    }
    let working_dir = path.resolve(config.start_file, "..");
    let write_dir = path.resolve(working_dir, config.outdir);
    let file_path = path.relative(working_dir, FilePath);
    let target_path = path.resolve(write_dir, file_path);
    makePath(path.resolve(target_path, ".."));
    fs.writeFileSync(target_path.replace(/\.jsx/g, ".js"), "/*JSX injection*/\n" + fs.readFileSync(path.resolve(__dirname, "./jsx.js")).toString().replace(/[\n\r]/g, "").replace(/\s\s/g, "") + "\n/*begin user file*/\n" + file);
}

function makePath(pth) {
    if (!fs.existsSync(pth)) {
        fs.mkdirSync(pth, {
            recursive: true
        });
    }
}

function parseJSXExpression(JSXstring) {
    let JSDom = new jsdom.JSDOM(JSXstring.string, {
        "runScripts": "dangerously"
    });
    let inject = fs.readFileSync(path.resolve(__dirname, "./embed.js"));
    JSDom.window.eval(inject.toString());
    JSDom.window.eval("window.output = _JSX({element:document.body.children[0]});");
    JSXstring.setFunc(`((function(){${JSDom.window.output}})())`);
}