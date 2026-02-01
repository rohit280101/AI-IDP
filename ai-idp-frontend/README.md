# AI-IDP Frontend

This is the frontend application for the AI-IDP project, which interacts with the backend APIs to manage document uploads and processing.

## Project Structure

```
ai-idp-frontend
├── src
│   ├── components
│   │   ├── DocumentUpload.tsx
│   │   ├── DocumentList.tsx
│   │   └── ProcessingStatus.tsx
│   ├── pages
│   │   ├── Home.tsx
│   │   ├── Documents.tsx
│   │   └── Dashboard.tsx
│   ├── services
│   │   ├── api.ts
│   │   └── documentService.ts
│   ├── types
│   │   └── index.ts
│   ├── App.tsx
│   └── main.tsx
├── public
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd ai-idp-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the application:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000` to view the application.

## Features

- **Document Upload:** Users can upload documents through the `DocumentUpload` component.
- **Document List:** The `DocumentList` component displays all uploaded documents.
- **Processing Status:** The `ProcessingStatus` component shows the current status of document processing.
- **Dashboard:** Provides an overview of the application and document processing statistics.

## Development

- The application is built using React and TypeScript.
- Components are organized in the `src/components` directory.
- API interactions are handled in the `src/services` directory.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.