![banner](https://raw.githubusercontent.com/RS-labhub/content-generation-platform/master/public/og-image.png)

# Content Generation Platform
A comprehensive AI-powered platform for creating engaging social media content, professional images, contextual comments, detailed summaries, and interactive LinkedIn carousels. Transform your ideas into platform-optimized posts with advanced AI tools and multi-provider support.

## Features

### 📱 Social Media Post Generation
- **Multi-Platform Support**: Generate content for LinkedIn, X (Twitter), Reddit, Instagram, Facebook, TikTok, YouTube, Medium, Discord, and Threads
- **Custom Styling**: Apply personalized writing styles (storytelling, educational, humorous, etc.)
- **Keyword Integration**: Emphasize specific keywords naturally within your content
- **Platform Optimization**: Automatic length and tone adjustment for each platform
- **AI Provider Choice**: Switch between GROQ, Gemini, OpenAI, and Anthropic AI models

### 🎠 LinkedIn Carousel Generator *(New Feature)*
- **Interactive Carousels**: Create engaging multi-slide LinkedIn carousels
- **AI-Powered Content**: Automatically generate carousel content from your input
- **Visual Design**: Professional slide layouts optimized for LinkedIn engagement
- **Template Variety**: Multiple carousel templates and styles
- **Export Options**: Download or copy carousel content for LinkedIn publishing

### 🎨 AI Image Generation
- **Multiple AI Providers**: Choose from OpenAI DALL-E, Pollinations (free), Hugging Face, and more
- **Social Media Optimization**: Pre-configured sizes for LinkedIn posts, X (Twitter) posts, and general use
- **Custom Styles**: Select from realistic, minimalist, cartoon, cyberpunk, watercolor, pixel art, or create custom styles
- **Model Selection**: Switch between different AI models within each provider
- **Free Options**: Access high-quality image generation with free providers
- **Error Handling**: Robust proxy system with fallback error messaging

### 💬 AI Comment Generation  
- **Flexible Content Source**: Generate comments for your own posts OR paste external content from any platform
- **Multiple Personas**: Professional, casual, expert, enthusiast, or skeptical commenting styles
- **Customizable Count**: Choose from preset options (1, 3, 5, 7, 10) or specify custom count (up to 20 comments)
- **Multi-Provider Support**: Powered by GROQ, Gemini, OpenAI, and Anthropic AI models
- **Context-Aware**: Comments adapt to post content, tone, and target platform

### 📄 AI Summary Generation
- **Dual Content Mode**: Summarize generated posts OR paste your own content for summarization  
- **Real-Time Analytics**: Live word count and character count for content optimization
- **Intelligent Processing**: Advanced text analysis with key point extraction
- **Platform Agnostic**: Works with content from any social media platform or source

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
- **AI Integration**: Vercel AI SDK with multi-provider support:
  - **Text Generation**: GROQ, Gemini, OpenAI, Anthropic
  - **Image Generation**: OpenAI DALL-E, Pollinations (free), Hugging Face  
- **State Management**: React hooks with localStorage persistence
- **UI Components**: Custom components built on Radix UI primitives
- **Image Processing**: Advanced proxy system with CORS handling
- **API Architecture**: RESTful endpoints with TypeScript validation

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
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GROQ_API_KEY` | API key for GROQ Cloud (text generation) | Optional* |
| `GEMINI_API_KEY` | API key for Google Gemini (text generation) | Optional* |
| `OPENAI_API_KEY` | API key for OpenAI (text + image generation) | Optional* |
| `ANTHROPIC_API_KEY` | API key for Anthropic Claude (text generation) | Optional* |

*At least one AI provider API key is required. Free image generation providers (Pollinations, Hugging Face) work without API keys.

## Usage

### 📱 Generating Social Media Posts

1. **Select AI Provider**: Choose between GROQ (fast), Gemini (advanced), OpenAI (versatile), or Anthropic (analytical)
2. **Configure Context**:
   - Select your target platform
   - Define your custom writing style
   - Add relevant keywords (optional)
3. **Add Source Content**: Paste your blog post, notes, or any content to transform
4. **Generate**: Click "Generate Post" to create platform-optimized content
5. **Copy & Use**: Copy the generated post and publish on your chosen platform

### 🎠 Creating LinkedIn Carousels *(New)*

1. **Navigate to Carousel Section**: Access carousel generation tools
2. **Configure Carousel**:
   - **Topic/Theme**: Describe your carousel subject
   - **Slide Count**: Specify number of slides needed
   - **Style**: Choose visual and content style
3. **Generate Content**: AI creates engaging carousel content
4. **Customize**: Edit individual slides as needed
5. **Export**: Download or copy for LinkedIn publishing

### 🎨 Generating AI Images

1. **Navigate to Images Tab**: Always available for immediate use
2. **Configure Settings**:
   - **Provider**: Choose from OpenAI DALL-E, Pollinations (free), or Hugging Face
   - **Style**: Select preset styles or create custom style descriptions
   - **Size**: Pick from social media optimized sizes or standard dimensions
   - **Model**: Select specific AI models when available
3. **Create Prompt**: Describe your desired image
4. **Generate**: Create high-quality AI images
5. **Copy & Use**: Download or copy the image URL for your content

### 💬 Generating Comments

1. **Navigate to Comments Tab**: Available immediately with flexible content options
2. **Choose Content Source**:
   - **Generated Post**: Use content you created within the platform
   - **Custom Post**: Paste existing content from LinkedIn, Twitter, etc.
3. **Configure Settings**:
   - **Persona**: Select from professional, casual, expert, enthusiast, or skeptical
   - **Count**: Choose preset numbers or specify custom count (1-20)
   - **Provider**: Select AI model for generation
4. **Generate Comments**: Create contextual, engaging comments
5. **Copy & Use**: Copy individual comments for platform engagement

### 📄 Creating Summaries

1. **Navigate to Summary Tab**: Available immediately
2. **Choose Content Source**:
   - **Generated Post**: Summarize platform-generated content
   - **Custom Post**: Paste your own content for summarization
3. **Content Analytics**: View real-time word and character counts
4. **Generate Summary**: Create concise, intelligent summaries
5. **Copy & Use**: Use summaries for quick content overview

### Creating Mermaid Diagrams

1. **Choose Diagram Type**: Select from flowchart, process, workflow, mind map, timeline, or hierarchy
2. **Select AI Provider**: Choose your preferred AI model
3. **Describe Content**: Provide a description of the process or concept to visualize
4. **Generate Diagram**: Create professional Mermaid code
5. **Export Options**: Copy the code or open directly in Mermaid Live Editor

## API Reference

### Server Actions & API Routes

#### `generatePost(params)`
Generates platform-specific social media content.

**Parameters:**
- `platform`: Target social media platform
- `style`: Custom writing style
- `keywords`: Keywords to emphasize
- `content`: Source content to transform
- `provider`: AI provider ("groq" | "gemini" | "openai" | "anthropic")

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

#### `POST /api/image-generate`
Generates AI images with multiple provider support.

**Parameters:**
- `prompt`: Image description
- `provider`: Image provider ("openai" | "pollinations_free" | "huggingface")
- `style`: Style preset or custom style description
- `size`: Image dimensions
- `model`: Specific AI model
- `customStyle`: Custom style when style is "custom"

**Returns:**
```typescript
{
  success: boolean;
  imageUrl?: string;
  error?: string;
  provider: string;
}
```

#### `POST /api/comment-generate`
Creates contextual comments for social media posts.

**Parameters:**
- `content`: Post content (generated or custom)
- `persona`: Comment personality type
- `count`: Number of comments (1-20)
- `provider`: AI provider
- `platform`: Target platform
- `title`: Post title (optional)
- `link`: Post link (optional)

**Returns:**
```typescript
{
  success: boolean;
  comments?: string[];
  error?: string;
  provider: string;
}
```

#### `POST /api/proxy-image`
Proxies external image URLs with CORS handling.

**Parameters:**
- `url`: External image URL

**Returns:**
Image data or error message

#### `generateContentDiagram(params)`
Creates Mermaid diagrams from text content.

**Parameters:**
- `content`: Text content to visualize
- `diagramType`: Type of diagram to create
- `provider`: AI provider ("groq" | "gemini" | "openai" | "anthropic")

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

### 🆕 Recent Updates & New Features

#### Enhanced Content Flexibility
- **Custom Post Support**: All tools now support both generated content AND external content
- **No Barriers**: Comments and summaries work immediately without requiring post generation first
- **Seamless Switching**: Toggle between generated and custom content sources at any time

#### Advanced Image Generation
- **Multi-Provider Architecture**: Choose from premium (OpenAI) and free (Pollinations, Hugging Face) providers
- **Social Media Optimization**: Pre-configured sizes for LinkedIn (1200x675) and X posts
- **Custom Styling**: Define your own artistic styles beyond preset options
- **Smart Fallbacks**: Robust error handling with user-friendly messages

#### Intelligent Comment System
- **Custom Comment Counts**: Specify any number from 1-20 comments
- **Contextual Personas**: AI adapts to different commenting personalities
- **Universal Compatibility**: Works with content from any social media platform

#### Professional Summary Generation
- **Real-Time Analytics**: Live word and character counting
- **Flexible Input**: Works with any text content, not just generated posts
- **Smart Processing**: Advanced text analysis and key point extraction

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
- Check that at least one AI provider key is configured for text generation
- Image generation: OpenAI key required for DALL-E; free providers work without keys
- Ensure API keys have sufficient credits/quota

**Image Generation Issues**
- Try switching between providers (free options available)
- Check proxy-image errors for external URL issues  
- Verify image sizes are supported by selected provider
- For custom styles, ensure descriptions are clear and specific

**Comment Generation Problems**
- Switch between custom post and generated post modes
- Verify post content is not empty
- Try different AI providers if one fails
- Custom comment counts must be between 1-20

**Summary Generation Issues**
- Ensure post content (generated or custom) has sufficient text
- Try switching content source modes
- Check that content is meaningful and not just fragments

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

&nbsp;

## Meet the Author

<img  src="https://raw.githubusercontent.com/RS-labhub/content-generation-platform/master/public/Author.jpg" alt="Author">

<div align="center">

**Built with ❤️ by [RS-labhub](https://github.com/RS-labhub)**