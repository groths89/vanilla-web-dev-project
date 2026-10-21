import { describe, it, expect } from 'vitest';

const BASE_URL = process.env.BASE_URL;

// Runs against a deployed worker; BASE_URL must be the deployed URL.
it('BASE_URL is configured', () => {
  expect(BASE_URL, 'BASE_URL must be set for smoke tests').toBeTruthy();
});

describe.skipIf(!BASE_URL)('smoke', () => {
  it('home page responds 200 with the dashboard', async () => {
    const res = await fetch(BASE_URL);
    expect(res.status).toBe(200);
    expect(await res.text()).toContain('Vanilla Web Dev Lab');
  });

  it('stopwatch project is reachable', async () => {
    const res = await fetch(`${BASE_URL}/stopwatch-lap-tracker/`);
    expect(res.status).toBe(200);
  });
});
