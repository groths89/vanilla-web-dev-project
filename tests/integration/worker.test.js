import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { startWorker, stopWorker, LOCAL_URL } from '../helpers/worker.js';

let worker;

beforeAll(async () => {
  worker = await startWorker();
}, 120_000);

afterAll(() => stopWorker(worker));

describe('worker (wrangler dev)', () => {
  it('GET / renders the dashboard', async () => {
    const res = await fetch(LOCAL_URL);
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('text/html');
    expect(await res.text()).toContain('Stopwatch Lap Tracker');
  });

  it('serves the project static files', async () => {
    for (const [file, type] of [
      ['index.html', 'text/html'],
      ['script.js', 'javascript'],
      ['style.css', 'text/css'],
      ['screen.png', 'image/png'],
    ]) {
      const res = await fetch(`${LOCAL_URL}/stopwatch-lap-tracker/${file}`);
      expect(res.status, file).toBe(200);
      expect(res.headers.get('content-type'), file).toContain(type);
    }
  });

  it('redirects a project path without a trailing slash so relative assets resolve', async () => {
    const res = await fetch(`${LOCAL_URL}/stopwatch-lap-tracker`, { redirect: 'manual' });
    expect(res.status).toBe(301);
    expect(new URL(res.headers.get('location')).pathname).toBe('/stopwatch-lap-tracker/');
  });

  it('returns 404 for unknown routes', async () => {
    const res = await fetch(`${LOCAL_URL}/does-not-exist`);
    expect(res.status).toBe(404);
  });
});
