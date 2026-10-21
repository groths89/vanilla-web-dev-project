import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import ejs from 'ejs';

const root = path.resolve(__dirname, '../..');
const template = readFileSync(path.join(root, 'views/index.ejs'), 'utf8');

const projects = [
  { folderName: '01-Stopwatch-Lap-Tracker', title: 'Stopwatch Lap Tracker', slug: 'stopwatch-lap-tracker' },
];

describe('views/index.ejs', () => {
  it('renders a card per project', () => {
    const html = ejs.render(template, { projects });
    expect(html).toContain('Stopwatch Lap Tracker');
    expect(html).toContain('stopwatch-lap-tracker/screen.png');
    expect(html.match(/class="project-card"/g)).toHaveLength(1);
  });

  it('renders no cards for an empty list', () => {
    const html = ejs.render(template, { projects: [] });
    expect(html).not.toContain('class="project-card"');
  });

  it('escapes project titles', () => {
    const html = ejs.render(template, {
      projects: [{ ...projects[0], title: '<script>alert(1)</script>' }],
    });
    expect(html).not.toContain('<script>alert(1)</script>');
  });
});

describe('project folders', () => {
  it.each(projects)('$folderName has the expected assets', ({ folderName }) => {
    for (const file of ['index.html', 'script.js', 'style.css']) {
      expect(existsSync(path.join(root, folderName, file))).toBe(true);
    }
  });
});
