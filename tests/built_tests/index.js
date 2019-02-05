const _JSX = {attribute(el, name, val) {if (val.constructor == Object) {for (let k in val) {el[name][k] = val[k];}return;}el.setAttribute(name, val);},append(el, child) {if (child.constructor == Array) return item.forEach((i) => _JSX.append(el, i));if (child.nodeType || child.textContent) {el.appendChild(item);} else {el.appendChild(document.createTextNode(child.toString()));}}};
/*end of jsx code*/
let rv = Math.random();
let tests = [
    {
        expect: `<div></div>`,
        from() {
            return ((function(){
let _0_0gir81jgs4 = document.createElement("div");
return _0_0gir81jgs4;})());
        }
    },
    {
        expect: `<div><div>a</div>b</div>`,
        from() {
            return ((function(){
let _0_0musqdix56q = document.createElement("div");
let _1_0mcyyfmc1gva = document.createElement("div");
let _2_0z9dphjhobvk = document.createTextNode("a");
_1_0mcyyfmc1gva.appendChild(_2_0z9dphjhobvk);
_0_0musqdix56q.appendChild(_1_0mcyyfmc1gva);
let _3_0tz8rv6tzjx = document.createTextNode("b");
_0_0musqdix56q.appendChild(_3_0tz8rv6tzjx);
return _0_0musqdix56q;})());
        }
    },
    {
        expect: `<div id="test"></div>`,
        from() {
            return ((function(){
let _0_0bc0bfqx3tcs = document.createElement("div");
_JSX.attribute(_0_0bc0bfqx3tcs,"id","test");
return _0_0bc0bfqx3tcs;})());
        }
    },
    {
        expect: `<div id="test" style="background-color: red;"> hi, my background is red</div>`,
        from() {
            return ((function(){
let _0_0gdyhje0ll7r = document.createElement("div");
_JSX.attribute(_0_0gdyhje0ll7r,"id","test");
_JSX.attribute(_0_0gdyhje0ll7r,"style",{backgroundColor:"red"});
let _1_0357dpgw23xr = document.createTextNode(" hi, my background is red");
_0_0gdyhje0ll7r.appendChild(_1_0357dpgw23xr);
return _0_0gdyhje0ll7r;})());
        }
    },
    {
        expect: `<div id="random">${rv}</div>`,
        from() {
            return ((function(){
let _0_0aa7hiqkwnyq = document.createElement("div");
_JSX.attribute(_0_0aa7hiqkwnyq,"id","random");
_JSX.append(_0_0aa7hiqkwnyq,rv);
return _0_0aa7hiqkwnyq;})());
        }
    }
];
