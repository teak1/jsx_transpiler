let _load = null;
(_load = function () {
    let load = null;
    document.addEventListener("load", load = () => {
        tests.forEach((test, i) => {
            document.body.innerHTML = "";
            console.warn(test, i);
            try {
                document.body.appendChild(test.from());
            } catch (e) {
                document.body.appendChild(document.createTextNode(e.message));
            }
            let pass = test.expect.replace(/[\n]/g, "") == document.body.innerHTML.replace(/[\n]/g, "");
            console.log({
                testNumber: i + 1,
                pass,
                expected: test.expect.replace(/[\n]/g, ""),
                got: document.body.innerHTML.replace(/[\n]/g, "")
            });
        });
        console.log({
            close: true
        });
    });
    if (document.body) load()
    else setTimeout(_load, 100);
})();