# Security Spec - EduClassroom 360

## 1. Data Invariants
- Each user profile `/users/{userId}` belongs strictly to `request.auth.uid`.
- Users cannot elevate their own role (`role` cannot be modified to 'admin' without admin privileges).
- Users can only read and write their own profile and study progress records.
- Progress records in `/study_progress/{progressId}` must match `request.auth.uid`.

## 2. The Dirty Dozen Payloads
1. Spoofing `userId` path mismatch on `/users/{userId}` (attacker creates doc with arbitrary ID).
2. Privilege escalation payload setting `role: "admin"` during user self-registration.
3. Overwriting `createdAt` with arbitrary past date.
4. Injecting oversized string (>30 chars) into `username`.
5. Injecting malicious non-alphanumeric characters into `username`.
6. Reading other users' private profiles without authorization.
7. Modifying `userId` on `/study_progress/{progressId}` to steal progress or assign XP to another account.
8. Unauthenticated read/write to `/users`.
9. Modifying someone else's study progress record.
10. Injecting oversized string (>128 chars) into `itemId`.
11. Blanket collection scanning without `userId == request.auth.uid` filter.
12. Attempting to bypass schema with unknown arbitrary ghost keys.
