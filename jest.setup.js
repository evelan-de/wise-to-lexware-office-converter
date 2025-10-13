// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Use fake timers for tests that need them
jest.useFakeTimers();

// Mock window.URL.createObjectURL and revokeObjectURL for download tests
global.URL.createObjectURL = jest.fn(() => 'mock-url');
global.URL.revokeObjectURL = jest.fn();

// Mock Blob for download tests
global.Blob = function MockBlob(parts, options) {
  this.parts = parts;
  this.options = options;
};

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};
