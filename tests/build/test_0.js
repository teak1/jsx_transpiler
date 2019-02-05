const _JSX = {attribute(el, name, val) {if (val.constructor == Object) {for (let k in val) {el[name][k] = val[k];}return;}el.setAttribute(name, val);},append(el, child) {if (child.constructor == Array) return item.forEach((i) => _JSX.append(el, i));if (child.nodeType || child.textContent) {el.appendChild(item);} else {el.appendChild(document.createTextNode(child.toString()));}}};
/*end of jsx code*/
let world = "hello";
let aa = "be aware of the";
function test() {
    return ((function(){
let _0_0gs6axmou0x6 = document.createElement("div");
_JSX.attribute(_0_0gs6axmou0x6,"id",world);
_JSX.attribute(_0_0gs6axmou0x6,"style",{backgroundColor:"red"});
_JSX.attribute(_0_0gs6axmou0x6,"test","3");
_JSX.attribute(_0_0gs6axmou0x6,"y",false);
let _1_0olx1wsepcm8 = document.createElement("span");
let _2_0pkgzkuuxol = document.createTextNode("hi!");
_1_0olx1wsepcm8.appendChild(_2_0pkgzkuuxol);
_0_0gs6axmou0x6.appendChild(_1_0olx1wsepcm8);
_JSX.append(_0_0gs6axmou0x6,aa);
let _3_0qqe3wgkfw88 = document.createTextNode(" hello!");
_0_0gs6axmou0x6.appendChild(_3_0qqe3wgkfw88);
return _0_0gs6axmou0x6;})())
}
function aa(url) {
    return ((function(){
let _0_033lm4ultuwd = document.createElement("a");
_JSX.attribute(_0_033lm4ultuwd,"href",url);
return _0_033lm4ultuwd;})());
}
export default {
    basic,
    basic_evalin,
    basic_atribute,
    basic_element,
    basic_input,
    basic_array_insert
};

function aaa() {
    return -1;
}