var vnn = 0;

function VN() {
    return "_" + (++vnn).toString(36);
};

function _JSX({
    element,
    more,
    parent
}) {
    let script = "";
    if (!element) return "";
    let vn = null;
    if (element.nodeName != "#text") {
        vn = VN();
        script += `let ${vn} = document.createElement("${element.nodeName}");`;
        let atrb = [...element.attributes];
        for (let i = 0; i < atrb.length; i++) {
            script += `${vn}.setAttribute("${atrb[i].name}",${atrb[i].value[0]=="{"?atrb[i].value.substr(1,atrb[i].value.length-2):`\`${atrb[i].value}\``});`;
        }
        for (let i = 0; i < element.childNodes.length; i++) {
            let child = _JSX({
                element: element.childNodes[i],
                more: true,
                parent: vn
            });
            if (child && typeof child != "string") {
                if (child.constructor != Array) {
                    child = [child];
                }
                for (let i = 0; i < child.length; i++) {
                    if (!child[i]) continue;
                    script += child[i].script;
                    if (child[i].vn != "_UNUSED") {
                        script += `${vn}.appendChild(${child[i].vn});`;
                    }
                }
            } else if (child) {
                console.log(child);
                script += child;
            }
        }
        if (more) {
            return {
                script,
                vn
            };
        }
    } else {
        if (element.textContent.trim() == "") return;
        if (element.textContent.match(/{(.+?)}/)) {
            // element.textContent = element.textContent.replace(/{(.+)}/g, "${$1}");
            let result = [];
            let code = element.textContent.match(/{(.+?)}/gm);
            let res = element.textContent.trim();
            for (let i = 0; i < code.length; i++) {
                res = res.split(code[i], 2);
                result.push(_JSX({
                    element: document.createTextNode(res.shift()),
                    more: true
                }));
                result.push({
                    vn: "_UNUSED",
                    script: `_JSX(${parent},${code[i].substr(1, code[i].length - 2)});`
                });
                res = res[0];
            }
            result.push(_JSX({
                element: document.createTextNode(res),
                more: true
            }));
            return result;
        }
        vn = VN();
        if (more) {
            return {
                script: `let ${vn}=document.createTextNode(\`${element.textContent.trim()}\`);`,
                vn
            };
        } else {
            return `let ${vn}=document.createTextNode("${element.textContent.trim()}");`;
        }
    }
    if (!more) script += `return ${vn};`;
    return script;
}