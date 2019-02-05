const _JSX = {attribute(el, name, val) {if (val.constructor == Object) {for (let k in val) {el[name][k] = val[k];}return;}el.setAttribute(name, val);},append(el, child) {if (child.constructor == Array) return item.forEach((i) => _JSX.append(el, i));if (child.nodeType || child.textContent) {el.appendChild(item);} else {el.appendChild(document.createTextNode(child.toString()));}}};
/*end of jsx code*/
let tests = [
    {
        expect: `<div></div>`,
        from() {
            return ((function(){
let _0_0m9tzmaqqdj8 = document.createElement("div");
return _0_0m9tzmaqqdj8;})());
        }
    },
    {
        expect: `<div><div>a</div>b</div>`,
        from() {
            return ((function(){
let _0_0lz3cilaq4xd = document.createElement("div");
let _1_0ixqix6lf8x = document.createElement("div");
let _2_0tsptp7gq9x = document.createTextNode("a");
_1_0ixqix6lf8x.appendChild(_2_0tsptp7gq9x);
_0_0lz3cilaq4xd.appendChild(_1_0ixqix6lf8x);
let _3_0qw87zysbmoa = document.createTextNode("b");
_0_0lz3cilaq4xd.appendChild(_3_0qw87zysbmoa);
return _0_0lz3cilaq4xd;})());
        }
    },
    {
        expect: `<div id="test"></div>`,
        from() {
            return ((function(){
let _0_0yv3v2znupfj = document.createElement("div");
_JSX.attribute(_0_0yv3v2znupfj,"id",test);
return _0_0yv3v2znupfj;})());
        }
    }
];
