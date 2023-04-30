// node.js version

function lock(lockedDefault = false) {
    const waiting = [];
    let locked = lockedDefault;
    const lock = function () {
        return new Promise(
            resolve => {
                if (locked)
                    waiting.push(resolve);
                else
                    resolve();
            }
        );
    };
    lock.unlock = () => {
        locked = false;
        while (!locked && waiting.length) {
            waiting.shift()();
        }
    };
    lock.lock = (locked_) => {
        if (locked_ === false) lock.unlock();
        locked = true;
    };
    Object.defineProperty(lock, "locked", {
        get() {
            return locked;
        },
        set(locked) {
            lock.lock(locked);
        }
    });
    return lock;
};

function waitFor(init) {
    let value = null;
    let locked = lock(true);
    function updateValue(newValue) {
        value = newValue;
        locked.unlock();
    }
    if (init) {
        const res = init();
        if (res instanceof Promise) {
            res.then(updateValue);
        } else {
            updateValue(res);
        }
    }
    return function (newValue) {
        if (newValue) {
            updateValue(newValue);
        } else {
            return (async () => {
                await locked();
                return value;
            })();
        }
    };
}

lock.waitFor = waitFor;

module.exports =
    lock;
