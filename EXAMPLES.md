# Portfolio Backend - API Examples

Example API requests and responses for testing and integration.

## Authentication

### Sign In

```javascript
// Redirect to OAuth provider
window.location.href = '/api/auth/signin';

// Or with specific provider
window.location.href = '/api/auth/signin?provider=github';
window.location.href = '/api/auth/signin?provider=google';
```

### Get Session

```javascript
const response = await fetch('/api/auth/session', {
  credentials: 'include'
});
const session = await response.json();
console.log(session.user); // { id, email, role, ... }
```

### Sign Out

```javascript
await fetch('/api/auth/signout', {
  method: 'POST',
  credentials: 'include'
});
```

## Public API Examples

### Fetch All Projects

```javascript
async function getProjects() {
  const response = await fetch('/api/projects?page=1&limit=10&published=true');
  const { data, meta } = await response.json();
  
  console.log(`Total: ${meta.total}`);
  data.forEach(project => {
    console.log(`${project.title} - ${project.stack.join(', ')}`);
  });
}
```

### Search Projects

```javascript
async function searchProjects(query) {
  const params = new URLSearchParams({
    search: query,
    published: 'true',
    limit: '20'
  });
  
  const response = await fetch(`/api/projects?${params}`);
  const { data } = await response.json();
  return data;
}

// Usage
const results = await searchProjects('machine learning');
```

### Get Single Project

```javascript
async function getProject(slug) {
  const response = await fetch(`/api/projects/${slug}`);
  if (!response.ok) {
    throw new Error('Project not found');
  }
  const { data } = await response.json();
  return data;
}

// Usage
const project = await getProject('ai-powered-portfolio');
console.log(project.description); // Full markdown content
console.log(project.tags); // Array of tag objects
console.log(project.mediaItems); // Associated images
```

### Fetch Blog Posts with Filtering

```javascript
async function getBlogPosts(filters = {}) {
  const params = new URLSearchParams({
    page: filters.page || 1,
    limit: filters.limit || 10,
    ...(filters.tag && { tag: filters.tag }),
    ...(filters.featured !== undefined && { featured: filters.featured }),
    published: 'true'
  });
  
  const response = await fetch(`/api/blog?${params}`);
  return await response.json();
}

// Usage
const { data: posts } = await getBlogPosts({ tag: 'tutorial', limit: 5 });
```

### Increment Blog Views

```javascript
async function readBlogPost(slug) {
  // This automatically increments view count
  const response = await fetch(`/api/blog/${slug}`);
  const { data } = await response.json();
  
  console.log(`Views: ${data.views}`);
  console.log(`Reading time: ${data.readingTime} minutes`);
  
  return data;
}
```

### Get Resume

```javascript
async function getLatestResume() {
  const response = await fetch('/api/resume/latest');
  const { data } = await response.json();
  
  // Download resume
  window.open(data.pdfUrl, '_blank');
  
  return data;
}
```

### Load Lottie Animation

```javascript
async function loadLottieAnimation(name) {
  const response = await fetch(`/api/lottie/${name}`);
  const animationData = await response.json();
  
  // Use with lottie-web
  const animation = lottie.loadAnimation({
    container: document.getElementById('lottie-container'),
    renderer: 'svg',
    loop: true,
    autoplay: true,
    animationData: animationData
  });
  
  return animation;
}

// Usage
await loadLottieAnimation('loading-spinner');
```

## Admin API Examples

All admin examples require authentication. Include credentials in requests.

### Create Project

```javascript
async function createProject(projectData) {
  const response = await fetch('/api/admin/projects', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      slug: 'new-project',
      title: 'New Project',
      summary: 'Short description',
      description: '# Full Description\n\nMarkdown content...',
      stack: ['React', 'TypeScript', 'Next.js'],
      repoUrl: 'https://github.com/user/repo',
      liveUrl: 'https://example.com',
      coverImageUrl: 'https://cdn.example.com/image.png',
      published: false,
      featured: false,
      tagIds: ['tag-id-1', 'tag-id-2']
    })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error.message);
  }
  
  const { data } = await response.json();
  return data;
}
```

### Update Project

```javascript
async function updateProject(id, updates) {
  const response = await fetch(`/api/admin/projects/${id}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updates)
  });
  
  const { data } = await response.json();
  return data;
}

