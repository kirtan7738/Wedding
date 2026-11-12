import { defineConfig, devices } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:4173';
const mobile = (w, h) => ({
  viewport: { width: w, height: h },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
  userAgent: devices['Pixel 7'].userAgent,
});

export default defineConfig({
  testDir: './e2e',
  timeout: 45_000,
  fullyParallel: true,
  workers: 4, // animation timing tests flake under heavier CPU contention
  reporter: [['list']],
  use: { baseURL: BASE_URL, trace: 'retain-on-failure' },
  projects: [
    { name: 'm390', use: { ...devices['Desktop Chrome'], ...mobile(390, 844) } },
    { name: 'm360', use: { ...devices['Desktop Chrome'], ...mobile(360, 740) } },
    { name: 'm430', use: { ...devices['Desktop Chrome'], ...mobile(430, 932) } },
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    {
      name: 'nowebgl',
      use: { ...devices['Desktop Chrome'], ...mobile(390, 844), launchOptions: { args: ['--disable-webgl', '--disable-3d-apis'] } },
    },
    { name: 'reduced', use: { ...devices['Desktop Chrome'], ...mobile(390, 844), reducedMotion: 'reduce' } },
  ],
  webServer: process.env.BASE_URL
    ? undefined
    : { command: 'npm run build && npx vite preview --port 4173 --strictPort', url: BASE_URL, reuseExistingServer: !process.env.CI, timeout: 180_000 },
});
