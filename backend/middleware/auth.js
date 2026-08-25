import jwt from 'jsonwebtoken'

/**
 * protect — OWNER: Auth
 *
 * This is the middleware that makes routes "protected": it should
 * read the JWT from the Authorization header, verify it, and attach
 * the logged-in user's id to `req.userId` so controllers know who's
 * making the request. It's already applied to the board/column/task
 * routes (see routes/*.js) — you don't need to touch those files.
 *
 * Right now it's a pass-through (calls next() unconditionally) so the
 * rest of the team isn't blocked from testing their own routes while
 * you build this. Replace the body with real verification — once you
 * do, every route that uses `protect` becomes properly protected
 * automatically.
 *
 * What to build:
 *   1. Read the token from the `Authorization: Bearer <token>` header.
 *   2. If it's missing, respond 401.
 *   3. Verify it with jwt.verify(token, process.env.JWT_SECRET).
 *   4. If verification fails, respond 401.
 *   5. On success, set req.userId = decoded.userId and call next().
 *
 * This pairs with controllers/authController.js, where login/register
 * should sign a token with jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' }).
 *
 * Worked example (delete this comment once you've built the real thing):
 *
 *   export function protect(req, res, next) {
 *     const header = req.headers.authorization
 *     if (!header?.startsWith('Bearer ')) {
 *       return res.status(401).json({ error: 'Missing or malformed Authorization header' })
 *     }
 *     const token = header.split(' ')[1]
 *     try {
 *       const decoded = jwt.verify(token, process.env.JWT_SECRET)
 *       req.userId = decoded.userId
 *       next()
 *     } catch {
 *       res.status(401).json({ error: 'Invalid or expired token' })
 *     }
 *   }
 */
export function protect(req, res, next) {
  // TODO(Owner: Auth) — replace this with the real check described above.
  next()
}
