class Element {
    constructor(type, attribute_list) {
        this.type = type;
        this.attribute_list = attribute_list || [];
    }
}
class JSXElement {
    constructor({
        openingElement,
        closingElement,
        Children = [],
        SelfClosing,
        AttributeList = []
    }) {
        this.isSelfClosing = SelfClosing;
        this.openingElement = openingElement;
        this.closingElement = closingElement;
        this.children = Children;
        this.attributes = AttributeList;
    }
    build(vnm = 0) {
        let is_root = vnm == 0;
        let func = is_root ? `(function(){` : ``;
        let vn = `_${(vnm++).toString(36)}`;
        func += `let ${vn} = document.createElement("${this.openingElement}");`;
        if (this.attributes.length > 0) {
            for (let i = 0; i < this.attributes.length; i++) {
                func += this.attributes[i].get(vn);
            }
        }
        if (this.children.length > 0) {
            for (let i = 0; i < this.children.length; i++) {
                if (!this.children[i].build) console.log(this.children[i].constructor);
                let child = this.children[i].build(vnm);
                vnm = child.vnm;
                func += child.func;
                func += `${vn}.appendChild(${child.vn});`;
            }
        }
        if (is_root) return func + `return ${vn};})()`;
        return {
            func,
            vn,
            vnm
        };
    }
}
class JSXSelfClosingElement extends JSXElement {
    constructor({
        openingElement,
        AttributeList
    }) {
        super({
            openingElement,
            AttributeList,
            SelfClosing: true
        });
    }
} //< JSXElementName JSXAttributes(opt) / >
class JSXOpeningElement {
    constructor({
        ElementName,
        AttributeList
    }) {
        this.ElementName = ElementName;
        this.attributes = AttributeList;
    }
} //< JSXElementName JSXAttributes(opt) / >
class JSXClosingElement {
    constructor({
        ElementName,
        AttributeList
    }) {
        this.ElementName = ElementName;
        this.attributes = AttributeList;
    }
} //< / JSXElementName >
class JSXAttribute {
    constructor({
        Name,
        Value
    }) {
        this.name = Name;
        this.Value = Value;
    }
    get(vn) {
        return `${vn}.setAttribute("${this.name}"${this.Value ? ",`" + this.Value.substr(1,this.Value.length-2)+"`" : ""});`;
    }
}
class JSXString {
    constructor({
        Text
    }) {
        this.text = Text;
    }
    build(vnm) {
        let vn = `_${(vnm++).toString(36)}`;
        let func = `let ${vn} = document.createTextNode(\`${this.text}\`);`;
        if (this.text.match(/\${.+?}/g)) {
            let parts = [];
            this.text.split("${").forEach(seg => {
                let segs = seg.split("}");
                let last = segs.pop();
                let code = segs.join("}");
                code.length && parts.push(code);
                last.length && parts.push(`"${last}"`);
            });
            func = `let ${vn} = document.createElement("span");[${parts.join()}].forEach(I=>${vn}.appendChild(!I || I.nodeName==undefined?document.createTextNode(""+I):I));`;
        }
        return {
            vnm,
            vn,
            func
        };
    }
}
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

function sendError(error) {
    exitError(`${error.message}\n${error.stack.replace(/\n/g, "\n\t")}`);
}

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
    // console.log(`looking for JSX string in ${string}`);
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
    console.log(`${col.FgGreen}[${col.FgCyan}LOG${col.FgGreen}] ${col.FgCyan}writing file "${col.FgWhite}${target_path.replace(".jsx", ".js")}${col.FgCyan}"${col.FgWhite}`);
    fs.writeFileSync(target_path.replace(/\.jsx/g, ".js"), file);
}

function makePath(pth) {
    if (!fs.existsSync(pth)) {
        fs.mkdirSync(pth, {
            recursive: true
        });
    }
}

function parseJSXExpression(JSXstring) {
    let letters = JSXstring.string.split("");
    let parts = [];
    let part = "";
    let JSXElem = null;
    for (let i = 0; i < letters.length; i++) {
        if (JSXstring.tagLocations[0]) {
            if (JSXstring.tagLocations[0][0] == i && part != "") {
                let text = part.replace(/[\n\r]/g, "").replace(/\s\s/g, "").trim();
                if (text != "") parts.push(text);
                part = "";
            }
            part += letters[i];
            if (i == JSXstring.tagLocations[0][1]) {
                JSXstring.tagLocations.shift();
                parts.push(part);
                part = "";
            }
        }
    }
    if (part != "") parts.push(part);
    parts = parts.map(parseElement);
    let elements = findMatchedElement(parts);
    let element = buildElements(elements);
    let built = element.build();
    JSXstring.setFunc(built);
}

function findMatchedElement(array) {
    if (array[0].isSelfClosing || array[0].text) return {
        first: array.shift()
    };
    let elements = [],
        first = array.shift(),
        between = [],
        last = null;
    elements.push(first);
    while (array.length > 0) {
        let element = array.shift();
        between.push(element);
        let isStart = element.openingElement ? true : false;
        if (element.text || element.isSelfClosing) {} else if (isStart) {
            elements.push(element);
        } else {
            if (elements[elements.length - 1].openingElement == element.closingElement) {
                elements.pop();
            }
        }
        if (elements.length == 0) {
            last = between.pop();
            return {
                first,
                between,
                last
            };
        }
    }
    return {
        first,
        between,
        last: between.pop()
    };
}

function parseElement(element) {
    if (element[0] != "<" && element[element.length - 1] != ">") {
        return new JSXString({
            Text: element
        });
    }
    let string = element.substr(1, element.length - 2);
    let in_string = null;
    let segments = [];
    let segment = 0;
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
        if (char == " ") {
            segments.push(string.substr(segment, i - segment).trim());
            segment = i;
        }
    }
    segments.push(string.substr(segment, string.length - segment).trim());
    let name = segments.shift();
    let AttributeList = [];
    let isSingleElement = false;
    for (let segment of segments) {
        if (segments == "/") {
            isSingleElement = true;
            continue;
        }
        let seg_name = segment.split("=", 2)[0];
        let value = segment.split("=", 2)[1];
        let Attribute = new JSXAttribute({
            Name: seg_name.replace(/[^a-zA-Z0-9_]/g, ""),
            Value: value || `"true"`
        });
        if (seg_name != "/" && seg_name != "/>") AttributeList.push(Attribute);
    }
    let elt = null;
    if (name[0] == "/" || name == "/>") {
        if (isSingleElement) {
            elt = new JSXElement({
                closingElement: name.substr(1),
                SelfClosing: true,
                AttributeList
            });
        } else {
            elt = new JSXElement({
                closingElement: name.substr(1),
                AttributeList,
                Children: []
            })
        }
    } else {
        if (isSingleElement) {
            elt = new JSXElement({
                openingElement: name,
                SelfClosing: true,
                AttributeList
            });
        } else {
            elt = new JSXElement({
                openingElement: name,
                AttributeList,
                Children: []
            })
        }
    }
    return elt;
}

function buildElements(elements) {
    if (!elements.between) return elements.first;
    if (elements.between.length == 0) return elements.first;
    while (elements.between.length > 0) {
        let matched = findMatchedElement(elements.between);
        let element = buildElements(matched);
        elements.first.children.push(element);
    }
    return elements.first;
}