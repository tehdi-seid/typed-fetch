# typed-fetch

A lightweight, type-safe HTTP request utility built with TypeScript and the native Fetch API.

`typed-fetch` provides a reusable `request<T>()` function for making HTTP requests with support for generic response types, query parameters, JSON request bodies, custom headers, and structured error handling.

Instead of throwing errors for unsuccessful HTTP responses, it returns a discriminated union that lets you handle success and failure explicitly.

## Features

- **Generic response types** — use `request<T>()` to specify the expected response data type.
- **HTTP methods** — supports `GET`, `POST`, `PUT`, and `DELETE`.
- **Typed query parameters** — pass string or number values through the `params` option.
- **JSON request bodies** — automatically serializes request bodies using `JSON.stringify()`.
- **Custom headers** — supports authorization tokens and other custom request headers.
- **Structured error handling** — returns either successful data or an error message.
- **Type-safe results** — uses a discriminated union to distinguish success from failure.
- **No external dependencies** — uses TypeScript and the native Fetch API.

## Requirements

- Node.js with Fetch API support, or a compatible browser environment.
- TypeScript.
- A TypeScript configuration compatible with your execution environment.

## Installation

Clone the repository:

```bash
git clone https://github.com/tehdi-seid/typed-fetch.git
cd typed-fetch
```

Install dependencies:

```bash
npm install
```

Replace `YOUR_USERNAME` with your GitHub username.

## Usage

Import the `request` function into your TypeScript file.

```ts
import { request } from "./request";
```

The examples below use JSONPlaceholder as a demonstration API.

### 1. GET request — fetch data successfully

Retrieve a post from the API.

```ts
interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

const result = await request<Post>(
  "https://jsonplaceholder.typicode.com/posts"
);

if (result.ok) {
  console.log(result.data.title);
  console.log(result.data.body);
} else {
  console.error(result.error);
}
```

**How it works:**

- `request<Post>()` specifies the expected response type.
- The default HTTP method is `GET`.
- `result.ok` determines whether the request succeeded.
- `result.data` contains the post when successful.
- `result.error` contains the error message when unsuccessful.

### 2. POST request — send JSON data

Create a post by sending a JSON body.

```ts
interface NewPost {
  title: string;
  body: string;
  userId: number;
}

const result = await request<Post>(
  "https://jsonplaceholder.typicode.com/posts",
  {
    method: "POST",
    body: {
      title: "Learning TypeScript",
      body: "Building a typed HTTP request utility.",
      userId: 1
    } satisfies NewPost
  }
);

if (result.ok) {
  console.log("Post created:", result.data);
} else {
  console.error("Request failed:", result.error);
}
```

**How it works:**

- `method: "POST"` selects the HTTP method.
- `body` contains the data to send.
- The request function serializes the body into JSON.
- The response is returned in the same success-or-error structure.

*Note: JSONPlaceholder simulates creating a post; it does not permanently save the new post.*

### 3. Error handling — unsuccessful requests

Handle an HTTP error without relying on a thrown exception.

```ts
interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

const result = await request<Post>(
  "https://jsonplaceholder.typicode.com/posts/999999"
);

if (result.ok) {
  console.log("Post:", result.data);
} else {
  console.error("Error:", result.error);
}
```

**How it works:**

- The example requests a post ID that does not exist.
- If the API returns a non-successful HTTP status, the function returns an error result.
- The caller can inspect `result.ok` and handle the failure without a rejected promise from that HTTP status.

Network failures and invalid JSON responses are also caught by the request function and returned as error results.

## API Reference

### `request<T>(url, options)`

Makes an HTTP request and returns a Promise containing a typed result.

| Parameter         | Type                                   | Description                    |
| ----------------- | -------------------------------------- | ------------------------------ |
| `url`             | `string`                               | The API endpoint URL           |
| `options.method`  | `"GET" \| "POST" \| "PUT" \| "DELETE"` | HTTP method; defaults to `GET` |
| `options.params`  | `Record<string, string \| number>`     | Query parameters               |
| `options.body`    | `unknown`                              | Data to serialize as JSON      |
| `options.headers` | `Record<string, string>`               | Custom request headers         |

### Return type

The function returns a `Promise<Result<T>>`.

```ts
type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };
```

A successful result contains `data` of type `T`.

A failed result contains an `error` message.

The `ok` property is the discriminator that allows TypeScript to narrow the result type safely.

## Error Handling

The request function handles:

- HTTP errors, such as 404 and 500.
- Network or Fetch API errors.
- Errors encountered while parsing JSON.

Errors are returned in the `Result<T>` structure rather than intentionally being thrown to the caller.

**Limitations:** The response type `T` is a compile-time expectation and is not automatically validated against the server's actual response.
Successful responses are expected to contain valid JSON; empty responses such as HTTP 204 require additional handling if you want to support them.

---

**Built as a TypeScript learning project.**
