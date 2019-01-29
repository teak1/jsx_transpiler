import all from "./test_1.jsx";
function test(id) {
    return (<div name="test">
        <p class="test2">
            a
        </p>
        <p>
<<<<<<< HEAD
            The time is currently {new Date()} and a random value is {Math.random()}
=======
            The time is currently {new Date()}
>>>>>>> 993d10bad714cf205d213262cef397bd649ff9ae
        </p>
        <div id={id} />
    </div>);
}

function test1() {
    return (<span>
        {new Date().getTime()}
    </span>);
}
function test2() {
    return (
<<<<<<< HEAD
        <span>
            the time was {test1()} when you ran test2
        </span>
=======
        < >
            the time was {test1()} when you ran test2
        </>
>>>>>>> 993d10bad714cf205d213262cef397bd649ff9ae
    );
}
console.log(all);

export default window.exports = {
    all,
    test
};