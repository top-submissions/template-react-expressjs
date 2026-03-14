import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest with jest-dom matchers
expect.extend(matchers);

// Clean up DOM after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

/**
 * Global Browser API Mocks.
 */

// Mock localStorage
const createLocalStorageMock = () => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = String(value);
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    key: (index) => Object.keys(store)[index] || null,
    get length() {
      return Object.keys(store).length;
    },
  };
};

if (typeof window !== 'undefined') {
  // Initialize localStorage
  Object.defineProperty(window, 'localStorage', {
    value: createLocalStorageMock(),
    writable: true,
    configurable: true,
  });

  // Mock global fetch
  global.fetch = vi.fn();

  // Mock window.location methods to prevent navigation errors
  Object.defineProperty(window, 'location', {
    value: {
      reload: vi.fn(),
      assign: vi.fn(),
      replace: vi.fn(),
    },
    writable: true,
  });
}

// React Router Navigation & Errors
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: vi.fn(() => vi.fn()),
    useRouteError: vi.fn(),
    Navigate: vi.fn(() => null),
  };
});
