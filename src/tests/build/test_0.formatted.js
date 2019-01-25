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
        let _4 = document.createTextNode(`b`);
        _3.appendChild(_4);
        _0.appendChild(_3);
        let _5 = document.createElement("div");
        _5.setAttribute("id", `${id}`);
        _5.setAttribute("hidden", `true`);
        _0.appendChild(_5);
        return _0;
    })());
}