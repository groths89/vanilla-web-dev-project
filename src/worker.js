import template from '../views/index.ejs';

const projects = [
    {
        folderName: '01-Stopwatch-Lap-Tracker',
        title: 'Stopwatch Lap Tracker',
        slug: 'stopwatch-lap-tracker',
        path: '/stopwatch-lap-tracker'
    }
    // As you add more projects, just append them to this array!
];

const escapeHtml = (value) =>
    String(value ?? '').replace(/[&<>"']/g, (c) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[c]);

// EJS compiles templates with `new Function`, which workerd forbids, so the
// dashboard's simple forEach/<%= %> template is rendered by hand here.
function renderDashboard() {
    const loop = /<%\s*projects\.forEach\(\s*\(?\s*\w+\s*\)?\s*=>\s*\{\s*%>([\s\S]*?)<%\s*\}\)\s*%>/;
    return template.replace(loop, (_, body) =>
        projects
            .map((project) =>
                body.replace(/<%=\s*([^%]+?)\s*%>/g, (__, expr) => {
                    const prop = expr.match(/^project\.(\w+)$/);
                    if (prop) return escapeHtml(project[prop[1]]);
                    if (expr === "project.folderName.split('-')[0]") {
                        return escapeHtml(project.folderName.split('-')[0]);
                    }
                    throw new Error(`Unsupported template expression: ${expr}`);
                })
            )
            .join('')
    );
}

export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        if (url.pathname === '/') {
            return new Response(renderDashboard(), {
                headers: { 'content-type': 'text/html; charset=utf-8' }
            });
        }

        for (const project of projects) {
            const prefix = `/${project.slug}`;
            if (url.pathname === prefix || url.pathname.startsWith(`${prefix}/`)) {
                const rest = url.pathname.slice(prefix.length) || '/';
                const assetUrl = new URL(`/${project.folderName}${rest}`, url);
                return env.ASSETS.fetch(new Request(assetUrl, request));
            }
        }

        return new Response('Not Found', { status: 404 });
    }
};