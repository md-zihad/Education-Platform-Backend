# JWT Authentication Implementation Standard

## 1. Document Objective

This document provides a technical description of the JWT authentication approach implemented in this project. It is intended for engineers, reviewers, and maintainers who need a clear view of design decisions, security controls, and production hardening requirements.

## 2. Scope

This document covers:

- Access token issuance and verification
- Refresh token issuance, storage, rotation, and revocation
- Route protection mechanism
- Security controls currently implemented
- Recommended improvements for production-grade operation

## 3. Source of Truth (Code References)

- `src/utils/jwt.ts`
- `src/modules/auth/Auth.service.ts`
- `src/modules/auth/Auth.controller.ts`
- `src/modules/auth/Auth.routes.ts`
- `src/middleware/auth.middleware.ts`
- `src/config/env.ts`
- `src/modules/user/User.entity.ts`

## 4. Authentication Architecture

### 4.1 Token Model

The implementation uses a dual-token model:

- Access token:
	- Signed with `JWT_ACCESS_SECRET`
	- Expiry from `JWT_EXPIRES_IN`
	- Sent to clients as response payload
	- Used as `Authorization: Bearer <token>` for protected APIs

- Refresh token:
	- Signed with `JWT_REFRESH_SECRET`
	- Expiry from `JWT_REFRESH_EXPIRES`
	- Transported in `httpOnly` cookie (`refreshToken`)
	- Rotated on each successful refresh

### 4.2 JWT Claims in Current Implementation

Current payload fields:

- `userId`
- `email`
- `role`

Defined by `JwtPayload` in `src/utils/jwt.ts`.

## 5. End-to-End Flow

### 5.1 Signup (`POST /api/auth/signup`)

1. Validate request body.
2. Check if email already exists.
3. Hash password with bcrypt (`saltRounds = 12`).
4. Persist user with role `ADMIN` (default in current model).

### 5.2 Login (`POST /api/auth/login`)

1. Validate credentials.
2. Generate access token and refresh token.
3. Hash refresh token with bcrypt (`saltRounds = 10`) and store in `users.refreshToken`.
4. Set raw refresh token as `httpOnly` cookie.
5. Return access token in response body.

### 5.3 Protected Route Access

Implemented by `protect` middleware in `src/middleware/auth.middleware.ts`:

1. Read `Authorization` header.
2. Enforce `Bearer` scheme.
3. Verify token using `verifyAccessToken`.
4. Attach decoded claims to `req.user`.
5. Return `401` for missing or invalid token.

### 5.4 Refresh (`POST /api/auth/refresh`)

1. Read refresh token from cookie.
2. Verify refresh token signature and expiry.
3. Lookup user from `decoded.userId`.
4. Compare raw refresh token against stored hash.
5. If valid, issue new access token and new refresh token.
6. Overwrite DB hash with newly issued refresh token hash.
7. Set refreshed cookie and return new access token.

### 5.5 Logout (`POST /api/auth/logout`)

1. Require valid access token.
2. Clear refresh hash from database.
3. Clear refresh cookie.

Result: ongoing refresh chain is invalidated for that user state.

## 6. Security Controls Implemented

### 6.1 Credential and Token Hashing

- Passwords are never stored in plaintext.
- Refresh tokens are hashed at rest before persistence.

### 6.2 Refresh Token Rotation

- Each successful refresh replaces the previous refresh token hash.

### 6.3 Key Separation

- Access and refresh tokens use different signing secrets.

### 6.4 Header-Based API Authorization

- Access token is not cookie-bound and is required in Bearer header for protected resources.

## 7. Security Best Practices for Production (Recommended)

### 7.1 Cookie Policy Hardening

- Set `secure: true` in production.
- Set explicit `maxAge` aligned with refresh token TTL.
- Keep `httpOnly: true`.
- Evaluate `sameSite` policy based on frontend deployment model.

### 7.2 CORS Hardening

- If cookie-based refresh is used cross-origin, enable `credentials: true`.
- Restrict `origin` to explicit trusted domains.
- Do not use permissive wildcard origin with credentials.

### 7.3 Typed Auth Contracts

- Replace `any` in auth-critical paths (`req`, decoded payload).
- Introduce typed request extension (e.g., `AuthRequest`) and typed claims model.

### 7.4 Claim Governance

- Add and validate standard claims where appropriate: `iss`, `aud`, `sub`, `jti`.
- Keep token payload minimal to reduce leakage risk.

### 7.5 Session-Level Refresh Management

Current model keeps one refresh hash per user.

For multi-device and enterprise session control, use a dedicated session table with fields such as:

- `userId`, `tokenHash`, `jti`, `expiresAt`, `revokedAt`, `deviceInfo`, `ipAddress`

### 7.6 Abuse Protection

- Apply rate limiting on `/api/auth/login` and `/api/auth/refresh`.
- Add login abuse controls (temporary lockout or backoff).

### 7.7 Security Observability

- Keep user-facing auth errors generic.
- Log security-relevant context server-side for detection and incident response.

## 8. Configuration Requirements

Required environment variables:

- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `JWT_REFRESH_SECRET`
- `JWT_REFRESH_EXPIRES`

Operational guidance:

- Use cryptographically strong secrets (minimum 32-byte entropy).
- Use short access token TTL and bounded refresh token TTL.
- Implement key rotation policy and secret management through secure vaulting.

## 9. Production Readiness Checklist

- HTTPS enforced in all environments except local development.
- Cookie options set per environment (`secure`, `sameSite`, `maxAge`).
- CORS policy restricted to approved origins.
- Auth endpoints rate-limited.
- Security logging and alerting enabled.
- Token compromise response procedure documented.

## 10. Conclusion

The current JWT implementation is a strong baseline and already includes key controls such as refresh token hashing, rotation, and separated signing secrets. With the production hardening measures listed above, the authentication layer can meet conventional professional standards for secure backend systems.
