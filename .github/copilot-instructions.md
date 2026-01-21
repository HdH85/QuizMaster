# QuizMaster - AI Coding Agent Instructions

## Architecture Overview

QuizMaster is an Express.js quiz application with a **three-layer architecture**:
- **Routes** ([routes/](routes/)): Handle HTTP requests/responses, input validation
- **Services** ([services/](services/)): Business logic and database transactions  
- **Models** ([models/](models/)): Sequelize ORM models with associations

**Key data flow**: Routes  Services  Models  MySQL Database

### Model Relationships
- User  hasMany  Quiz (userId foreign key)
- Quiz  hasMany  Question (quizId foreign key)
- Question  belongsTo  Quiz
- All use CASCADE deletion

Models define associations via `.associate()` method called in [models/index.js](models/index.js).

## Critical Patterns

### 1. Service Layer Transactions
Services use Sequelize transactions for multi-step operations:
\\\javascript
// Example from QuizService.createQuiz
const result = await this.client.transaction(async (t) => {
    const newQuiz = await this.quiz.create({...}, { transaction: t });
    await this.question.bulkCreate(questionsData, { transaction: t });
    return newQuiz;
});
\\\
**Always wrap related creates/updates in transactions.**

### 2. Authentication Flow
- JWT tokens stored in `Authorization: Bearer <token>` headers
- [middleware/authMiddleware.js](middleware/authMiddleware.js) provides `isAuth` and `isAdmin` guards
- Token secret from `process.env.TOKEN_SECRET`
- Session middleware configured in [app.js](app.js) but JWT is primary auth

### 3. API Response Format
All API responses follow this structure:
\\\javascript
{
    success: true/false,
    statuscode: 201,
    data: {
        message: "...",
        result: {...}  // Optional
    }
}
\\\
See [routes/quiz.js](routes/quiz.js) POST handler for reference.

### 4. Frontend API Calls
- Use `getApi(url, method, body)` from [public/javascripts/api.js](public/javascripts/api.js)
- All calls go through `/api` proxy (configured in [app.js](app.js))
- Frontend uses ES6 modules (`import/export`)

### 5. Model Definitions
Models use factory functions: `module.exports = (sequelize, Sequelize) => {...}`
- No timestamps by default: `{ timestamps: false }`
- AUTO_INCREMENT primary keys named `id`
- Associations defined in separate `.associate()` method

## Environment Setup

Required `.env` variables (see [.env_example](.env_example)):
- Database: `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `DB_NAME`, `HOST`, `PORT`, `DIALECT` (mysql), `DIALECTMODEL`
- Auth: `TOKEN_SECRET`, `SESSION_SECRET`

**Database syncs on startup** via `db.sequelize.sync({ force: false })` in [app.js](app.js).

## Development Workflow

**Start server**: `
pm start` (runs [bin/www](bin/www) on port 3000)

**No test suite exists** - manual testing only.

**View engine**: EJS templates in [views/](views/) with partials in [views/partials/](views/partials/).

## Common Gotchas

1. **API proxy confusion**: Routes defined at `/quiz` but frontend calls `/api/quiz` - proxy rewrites path
2. **Service instantiation**: Each service uses `
ew ServiceName()` - not singleton pattern
3. **Error handling**: Services throw errors, routes catch and format into standard response
4. **Password hashing**: Always use bcrypt (salt rounds: 10) in UserService
5. **Frontend modules**: Quiz manager files use mixed CommonJS/ES6 - [quizManager.js](public/javascripts/quizManager.js) has `import` but also `module.exports`

## Key Files to Reference

- [app.js](app.js): Express setup, middleware order, route mounting, proxy config
- [models/index.js](models/index.js): Sequelize initialization and model auto-loading
- [services/QuizService.js](services/QuizService.js): Transaction pattern for complex operations
- [middleware/authMiddleware.js](middleware/authMiddleware.js): JWT verification logic
- [routes/auth.js](routes/auth.js): Registration/login validation patterns
