# API Reference

Complete API documentation for the Portfolio Backend.

## Base URL

- **Development**: `http://localhost:3000/api`
- **Production**: `https://your-domain.vercel.app/api`

## Authentication

Admin endpoints require authentication via NextAuth session. Include credentials in requests:

```javascript
fetch('/api/admin/projects', {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json'
  }
})
```

## Rate Limits

| Endpoint Type | Limit |
|--------------|-------|
| Public API | 10 requests / 10 seconds |
| Admin API | 100 requests / minute |
| Contact Form | 3 submissions / hour |
| Auth | 5 requests / minute |

Rate limit headers are returned with each response:
- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`

## Projects

### List Projects (Public)

```http
GET /api/projects
```

**Query Parameters:**
- `page` (number, default: 1): Page number
- `limit` (number, default: 10, max: 100): Items per page
- `published` (boolean): Filter by published status
- `featured` (boolean): Filter by featured status
- `tag` (string): Filter by tag slug
- `search` (string): Search in title, summary, description

**Example:**
```bash
curl "https://api.example.com/api/projects?page=1&limit=10&published=true&featured=true"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx...",
      "slug": "ai-powered-portfolio",
      "title": "AI-Powered Portfolio",
      "summary": "A next-generation portfolio platform",
      "description": "Full markdown content...",
      "stack": ["Next.js", "TypeScript", "Prisma"],
      "repoUrl": "https://github.com/...",
      "liveUrl": "https://...",
      "coverImageUrl": "https://...",
      "metrics": {
        "stars": 45,
        "forks": 12,
        "views": 1230
      },
      "published": true,
      "featured": true,
      "displayOrder": 1,
      "createdAt": "2024-11-01T00:00:00Z",
      "updatedAt": "2024-11-01T00:00:00Z",
      "tags": [
        {
          "id": "clx...",
          "name": "React",
          "slug": "react",
          "color": "#61DAFB"
        }
      ],
      "_count": {
        "mediaItems": 5
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "totalPages": 2
  }
}
```

### Get Single Project (Public)

```http
GET /api/projects/[slug]
```

**Example:**
```bash
curl "https://api.example.com/api/projects/ai-powered-portfolio"
```

### Create Project (Admin)

```http
POST /api/admin/projects
```

**Request Body:**
```json
{
  "slug": "new-project",
  "title": "New Project",
  "summary": "Short description",
  "description": "Full markdown content",
  "stack": ["React", "Node.js"],
  "repoUrl": "https://github.com/...",
  "liveUrl": "https://...",
  "coverImageUrl": "https://...",
  "metrics": {
    "stars": 0,
    "forks": 0
  },
  "published": false,
  "featured": false,
  "displayOrder": 0,
  "tagIds": ["clx...", "clx..."]
}
```

### Update Project (Admin)

```http
PATCH /api/admin/projects/[id]
```

**Request Body:** (all fields optional)
```json
{
  "title": "Updated Title",
  "published": true
}
```

### Delete Project (Admin)

```http
DELETE /api/admin/projects/[id]
```

## Blog Posts

### List Blog Posts (Public)

```http
GET /api/blog
```

**Query Parameters:**
- `page`, `limit`, `published`, `featured`, `tag`, `search` (same as projects)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx...",
      "slug": "building-scalable-apps",
      "title": "Building Scalable Next.js Apps",
      "excerpt": "Learn best practices...",
      "coverImageUrl": "https://...",
      "published": true,
      "featured": true,
      "readingTime": 8,
      "views": 1234,
      "publishedAt": "2024-11-01T00:00:00Z",
      "createdAt": "2024-11-01T00:00:00Z",
      "updatedAt": "2024-11-01T00:00:00Z",
      "tags": [...]
    }
  ],
  "meta": { ... }
}
```

### Get Single Blog Post (Public)

```http
GET /api/blog/[slug]
```

**Note:** This endpoint increments the view count automatically.

**Response includes full content:**
```json
{
  "success": true,
  "data": {
    "id": "clx...",
    "content": "# Full MDX Content\n\n...",
    // ... other fields
  }
}
```

### Create Blog Post (Admin)

```http
POST /api/admin/blog
```

**Request Body:**
```json
{
  "slug": "new-post",
  "title": "New Blog Post",
  "excerpt": "Short excerpt",
  "content": "Full MDX content",
  "coverImageUrl": "https://...",
  "published": false,
  "featured": false,
  "readingTime": 5,
  "publishedAt": "2024-11-08T00:00:00Z",
  "tagIds": ["clx..."]
}
```

**Note:** If `readingTime` is not provided, it will be calculated automatically from content.

### Update Blog Post (Admin)

```http
PATCH /api/admin/blog/[id]
```

### Delete Blog Post (Admin)

```http
DELETE /api/admin/blog/[id]
```

## Research Papers

### List Research Papers (Public)

```http
GET /api/research
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx...",
      "title": "Efficient Neural Architecture Search",
      "venue": "ICML 2024",
      "year": 2024,
      "abstract": "We propose a novel...",
      "pdfUrl": "https://...",
      "doi": "10.1000/...",
      "bibtex": "@inproceedings{...}",
      "authors": ["Abhay Soni", "..."],
      "keywords": ["NAS", "Deep Learning"],
      "citedBy": 15,
      "createdAt": "2024-11-01T00:00:00Z"
    }
  ]
}
```

## Certifications

### List Certifications (Public)

```http
GET /api/certifications
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx...",
      "title": "AWS Solutions Architect",
      "issuer": "Amazon Web Services",
      "credentialId": "AWS-...",
      "credentialUrl": "https://...",
      "issuedOn": "2024-06-15T00:00:00Z",
      "expiresOn": null,
      "summary": "Advanced AWS certification",
      "imageUrl": "https://...",
      "skills": ["AWS", "Cloud", "DevOps"],
      "createdAt": "2024-11-01T00:00:00Z"
    }
  ]
}
```

