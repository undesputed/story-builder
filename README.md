# Story Generation UI

A modern Next.js app for collecting employee stories about AI-driven work transformation through a conversational interview flow. The experience combines a chat-style interface, structured story capture, generation controls, and a story poster preview.

## Features

- Conversational interview flow for gathering identity and story details
- Multi-step story collection for:
  - before / after / value / next
- Story preview panel that updates as the user answers questions
- Generation controls modal for customizing tone, length, focus, and version
- Save and reject/regenerate workflow
- History page for viewing saved stories
- Light/dark theme toggle
- Bilingual UI text for English and Japanese

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- shadcn-style UI components
- Lucide icons
- Vercel Analytics

## Project Structure

```text
app/
  layout.tsx
  page.tsx
  globals.css
  history/page.tsx
components/
  chat-interface.tsx
  dashboard.tsx
  generation-controls-modal.tsx
  story-form.tsx
  story-interview.tsx
  story-poster-display.tsx
  story-poster.tsx
  theme-provider.tsx
  theme-toggle.tsx
  ui/
lib/
  utils.ts
public/
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm

### Install dependencies

```bash
pnpm install
```

### Run locally

```bash
pnpm dev
```

Then open http://localhost:3000.

### Build for production

```bash
pnpm build
```

## Notes

- The current version uses client-side state and local storage for saved stories.
- The interview flow is currently simulated on the frontend and can be connected to a real backend or AI API later.
- The app includes a theme toggle and responsive UI styling for both light and dark modes.

- AWS S3 / Vercel Blob for file storage
- Auth middleware for user-specific stories

## 📝 Notes

- **UI Only**: No actual LLM integration (simulated responses)
- **Mock Data**: All AI responses are template-based
- **Client-Side Storage**: localStorage (replace for production)
- **Mobile Responsive**: Optimized for desktop, adapts to tablet/mobile
- **Light Theme Default**: Respects system preference (prefers-color-scheme)

## 🛠️ Tech Stack

- **Next.js 16** - Framework (App Router, Turbopack)
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **shadcn/ui** - UI components
- **Lucide Icons** - Icons
- **localStorage** - Data persistence (client-side)

## 🎓 Usage Example

1. Visit `http://localhost:3000`
2. Follow AI prompts through chat
3. Type responses naturally
4. Answer all questions (auto-saves)
5. When complete → Generation Controls modal
6. Adjust sliders and select version
7. Click "Generate Story"
8. Review poster on right panel
9. Save or Reject & Regenerate
10. View history at `/history`

## 🚀 Next Steps

1. Integrate real LLM (OpenAI, Claude, etc.)
2. Add backend API for data persistence
3. Implement user authentication
4. Add file upload (profile photos)
5. Create admin dashboard for story moderation
6. Add export functionality (PDF posters)
7. Implement multi-language support
8. Build analytics dashboard

---

**Built with v0 by Vercel** — [v0.app](https://v0.app)
