export default function lock(defaultLocked: boolean = false): Lock;
export interface Lock {
    (): Promise<void>,
    lock(): void,
    lock(locked: boolean): void,
    unlock(): void,
    locked: boolean,
}