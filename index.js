const col = require("./col.js");
const path = require("path");
const fs = require("fs");
const esprima = require("esprima");
let files = {};
let loaded_files = [];
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
let config = {
    "start_file": "./index.jsx",
    "outdir": "../build"
};
const default_config = {
    "start_file": "index.jsx",
    "outdir": "../build"
};
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
let watcher = null;
let last_seen = {};
if (args.w || args.watch) {
    let watch_path = path.resolve(config.start_file, "..");
    watcher = fs.watch(watch_path, {
        "recursive": true
    }, function (type, filename) {
        if (type == "change") {
            let now = new Date().getTime();
            if (last_seen[filename] + 100 < now) {
                let base = path.resolve(config.start_file, "..");
                if (!new RegExp(path.resolve(base, config.outdir).replace(/\\/g, "\\\\")).test(path.resolve(watch_path, filename))) {
                    console.log(`${col.FgGreen}[${col.FgCyan}LOG${col.FgGreen}] ${col.FgCyan}Starting new Build at ${new Date()}${col.FgWhite}`);
                    files = {};
                    loaded_files = [];
                    _run(args.base, config.start_file);
                };
            }
            last_seen[filename] = now;
        }
    });
}
const prepend = fs.readFileSync(path.resolve(__dirname, "./jsx.js")).toString().replace(/[\n\r]/g, "").replace(/\s\s/g, "");

function VN() {
    let vnn = 0;
    return function () {
        return "_" + (vnn++).toString(36) + "_" + Math.random().toString(36).replace(".", "");
    }
}
async function _run(base, file) {
    let code = await load_file(base, file);
    let segments = findJSXExpressionInString(code);
    segments.reverse().forEach(segment => {
        let vn = VN();
        let jsx = createJSXJS(segment, vn, code);
        let before = code.text.substr(0, segment.range[0]);
        let after = code.text.substr(segment.range[1]);
        code.text = before + jsx.value + after;
    });
    let rel = path.relative(path.resolve(config.start_file, ".."), code.FilePath);
    let final = path.resolve(args.base, config.outdir, rel.replace(".jsx", ".js"));
    if (!fs.existsSync(path.resolve(final, ".."))) fs.mkdirSync(path.resolve(final, ".."), {
        "recursive": true
    });
    fs.writeFileSync(final, prepend + "\n/*end of jsx code*/\n" + code.text);
}

_run(args.base, config.start_file);
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
                let result = line.match(/import.+?from\s"(.+?)"/);
                if (result) {
                    console.log(`${col.FgGreen}[${col.FgCyan}LOG${col.FgGreen}] ${col.FgCyan}found import "${col.FgWhite}${result[1]}${col.FgCyan}"${col.FgWhite}`);
                    files[location] = files[location].replace(result[0], result[0].replace(".jsx", ".js"));
                    _run(path.resolve(location, ".."), result[1]);
                }
            });
            resolve({
                text: files[location],
                FilePath: location
            });
        });
    });
}



function findJSXExpressionInString(string) {
    let elements = search(esprima.parseModule(string.text, {
            "jsx": true,
            "range": true,
            "tokens": true
        }),
        "JSXElement");
    elements.map(item => {
        return search(item, "JSXExpressionContainer").map(expression => string.text.substr(expression.range[0] + 1, expression.range[1] - expression.range[0] - 2));
    });
    return elements;
}

function search(obj, target, path = ["root"]) {
    let results = [];
    if (obj == undefined || obj == null) return [];
    // console.log(obj, Object.keys(obj));
    for (let key of Object.keys(obj)) {
        //console.log(typeof obj[key])
        // if (obj[key] == undefined) continue;
        // if (obj[key].constructor != Object && obj[key].constructor != Array) continue;
        // console.log(obj[key]);
        if (obj[key] !== null && obj[key].type == target) {
            results.push(obj[key]);
        } else {
            // console.log("deeper", obj[key]);
            if (typeof obj[key] == "object") results = [...results, ...search(obj[key], target, [...path, key])];
        }
        // console.log(">" + path.join(".") + "." + key);
    }
    return results;
}




function createJSXJS(JSXElement, vn, code, parentVn) {
    let result = "";
    let Vn = vn();
    result += `let ${Vn} = document.createElement("${JSXElement.openingElement.name.name}");\n`;
    if (JSXElement.openingElement.attributes.length > 0) {
        let attrbs = JSXElement.openingElement.attributes;
        attrbs = attrbs.map(atrb => {
            if (atrb.type == "JSXSpreadAttribute") {
                let props = atrb.argument.properties;
                for (let prop of props) {
                    result += `_JSX.attribute(${Vn},"${prop.key.name}",${prop.value.raw});\n`;
                }
                return;
            }
            let value = code.text[atrb.value.range[0]] == "{" ? code.text.substr(atrb.value.range[0] + 1, atrb.value.range[1] - atrb.value.range[0] - 2) : code.text.substr(atrb.value.range[0], atrb.value.range[1] - atrb.value.range[0]);
            let name = atrb.name.name;
            result += `_JSX.attribute(${Vn},"${name}",${value.replace(/\s\s/g, "").replace(/\n/g, "").replace(/:\s/g, ":")});\n`;
        });
    }
    if (!JSXElement.openingElement.selfClosing && JSXElement.children.length > 0) {
        JSXElement.children.forEach(a => {
            if (a.type == "JSXElement") {
                let res = createJSXJS(a, vn, code, Vn);
                result += res.result;
                result += `${Vn}.appendChild(${res.Vn});\n`
            } else if (a.type == "JSXText") {
                if (a.value.trim() != "") {
                    let v = vn();
                    result += `let ${v} = document.createTextNode("${a.value}");\n${Vn}.appendChild(${v});\n`;
                }
            } else if (a.type == "JSXExpressionContainer") {
                let raw = a.expression.range;
                let c = code.text.substr(raw[0], raw[1] - raw[0]);
                result += `_JSX.append(${Vn},${c});\n`;
            } else {
                console.log(a.type);
            }
        });
    }
    if (!parentVn) return {
        FilePath: code.FilePath,
        value: `(function(){\n${result}return ${Vn};})()`
    };
    return {
        result,
        Vn
    };
}