# AI-IDP Frontend

Production-quality React + TypeScript frontend for the AI-Powered Intelligent Document Processing platform.

## Tech Stack

- **React 18** - Modern React with functional components and hooks
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Axios** - HTTP client for API communication
- **React Router** - Client-side routing

## Architecture

This application follows a clean architecture with strict separation of concerns:

### Directory Structure

```
src/
├── components/         # Reusable UI components
│   ├── DocumentUpload.tsx
│   ├── DocumentList.tsx
│   ├── ProcessingStatus.tsx
│   └── SemanticSearch.tsx
├── pages/             # Route-level components
│   ├── Home.tsx
│   ├── Documents.tsx
│   └── Dashboard.tsx
├── services/          # API service layer (NO Axios in components!)
│   ├── api.ts
│   ├── documentService.ts
│   └── searchService.ts
├── types/             # TypeScript interfaces
│   └── index.ts
├── App.tsx            # Main app with routing
└── main.tsx           # Entry point
```

### Architectural Principles

1. **No direct API calls in components** - All HTTP requests go through the services layer
2. **Components are presentation-focused** - Business logic lives in services
3. **TypeScript everywhere** - Strict typing for all API responses and props
4. **Loading, success, and error states** - Comprehensive state management
5. **Clean, readable code** - Production-quality standards

## Features

### 📄 Document Management
- **PDF-only upload** with validation
- **Upload progress tracking** with visual feedback
- **Real-time status updates** (Uploaded → Processing → Completed)
- **Automatic classification** using AI

### 🔍 Semantic Search
- **Natural language queries** across all processed documents
- **Ranked results** by semantic similarity
- **Configurable result limits** (5, 10, 20, 50)
- **Prepared for future enhancements** (text highlighting, previews)

### 📊 Dashboard
- **Statistics overview** (total, completed, processing, failed)
- **Integrated search interface**
- **Document details** with classifications

## Backend API

The frontend communicates with a FastAPI backend at:
- Base URL: `http://localhost:8000/api/v1`

### Endpoints Used

1. **Upload Document**
   - `POST /documents/upload`
   - multipart/form-data with PDF file

2. **Get Documents**
   - `GET /documents`
   - Returns array of all documents

3. **Get Document Status**
   - `GET /documents/{id}`
   - Returns status and classification

4. **Semantic Search**
   - `POST /search`
   - Body: `{ query: string, limit: number }`
   - Returns: `{ results: number[] }`

## Setup Instructions

### Prerequisites

- Node.js 16+ and npm/yarn
- Backend API running on `http://localhost:8000`

### Installation

```bash
# Install dependencies
npm install
# or
yarn install
```

### Configuration

Create a `.env` file (copy from `.env.example`):

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

### Development

```bash
# Start development server
npm run dev
# or
yarn dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
# Build for production
npm run build
# or
yarn build
```

### Preview Production Build

```bash
# Preview production build
npm run serve
# or
yarn serve
```

## Component Details

### DocumentUpload
- Accepts only PDF files
- Shows upload progress with percentage
- Displays success/error feedback
- Triggers refresh of document list on success
- Validates file type before upload

### DocumentList
- Displays all uploaded documents in a table
- Shows status badges (Uploaded, Processing, Completed, Failed)
- Displays classification when available
- Auto-refreshes when document status changes
- Clickable rows for document selection

### ProcessingStatus
- Polls document status every 3 seconds
- Visual timeline (Uploaded → Processing → Done)
- Stops polling when completed or failed
- Shows classification when available
- Clean status indicators with color coding

### SemanticSearch
- Natural language search input
- Configurable result limit
- Displays ranked document IDs
- Loading and empty states
- Prepared for future text highlighting

## Code Quality

This codebase follows production standards:

- ✅ **TypeScript strict mode** - All types explicitly defined
- ✅ **No any types** - Proper typing throughout
- ✅ **Error handling** - Comprehensive try-catch with user feedback
- ✅ **Loading states** - Visual feedback for all async operations
- ✅ **Clean separation** - Services, components, and pages clearly separated
- ✅ **Reusability** - Components accept props for flexible usage
- ✅ **Performance** - Avoiding unnecessary re-renders with proper hooks
- ✅ **Accessibility** - Semantic HTML and clear labels

## Troubleshooting

### CORS Errors
Make sure your backend has CORS enabled for `http://localhost:5173`

### API Connection Issues
1. Check backend is running on port 8000
2. Verify `.env` file has correct `VITE_API_BASE_URL`
3. Check browser console for detailed error messages

### Upload Failures
- Ensure file is a valid PDF
- Check file size limits on backend
- Verify backend has write permissions to upload directory

## License

This project is licensed under the MIT License.