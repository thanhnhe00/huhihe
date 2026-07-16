# Frontend ↔ Backend Integration Gaps & Missing Endpoints Report

In attempting to replace the local mock data (`fe/src/data/mangas.ts`) and `localStorage` with active backend API calls, several structural gaps have been identified where required endpoints, fields, or database tables are missing in the existing Spring Boot backend.

In accordance with the integration guidelines, further implementation of frontend changes has been **STOPPED immediately** to wait for review and approval. No backend modifications have been made.

---

## 1. Story Slug (String Identifier) to Long ID Mapping
* **Missing Endpoint / Field:** `GET /api/stories/slug/{slug}` (or `slug` field in JPA model)
* **Frontend File:**
  - `fe/src/App.tsx`
  - `fe/src/views/MangaDetailView.tsx`
  - `fe/src/views/ReaderView.tsx`
  - `fe/src/views/FollowingView.tsx`
  - `fe/src/views/HistoryView.tsx`
* **Why it is needed:**
  The React frontend uses string-based human-readable slugs (e.g. `'one-piece'`, `'solo-leveling'`) to track active navigation views, store likes, comments, and navigate pages. The backend database `Story` model strictly identifies stories via auto-incremented `Long storyId` (e.g. `1`, `2`) and has no string slug column. Without slug lookup, the frontend cannot render any specific manga detail or reader page when given slug strings.
* **Suggested Backend Implementation:**
  1. Add a `slug` field to the `Story` JPA entity:
     ```java
     @Column(name = "slug", unique = true, nullable = false, length = 255)
     private String slug;
     ```
  2. Implement a repository method `Optional<Story> findBySlug(String slug)` and service mapping.
  3. Create a controller endpoint `GET /api/stories/slug/{slug}` returning `StoryResponse`.

---

## 2. Story-Level Comments Support
* **Missing Endpoint / Schema Support:** Nullable chapter dependency on Comments and a `GET /api/stories/{storyId}/comments` endpoint.
* **Frontend File:**
  - `fe/src/components/CommentSection.tsx`
  - `fe/src/views/MangaDetailView.tsx`
* **Why it is needed:**
  The frontend features a "Comments" section on the manga detail page (`MangaDetailView.tsx`), where users comment on the overall story rather than a specific chapter. In the backend, the `Comment` JPA entity defines `chapter_id` as non-nullable (`nullable = false`), forcing all comments to be associated with a `Chapter` only. There is no structural representation for story-level comments.
* **Suggested Backend Implementation:**
  1. Modify `Comment.java` to make `chapter` nullable, and add a nullable relationship to `Story`:
     ```java
     @ManyToOne(fetch = FetchType.LAZY)
     @JoinColumn(name = "story_id", nullable = true)
     private Story story;
     ```
  2. Add an endpoint `GET /api/stories/{storyId}/comments` to retrieve comments posted directly to the story.
  3. Update `CommentRequest` DTO to accept nullable `chapterId` and optional/mandatory `storyId`.

---

## 3. Comment Liking / Reaction Endpoint
* **Missing Endpoint:** `POST /api/comments/{id}/like`
* **Frontend File:**
  - `fe/src/components/CommentSection.tsx`
* **Why it is needed:**
  The frontend comment UI lets users like comments/replies and displays the likes count (`likes` in the frontend `Comment` type). The backend `Comment` entity completely lacks a `likes` count field, and there is no liking endpoint inside `CommentController.java`.
* **Suggested Backend Implementation:**
  1. Add a `likes` field to the JPA `Comment` entity:
     ```java
     @Column(name = "likes", nullable = false)
     @Builder.Default
     private Integer likes = 0;
     ```
  2. Expose `likes` inside `CommentResponse` DTO.
  3. Add `POST /api/comments/{id}/like` in `CommentController` to increment comment likes.

---

## 4. Total Rating Reviews Count
* **Missing Field / Aggregation:** Exposing the total count of ratings on the Story detail view.
* **Frontend File:**
  - `fe/src/views/MangaDetailView.tsx`
* **Why it is needed:**
  The story detail page displays the average rating alongside the total number of votes/ratings (represented by `ratingCount` in the UI). The backend offers average ratings in `StoryResponse` but does not return the count of rating votes, meaning the UI cannot display authentic statistics.
* **Suggested Backend Implementation:**
  1. Add a `ratingCount` field to `StoryResponse` DTO:
     ```java
     private Long ratingCount;
     ```
  2. Calculate and populate this count in `StoryServiceImpl` using `ratingRepository.countByStoryStoryId(storyId)`.

---

## 5. Adjacent Chapter Navigation
* **Missing Endpoint / Convenience helper:** Metadata to discover previous/next chapter IDs.
* **Frontend File:**
  - `fe/src/views/ReaderView.tsx`
* **Why it is needed:**
  When reading a chapter, users click "Chương trước" (Prev Chapter) or "Chương sau" (Next Chapter). The frontend uses relative index offsets on a local chapter array. Over an API, finding which chapter is "before" or "after" the current chapter is crucial for fluid user navigation.
* **Suggested Backend Implementation:**
  1. Add helper endpoints `GET /api/chapters/{id}/next` and `GET /api/chapters/{id}/prev` that resolve the sibling chapters in order.
  2. Alternatively, ensure the list of chapters returned by `GET /api/stories/{id}` contains sorted, complete lightweight metadata (including adjacent IDs) so the frontend can pre-compute.

---

## Recommendation & Next Steps
We have successfully documented all gaps and will pause implementation immediately as instructed. Please advise if we should proceed with:
1. Enhancing the backend database schema, entities, and controllers to address these 5 core integration requirements, OR
2. Modifying the frontend views to work within the strict existing boundaries (e.g., mapping slugs locally to numeric database IDs, only allowing comments on specific chapters, and hiding/disabling comment likes & rating counts).
