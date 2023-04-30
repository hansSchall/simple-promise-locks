# simple-promise-locks

Easy to use, object-orientated, promise-based, typescript-first locks

Supports Deno, Node.js and browser.

There are hundreds of similar repositories, but I was missing the above
aspects.<br/> Most of them identify a lock by a name and not an object as it is
typical for JavaScript/TypeScript.<br/> Additionally I was missing a simple
support for ES6 Promises

Install it via `npm install simple-promise-locks` or
`yarn add simple-promise-locks`. (lock is a default export, waitFor is a
property of it)

Deno users: please see bottom of page

This one is very simple to use:

## Lock API

### 1 Create the lock:

```javascript
const myLock = lock();
// or
const myLock = lock(true); // creates an already locked lock
```

### 2 Lock it:

```javascript
myLock.lock();
// or
myLock.lock(true);
// or
myLock.locked = true;
```

### 3 Wait for the lock to unlock:

```javascript
await myLock();
```

### 4 Unlock it:

```javascript
myLock.unlock();
// or
myLock.lock(false);
// or
myLock.locked = false;
```

That's all!

## WaitFor API

This helps you preventing null-pointer exceptions when using global variables
like database drivers. It delays the access to the API until the instance has
been created, instead of throwing a null pointer. It is built on top of the lock
API.

### 1 Create an instance

```typescript
// JavaScript
const w_globApi = waitFor();
// or TypeScript
const w_globApi = waitFor<TypeOfAPI>();
```

### 2a Set the value by calling the instance

```typescript
w_globApi(apiInstance);
```

Calling this multiple times will update the value.

### 2b Set the value by an initializer function

```typescript
// call signature of waitFor():
waitFor(initFunction?: () => TypeOfAPI | Promise<TypeOfAPI>)
```

### 3 Use the value

```typescript
const api: Promise<TypeOfAPI> = await w_globApi();
```

The promise resolves once the value has been set the first time

## Practical example using waitFor and SQLite (Node.js):

```typescript
import { Database, open } from "sqlite"; // Promise abstraction for SQLite
import { Database as DB3 } from "sqlite3"; // node SQLite bindings
import lock, { waitFor } from "simple-promise-locks"; // lock is a default export, waitFor is named

const w_db = waitFor<Database>(); // create instance

export async function initDB() {
  // open Database
  const db = await open({
    filename: path.resolve("path/to/database.db"),
    driver: DB3,
  });

  // ensure all tables exist
  await Promise.all([
    "CREATE TABLE IF NOT EXISTS Foo (id TEXT PRIMARY KEY, label TEXT)",
    "CREATE TABLE IF NOT EXISTS Config (id TEXT PRIMARY KEY, value TEXT)",
  ].map((stmnt) => db.run(stmnt)));

  // set waitFor to db driver instance
  w_db(db);
}

export async function getData(id: string) {
  const db = await w_db();

  const res = await db.get("SELECT * FROM Foo WHERE id = ?", [id]);

  // ...
}
```

## Using Deno:

```ts
import {
  Lock,
  WaitFor,
} from "https://deno.land/x/simple_promise_lock/deno/lock.ts";
```

`lock(...)` => `Lock(...)`<br> `waitFor(...)` => `WaitFor(...)`

## License

Copyright (c) 2022-2023 Hans Schallmoser

MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
