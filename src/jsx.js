function _JSX(parent, thing) {
    if (thing.nodeType || thing.textContent) {
        parent.appendChild(thing);
    } else {
        parent.appendChild(document.createTextNode(thing.toString()));
    }
}