import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/styles/theme';
import { NextIntlProvider } from 'next-intl';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import { NextRouter } from 'next/router';

// Mock router for testing
const mockRouter: NextRouter = {
  route: '/',
  pathname: '/',
  query: {},
  asPath: '/',
  push: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
  back: jest.fn(),
  prefetch: jest.fn().mockResolvedValue(undefined),
  beforePopState: jest.fn(),
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  isFallback: false,
  basePath: '',
  isReady: true,
  isPreview: false,
  isLocaleDomain: false,
};

// Custom render function with all the providers
const customRender = (
  ui: ReactElement,
  {
    locale = 'en',
    router = mockRouter,
    ...renderOptions
  }: {
    locale?: string;
    router?: Partial<NextRouter>;
  } & Omit<RenderOptions, 'queries'> = {}
) => {
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <RouterContext.Provider value={{ ...mockRouter, ...router }}>
      <NextIntlProvider
        locale={locale}
        messages={require(`@/messages/${locale}.json`)}
      >
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </NextIntlProvider>
    </RouterContext.Provider>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// Re-export everything from @testing-library/react
export * from '@testing-library/react';

// Override render method
export { customRender as render };

// Mock next/head
export const mockNextHead = (metaTags: Record<string, string>) => {
  const meta = document.createElement('meta');
  Object.entries(metaTags).forEach(([key, value]) => {
    meta.setAttribute(key, value);
  });
  document.head.appendChild(meta);
  return meta;
};

// Mock next/router
export const mockRouterPush = jest.fn();
export const mockRouterReplace = jest.fn();

export const createMockRouter = (overrides: Partial<NextRouter> = {}): NextRouter => ({
  ...mockRouter,
  ...overrides,
});

// Mock fetch responses
export const mockFetchResponse = (response: any, status = 200) => {
  const mockJsonPromise = Promise.resolve(response);
  const mockFetchPromise = Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => mockJsonPromise,
  });
  
  global.fetch = jest.fn().mockImplementation(() => mockFetchPromise);
  return { mockJsonPromise, mockFetchPromise };
};

// Mock localStorage
export const mockLocalStorage = () => {
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value.toString();
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
    };
  })();

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
  });

  return localStorageMock;
};

// Mock sessionStorage
export const mockSessionStorage = () => {
  const sessionStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value.toString();
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
    };
  })();

  Object.defineProperty(window, 'sessionStorage', {
    value: sessionStorageMock,
    writable: true,
  });

  return sessionStorageMock;
};
