import all from "./test_1.js";

function test(id) {
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
        _5.setAttribute("hidden", `true`);
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
}

function test2() {
    return (
        (function () {
            let _0 = document.createElement("");
            _0.setAttribute("", `true`);
            let _1 = document.createElement("span");
            ["the time was ", test1(), " when you ran test2"].forEach(I => _1.appendChild(!I || I.nodeName == undefined ? document.createTextNode("" + I) : I));
            _0.appendChild(_1);
            return _0;
        })()
    );
}
console.log(all);

export default window.exports = {
    all,
    test
};