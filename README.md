# simple-promise-locks
Easy to use, object-orientated, promise-based locks

There are hundreds of similar repositories, but I was missing the above aspects.<br/>
Most of them identify a lock by a name and not an object as it is typical for JavaScript/TypeScript.<br/>
Additionally I was missing a simple support for ES6 Promises

Install it via `npm install simple-promise-locks` or `yarn add simple-promise-locks`

This one is very simple to use:

1. Create the lock:

````javascript
const myLock = lock();
// or
const myLock = lock(true); // creates an already locked lock
````

2. Lock it:

````javascript
myLock.lock();
// or
myLock.lock(true);
````
3. Wait for the lock to unlock:

````javascript
await myLock();
````

4. Unlock it:

````javascript
myLock.unlock();
// or
myLock.lock(false);
````

That's all!
