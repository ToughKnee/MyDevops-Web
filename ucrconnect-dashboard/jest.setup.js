// Extensions that Jest needs to recognize
import '@testing-library/jest-dom'

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        prefetch: jest.fn(),
        back: jest.fn(),
        forward: jest.fn(),
        refresh: jest.fn(),
        pathname: '/',
        query: {},
    }),
    usePathname: jest.fn().mockReturnValue('/'),
    useSearchParams: jest.fn().mockReturnValue(new URLSearchParams()),
    useParams: jest.fn().mockReturnValue({}),
}))

// Reset mocks before each test
beforeEach(() => {
    jest.clearAllMocks()
})

global.requestIdleCallback = (cb) => {
    return setTimeout(() => {
      cb({
        didTimeout: false,
        timeRemaining: () => 50,
      });
    }, 1);
  };
  
  global.cancelIdleCallback = (id) => {
    clearTimeout(id);
  };
  
  // Mockear IntersectionObserver
  class IntersectionObserverMock {
    constructor() {}
    observe() {}
    disconnect() {}
    unobserve() {}
  }
  
  global.IntersectionObserver = IntersectionObserverMock;
  