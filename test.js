const lock = require("./index");

async function main() {
    console.log("if everyhing works correctly this should print numbers from 1 to ... in the correct order");
    const a = lock();
    a().then(() => console.log("2"));
    console.log("1");
    await a();
    console.log("3");
    a.lock();
    a().then(() => console.log("5"));
    a().then(() => console.log("6"));
    console.log("4");
    a.unlock();
    await a();
    console.log("7");
}
main();