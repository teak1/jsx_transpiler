import all from "./test_1.jsx";
function test(id) {
    return (<div name="test">
        <p class="test2">
            a
        </p>
        <p>
            The time is currently ${new Date()}
        </p>
        <div id="${id}" hidden />
    </div>);
}

function test1() {
    return (<span>
        ${new Date().getTime()}
    </span>);
}
function test2() {
    return (
        <span>
            the time was ${test1()} when you ran test2
        </span>
    );
}
console.log(all);

export default window.exports = {
    all,
    test
};