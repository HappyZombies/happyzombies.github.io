---
title: 'Custom Node.js Errors'
date: '2023-03-04'
category: node
summary: Extending the Node.js error class should be known about and used 
---

> Update:  I've made a few changes to help clarify a few things. First off, I just wanted to say that everything I'm sharing here is just based on my own opinions and personal preferences when it comes to using custom Node.js Errors. I hope it'll be useful to you too! I've also tweaked the error classes and code examples to make them a bit better - hope this post helps!

A small yet powerful tool that I believe every Node.js developer should use and know about is the ability to create custom errors within their application.

Creating custom errors gives us a few advantages:
1. Allows us to create more specific unit tests for error scenarios.
2. Including extra debugging information in the Error class, not limiting us to just `Error.message`.
3. Categorizing errors promptly to pinpoint their exact location of occurrence.

## Defining a Custom Error

To define a custom error class, simply extend the Error class. See some examples below.

```js
class InvalidInputError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
  }
}
class DatabaseError extends Error {
  constructor(message, statusCode, originalError) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.originalError = originalError;
  }
}
```

Now when we extend this class, we can have control over what new and additional properties we can send. So whether it's to rethrow an error or capture it in a log, the custom error class can give us extra information on what is going on.

To use the custom error, simply throw it the same way as the built-in error class.

```js
const { InvalidInputError, DatabaseError } = require('../errors');

function validateUser(user) {
  if (!user || !user.email || !user.email.includes('@')) {
    throw new InvalidInputError('Invalid user email');
  }

  // This is just an example
  try {
    await someDatabaseCall(user.email);
  } catch(err) {
    throw new DatabaseError('Database Error Occurred', 500, err);
  }

}
```
In this example, we throw a custom error class for invalid user input, and we use a try-catch block to handle any errors that may be thrown during the database call. We throw a typical error message so don't divulge too much information to the end user on what exactly happened.

It's important to pass the original error when throwing a custom error class like `DatabaseError`. This way, we don't lose any information on the original cause of the error. Of course this may vary depending on the type of error you're handling. In the case of `InvalidInputError`, we don't need to pass the original error because we're not re-throwing it from the database call.

## Benefit 1: Specific Unit Tests
Imagine if we were to write a unit test for the method above. How would we test for the error case if we simply threw `new Error()` for the input validation or re-threw the error from the database call? Well, we'd have to catch the error based on the string value.

```js
describe('validate user existing', () => {
  it('should throw an error if the user cannot be found in the database', async () => {
    expect(() => await validateUser('someemail@email.com').to.throw(/Database Error Occurred/))
  });
});
```

But with the added benefit of our custom error, we can write a much cleaner unit test that doesn't check for a string value, but rather the class type.

```js
const { DatabaseError } = require('../errors');

describe('validate user existing', () => {
  it('should throw an error if the user cannot be found in the database', async () => {
    expect(() => await validateUser('someemail@email.com').to.throw(DatabaseError));
  });
});

```
This version of the unit test is much more specific, and we know the exact reason why this error occurred.

## Benefit 2: Additional Properties

With us defining the error class now, we can pass as many variables as we need. One valuable variable to include is a timestamp, which can be extremely helpful when errors are captured in your logs.

Moreover, if you have some sort of concept of a tracing/tracking id, you can pass it to the class and the tracing id will be present. This is especially useful if the error is thrown due to an uncaught exception.

```js
class DatabaseError extends Error {
  constructor(message, traceId, statusCode, originalError) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.originalError = originalError;
    this.date = new Date();
  }
}

const findUserById = async (id) => {
  const traceId = generateRandomUUID(); // some uuid
  logger.info(traceId, "entering database call");
  let user;
  try {
    user = await someDatabaseCall(id);
  } catch (error) {
    logger.info(traceId, "an error occurred during the database query!");
    throw new DatabaseError("Error when getting user.", traceId, 500, error);
  }
  return user;
}
```

The code above will throw an error like so:

```text
DatabaseError: Error when getting user.
    at script.js:14:9
    at ModuleJob.run (node:internal/modules/esm/module_job:193:25)
    at async Promise.all (index 0)
    at async ESMLoader.import (node:internal/modules/esm/loader:530:24)
    at async loadESM (node:internal/process/esm_loader:91:5)
    at async handleMainPromise (node:internal/modules/run_main:65:12) {
  traceId: '56c84a0d-e8da-40e5-8618-f41a8a00cb65',
  date: 2023-02-20T21:35:07.020Z,
  originalError: {Error here}
}
```

## Benefit 3: Quicker to Identify

Notice from the error thrown above, that it contains our class name. This is also a major benefit because right away we can know what type of error this is/where it is coming from.

In this case, since it's a DatabaseError, we know that this pertains to an issue with our database.

If errors aren't categorized correctly, debugging can be a difficult task since developers have to manually analyze the message and stack trace. But by implementing this simple technique, we can simplify the debugging process tremendously by giving us a context clue right away.

## Custom Errors That Every Dev Should Have

Generally, I would recommend at least these three types of custom errors. Of course, your use case may vary depending on what you are building.

### Startup Error
```js

class StartUpError extends Error {
  constructor(message, traceId, originalError) {
    super(message);
    this.name = this.constructor.name;
    this.originalError = originalError;
    this.date = new Date();
  }
}
```
This error should be used during application startup, especially when connecting to any backing services, validating environment variables, and other related operations.

### API Error
```js
class ApiError extends Error {
  constructor(message, traceId, originalError, statusCode = 500) {
    super(message);
    this.name = this.constructor.name;
    this.traceId = traceId;
    this.originalError = originalError;
    this.statusCode = statusCode;
    this.date = new Date();
  }
}
```
These errors apply to everything that will be sent via our API and will also include any HTTP error status codes.

You can also get extra fancy and extend this base ApiError. This way you can have consistent HTTP error classes depending on the type of HTTP error you will be sending.

```js
class NotFoundError extends ApiError {
    constructor(resource, traceId, originalError) {
        super(`Could not find resource ${resource}`, traceId, originalError, 404);
    }
}
```
### Application Error
```js
class ApplicationError extends Error {
  constructor(message, traceId, originalError) {
    super(message);
    this.name = this.constructor.name;
    this.originalError = originalError;
    this.date = new Date();
  }
}
```
I use Application Errors for "everything else" and/or custom error failure cases that aren't necessarily meant for a user. Additionally, in this example I call the class ApplicationError, but I prefer to use the name of my application. So if the name of my app is called "Quiz App", I'd call it "QuizAppError".

You'll notice that this class is the same as the StartUpError. But what I am taking advantage of here is the name of the class. When this error is thrown, I know that it is a specific error case that I have handled and caught, so it will contain the additional debugging information I have added.

## Conclusion

Creating custom errors allows your application to be more flexible and easier to understand. Additionally, implementing them doesn't require much extra effort, and I can guarantee you that you, you're coworkers, and as well as your users, will appreciate these explicit and detailed error messages.


### Resources and Tools

* [Node.js Error Documentation](https://nodejs.org/api/errors.html#class-error)
* [ChatGPT](https://openai.com/) for proof reading this post.