const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Path to Next.js app
  dir: "./",
});

// Custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    // Module aliases
    "^@/app/(.*)$": "<rootDir>/src/app/$1",
    "^@/components/(.*)$": "<rootDir>/src/app/components/$1",
    "^@/lib/(.*)$": "<rootDir>/src/lib/$1",
  },
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
    "!<rootDir>/.next/**",
    "!<rootDir>/coverage/**",
    "!<rootDir>/dist/**",
    "!<rootDir>/*.config.js",
    "!<rootDir>/src/app/api/**", // Excluding API routes
    "!<rootDir>/src/middleware.ts",
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  // Next.js 13+ specific files
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
  testMatch: [
    "**/__tests__/**/*.{js,jsx,ts,tsx}",
    "**/*.{spec,test}.{js,jsx,ts,tsx}",
  ],
};

module.exports = createJestConfig(customJestConfig);
