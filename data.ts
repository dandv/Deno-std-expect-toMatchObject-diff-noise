// Shared fixture used by both deno_expect_test.ts and jest_expect.test.ts

export const article = {
  id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  slug: "getting-started-with-deno",
  title: "Getting Started with Deno",
  subtitle: "A practical guide to the modern JavaScript runtime",
  body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  author: {
    id: "u9876",
    name: "Ada Lovelace",
    email: "ada@example.dev",
    bio: "Pioneering developer and runtime enthusiast. Writes about compilers, runtimes, and elegant APIs.",
    avatar: "https://example.dev/avatars/ada.png",
    social: {
      twitter: "@ada_codes",
      github: "ada-lovelace",
      linkedin: "ada-lovelace-dev",
    },
    stats: {
      posts: 42,
      followers: 1337,
      following: 88,
    },
  },
  // !! THE MISMATCH !!
  // The expected object checks for tags: ["deno"] — an array with exactly one element.
  // toMatchObject checks arrays by *exact length*, not containment.
  // This fails even though "deno" is present, because the actual array has 5 elements.
  // Use expect.arrayContaining(["deno"]) if containment is all you need.
  tags: ["deno", "typescript", "javascript", "runtime", "tutorial"],
  category: {
    id: "cat-3",
    name: "Backend",
    slug: "backend",
    description: "Server-side development and infrastructure topics.",
  },
  stats: {
    views: 29_041,
    likes: 812,
    comments: 134,
    bookmarks: 309,
    shares: {
      twitter: 204,
      linkedin: 87,
      reddit: 153,
      hackernews: 66,
    },
  },
  seo: {
    metaTitle: "Getting Started with Deno | Dev Blog",
    metaDescription: "Learn the basics of Deno runtime in this hands-on guide.",
    canonicalUrl: "https://example.dev/blog/getting-started-with-deno",
    openGraph: {
      image: "https://example.dev/og/deno-guide.png",
      type: "article",
    },
  },
  publishedAt: "2025-06-01T09:00:00Z",
  updatedAt: "2025-06-12T16:45:00Z",
  readingTime: 7,
  featured: true,
  allowComments: true,
  relatedArticles: [
    { id: "a0001", title: "Deno vs Node.js", slug: "deno-vs-node" },
    { id: "a0002", title: "TypeScript Basics", slug: "typescript-basics" },
    { id: "a0003", title: "Modern JS Tooling", slug: "modern-js-tooling" },
  ],
};

// A simple, focused expected shape. Most of it matches — the only failure is `tags`.
export const expected = {
  title: "Getting Started with Deno",
  author: {
    name: "Ada Lovelace",
    stats: {
      posts: 42,
    },
  },
  // One element vs. five: toMatchObject will fail here.
  // The error output is what this demo is all about.
  tags: ["deno"],
  featured: true,
  stats: {
    likes: 812,
  },
};