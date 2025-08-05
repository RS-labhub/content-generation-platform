![banner](https://raw.githubusercontent.com/RS-labhub/content-generation-platform/master/public/og-image.png)

# Content Posting Platform
A powerful AI-driven platform for generating platform-specific social media posts and Mermaid diagrams. Transform your content into optimized posts for LinkedIn, Twitter, Instagram, and more, while creating professional diagrams to visualize processes and workflows.

## Features

### Social Media Post Generation
- **Multi-Platform Support**: Generate content for LinkedIn, X (Twitter), Reddit, Instagram, Facebook, TikTok, YouTube, Medium, Discord, and Threads
- **Custom Styling**: Apply personalized writing styles (storytelling, educational, humorous, etc.)
- **Keyword Integration**: Emphasize specific keywords naturally within your content
- **Platform Optimization**: Automatic length and tone adjustment for each platform
- **AI Provider Choice**: Switch between GROQ and Gemini AI models

### Mermaid Diagram Generation
- **Multiple Diagram Types**: Create flowcharts, process diagrams, workflows, mind maps, timelines, and hierarchies
- **Content-Based Generation**: Transform any text content into visual diagrams
- **Live Editor Integration**: Direct links to Mermaid Live Editor for further customization
- **Professional Output**: Clean, properly formatted Mermaid code ready for documentation

### User Experience
- **Real-time Saving**: Automatic local storage of your work
- **Mobile Responsive**: Optimized for all device sizes
- **Copy Functionality**: One-click copying with visual feedback
- **Tabbed Interface**: Clean separation between post generation and diagram creation
- **Resource Links**: Quick access to Mermaid documentation and tools

## Technology Stack

- **Frontend**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with shadcn/ui components
- **AI Integration**: Vercel AI SDK with GROQ and Gemini providers
- **State Management**: React hooks with localStorage persistence
- **UI Components**: Custom components built on Radix UI primitives

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager
- API keys for GROQ and/or Gemini

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/content-posting-platform.git
cd content-posting-platform
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Add your API keys to `.env.local`:
```
GROQ_API_KEY=your_groq_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GROQ_API_KEY` | API key for GROQ Cloud | Optional* |
| `GEMINI_API_KEY` | API key for Google Gemini | Optional* |

*At least one AI provider API key is required for the application to function.

## Usage

### Generating Social Media Posts

1. **Select AI Provider**: Choose between GROQ (fast inference) or Gemini (advanced reasoning)
2. **Configure Context**:
   - Select your target platform
   - Define your custom writing style
   - Add relevant keywords (optional)
3. **Add Source Content**: Paste your blog post, notes, or any content to transform
4. **Generate**: Click "Generate Post" to create platform-optimized content
5. **Copy & Use**: Copy the generated post and publish on your chosen platform

### Creating Mermaid Diagrams

1. **Choose Diagram Type**: Select from flowchart, process, workflow, mind map, timeline, or hierarchy
2. **Select AI Provider**: Choose your preferred AI model
3. **Describe Content**: Provide a description of the process or concept to visualize
4. **Generate Diagram**: Create professional Mermaid code
5. **Export Options**: Copy the code or open directly in Mermaid Live Editor

## API Reference

### Server Actions

#### `generatePost(params)`
Generates platform-specific social media content.

**Parameters:**
- `platform`: Target social media platform
- `style`: Custom writing style
- `keywords`: Keywords to emphasize
- `content`: Source content to transform
- `provider`: AI provider ("groq" | "gemini")

**Returns:**
```typescript
{
  success: boolean;
  post?: string;
  error?: string;
  provider: string;
  timestamp: string;
}
```

#### `generateContentDiagram(params)`
Creates Mermaid diagrams from text content.

**Parameters:**
- `content`: Text content to visualize
- `diagramType`: Type of diagram to create
- `provider`: AI provider ("groq" | "gemini")

**Returns:**
```typescript
{
  success: boolean;
  diagram?: string;
  error?: string;
  provider: string;
}
```

## Platform Guidelines

### Supported Platforms

| Platform | Max Length | Tone | Special Features |
|----------|------------|------|------------------|
| LinkedIn | 1300 chars | Professional | Hashtags, engagement focus |
| X (Twitter) | 280 chars | Concise | Punchy, impactful |
| Reddit | Moderate | Conversational | Subreddit-appropriate |
| Instagram | 2200 chars | Visual | Hashtag-heavy |
| Facebook | 500-600 chars | Community | Discussion-focused |
| TikTok | 150 chars | Trendy | Trending hashtags |
| YouTube | 1000 chars | Informative | Timestamps, links |
| Medium | Comprehensive | Thoughtful | Article format |
| Discord | 2000 chars | Casual | Community chat |
| Threads | 500 chars | Conversational | Authentic tone |

## Contributing

We welcome contributions to improve the Content Posting Platform! Here's how you can help:

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Code Style

- Use TypeScript for type safety
- Follow the existing code formatting (Prettier configuration included)
- Write meaningful commit messages
- Add comments for complex logic
- Ensure mobile responsiveness for UI changes

### Testing

Before submitting a PR:
- Test with both AI providers
- Verify mobile responsiveness
- Test diagram generation with various content types
- Ensure all platforms generate appropriate content

## Troubleshooting

### Common Issues

**API Key Errors**
- Verify your API keys are correctly set in environment variables
- Check that at least one AI provider key is configured
- Ensure API keys have sufficient credits/quota

**Diagram Generation Issues**
- Try switching between AI providers
- Simplify your content description
- Check the Mermaid Live Editor link for syntax validation

**Mobile Display Problems**
- Clear browser cache and localStorage
- Ensure you're using a supported browser
- Check for JavaScript errors in browser console

### Getting Help

- Check existing GitHub issues
- Create a new issue with detailed reproduction steps
- Include browser information and error messages
- Provide example content that causes issues

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## Roadmap

### Upcoming Features
- Content scheduling and calendar integration
- Team collaboration features
- Content templates and presets
- Analytics and performance tracking
- Bulk content generation
- Additional diagram types and customization
- Dark mode support
- Offline functionality and PWA support

### Long-term Goals
- Multi-language support
- Advanced content analytics
- Integration with major social media APIs
- Custom AI model training
- Enterprise features and SSO
- Mobile app development

&nbsp;

## Meet the Author

<img  src="https://raw.githubusercontent.com/RS-labhub/content-generation-platform/master/public/Author.jpg" alt="Author">

<div align="center">

**Built with ❤️ by [RS-labhub](https://github.com/RS-labhub)**