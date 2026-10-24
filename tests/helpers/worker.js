import { spawn } from 'node:child_process';

export const PORT = 8787;
export const LOCAL_URL = `http://127.0.0.1:${PORT}`;

// Starts `wrangler dev` and resolves once the worker answers requests.
export async function startWorker() {
  const child = spawn('npx', ['wrangler', 'dev', '--local', '--port', String(PORT), '--ip', '127.0.0.1'], {
    shell: true,
    stdio: 'inherit',
    detached: process.platform !== 'win32',
  });

  const deadline = Date.now() + 90_000;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(LOCAL_URL);
      if (res.status < 500) return child;
    } catch {
      // not up yet
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  stopWorker(child);
  throw new Error('wrangler dev did not start in time');
}

export function stopWorker(child) {
  if (!child) return;
  if (process.platform === 'win32') {
    spawn('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore' });
  } else {
    // Kill the whole process group so wrangler/workerd don't outlive the shell.
    try {
      process.kill(-child.pid, 'SIGKILL');
    } catch {
      child.kill('SIGKILL');
    }
  }
}
