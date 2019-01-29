/*JSX injection*/
function _JSX(parent, thing) {
    if (thing.nodeType || thing.textContent) {
        parent.appendChild(thing);
    } else {
        parent.appendChild(document.createTextNode(thing.toString()));
    }
}
/*begin user file*/
import all from "./test_1.js";

function test(id) {
<<<<<<< HEAD
    return (((function () {
        let _1 = document.createElement("DIV");
        _1.setAttribute("name", `test`);
        let _2 = document.createElement("P");
        _2.setAttribute("class", `test2`);
        let _3 = document.createTextNode(`a`);
        _2.appendChild(_3);
        _1.appendChild(_2);
        let _4 = document.createElement("P");
        let _5 = document.createTextNode(`The time is currently`);
        _4.appendChild(_5);
        _JSX(_4, new Date());
        let _6 = document.createTextNode(`and a random value is`);
        _4.appendChild(_6);
        _JSX(_4, Math.random());
        _1.appendChild(_4);
        let _7 = document.createElement("DIV");
        _7.setAttribute("id", id);
        _1.appendChild(_7);
        return _1;
    })()));
}

function test1() {
    return (((function () {
        let _1 = document.createElement("SPAN");
        _JSX(_1, new Date().getTime());
        return _1;
    })()));
=======
    return ((function () {
        let _0 = document.createElement("div");
        _0.setAttribute("name", `test`);
        let _1 = document.createElement("p");
        _1.setAttribute("class", `test2`);
        let _2 = document.createTextNode(`a`);
        _1.appendChild(_2);
        _0.appendChild(_1);
        let _3 = document.createElement("p");
        let _4 = document.createElement("span");
        ["The time is currently ", new Date()].forEach(I => _4.appendChild(!I || I.nodeName == undefined ? document.createTextNode("" + I) : I));
        _3.appendChild(_4);
        _0.appendChild(_3);
        let _5 = document.createElement("div");
        _5.setAttribute("id", `id`);
        _0.appendChild(_5);
        return _0;
    })());
}

function test1() {
    return ((function () {
        let _0 = document.createElement("span");
        let _1 = document.createElement("span");
        [new Date().getTime()].forEach(I => _1.appendChild(!I || I.nodeName == undefined ? document.createTextNode("" + I) : I));
        _0.appendChild(_1);
        return _0;
    })());
>>>>>>> 993d10bad714cf205d213262cef397bd649ff9ae
}

function test2() {
    return (
<<<<<<< HEAD
        ((function () {
            let _1 = document.createElement("SPAN");
            let _2 = document.createTextNode(`the time was`);
            _1.appendChild(_2);
            _JSX(_1, test1());
            let _3 = document.createTextNode(`when you ran test2`);
            _1.appendChild(_3);
            return _1;
        })())
=======
        (function () {
            let _0 = document.createElement("");
            _0.setAttribute("", `true`);
            let _1 = document.createElement("span");
            ["the time was ", test1(), " when you ran test2"].forEach(I => _1.appendChild(!I || I.nodeName == undefined ? document.createTextNode("" + I) : I));
            _0.appendChild(_1);
            return _0;
        })()
>>>>>>> 993d10bad714cf205d213262cef397bd649ff9ae
    );
}
console.log(all);

export default window.exports = {
    all,
    test
};