export default function lock(): Lock;
export default function lock(defaultLocked: boolean): Lock;
export interface Lock {
    (): Promise<void>,
    lock(): void,
    lock(locked: boolean): void,
    unlock(): void,
    locked: boolean,
}

export function waitFor<T>(init?: () => T | Promise<T>): WaitFor<T>;
export interface WaitFor<T> {
    (value: T): void,
    (): Promise<T>,
}
