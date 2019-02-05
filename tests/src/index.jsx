let rv = Math.random();
let tests = [
    {
        expect: `<div></div>`,
        from() {
            return (<div></div>);
        }
    },
    {
        expect: `<div><div>a</div>b</div>`,
        from() {
            return (<div><div>a</div>b</div>);
        }
    },
    {
        expect: `<div id="test"></div>`,
        from() {
            return (<div id="test"></div>);
        }
    },
    {
        expect: `<div id="test" style="background-color: red;"> hi, my background is red</div>`,
        from() {
            return (<div id="test" style={{
                backgroundColor: "red"
            }}> hi, my background is red</div>);
        }
    },
    {
        expect: `<div id="random">${rv}</div>`,
        from() {
            return (<div id="random">{rv}</div>);
        }
    }
];
