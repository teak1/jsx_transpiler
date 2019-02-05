let _load = null;

setTimeout(() => (_load = function () {
    let load = null;
    document.addEventListener("load", load = () => {
        tests.forEach((test, i) => {
            document.body.innerHTML = "";
            // console.log(test);
            // console.warn(test, i);
            if (!test) console.log(test);
            try {
                document.body.appendChild(test.from());
            } catch (e) {
                console.log(test);
                document.body.appendChild(document.createTextNode(e.message));
            }
            let pass = test.expect.replace(/\n|\s\s/g, "") == document.body.innerHTML.replace(/\n|\s\s/g, "");
            console.log({
                testNumber: i + 1,
                pass,
                expected: test.expect.replace(/\n|\s\s/g, ""),
                got: document.body.innerHTML.replace(/\n|\s\s/g, "")
            });
        });
        console.log({
            // close: true
        });
    });
    if (document.body) load()
    else setTimeout(_load, 100);
})(), 1000);