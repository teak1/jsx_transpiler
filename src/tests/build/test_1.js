/*JSX injection*/
function _JSX(parent, thing) {if (thing.nodeType || thing.textContent) {parent.appendChild(thing);} else {parent.appendChild(document.createTextNode(thing.toString()));}}
/*begin user file*/
function test() {
    return (((function(){let _1 = document.createElement("DIV");return _1;})()));
}
function test2() {
    return (((function(){let _1 = document.createElement("DIV");let _2 = document.createElement("P");let _3=document.createTextNode(`hi!`);_2.appendChild(_3);_1.appendChild(_2);return _1;})()));
}
function test3() {
    return (((function(){let _1 = document.createElement("DIV");let _2 = document.createElement("P");let _3=document.createTextNode(`a`);_2.appendChild(_3);_1.appendChild(_2);let _4 = document.createElement("P");let _5=document.createTextNode(`b`);_4.appendChild(_5);_1.appendChild(_4);return _1;})()));
}

function test4() {
    return (((function(){let _1 = document.createElement("DIV");_1.setAttribute("name",`test`);let _2 = document.createElement("P");_2.setAttribute("class",`test2`);let _3=document.createTextNode(`a`);_2.appendChild(_3);_1.appendChild(_2);let _4 = document.createElement("P");let _5=document.createTextNode(`b`);_4.appendChild(_5);_1.appendChild(_4);let _6 = document.createElement("DIV");_6.setAttribute("id",`test`);_1.appendChild(_6);return _1;})()));
}

export default {
    test,
    test2,
    test3,
    test4
}