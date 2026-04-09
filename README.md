# StudyHub (Student Online Resource Sharing Platform) 🎓

**StudyHub** is a premium, collaborative platform designed for students to share, discover, and organize educational resources. Whether it's lecture notes, research papers, or technical blog posts, StudyHub provides a unified space for institutional knowledge sharing.

---

## ✨ Key Features

### 📄 Comprehensive Resource Management
- **Multi-File Support**: Upload multiple attachments (PDFs, PPTs, DOCX, etc.) per resource with individual previews and batch downloads.
- **Document Previews**: Built-in viewer for documents and slides powered by Google Docs Viewer.
- **Smart Categorization**: Organise content by Subjects (OS, DBMS, Java) or Categories (File/Blog).

### ✍️ Premium Blog Authoring
- **Tiptap-Powered Editor**: A rich, real-time authoring experience with standard formatting and advanced features.
- **Developer-Focused Code Blocks**: 
  - Real-time syntax highlighting for 100+ languages via `lowlight`.
  - Custom **Filename Labels** and **Technology Icons** (JavaScript, Python, React, etc.).
  - One-click **Copy to Clipboard** with success feedback.
- **Image Integration**: Direct ImageKit integration for blog thumbnails and inline images.

### 🌐 Advanced SEO & Metadata
- **Dynamic Sitemaps**: Automatically generated `sitemap.xml` that updates as new resources are publically shared.
- **Metadata Optimization**: Page-specific titles, descriptions, and OpenGraph/Twitter card previews.
- **Robots.txt**: Perfectly configured for search engine crawlers.

### 👥 Collaboration & Identity
- **Better Auth Integration**: Secure social and email-based authentication.
- **Institutional Affiliation**: Track and filter resources by College/University.
- **Social Interactions**: Like, comment, and save your favorite resources to your personal collection.
- **User Profiles**: Manage your personal student identity and display your shared knowledge.

---

## 🛠️ Tech Stack
- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS 4
- **Styling**: Shadcn UI, Tabler Icons, Lucide
- **Database**: Drizzle ORM + Neon (PostgreSQL)
- **Authentication**: Better Auth
- **Storage**: ImageKit.io
- **Content Engine**: Tiptap Editor, Highlight.js, Lowlight

---

## 🚀 Getting Started

### 1. Requirements
- Node.js 20+
- PNPM or Bun
- PostgreSQL database (Neon recommended)
- ImageKit.io account

### 2. Environment Variables
Create a `.env` file in the root directory:
```bash
DATABASE_URL=
BETTER_AUTH_SECRET=
NEXT_PUBLIC_APP_URL=https://resource.kishore-sv.me
IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_URL_ENDPOINT=
```

### 3. Installation
```bash
bun install
```

### 4. Database Setup
```bash
npx drizzle-kit push
```

### 5. Start Development
```bash
bun run dev
```

---

## 🎯 Project Goals
StudyHub aims to bridge the gap between classroom learning and peer-to-peer knowledge sharing, providing a high-performance, SEO-optimized platform for the modern student.
