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
14. Non-admin signed-in student (including regular user `TanHung`) attempting to post a message inside `/forum_groups/official-announcements` or spoof `isMandatoryAdminGroup: true` on a new group.
15. Email spoofing attempt where `request.auth.token.email == 'synapse.admin@educlassroom360.vn'` with `email_verified == false`.

## 3. Forum Data Invariants
- `/forum_groups/official-announcements` is the mandatory Admin announcement group (`isMandatoryAdminGroup: true`) managed strictly by Admin `Synapse` (`synapse.admin@educlassroom360.vn` with `email_verified == true` or verified `/admins/{uid}` record), and can never be deleted or modified by regular users.
- Only signed-in users (`isSignedIn()`) may enter the mandatory Admin group, create new `/forum_groups/{groupId}` rooms (`isMandatoryAdminGroup: false`), or create `/forum_groups/{groupId}/messages/{messageId}` records.
- Only Admin `Synapse` can send messages into `/forum_groups/official-announcements`; user `TanHung` (`hungbuiday12@gmail.com`) is a standard student user.
- Group and message documents store zero user PII (no raw user email addresses).

## 4. Forum Social Feed & Updates Invariants
- `/forum_posts/{postId}` stores zero PII and is publicly readable (`get` and `list` scoped by `postType`).
- Only signed-in users (`isSignedIn()` with verified email) can create `/forum_posts/{postId}` (`authorId == request.auth.uid`, `commentsCount == 0`, `tryCount == 0`).
- Only Admin `Synapse` (`isForumAdmin()`) can create official web-update posts (`postType == 'update'`) or set `isPinned: true`.
- Standard users may edit or delete only their own `/forum_posts/{postId}` (`existing().authorId == request.auth.uid`) and cannot escalate `postType` to `'update'` or change `authorId`.
- Signed-in users may react (`reactions`), update `commentsCount`, or increment `tryCount` when launching an attached experiment/lecture, without altering the post's author or body.
- `/forum_posts/{postId}/comments/{commentId}` enforces parent post existence (Master Gate), immutable `authorId`/`postId`, and deletion restricted to comment owner, post owner, or Admin `Synapse`.
- Dirty payloads blocked: spoofing `authorId` on create, regular user creating `postType: "update"` or `isPinned: true`, injecting ghost fields or oversized attachments, or editing another user's post content.

