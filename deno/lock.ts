export function Lock(lockedDefault = false): Lock {
    const waiting = [];
    let locked = lockedDefault;
    const lock = function () {
        return new Promise<void>(
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
    lock.lock = (nlocked?: boolean) => {
        if (nlocked === false) lock.unlock();
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
    return lock as unknown as Lock;
};

export interface Lock {
    (): Promise<void>,
    lock(): void,
    lock(locked: boolean): void,
    unlock(): void,
    locked: boolean,
}

export function WaitFor<T>() {
    let value: T = null;
    let locked = Lock(true);
    return function (nvalue?: T) {
        if (nvalue) {
            value = nvalue;
            locked.unlock();
        } else {
            return (async () => {
                await locked();
                return value;
            })();
        }
    };
}

export interface WaitFor<T> {
    (): Promise<T>,
    (value: T): void,
}
