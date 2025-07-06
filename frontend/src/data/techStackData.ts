// frontend/src/data/techStackData.ts

export interface TechOption {
  name: string;
  description: string;
  popularity: 'high' | 'medium' | 'low';
  latestVersion?: string;
}

export interface TechCategory {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
  options: TechOption[];
}

export const TECH_CATEGORIES: TechCategory[] = [
  {
    id: 'styling',
    name: 'Styling',
    emoji: '🎨',
    color: '#EF4444', // Red
    description: 'CSS frameworks, preprocessors, and styling solutions',
    options: [
      {
        name: 'Tailwind CSS',
        description: 'Utility-first CSS framework for rapid UI development',
        popularity: 'high',
        latestVersion: '3.4.0'
      },
      {
        name: 'Bootstrap',
        description: 'Popular CSS framework with pre-built components',
        popularity: 'high',
        latestVersion: '5.3.0'
      },
      {
        name: 'Styled Components',
        description: 'CSS-in-JS library for styling React components',
        popularity: 'high',
        latestVersion: '6.1.0'
      },
      {
        name: 'Emotion',
        description: 'Performant and flexible CSS-in-JS library',
        popularity: 'medium',
        latestVersion: '11.11.0'
      },
      {
        name: 'Sass/SCSS',
        description: 'CSS preprocessor with variables, nesting, and mixins',
        popularity: 'high',
        latestVersion: '1.69.0'
      },
      {
        name: 'Less',
        description: 'Dynamic CSS preprocessor with variables and functions',
        popularity: 'medium',
        latestVersion: '4.2.0'
      },
      {
        name: 'Bulma',
        description: 'Modern CSS framework based on Flexbox',
        popularity: 'medium',
        latestVersion: '0.9.4'
      },
      {
        name: 'DaisyUI',
        description: 'Semantic component classes for Tailwind CSS',
        popularity: 'medium',
        latestVersion: '4.12.0'
      },
      {
        name: 'Chakra UI',
        description: 'Modular and accessible component library for React',
        popularity: 'high',
        latestVersion: '2.8.0'
      }
    ]
  },
  {
    id: 'database',
    name: 'Database',
    emoji: '🗄️',
    color: '#3B82F6', // Blue
    description: 'Database systems and data storage solutions',
    options: [
      {
        name: 'MongoDB',
        description: 'NoSQL document database with flexible schema',
        popularity: 'high',
        latestVersion: '7.0'
      },
      {
        name: 'PostgreSQL',
        description: 'Advanced open-source relational database',
        popularity: 'high',
        latestVersion: '16.0'
      },
      {
        name: 'MySQL',
        description: 'Popular open-source relational database',
        popularity: 'high',
        latestVersion: '8.2'
      },
      {
        name: 'Redis',
        description: 'In-memory data structure store for caching',
        popularity: 'high',
        latestVersion: '7.2'
      },
      {
        name: 'SQLite',
        description: 'Lightweight file-based SQL database',
        popularity: 'medium',
        latestVersion: '3.44'
      },
      {
        name: 'Supabase',
        description: 'Open-source Firebase alternative with PostgreSQL',
        popularity: 'high',
        latestVersion: '2.38'
      },
      {
        name: 'Firebase',
        description: 'Google\'s NoSQL cloud database with real-time sync',
        popularity: 'high',
        latestVersion: '10.7'
      },
      {
        name: 'PlanetScale',
        description: 'Serverless MySQL platform with branching',
        popularity: 'medium',
        latestVersion: 'Cloud'
      },
      {
        name: 'Prisma',
        description: 'Next-generation ORM for Node.js and TypeScript',
        popularity: 'high',
        latestVersion: '5.7'
      },
      {
        name: 'Drizzle ORM',
        description: 'Lightweight TypeScript ORM with full type safety',
        popularity: 'medium',
        latestVersion: '0.29'
      }
    ]
  },
  {
    id: 'framework',
    name: 'Framework',
    emoji: '🚀',
    color: '#10B981', // Green
    description: 'Frontend and backend frameworks',
    options: [
      {
        name: 'React',
        description: 'Popular JavaScript library for building user interfaces',
        popularity: 'high',
        latestVersion: '18.2'
      },
      {
        name: 'Next.js',
        description: 'Full-stack React framework with SSR and SSG',
        popularity: 'high',
        latestVersion: '14.0'
      },
      {
        name: 'Vue.js',
        description: 'Progressive JavaScript framework for UIs',
        popularity: 'high',
        latestVersion: '3.3'
      },
      {
        name: 'Nuxt.js',
        description: 'Full-stack Vue.js framework',
        popularity: 'medium',
        latestVersion: '3.8'
      },
      {
        name: 'Angular',
        description: 'TypeScript-based web application framework by Google',
        popularity: 'high',
        latestVersion: '17.0'
      },
      {
        name: 'Svelte',
        description: 'Compile-time framework with no virtual DOM',
        popularity: 'medium',
        latestVersion: '4.2'
      },
      {
        name: 'SvelteKit',
        description: 'Full-stack framework for building Svelte apps',
        popularity: 'medium',
        latestVersion: '1.27'
      },
      {
        name: 'Express.js',
        description: 'Fast, minimalist web framework for Node.js',
        popularity: 'high',
        latestVersion: '4.18'
      },
      {
        name: 'Fastify',
        description: 'Fast and low overhead web framework for Node.js',
        popularity: 'medium',
        latestVersion: '4.24'
      },
      {
        name: 'NestJS',
        description: 'Progressive Node.js framework for building scalable server-side applications',
        popularity: 'high',
        latestVersion: '10.2'
      }
    ]
  },
  {
    id: 'runtime',
    name: 'Runtime',
    emoji: '⚡',
    color: '#F59E0B', // Yellow
    description: 'JavaScript runtimes and execution environments',
    options: [
      {
        name: 'Node.js',
        description: 'JavaScript runtime built on Chrome\'s V8 engine',
        popularity: 'high',
        latestVersion: '21.2'
      },
      {
        name: 'Deno',
        description: 'Secure runtime for JavaScript and TypeScript',
        popularity: 'medium',
        latestVersion: '1.38'
      },
      {
        name: 'Bun',
        description: 'Fast all-in-one JavaScript runtime and toolkit',
        popularity: 'medium',
        latestVersion: '1.0'
      },
      {
        name: 'Cloudflare Workers',
        description: 'Serverless execution environment at the edge',
        popularity: 'medium',
        latestVersion: 'Cloud'
      },
      {
        name: 'AWS Lambda',
        description: 'Serverless compute service by Amazon',
        popularity: 'high',
        latestVersion: 'Cloud'
      },
      {
        name: 'Vercel Functions',
        description: 'Serverless functions on Vercel platform',
        popularity: 'high',
        latestVersion: 'Cloud'
      }
    ]
  },
  {
    id: 'deployment',
    name: 'Deployment',
    emoji: '🌐',
    color: '#8B5CF6', // Purple
    description: 'Hosting platforms and deployment services',
    options: [
      {
        name: 'Vercel',
        description: 'Frontend cloud platform for static sites and serverless functions',
        popularity: 'high',
        latestVersion: 'Cloud'
      },
      {
        name: 'Netlify',
        description: 'Platform for deploying and hosting modern web projects',
        popularity: 'high',
        latestVersion: 'Cloud'
      },
      {
        name: 'AWS',
        description: 'Amazon Web Services cloud platform',
        popularity: 'high',
        latestVersion: 'Cloud'
      },
      {
        name: 'Digital Ocean',
        description: 'Cloud infrastructure provider for developers',
        popularity: 'medium',
        latestVersion: 'Cloud'
      },
      {
        name: 'Railway',
        description: 'Simple deployment platform for full-stack applications',
        popularity: 'medium',
        latestVersion: 'Cloud'
      },
      {
        name: 'Render',
        description: 'Cloud platform for hosting web apps and databases',
        popularity: 'medium',
        latestVersion: 'Cloud'
      }
    ]
  },
  {
    id: 'testing',
    name: 'Testing',
    emoji: '🧪',
    color: '#EC4899', // Pink
    description: 'Testing frameworks and tools',
    options: [
      {
        name: 'Jest',
        description: 'JavaScript testing framework with built-in mocking',
        popularity: 'high',
        latestVersion: '29.7'
      },
      {
        name: 'Vitest',
        description: 'Fast unit testing framework powered by Vite',
        popularity: 'high',
        latestVersion: '1.0'
      },
      {
        name: 'Cypress',
        description: 'End-to-end testing framework for web applications',
        popularity: 'high',
        latestVersion: '13.6'
      },
      {
        name: 'Playwright',
        description: 'Cross-browser automation library for testing',
        popularity: 'high',
        latestVersion: '1.40'
      },
      {
        name: 'React Testing Library',
        description: 'Testing utilities for React components',
        popularity: 'high',
        latestVersion: '14.1'
      }
    ]
  },
  {
    id: 'tooling',
    name: 'Tooling',
    emoji: '🔧',
    color: '#14B8A6', // Teal
    description: 'Development tools and build systems',
    options: [
      {
        name: 'Vite',
        description: 'Fast build tool and development server',
        popularity: 'high',
        latestVersion: '5.0'
      },
      {
        name: 'Webpack',
        description: 'Module bundler for JavaScript applications',
        popularity: 'high',
        latestVersion: '5.89'
      },
      {
        name: 'TypeScript',
        description: 'Typed superset of JavaScript',
        popularity: 'high',
        latestVersion: '5.3'
      },
      {
        name: 'ESLint',
        description: 'Linting utility for JavaScript and TypeScript',
        popularity: 'high',
        latestVersion: '8.55'
      },
      {
        name: 'Prettier',
        description: 'Code formatter for consistent style',
        popularity: 'high',
        latestVersion: '3.1'
      }
    ]
  }
];

