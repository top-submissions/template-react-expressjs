import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

afterEach(() => {
  cleanup();
});

/**
 * Creates a mock implementation of localStorage for testing
 * @returns {Object} Mock localStorage with all standard methods
 */
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
  Object.defineProperty(window, 'localStorage', {
    value: createLocalStorageMock(),
    writable: true,
    configurable: true,
  });
}
