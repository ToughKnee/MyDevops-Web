/// <reference types="@testing-library/jest-dom" />

declare global {
  namespace jest {
    interface Matchers<R, T> {
      toBeInTheDocument(): R;
      toHaveAttribute(attr: string, value?: string): R;
    }
  }
}

declare module '@testing-library/jest-dom' {} 