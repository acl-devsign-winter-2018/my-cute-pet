My Cute Pet
===

## Setup

### Install

```sh
> firebase init functions
```

Choose `JavaScript` and accept defaults

### Write Functions in `functions/index.js`

You'll be using CJS instead of ES6 Modules!

Common setup looks like:

```js
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);
```

And to test the functionality, add a hello world:

```js
exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});
```

### Deploy

```sh
> firebase deploy --only functions
```

You should see an outputted url like:
```sh
Function URL (helloWorld): https://us-central1-my-cute-pet.cloudfunctions.net/helloWorld
```

Go to that url and check that it is working

## Example: Track count of Favorites
