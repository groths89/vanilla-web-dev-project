const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname));

function getProjects() {
    try {
        const items = fs.readdirSync(__dirname, { withFileTypes: true });
        const projects = items
            .filter(item => item.isDirectory() && /^\d{2}-/.test(item.name))
            .map(dir => {
                const folderName = dir.name;

                const cleanName = folderName.replace(/^\d{2}-/, '');
                
                const slug = cleanName.toLowerCase();
                
                const title = cleanName.replace(/-/g, ' ');

                return {
                    folderName,
                    title,
                    slug,
                    path: `/${slug}`
                };
            })
            .sort((a, b) => a.folderName.localeCompare(b.folderName));

        return projects;
    } catch (err) {
        console.error("❌ Error reading project directories:", err);
        return [];
    }
}

const projects = getProjects();
projects.forEach(project => {
    app.use(`/${project.slug}`, express.static(path.join(__dirname, project.folderName)));
});

app.get('/', (req, res) => {
    const activeProjects = getProjects();
    res.render('index', { projects: activeProjects });
});

app.listen(PORT, () => {
    console.log(`Web Lab Server running at http://localhost:${PORT}`);
})