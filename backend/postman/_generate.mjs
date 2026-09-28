import { mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = dirname(fileURLToPath(import.meta.url));
const SCHEMA = "https://schema.getpostman.com/json/collection/v2.1.0/collection.json";

const vars = [
  { key: "baseUrl", value: "http://localhost:5000" },
  { key: "authToken", value: "" },
  { key: "userId", value: "" },
  { key: "authorId", value: "" },
  { key: "blogId", value: "" },
  { key: "categoryId", value: "" },
  { key: "commentId", value: "" },
];

const authHeader = [{ key: "Authorization", value: "Bearer {{authToken}}" }];
const jsonHeader = [{ key: "Content-Type", value: "application/json" }];

const loginTests = {
  listen: "test",
  script: {
    type: "text/javascript",
    exec: [
      "const json = pm.response.json();",
      "if (json?.data?.authToken) {",
      '  pm.environment.set("authToken", json.data.authToken);',
      '  pm.collectionVariables.set("authToken", json.data.authToken);',
      "}",
      "if (json?.data?._id) {",
      '  pm.environment.set("userId", json.data._id);',
      '  pm.collectionVariables.set("userId", json.data._id);',
      "}",
    ],
  },
};

function url(path, query = []) {
  const rawQuery = query.length
    ? "?" + query.map((q) => `${q.key}=${q.value}`).join("&")
    : "";
  return {
    raw: `{{baseUrl}}${path}${rawQuery}`,
    host: ["{{baseUrl}}"],
    path: path.replace(/^\//, "").split("/"),
    query,
  };
}

function req({ name, method, path, auth = false, body, query, description, event }) {
  const header = [
    ...(body ? jsonHeader : []),
    ...(auth ? authHeader : []),
  ];
  const item = {
    name,
    request: {
      method,
      header,
      url: url(path, query),
      description: description || "",
    },
  };
  if (body) {
    item.request.body = {
      mode: "raw",
      raw: JSON.stringify(body, null, 2),
      options: { raw: { language: "json" } },
    };
  }
  if (event) item.event = [event];
  return item;
}

function folder(name, item) {
  return { name, item };
}

function collection(name, item) {
  return {
    info: { name, schema: SCHEMA },
    variable: vars,
    item,
  };
}

function save(moduleName, col) {
  const dir = join(root, moduleName);
  mkdirSync(dir, { recursive: true });
  const file = join(dir, `${moduleName}.postman_collection.json`);
  writeFileSync(file, JSON.stringify(col, null, 2));
  console.log("wrote", file);
}

const health = [
  req({
    name: "Health Check",
    method: "GET",
    path: "/api/health",
    description: "Public — server health",
  }),
];

const auth = [
  folder("Public", [
    req({
      name: "Register User (Reader)",
      method: "POST",
      path: "/api/auth/register",
      body: { username: "reader1", email: "reader1@example.com", password: "Password@123" },
      description: "Public — role User",
      event: loginTests,
    }),
    req({
      name: "Register Author",
      method: "POST",
      path: "/api/auth/register-author",
      body: {
        username: "author1",
        email: "author1@example.com",
        password: "Password@123",
        bio: "Writes about tech",
      },
      description: "Public — role Author",
      event: loginTests,
    }),
    req({
      name: "Login (User / Author / Admin)",
      method: "POST",
      path: "/api/auth/login",
      body: { email: "admin@example.com", password: "Password@123" },
      description: "Public — token authToken me save hota hai",
      event: loginTests,
    }),
  ]),
  folder("Protected Profile", [
    req({
      name: "Get Profile",
      method: "GET",
      path: "/api/auth/profile",
      auth: true,
      description: "JWT required",
    }),
    req({
      name: "Update Profile",
      method: "PATCH",
      path: "/api/auth/update-profile",
      auth: true,
      body: { username: "reader1", bio: "Hello", profilePic: "" },
      description: "JWT required — username, bio, profilePic",
    }),
    req({
      name: "Update Password",
      method: "PATCH",
      path: "/api/auth/update-password",
      auth: true,
      body: { oldPassword: "Password@123", newPassword: "NewPassword@123" },
      description: "JWT required",
    }),
  ]),
  folder("Admin User Management", [
    req({
      name: "Get All Users",
      method: "GET",
      path: "/api/auth/users",
      auth: true,
      query: [
        { key: "page", value: "1" },
        { key: "limit", value: "10" },
        { key: "search", value: "", disabled: true },
        { key: "role", value: "User", disabled: true },
        { key: "isPagination", value: "true" },
      ],
      description: "Admin only — role filter: User | Author | Admin",
    }),
    req({
      name: "Get User By ID",
      method: "GET",
      path: "/api/auth/users/{{userId}}",
      auth: true,
      description: "Admin only",
    }),
    req({
      name: "Update User Role",
      method: "PUT",
      path: "/api/auth/users/{{userId}}/role",
      auth: true,
      body: { role: "Admin" },
      description: "Admin only — role: User | Author | Admin",
    }),
    req({
      name: "Delete User",
      method: "DELETE",
      path: "/api/auth/users/{{userId}}",
      auth: true,
      description: "Admin only — param name is :id",
    }),
  ]),
];

const user = [
  req({
    name: "Get Saved Blogs",
    method: "GET",
    path: "/api/user/saved-blogs",
    auth: true,
    query: [
      { key: "page", value: "1" },
      { key: "limit", value: "10" },
      { key: "isPagination", value: "true" },
    ],
    description: "Logged-in user",
  }),
  req({
    name: "Get Liked Blogs",
    method: "GET",
    path: "/api/user/liked-blogs",
    auth: true,
    query: [
      { key: "page", value: "1" },
      { key: "limit", value: "10" },
      { key: "isPagination", value: "true" },
    ],
    description: "Logged-in user",
  }),
  req({
    name: "Get Following Authors",
    method: "GET",
    path: "/api/user/following",
    auth: true,
    description: "Logged-in user",
  }),
  req({
    name: "Toggle Follow Author",
    method: "PATCH",
    path: "/api/user/follow/{{authorId}}",
    auth: true,
    description: "Logged-in user — follow / unfollow",
  }),
];

const blogs = [
  folder("Public", [
    req({
      name: "Get All Blogs",
      method: "GET",
      path: "/api/blogs/all-blogs",
      query: [
        { key: "page", value: "1" },
        { key: "limit", value: "10" },
        { key: "search", value: "", disabled: true },
        { key: "category", value: "{{categoryId}}", disabled: true },
        { key: "sortBy", value: "recent" },
        { key: "isPagination", value: "true" },
      ],
      description: "Public — published blogs. sortBy: recent | oldest | popular",
    }),
    req({
      name: "Get Single Blog",
      method: "GET",
      path: "/api/blogs/get-blog/{{blogId}}",
      description: "Public",
    }),
    req({
      name: "Get Author Blogs",
      method: "GET",
      path: "/api/blogs/author/{{authorId}}",
      query: [
        { key: "page", value: "1" },
        { key: "limit", value: "10" },
        { key: "isPagination", value: "true" },
      ],
      description: "Public — author ki published blogs",
    }),
  ]),
  folder("Author", [
    req({
      name: "Create Blog",
      method: "POST",
      path: "/api/blogs/create",
      auth: true,
      body: {
        title: "My First Blog",
        description: "Short summary",
        content: "<p>Full content</p>",
        image: "https://example.com/cover.jpg",
        category: "{{categoryId}}",
        tags: ["tech"],
        isPublished: true,
      },
      description: "Author only — title, description, image required",
    }),
    req({
      name: "Get My Blogs",
      method: "GET",
      path: "/api/blogs/my-blogs",
      auth: true,
      query: [
        { key: "page", value: "1" },
        { key: "limit", value: "10" },
        { key: "isPagination", value: "true" },
        { key: "isPublished", value: "", disabled: true },
      ],
      description: "Author only — drafts bhi",
    }),
    req({
      name: "Toggle Publish",
      method: "PATCH",
      path: "/api/blogs/toggle-publish/{{blogId}}",
      auth: true,
      description: "Author only",
    }),
  ]),
  folder("Author or Admin", [
    req({
      name: "Update Blog",
      method: "PUT",
      path: "/api/blogs/update/{{blogId}}",
      auth: true,
      body: {
        title: "Updated title",
        description: "Updated summary",
        content: "<p>Updated</p>",
        image: "https://example.com/cover.jpg",
        category: "{{categoryId}}",
        tags: ["tech"],
        isPublished: true,
      },
      description: "Owner author or Admin",
    }),
    req({
      name: "Delete Blog",
      method: "DELETE",
      path: "/api/blogs/delete/{{blogId}}",
      auth: true,
      description: "Owner author or Admin",
    }),
  ]),
  folder("Logged-in User", [
    req({
      name: "Toggle Like",
      method: "PATCH",
      path: "/api/blogs/like/{{blogId}}",
      auth: true,
    }),
    req({
      name: "Toggle Save",
      method: "PATCH",
      path: "/api/blogs/save/{{blogId}}",
      auth: true,
    }),
  ]),
];

const comments = [
  req({
    name: "Get Comments By Blog",
    method: "GET",
    path: "/api/comments/{{blogId}}",
    query: [
      { key: "page", value: "1" },
      { key: "limit", value: "10" },
      { key: "isPagination", value: "true" },
    ],
    description: "Public — approved comments",
  }),
  req({
    name: "Add Comment",
    method: "POST",
    path: "/api/comments/{{blogId}}",
    auth: true,
    body: { content: "Nice article!" },
    description: "Logged-in user",
  }),
  req({
    name: "Update Comment",
    method: "PATCH",
    path: "/api/comments/{{commentId}}",
    auth: true,
    body: { content: "Updated comment" },
    description: "Own comment only",
  }),
  req({
    name: "Delete Comment",
    method: "DELETE",
    path: "/api/comments/{{commentId}}",
    auth: true,
    description: "Own comment, blog author, or Admin",
  }),
  req({
    name: "Approve Comment",
    method: "PATCH",
    path: "/api/comments/{{commentId}}/approve",
    auth: true,
    description: "Blog author or Admin",
  }),
];

const categories = [
  req({
    name: "Get All Categories",
    method: "GET",
    path: "/api/categories",
    query: [
      { key: "page", value: "1" },
      { key: "limit", value: "10" },
      { key: "search", value: "", disabled: true },
      { key: "isActive", value: "true", disabled: true },
      { key: "sortBy", value: "recent" },
      { key: "isPagination", value: "true" },
    ],
    description: "Public",
  }),
  req({
    name: "Get Category By ID",
    method: "GET",
    path: "/api/categories/{{categoryId}}",
    description: "Public",
  }),
  req({
    name: "Create Category",
    method: "POST",
    path: "/api/categories",
    auth: true,
    body: { name: "Technology", isActive: true },
    description: "Admin only",
  }),
  req({
    name: "Update Category",
    method: "PUT",
    path: "/api/categories/{{categoryId}}",
    auth: true,
    body: { name: "Tech", isActive: true },
    description: "Admin only",
  }),
  req({
    name: "Delete Category",
    method: "DELETE",
    path: "/api/categories/{{categoryId}}",
    auth: true,
    description: "Admin only",
  }),
];

const authors = [
  folder("Public", [
    req({
      name: "Get All Authors",
      method: "GET",
      path: "/api/authors/all",
      query: [
        { key: "page", value: "1" },
        { key: "limit", value: "10" },
        { key: "search", value: "", disabled: true },
        { key: "isPagination", value: "true" },
      ],
      description: "Public",
    }),
    req({
      name: "Get Public Author Profile",
      method: "GET",
      path: "/api/authors/profile/{{authorId}}",
      description: "Public",
    }),
  ]),
  folder("Author Dashboard", [
    req({
      name: "Get Author Dashboard",
      method: "GET",
      path: "/api/authors/dashboard",
      auth: true,
      description: "Author or Admin",
    }),
    req({
      name: "Get Pending Comments",
      method: "GET",
      path: "/api/authors/pending-comments",
      auth: true,
      query: [
        { key: "page", value: "1" },
        { key: "limit", value: "10" },
        { key: "isPagination", value: "true" },
      ],
      description: "Author or Admin",
    }),
  ]),
];

const admin = [
  req({
    name: "Get Dashboard Stats",
    method: "GET",
    path: "/api/admin/stats",
    auth: true,
    description: "Admin only",
  }),
];

const modules = {
  Health: health,
  Auth: auth,
  User: user,
  Blogs: blogs,
  Comments: comments,
  Categories: categories,
  Authors: authors,
  Admin: admin,
};

const allFolders = Object.entries(modules).map(([name, item]) => folder(name, item));
writeFileSync(
  join(root, "Blog-Website.postman_collection.json"),
  JSON.stringify(collection("Blog Website API", allFolders), null, 2)
);
console.log("wrote master collection");

for (const [name, item] of Object.entries(modules)) {
  save(name, collection(name, item));
}
