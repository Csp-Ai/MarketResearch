# AI Agent Market Research Frontend

A React-based frontend for AI agent market research and chatbot management.

## Features

- **Chatbot Management**: Create, edit, and manage AI chatbots
- **Business Integration**: Connect chatbots with business data
- **Conversation History**: Track and view chatbot conversations
- **Chatbot Sharing**: Share chatbots via direct links, embed codes, and QR codes

## Chatbot Sharing Features

### Direct Link Sharing
Users can share their chatbots using direct links in the format:
```
https://yourapp.com/chat/{chatbotId}
```

### Embedding in Websites
Chatbots can be embedded in external websites using iframe:

```html
<iframe src="https://yourapp.com/embed/{chatbotId}" width="350" height="500" frameborder="0"></iframe>
```

Or using the embed script:

```html
<script src="https://yourapp.com/embed.js"></script>
<script>
  ChatbotEmbed.init('{chatbotId}', {
    position: 'bottom-right',
    theme: 'light',
    width: 350,
    height: 500
  });
</script>
```

### QR Code Sharing
QR codes are automatically generated for easy mobile sharing.

## Development

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# API Configuration
VITE_AGENTIAL_API=http://localhost:8000  # For local development
# VITE_AGENTIAL_API=https://your-live-api.com  # For production

# Legacy scraper API (used by useAnalysis hook)
VITE_scraper_api_base_url=http://localhost:8000
```

### Running the Development Server
```bash
npm run dev
```

### Building for Production
```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── chatbot/
│   │   ├── ChatbotPreview.tsx      # Main chatbot interface
│   │   ├── ConversationHistory.tsx  # Chat history viewer
│   │   ├── EmbeddableChatbot.tsx   # Embeddable chatbot component
│   │   └── SharingControls.tsx     # Sharing options UI
│   └── ...
├── pages/
│   ├── Chatbots.tsx                # Main chatbots management page
│   ├── PublicChatbot.tsx           # Public chatbot access page
│   └── ...
└── ...
```

## API Endpoints

- `GET /chat/{chatbotId}` - Public chatbot access
- `GET /embed/{chatbotId}` - Embeddable chatbot interface
- `POST /api/chat` - Chat message processing

## Technologies Used

- React 18
- TypeScript
- Tailwind CSS
- Supabase (Backend)
- Lucide React (Icons)
- React Router DOM
