const fs = require("fs");
const puppeteer = require('puppeteer');
const path = require("path");
const col = require("./col.js");
let target = path.resolve(__dirname, "index.html");
let templates = {
    pass: `${col.FgYellow}[${col.FgGreen}PASS${col.FgYellow}]${col.FgGreen}`,
    fail: `${col.FgYellow}[${col.FgRed}FAIL${col.FgYellow}]${col.FgGreen}`
};
(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--allow-file-access-from-files'],
        "devtools": true
    });
    const page = await browser.newPage();
    page.on('console', msg => {
        let args = msg.args();
        for (let i = 0; i < args.length; ++i)
            args[i].jsonValue().then(value => {
                if (value.close) {
                    return browser.close();
                }
                let _got = value.got;
                let _expected = value.expected;
                let got = "";
                let expected = "";
                if (!value.pass) {
                    let has_failed = false;
                    if (!_got && !_expected) {
                        return;
                    }
                    let end = Math.max(_got.length, _expected.length);
                    for (let i = 0; i < end; i++) {
                        if (_got[i] != _expected[i] && !has_failed) {
                            has_failed = true;
                            got += col.FgRed;
                            expected += col.FgRed;
                        }
                        _got[i] && (got += _got[i]);
                        _expected[i] && (expected += _expected[i]);
                    }
                    got += col.FgGreen;
                    expected += col.FgGreen;
                } else {
                    got = _got;
                }
                console.log(`${value.pass ? templates.pass : templates.fail} Test #${value.testNumber} \n\t     GOT "${got}" ${!value.pass ? `\n\tEXPECTED "${expected}"` : ""}${col.FgWhite}`);
            });
    });
    await page.goto('file://' + target);
    await page.addScriptTag({
        "content": fs.readFileSync("./inject.js").toString()
    });
})();
console.log("loading testbench...");