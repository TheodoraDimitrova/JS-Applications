setTimeout(()=> {
    console.log("task1 finished")
}, 1000);
setTimeout(function () {
    console.log("task2 finished")
}, 1500);
setTimeout(task3, 500);
console.log("All tasks started");

function task3() {
    console.log("task3 finished")
}