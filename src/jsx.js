function _JSX(parent, thing) {
    if(thing.constructor==Array)return thing.forEach(itm=>_JSX(parent,itm));
    if (thing.nodeType || thing.textContent) {
        parent.appendChild(thing);
    } else {
        parent.appendChild(document.createTextNode(thing.toString()));
    }
}