export const PACKAGE_CATEGORIES: TechCategory[] = [
  {
    id: 'ui',
    name: 'UI Components',
    emoji: '🎛️',
    color: '#EF4444',
    description: 'Component libraries and UI frameworks',
    options: [
      {
        name: 'Material-UI',
        description: 'React components implementing Material Design',
        popularity: 'high',
        latestVersion: '5.15'
      },
      {
        name: 'Ant Design',
        description: 'Enterprise-class UI design language for React',
        popularity: 'high',
        latestVersion: '5.12'
      },
      {
        name: 'React Bootstrap',
        description: 'Bootstrap components for React',
        popularity: 'medium',
        latestVersion: '2.9'
      },
      {
        name: 'Mantine',
        description: 'Full-featured React components and hooks library',
        popularity: 'medium',
        latestVersion: '7.3'
      }
    ]
  },
  {
    id: 'state',
    name: 'State Management',
    emoji: '🗂️',
    color: '#3B82F6',
    description: 'State management libraries and tools',
    options: [
      {
        name: 'Redux Toolkit',
        description: 'Official toolset for efficient Redux development',
        popularity: 'high',
        latestVersion: '2.0'
      },
      {
        name: 'Zustand',
        description: 'Small, fast state management solution',
        popularity: 'high',
        latestVersion: '4.4'
      },
      {
        name: 'Jotai',
        description: 'Atomic approach to global React state management',
        popularity: 'medium',
        latestVersion: '2.6'
      },
      {
        name: 'Recoil',
        description: 'Experimental state management library by Facebook',
        popularity: 'medium',
        latestVersion: '0.7'
      }
    ]
  },
  {
    id: 'routing',
    name: 'Routing',
    emoji: '🗺️',
    color: '#10B981',
    description: 'Client-side routing solutions',
    options: [
      {
        name: 'React Router',
        description: 'Declarative routing for React applications',
        popularity: 'high',
        latestVersion: '6.20'
      },
      {
        name: 'Next.js Router',
        description: 'Built-in file-system based routing for Next.js',
        popularity: 'high',
        latestVersion: '14.0'
      },
      {
        name: 'Reach Router',
        description: 'Accessible router (now merged into React Router)',
        popularity: 'low',
        latestVersion: '1.3'
      }
    ]
  },
  {
    id: 'api',
    name: 'API & Data Fetching',
    emoji: '🔌',
    color: '#F59E0B',
    description: 'Libraries for API calls and data fetching',
    options: [
      {
        name: 'React Query',
        description: 'Data fetching and caching library for React',
        popularity: 'high',
        latestVersion: '5.8'
      },
      {
        name: 'Axios',
        description: 'Promise-based HTTP client for JavaScript',
        popularity: 'high',
        latestVersion: '1.6'
      },
      {
        name: 'SWR',
        description: 'Data fetching library with caching and revalidation',
        popularity: 'medium',
        latestVersion: '2.2'
      },
      {
        name: 'Apollo Client',
        description: 'Comprehensive GraphQL client with caching',
        popularity: 'medium',
        latestVersion: '3.8'
      }
    ]
  },
  {
    id: 'forms',
    name: 'Forms',
    emoji: '📝',
    color: '#8B5CF6',
    description: 'Form handling and validation libraries',
    options: [
      {
        name: 'React Hook Form',
        description: 'Performant, flexible forms with easy validation',
        popularity: 'high',
        latestVersion: '7.48'
      },
      {
        name: 'Formik',
        description: 'Build forms in React without tears',
        popularity: 'medium',
        latestVersion: '2.4'
      },
      {
        name: 'Yup',
        description: 'JavaScript schema validation library',
        popularity: 'high',
        latestVersion: '1.4'
      }
    ]
  },
  {
    id: 'animation',
    name: 'Animation',
    emoji: '✨',
    color: '#EC4899',
    description: 'Animation and motion libraries',
    options: [
      {
        name: 'Framer Motion',
        description: 'Production-ready motion library for React',
        popularity: 'high',
        latestVersion: '10.16'
      },
      {
        name: 'React Spring',
        description: 'Spring-physics based animation library',
        popularity: 'medium',
        latestVersion: '9.7'
      },
      {
        name: 'Lottie React',
        description: 'Render After Effects animations in React',
        popularity: 'medium',
        latestVersion: '2.4'
      }
    ]
  },
  {
    id: 'utility',
    name: 'Utility',
    emoji: '🛠️',
    color: '#14B8A6',
    description: 'Utility libraries and helpers',
    options: [
      {
        name: 'Lodash',
        description: 'Utility library delivering modularity and performance',
        popularity: 'high',
        latestVersion: '4.17'
      },
      {
        name: 'Date-fns',
        description: 'Modern JavaScript date utility library',
        popularity: 'high',
        latestVersion: '2.30'
      },
      {
        name: 'Moment.js',
        description: 'Parse, validate, manipulate, and display dates',
        popularity: 'medium',
        latestVersion: '2.29'
      },
      {
        name: 'Ramda',
        description: 'Functional programming library for JavaScript',
        popularity: 'medium',
        latestVersion: '0.29'
      }
    ]
  }
];