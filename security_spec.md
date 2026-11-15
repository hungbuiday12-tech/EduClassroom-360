# Security Spec - EduClassroom 360

## 1. Data Invariants
- Each user profile `/users/{userId}` belongs strictly to `request.auth.uid`.
- Users cannot elevate their own role (`role` cannot be modified to 'admin' without admin privileges).
- Users can only read and write their own profile, `/study_progress/{progressId}`, `/study_roadmap/{userId}`, and `/lesson_assessments/{assessmentId}` (with `overallMastery` in `[0, 100]` and immutable `userId` and `lessonKey`).
- Daily arena attempts in `/arena_attempts/{attemptId}` are immutable once created (`allow update, delete: if false`) and strictly owned by `request.auth.uid` with scores constrained to `[0, 100]`.
- Weekly leaderboard records in `/weekly_leaderboard/{entryId}` contain zero PII (no emails/phones), enforce score bounds `[0, 100]`, and only allow updates by the owning `request.auth.uid` with immutable `userId` and `weekId`.

## 2. The Dirty Dozen Payloads
1. Spoofing `userId` path mismatch on `/users/{userId}` (attacker creates doc with arbitrary ID).
2. Privilege escalation payload setting `role: "admin"` during user self-registration.
3. Overwriting `createdAt` with arbitrary past date.
4. Injecting oversized string (>30 chars) into `username`.
5. Injecting malicious non-alphanumeric characters into `username`.
6. Reading other users' private profiles without authorization.
7. Modifying `userId` on `/study_progress/{progressId}` or `/study_roadmap/{userId}` to steal progress or assign XP to another account.
8. Unauthenticated write to `/users`, `/arena_attempts`, `/weekly_leaderboard`, or `/study_roadmap`.
9. Attempting to overwrite/update an existing `/arena_attempts/{attemptId}` to bypass the 1-attempt-per-day-per-subject limit.
10. Injecting out-of-range score (>100 or <0) into `/arena_attempts` or `/weekly_leaderboard`.
11. Injecting PII (`email`) or ghost fields into `/weekly_leaderboard` or `/arena_attempts`.
12. Attempting to bypass schema with unknown arbitrary ghost keys.
13. Unauthenticated guest attempting to read/enter `/forum_groups/official-announcements` or its nested `/messages`.
14. Non-admin signed-in student attempting to post a message inside `/forum_groups/official-announcements` or spoof `isMandatoryAdminGroup: true` on a new group.
15. Email spoofing attempt where `request.auth.token.email == 'hungbuiday12@gmail.com'` with `email_verified == false`.

## 3. Forum Data Invariants
- `/forum_groups/official-announcements` is the mandatory Admin announcement group (`isMandatoryAdminGroup: true`) managed strictly by Admin `TanHung` (`hungbuiday12@gmail.com` with `email_verified == true`), and can never be deleted or modified by regular users.
- Only signed-in users (`isSignedIn()`) may enter the mandatory Admin group, create new `/forum_groups/{groupId}` rooms (`isMandatoryAdminGroup: false`), or create `/forum_groups/{groupId}/messages/{messageId}` records.
- Only Admin `TanHung` (`hungbuiday12@gmail.com` verified) can send messages into `/forum_groups/official-announcements`.
- Group and message documents store zero user PII (no raw user email addresses).
