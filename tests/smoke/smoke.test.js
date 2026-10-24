import { describe, it, expect } from 'vitest';

const RAW_BASE_URL = process.env.BASE_URL;

function parseBaseUrl(value) {
  try {
    const url = new URL(value);
    return /^https?:$/.test(url.protocol) ? url.origin : undefined;
  } catch {
    return undefined;
  }
}

const BASE_URL = parseBaseUrl(RAW_BASE_URL);

// Runs against a deployed worker; BASE_URL must be the deployed URL.
it('BASE_URL is configured', () => {
  expect(
    BASE_URL,
    `BASE_URL must be an absolute http(s) URL (e.g. https://name.account.workers.dev), got: ${JSON.stringify(RAW_BASE_URL)}`
  ).toBeTruthy();
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
