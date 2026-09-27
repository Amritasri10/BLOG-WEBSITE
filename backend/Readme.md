# Blog Website - Backend

Blog website ka backend, Express.js + MongoDB ke saath.

## Project Structure

```
backend/
├── config/
│   ├── db.js                    # MongoDB connection
│   └── cloudinary.js            # Cloudinary image upload config
│
├── controllers/
│   ├── authController.js        # Auth: register, login, profile management
│   └── blog/
│       ├── blogController.js    # Blog CRUD + like/unlike
│       ├── commentController.js # Comments CRUD
│       ├── categoryController.js# Category CRUD (crudFactory se)
│       └── adminDashboardController.js # Admin stats
│
├── middlewares/
│   ├── authMiddleware.js        # JWT verify + role authorization
│   ├── isAdmin.js               # Admin check middleware
│   └── errorHandler.js          # Global error handler
│
├── models/
│   ├── User.modal.js            # User schema (JWT token method)
│   └── blog/
│       ├── Blog.modal.js        # Blog schema
│       ├── Comment.modal.js     # Comment schema
│       └── Category.modal.js    # Category schema
│
├── router/
│   ├── authRoutes.js            # Auth routes
│   └── blog/
│       ├── blogRoutes.js        # Blog routes
│       ├── commentRoutes.js     # Comment routes
│       ├── categoryRoutes.js    # Category routes
│       └── adminDashboardRoutes.js # Admin dashboard routes
│
├── utils/
│   ├── apiResponse.js           # Standard API response class
│   ├── apiError.js              # API error helper
│   ├── asyncHandler.js          # Async error wrapper
│   ├── crudFactory.js           # Generic CRUD factory
│   ├── helper.js                # Utility functions (slug generation, etc.)
│   └── sendEmail.js             # Email sender (nodemailer)
│
├── .env                         # Environment variables
├── .gitignore
├── index.js                     # Entry point
└── package.json
```

## API Endpoints

### Auth
| Method | Route | Access |
|--------|-------|--------|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET | /api/auth/profile | Protected |
| PATCH | /api/auth/update/:id | Protected |
| PATCH | /api/auth/update-password | Protected |
| GET | /api/auth/users | Admin |
| GET | /api/auth/users/:userId | Admin |
| PUT | /api/auth/users/:userId/role | Admin |
| DELETE | /api/auth/users/:id | Admin |

### Blogs
| Method | Route | Access |
|--------|-------|--------|
| GET | /api/blogs/all-blogs | Public |
| GET | /api/blogs/get-blog/:id | Public |
| GET | /api/blogs/user-blogs/:userId | Public |
| POST | /api/blogs/create-blog | Protected |
| PUT | /api/blogs/update-blog/:id | Protected |
| DELETE | /api/blogs/delete-blog/:id | Protected |
| PATCH | /api/blogs/like/:id | Protected |

### Comments
| Method | Route | Access |
|--------|-------|--------|
| GET | /api/comments/:blogId | Public |
| POST | /api/comments/:blogId | Protected |
| PATCH | /api/comments/:id | Protected |
| DELETE | /api/comments/:id | Protected |

### Categories
| Method | Route | Access |
|--------|-------|--------|
| GET | /api/categories | Public |
| GET | /api/categories/:id | Public |
| POST | /api/categories | Admin |
| PUT | /api/categories/:id | Admin |
| DELETE | /api/categories/:id | Admin |

### Admin Dashboard
| Method | Route | Access |
|--------|-------|--------|
| GET | /api/admin/dashboard/stats | Admin |

## Setup

```bash
cd backend
npm install
# .env file mein apni values bharo
npm run dev
```
