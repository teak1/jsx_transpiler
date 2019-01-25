import all from "./test_1.jsx";
function test(id) {
    return (<div name="test">
        <p class="test2">
            a
        </p>
        <p>
            b
        </p>
        <div id="${id}" hidden />
    </div>);
}