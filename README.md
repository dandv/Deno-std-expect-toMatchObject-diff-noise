# Noise in @std/expect's `toMatchObject` diff (vs. Jest's `expect`): object keys not present in the expected object

The code in the [repro repo](https://github.com/dandv/Deno-std-expect-toMatchObject-diff-noise) calls
`expect(article).toMatchObject(expected);` on a [_Lorem impsum_ blog post object](data.ts)
with one actual mismatch:

```ts
// actual (5 elements)
tags: ["deno", "typescript", "javascript", "runtime", "tutorial"]

// expected inside toMatchObject (1 element)
tags: ["deno"]
```

Deno's `expect` output is ~3x longer than Jest, and the actual difference is buried in noise.

## Actual output

### Jest's `expect`

This is scoped to the keys in `expected`:

```
error: Error: expect(received).toMatchObject(expected)

- Expected  - 0
+ Received  + 4

  Object {
    "author": Object {
      "name": "Ada Lovelace",
      "stats": Object {
        "posts": 42,
      },
    },
    "featured": true,
    "stats": Object {
      "likes": 812,
    },
    "tags": Array [
      "deno",
+     "typescript",
+     "javascript",
+     "runtime",
+     "tutorial",
    ],
    "title": "Getting Started with Deno",
  }
```

The four extra array elements are marked with `+` so the problem is easy to identify.

---

### Deno's `@std/expect`

 The entire **actual** object is dumped:

```
error: AssertionError: Values are not equal.


    [Diff] Actual / Expected


    {
-     allowComments: true,
      author: {
-       avatar: "https://example.dev/avatars/ada.png",
-       bio: "Pioneering developer and runtime enthusiast. Writes about compilers, runtimes, and elegant APIs.",
-       email: "ada@example.dev",
-       id: "u9876",
        name: "Ada Lovelace",
-       social: {
-         github: "ada-lovelace",
-         linkedin: "ada-lovelace-dev",
-         twitter: "@ada_codes",
-       },
        stats: {
-         followers: 1337,
-         following: 88,
          posts: 42,
        },
      },
-     body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
-     category: {
-       description: "Server-side development and infrastructure topics.",
-       id: "cat-3",
-       name: "Backend",
-       slug: "backend",
-     },
      featured: true,
-     id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
-     publishedAt: "2025-06-01T09:00:00Z",
-     readingTime: 7,
-     relatedArticles: [
-       {
-         id: "a0001",
-         slug: "deno-vs-node",
-         title: "Deno vs Node.js",
-       },
-       {
-         id: "a0002",
-         slug: "typescript-basics",
-         title: "TypeScript Basics",
-       },
-       {
-         id: "a0003",
-         slug: "modern-js-tooling",
-         title: "Modern JS Tooling",
-       },
-     ],
-     seo: {
-       canonicalUrl: "https://example.dev/blog/getting-started-with-deno",
-       metaDescription: "Learn the basics of Deno runtime in this hands-on guide.",
-       metaTitle: "Getting Started with Deno | Dev Blog",
-       openGraph: {
-         image: "https://example.dev/og/deno-guide.png",
-         type: "article",
-       },
-     },
-     slug: "getting-started-with-deno",
      stats: {
-       bookmarks: 309,
-       comments: 134,
        likes: 812,
-       shares: {
-         hackernews: 66,
-         linkedin: 87,
-         reddit: 153,
-         twitter: 204,
-       },
-       views: 29041,
      },
-     subtitle: "A practical guide to the modern JavaScript runtime",
      tags: [
        "deno",
-       "typescript",
-       "javascript",
-       "runtime",
-       "tutorial",
      ],
      title: "Getting Started with Deno",
-     updatedAt: "2025-06-12T16:45:00Z",
    }
```

Every property of the received object is dumped, including fields that were never
mentioned in `expected` (e.g. `seo`, `relatedArticles`, `body`, `category`, `slug`,
the full `author.social` block). All these appear as `-` removals, because the differ
is comparing the full received value against the partial expected value.

The actual mismatch (`tags`) is buried near the bottom.

---

## Summary

For small objects the difference is cosmetic but for cmoplex object (e.g. real API responses),
the `@std/expect` output can easily blow past a terminal scrollback buffer, making the actual
failure very hard to identify.

## Project structure

```
data.ts                 shared fixture (article) + expected object
deno_expect_test.ts     uses jsr:@std/expect
jest_expect_test.ts     uses npm:expect (Jest's standalone expect)
deno.json               tasks — everything runs under deno test
```

## Running

```sh
deno task test:deno   # @std/expect only
deno task test:jest   # Jest expect only
deno task test        # both
```