// Usage
await updateProject('project-id', {
  published: true,
  featured: true
});
```

### Delete Project

```javascript
async function deleteProject(id) {
  const confirmed = confirm('Are you sure you want to delete this project?');
  if (!confirmed) return;
  
  const response = await fetch(`/api/admin/projects/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  });
  
  if (response.ok) {
    console.log('Project deleted successfully');
  }
}
```

### Upload File to R2

```javascript
async function uploadFile(file, folder = 'media') {
  // Step 1: Get presigned upload URL
  const urlResponse = await fetch('/api/admin/upload-url', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      fileName: file.name,
      contentType: file.type,
      fileSize: file.size,
      folder: folder
    })
  });
  
  if (!urlResponse.ok) {
    throw new Error('Failed to get upload URL');
  }
  
  const { data: { uploadUrl, publicUrl, key } } = await urlResponse.json();
  
  // Step 2: Upload file to R2
  const uploadResponse = await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type
    }
  });
  
  if (!uploadResponse.ok) {
    throw new Error('Failed to upload file');
  }
  
  // Return the public URL to save in database
  return { publicUrl, key };
}

// Usage with file input
const fileInput = document.querySelector('input[type="file"]');
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  const { publicUrl } = await uploadFile(file, 'projects');
  console.log('File uploaded:', publicUrl);
  // Use publicUrl when creating/updating project
});
```

### Complete Upload Flow (Image for Project)

```javascript
async function createProjectWithImage(projectData, coverImageFile) {
  // 1. Upload cover image
  const { publicUrl: coverImageUrl } = await uploadFile(
    coverImageFile,
    'projects'
  );
  
  // 2. Create project with image URL
  const project = await fetch('/api/admin/projects', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...projectData,
      coverImageUrl
    })
  }).then(r => r.json()).then(r => r.data);
  
  return project;
}
```

### Create Blog Post

```javascript
async function createBlogPost(postData) {
  const response = await fetch('/api/admin/blog', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      slug: 'my-new-post',
      title: 'My New Blog Post',
      excerpt: 'A short excerpt',
      content: '# Article Title\n\nFull MDX content...',
      coverImageUrl: 'https://cdn.example.com/cover.png',
      published: false,
      publishedAt: new Date().toISOString(),
      tagIds: ['tag-id']
    })
  });
  
  const { data } = await response.json();
  return data;
}
```

### Update Theme

```javascript
async function toggleTheme(currentMode) {
  const newMode = currentMode === 'LIGHT' ? 'DARK' : 'LIGHT';
  
  const response = await fetch('/api/admin/theme', {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      mode: newMode
    })
  });
  
  const { data } = await response.json();
  return data.mode;
}
```

### Upload Resume

```javascript
async function uploadResume(pdfFile, version) {
  // 1. Upload PDF to R2
  const { publicUrl } = await uploadFile(pdfFile, 'resume');
  
  // 2. Register resume in database
  const response = await fetch('/api/admin/resume', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      pdfUrl: publicUrl,
      version: version,
      fileName: pdfFile.name,
      fileSize: pdfFile.size,
      isCurrent: true // Mark as current
    })
  });
  
  const { data } = await response.json();
  return data;
}
```

### Upload Lottie Animation

```javascript
async function uploadLottieAnimation(jsonFile, name, title) {
  // 1. Upload JSON to R2
  const { publicUrl } = await uploadFile(jsonFile, 'animations');
  
  // 2. Register animation in database
  const response = await fetch('/api/admin/lottie', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: name,
      title: title,
      description: 'Loading animation',
      jsonUrl: publicUrl,
      category: 'loading',
      fileSize: jsonFile.size
    })
  });
  
  const { data } = await response.json();
  return data;
}
```

## React Hooks Examples

### useProjects Hook

```typescript
import { useState, useEffect } from 'react';

export function useProjects(filters = {}) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState(null);
  
  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: filters.page || 1,
          limit: filters.limit || 10,
          published: 'true',
          ...(filters.tag && { tag: filters.tag })
        });
        
        const response = await fetch(`/api/projects?${params}`);
        const { data, meta } = await response.json();
        
        setProjects(data);
        setMeta(meta);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProjects();
  }, [filters.page, filters.limit, filters.tag]);
  
  return { projects, loading, error, meta };
}

// Usage
function ProjectList() {
  const { projects, loading, meta } = useProjects({ page: 1, limit: 10 });
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
      <Pagination {...meta} />
    </div>
  );
}
```

## Error Handling

```javascript
async function apiCall(endpoint, options = {}) {
  try {
    const response = await fetch(endpoint, {
      credentials: 'include',
      ...options
    });
    
    const data = await response.json();
    
    if (!data.success) {
      // Handle API error
      throw new Error(data.error.message);
    }
    
    return data.data;
  } catch (error) {
    // Handle network error
    console.error('API Error:', error);
    throw error;
  }
}

// Usage
try {
  const projects = await apiCall('/api/projects');
  console.log(projects);
} catch (error) {
  alert(`Error: ${error.message}`);
}
```

## Rate Limit Handling

```javascript
async function fetchWithRetry(url, options = {}, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    const response = await fetch(url, options);
    
    if (response.status === 429) {
      // Rate limited
      const retryAfter = response.headers.get('Retry-After');
      const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 1000 * (i + 1);
      
      console.log(`Rate limited. Retrying in ${waitTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      continue;
    }
    
    return response;
  }
  
  throw new Error('Max retries exceeded');
}
```

---

For more examples, see the [API Documentation](./API_DOCUMENTATION.md).
