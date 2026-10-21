import { httpServerHandler } from 'cloudflare:node';
import express from 'express';
import path from 'path';

const app = express();

// Define your projects cleanly here so the edge worker knows what to serve
const projects = [
    {
        folderName: '01-Stopwatch-Lap-Tracker',
        title: 'Stopwatch Lap Tracker',
        slug: 'stopwatch-lap-tracker'
    }
    // As you add more projects, just append them to this array!
];

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Mount static assets for each project folder natively
projects.forEach(project => {
    app.use(`/${project.slug}`, express.static(path.join(__dirname, `../${project.folderName}`)));
});

// Main Dashboard Index Route
app.get('/', (req, res) => {
    res.render('index', { projects });
});

// Export standard Cloudflare HTTP Server handler adapter
export default {
  fetch: httpServerHandler(app),
};