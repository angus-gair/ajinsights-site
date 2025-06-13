// Add custom jest matchers for DOM testing
import '@testing-library/jest-dom';

// Mock next/router
global.jest = jest; // Make sure Jest is available in the global scope

// Mock next/router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: {},
      asPath: '',
      push: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(() => Promise.resolve()),
      beforePopState: jest.fn(() => null),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    };
  },
}));

// Mock next/head
jest.mock('next/head', () => {
  return {
    __esModule: true,
    default: ({ children }: { children: Array<React.ReactElement> }) => {
      return <>{children}</>;
    },
  };
});

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href, ...rest }: any) => {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  };
});

// Global mocks
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
);

// Mock console methods to keep test output clean
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  // Suppress specific warnings
  const suppressedErrors = [
    /Warning: React does not recognize the `%s` prop on a DOM element/, // Suppress styled-components warnings
    /Warning: An update to %s inside a test was not wrapped in act/, // Suppress act warnings
  ];

  const error = console.error;
  console.error = (...args) => {
    if (suppressedErrors.some((pattern) => pattern.test(args[0]))) {
      return;
    }
    originalConsoleError.apply(console, args);
  };

  const warn = console.warn;
  console.warn = (...args) => {
    if (suppressedErrors.some((pattern) => pattern.test(args[0]))) {
      return;
    }
    originalConsoleWarn.apply(console, args);
  };
});

afterAll(() => {
  // Restore original console methods
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// Add TypeScript support for expect extensions
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveTextContent(text: string): R;
      toHaveAttribute(attr: string, value?: string): R;
      toBeVisible(): R;
      toBeEnabled(): R;
      toBeDisabled(): R;
      toBeChecked(): R;
      toHaveClass(...classNames: string[]): R;
      toHaveStyle(css: string): R;
      toHaveValue(value: string | string[] | number): R;
    }
  }
}
