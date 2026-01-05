![banner](https://raw.githubusercontent.com/RS-labhub/content-generation-platform/master/public/og-image.png)

# Content Generation Platform

A comprehensive AI-powered platform for creating engaging social media content, professional carousels, AI-generated images, contextual comments, and detailed summaries. Transform your ideas into platform-optimized content with advanced AI tools and multi-provider support.

## Featured Tool: LinkedIn Carousel Designer

**[Launch Carousel Designer](https://content-generation-platform.vercel.app/carousel-designer)**

Create stunning, professional LinkedIn carousels with our advanced visual designer:
- **Interactive Canvas**: Drag, resize, and arrange elements with precision
- **Rich Design Tools**: Custom backgrounds, gradients, patterns, shapes, images, and text
- **Professional Templates**: 50+ pre-designed templates across multiple categories
- **AI-Powered Content**: Generate carousel content automatically from your input
- **Advanced Features**: Grouping, alignment, layers panel, custom color palettes
- **Export Options**: Download as PNG or PDF for LinkedIn publishing
- **Keyboard Shortcuts**: Efficient workflow with copy, paste, duplicate, and group controls
- **Floating Notepad**: Keep track of your content ideas while designing

## Core Features

### Social Media Post Generation
- Multi-platform support (LinkedIn, X, Reddit, Instagram, Facebook, TikTok, YouTube, Medium, Discord, Threads)
- Custom writing styles and keyword integration
- Platform-optimized content with automatic length adjustment
- Multiple AI providers (GROQ, Gemini, OpenAI, Anthropic)

### AI Image Generation
- Multiple providers including OpenAI DALL-E, Pollinations (free), and Hugging Face
- Social media optimized sizes for LinkedIn, X, and general use
- Custom styles: realistic, minimalist, cartoon, cyberpunk, watercolor, pixel art
- No API key required for free providers

### AI Comment Generation  
- Generate comments for your posts or external content
- Multiple personas: professional, casual, expert, enthusiast, skeptical
- Customizable count (1-20 comments)
- Context-aware responses adapted to platform and tone

### AI Summary Generation
- Summarize generated posts or custom content
- Real-time word and character count
- Intelligent key point extraction
- Works with content from any source

### Mermaid Diagram Generation
- Create flowcharts, process diagrams, workflows, mind maps, timelines
- Transform text into visual diagrams
- Direct integration with Mermaid Live Editor
- Professional output ready for documentation

## Technology Stack

- **Frontend**: Next.js 15 with App Router, React, TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **AI Integration**: Vercel AI SDK
  - Text: GROQ, Gemini, OpenAI, Anthropic
  - Images: OpenAI DALL-E, Pollinations, Hugging Face
- **State Management**: React hooks with localStorage
- **UI Components**: Radix UI primitives

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- At least one AI provider API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/RS-labhub/content-generation-platform.git
cd content-generation-platform
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

## Quick Usage Guide

### Creating LinkedIn Carousels

1. Visit the [Carousel Designer](https://content-generation-platform.vercel.app/carousel-designer)
2. Choose a template or start from scratch
3. Customize your slides with text, shapes, and images
4. Use AI to generate content or add your own
5. Export as PNG or PDF for LinkedIn

### Generating Social Media Posts

1. Select your AI provider and target platform
2. Configure your writing style and keywords
3. Add source content to transform
4. Generate platform-optimized posts
5. Copy and publish to your chosen platform

### Creating AI Images

1. Choose provider (free options available)
2. Select style and size
3. Write your image prompt
4. Generate and download

### Generating Comments

1. Paste post content or use generated posts
2. Select persona and comment count
3. Choose AI provider
4. Generate contextual comments
5. Copy and use for engagement

## Platform Support

| Platform | Max Length | Tone |
|----------|------------|------|
| LinkedIn | 1300 chars | Professional |
| X (Twitter) | 280 chars | Concise |
| Reddit | Moderate | Conversational |
| Instagram | 2200 chars | Visual-focused |
| Facebook | 500-600 chars | Community |
| TikTok | 150 chars | Trendy |
| YouTube | 1000 chars | Informative |
| Medium | Comprehensive | Thoughtful |
| Discord | 2000 chars | Casual |
| Threads | 500 chars | Conversational |

## Contributing

We welcome contributions! Please read our [Contributing Guidelines](https://github.com/RS-labhub/content-generation-platform/blob/master/CONTRIBUTING.md) for details on our code of conduct and development process.

## Troubleshooting

### API Key Errors
- Verify API keys in environment variables
- Ensure keys have sufficient credits/quota
- At least one provider key required for text generation

### Image Generation Issues
- Try free providers (Pollinations, Hugging Face)
- Switch between available providers
- Verify image sizes are supported

### Comment/Summary Problems
- Switch between content source modes
- Try different AI providers
- Ensure content is not empty

For more help, check existing [GitHub issues](https://github.com/RS-labhub/content-generation-platform/issues) or create a new one.

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/RS-labhub/content-generation-platform/blob/master/LICENSE) file for details.

&nbsp;

## Meet the Author

<img src="https://raw.githubusercontent.com/RS-labhub/content-generation-platform/master/public/Author.jpg" alt="Author">

<div align="center">

**Built with 💔 by [Rohan Sharma](https://github.com/RS-labhub)**

[Portfolio](https://rohan-sharma-portfolio.vercel.app/) | [GitHub](https://github.com/RS-labhub) | [LinkedIn](https://www.linkedin.com/in/rohan-sharma-9386rs/)

</div>