## Achievements

### List Achievements (Public)

```http
GET /api/achievements
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx...",
      "title": "Best Paper Award - ICML 2024",
      "organization": "ICML",
      "year": 2024,
      "summary": "Received Best Paper Award...",
      "link": "https://...",
      "imageUrl": "https://...",
      "type": "award",
      "createdAt": "2024-11-01T00:00:00Z"
    }
  ]
}
```

## Gallery / Media Items

### List Media Items (Public)

```http
GET /api/gallery?category=project&projectId=clx...
```

**Query Parameters:**
- `category` (string, optional): Filter by category
- `projectId` (string, optional): Filter by project

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx...",
      "title": "Dashboard Screenshot",
      "description": "Main view",
      "takenAt": "2024-10-01T00:00:00Z",
      "imageUrl": "https://...",
      "thumbnailUrl": "https://...",
      "altText": "Dashboard view",
      "projectId": "clx...",
      "category": "project",
      "createdAt": "2024-11-01T00:00:00Z",
      "project": {
        "id": "clx...",
        "title": "Project Name",
        "slug": "project-slug"
      }
    }
  ]
}
```

## Resume

### Get Latest Resume (Public)

```http
GET /api/resume/latest
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clx...",
    "pdfUrl": "https://...",
    "version": "2024-v1",
    "fileName": "abhay-soni-resume.pdf",
    "fileSize": 245678,
    "isCurrent": true,
    "createdAt": "2024-11-01T00:00:00Z"
  }
}
```

### Upload New Resume (Admin)

```http
POST /api/admin/resume
```

**Request Body:**
```json
{
  "pdfUrl": "https://...",
  "version": "2024-v2",
  "fileName": "resume.pdf",
  "fileSize": 250000,
  "isCurrent": true
}
```

**Note:** Setting `isCurrent: true` automatically marks all other resumes as not current.

## Theme Preferences

### Get Theme (Public/Authenticated)

```http
GET /api/theme
```

**Response (not authenticated):**
```json
{
  "success": true,
  "data": {
    "mode": "LIGHT"
  }
}
```

**Response (authenticated):**
```json
{
  "success": true,
  "data": {
    "mode": "DARK"
  }
}
```

### Update Theme (Admin)

```http
PATCH /api/admin/theme
```

**Request Body:**
```json
{
  "mode": "DARK"
}
```

**Allowed values:** `"LIGHT"` or `"DARK"`

## Lottie Animations

### Get Animation (Public)

```http
GET /api/lottie/[name]
```

**Example:**
```bash
curl "https://api.example.com/api/lottie/loading-spinner"
```

**Response:** Raw Lottie JSON
```json
{
  "v": "5.5.7",
  "fr": 30,
  "ip": 0,
  "op": 90,
  "w": 500,
  "h": 500,
  "assets": [],
  "layers": [...]
}
```

### Upload Animation (Admin)

```http
POST /api/admin/lottie
```

**Request Body:**
```json
{
  "name": "loading-spinner",
  "title": "Loading Spinner",
  "description": "Animated loading indicator",
  "jsonUrl": "https://...",
  "category": "loading",
  "fileSize": 15432
}
```

### Delete Animation (Admin)

```http
DELETE /api/admin/lottie/[name]
```

## File Upload

### Get Presigned Upload URL (Admin)

```http
POST /api/admin/upload-url
```

**Request Body:**
```json
{
  "fileName": "image.png",
  "contentType": "image/png",
  "fileSize": 1048576,
  "folder": "projects"
}
```

**Allowed folders:** `media`, `resume`, `animations`, `projects`, `blog`, `certifications`

**Response:**
```json
{
  "success": true,
  "data": {
    "uploadUrl": "https://r2.../presigned-url",
    "publicUrl": "https://cdn.../path/to/file.png",
    "key": "projects/12345-abc-image.png",
    "expiresIn": 3600
  }
}
```

**Upload Flow:**
1. Get presigned URL from API
2. Upload file directly to R2 using the `uploadUrl` (PUT request)
3. Save the `publicUrl` in your database

**Example Upload:**
```javascript
// 1. Get presigned URL
const { uploadUrl, publicUrl } = await fetch('/api/admin/upload-url', {
  method: 'POST',
  body: JSON.stringify({
    fileName: file.name,
    contentType: file.type,
    fileSize: file.size,
    folder: 'projects'
  })
}).then(r => r.json()).then(r => r.data);

// 2. Upload file to R2
await fetch(uploadUrl, {
  method: 'PUT',
  body: file,
  headers: { 'Content-Type': file.type }
});

// 3. Use publicUrl in your project/blog/etc
```

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "message": "Human-readable error message",
    "code": "ERROR_CODE",
    "details": { /* optional additional info */ }
  }
}
```

**Common Error Codes:**
- `UNAUTHORIZED` (401): Authentication required
- `FORBIDDEN` (403): Insufficient permissions
- `NOT_FOUND` (404): Resource not found
- `CONFLICT` (409): Resource already exists
- `VALIDATION_ERROR` (400): Invalid input
- `INTERNAL_ERROR` (500): Server error

**Validation Error Example:**
```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": [
      {
        "code": "too_small",
        "minimum": 1,
        "path": ["title"],
        "message": "String must contain at least 1 character(s)"
      }
    ]
  }
}
```

## Webhook Events (Future)

Contact form submissions can be configured to send webhooks to external services (e.g., Slack, Discord).

---

For more examples and integration guides, see the main [README.md](./README.md).
