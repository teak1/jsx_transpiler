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
    }
];
