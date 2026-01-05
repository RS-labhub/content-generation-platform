# Contributing to Content Generation Platform

Thank you for your interest in contributing to the Content Generation Platform! This document provides comprehensive guidelines for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Development Guidelines](#development-guidelines)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [API Documentation](#api-documentation)
- [Platform Guidelines](#platform-guidelines)
- [Feature Updates](#feature-updates)
- [Troubleshooting Development](#troubleshooting-development)

## Code of Conduct

We are committed to providing a welcoming and inspiring community for all. Please be respectful and constructive in all interactions.

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- Git for version control
- At least one AI provider API key (GROQ, Gemini, OpenAI, or Anthropic)
- Code editor (VS Code recommended)

### First-Time Setup

1. Fork the repository on GitHub
2. Clone your forked repository:
```bash
git clone https://github.com/YOUR_USERNAME/content-generation-platform.git
cd content-generation-platform
```

3. Add upstream remote:
```bash
git remote add upstream https://github.com/RS-labhub/content-generation-platform.git
```

4. Install dependencies:
```bash
npm install
```

5. Create environment file:
```bash
cp .env.example .env.local
```

6. Add your API keys to `.env.local`

7. Start development server:
```bash
npm run dev
```

## Development Setup

### Environment Variables

Required environment variables for full functionality:

```env
# Text Generation (at least one required)
GROQ_API_KEY=your_groq_api_key
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key

# Optional: For specific features
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
```

## Project Structure

```
content-generation-platform/
├── app/                      # Next.js app directory
│   ├── actions/             # Server actions
│   ├── api/                 # API routes
│   ├── carousel-designer/   # Carousel designer page
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   ├── carousel-designer.tsx
│   ├── custom-palette-creator.tsx
│   ├── floating-notepad.tsx
│   ├── help-dialog.tsx
│   └── ...
├── lib/                     # Utility functions
│   ├── ai-providers.ts      # AI provider configurations
│   ├── carousel-designer-types.ts
│   ├── utils.ts
│   └── ...
├── public/                  # Static assets
└── sample-data/            # Sample data files
```

## Development Guidelines

### Code Style

1. **TypeScript**: Use TypeScript for all new code
   - Define proper types and interfaces
   - Avoid `any` type when possible
   - Use type inference where appropriate

2. **React Components**:
   - Use functional components with hooks
   - Implement proper prop types
   - Use `"use client"` directive when needed
   - Keep components focused and single-purpose

3. **Naming Conventions**:
   - Components: PascalCase (e.g., `CarouselDesigner`)
   - Functions: camelCase (e.g., `generatePost`)
   - Constants: UPPER_SNAKE_CASE (e.g., `API_ENDPOINT`)
   - Files: kebab-case for utilities, PascalCase for components

4. **File Organization**:
   - Group related functionality
   - Keep files under 500 lines when possible
   - Extract reusable logic into utilities
   - Use barrel exports for cleaner imports

### Styling Guidelines

1. **Tailwind CSS**:
   - Use Tailwind utility classes
   - Follow mobile-first approach
   - Use design system tokens (colors, spacing)
   - Group related classes logically

2. **Component Styling**:
   - Use `cn()` utility for conditional classes
   - Maintain consistent spacing and sizing
   - Ensure dark mode compatibility
   - Test responsive behavior

3. **Accessibility**:
   - Include proper ARIA labels
   - Ensure keyboard navigation works
   - Maintain color contrast ratios
   - Test with screen readers

### State Management

1. **Local State**: Use `useState` for component-local state
2. **Shared State**: Use Context API or prop drilling for shared state
3. **Persistence**: Use localStorage for user preferences
4. **Server State**: Use server actions for data mutations

### Error Handling

1. **API Errors**:
   - Return structured error responses
   - Include helpful error messages
   - Log errors appropriately
   - Handle edge cases

2. **Client Errors**:
   - Use try-catch blocks
   - Display user-friendly error messages
   - Provide recovery options
   - Log errors to console in development

## Testing Guidelines

### Before Submitting PR

1. **Functionality Testing**:
   - Test with all supported AI providers
   - Verify each platform generates appropriate content
   - Test image generation with different providers
   - Test comment generation with various personas
   - Verify diagram generation with different types

2. **UI/UX Testing**:
   - Test on mobile devices (or responsive mode)
   - Verify dark mode compatibility
   - Check all interactive elements
   - Ensure loading states are visible
   - Test keyboard navigation

3. **Browser Testing**:
   - Chrome/Edge (Chromium)
   - Firefox
   - Safari (if possible)

4. **Performance Testing**:
   - Check build succeeds without errors
   - Verify no console errors in production build
   - Test with slow network conditions

## Pull Request Process

### Creating a Pull Request

1. **Branch Naming**:
   - Feature: `feature/description`
   - Bug fix: `fix/description`
   - Documentation: `docs/description`

2. **Commit Messages**:
   - Use clear, descriptive messages
   - Start with verb (Add, Fix, Update, Remove)
   - Reference issues when applicable
   - Example: `Add carousel template selector component`

3. **PR Description**:
   - Describe what changes were made
   - Explain why changes were necessary
   - List any breaking changes
   - Include screenshots for UI changes
   - Reference related issues

4. **Before Submitting**:
   - Sync with upstream main branch
   - Resolve any conflicts
   - Run linter: `npm run lint`
   - Test thoroughly
   - Update documentation if needed

### PR Review Process

1. Maintainers will review your PR
2. Address any requested changes
3. Once approved, PR will be merged
4. Your contribution will be acknowledged

## API Documentation

### Server Actions

#### `generatePost(params)`

Generates platform-specific social media content.

**Parameters:**
```typescript
{
  platform: string;        // Target platform
  style: string;          // Writing style
  keywords: string;       // Keywords to emphasize
  content: string;        // Source content
  provider: AIProvider;   // AI provider
}
```

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

#### `generateLinkedInCarousel(params)`

Generates LinkedIn carousel content.

**Parameters:**
```typescript
{
  topic: string;          // Carousel topic
  slideCount: number;     // Number of slides
  style: string;          // Content style
  provider: AIProvider;   // AI provider
}
```

**Returns:**
```typescript
{
  success: boolean;
  slides?: Array<{
    title: string;
    content: string;
    keyPoints: string[];
  }>;
  error?: string;
}
```

### API Routes

#### `POST /api/image-generate`

Generates AI images with multiple provider support.

**Request Body:**
```typescript
{
  prompt: string;
  provider: "openai" | "pollinations_free" | "huggingface";
  style?: string;
  size?: string;
  model?: string;
  customStyle?: string;
}
```

**Response:**
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

**Request Body:**
```typescript
{
  content: string;
  persona: "professional" | "casual" | "expert" | "enthusiast" | "skeptical";
  count: number;          // 1-20
  provider: AIProvider;
  platform?: string;
  title?: string;
  link?: string;
}
```

**Response:**
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

**Request Body:**
```typescript
{
  url: string;           // External image URL
}
```

**Response:**
Image data or error message

#### `generateContentDiagram(params)`

Creates Mermaid diagrams from text content.

**Parameters:**
```typescript
{
  content: string;
  diagramType: "flowchart" | "process" | "workflow" | "mindmap" | "timeline" | "hierarchy";
  provider: AIProvider;
}
```

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

### Writing Style Presets

- **Storytelling**: Narrative-driven, engaging
- **Educational**: Informative, clear
- **Humorous**: Light-hearted, entertaining
- **Professional**: Formal, business-focused
- **Inspirational**: Motivational, uplifting
- **Technical**: Detailed, precise

## Feature Updates

### Recent Enhancements

#### Carousel Designer
- 50+ professional templates
- Interactive canvas with drag-and-drop
- Advanced design tools (shapes, images, text)
- Grouping and alignment features
- Custom color palettes with harmony generator
- Floating notepad for content planning
- Keyboard shortcuts for efficiency
- Export as PNG or PDF

#### Content Flexibility
- Custom post support across all tools
- Comments and summaries work without post generation
- Seamless content source switching

#### Image Generation
- Multiple provider architecture
- Free provider options (Pollinations, Hugging Face)
- Social media optimized sizes
- Custom styling capabilities
- Smart error handling with fallbacks

#### Comment System
- Custom comment counts (1-20)
- Multiple commenting personas
- Universal platform compatibility
- Context-aware responses

#### Summary Generation
- Real-time character and word counting
- Flexible input from any source
- Intelligent key point extraction
- Platform-agnostic processing

## Troubleshooting Development

### Common Development Issues

**Build Errors**
- Clear `.next` directory: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Node.js version compatibility
- Verify TypeScript configuration

**API Issues**
- Verify environment variables are set correctly
- Check API key validity and quotas
- Test with different AI providers
- Review network requests in browser DevTools

**Styling Issues**
- Clear Tailwind cache
- Verify Tailwind configuration
- Check for conflicting CSS classes
- Test in different browsers

**State Management Issues**
- Clear localStorage: `localStorage.clear()`
- Check React DevTools for state
- Verify proper hook usage
- Review component lifecycle

### Getting Help

If you encounter issues:
1. Check existing GitHub issues
2. Search documentation and code comments
3. Create a detailed issue with:
   - Steps to reproduce
   - Expected vs actual behavior
   - Browser and environment details
   - Relevant code snippets
   - Error messages and logs

## Questions?

Feel free to:
- Open an issue for bugs or feature requests
- Start a discussion for questions or ideas
- Reach out to maintainers for guidance

Thank you for contributing to the Content Generation Platform!
