import lock, { waitFor } from "./index";

let count = 0;

function test(nr: number, completed?: boolean) {
    count++;
    // console.log(nr);
    if (nr != count) {
        throw new Error(`Out of order: got ${nr}, expected ${count}`);
    } else if (completed) {
        console.log("completed");
        count = 0;
    }
}

async function main() {
    console.log("lock:");
    const a = lock();
    a().then(() => test(2));
    test(1);
    await a();
    test(3);
    a.lock();
    a().then(() => test(5));
    a().then(() => test(6));
    test(4)
    a.unlock();
    await a();
    test(7, true)

    console.log("waitfor:")
    // b: Waitfor<boolean>
    const b = waitFor<boolean>();
    // c: Promise<boolean>
    b().then(() => test(3, true))
    test(1);
    // d: void
    const d = b(true);
    test(2);

}

main();
