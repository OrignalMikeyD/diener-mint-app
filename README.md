# Module 9 Gap Fixes — Runbook

This closes the three pieces your app was missing against the Module 9 milestone. I tested all the code against your exact files: every page renders, the new route ordering holds, and creating a project works end to end. The only part I cannot do for you is the DigitalOcean Spaces setup, because it lives in your account. That part is spelled out below and takes about 15 minutes.

## What changed, and why

**Gap 1: New project page.** Your app could read projects but not create them. I added a form page, a route to show it, and a route that inserts the row into MySQL.

**Gap 2: Content delivery network.** Your images load from picsum.photos, which is a third-party placeholder service, not a DigitalOcean CDN. The milestone requires a CDN on DigitalOcean. You upload your images to a Space, then run one script to point the database at the new URLs.

**Gap 3: Header and footer as EJS partials.** Your nav and footer were copy-pasted into every page. I pulled them into two shared partials, and every page now includes them. Change the nav once and it changes everywhere.

## File placement

Drop these into your repo at the exact paths shown. Six replace existing files, three are new.

| File | Path in your repo | New or replace |
|------|-------------------|----------------|
| main.mjs | `src/main.mjs` | replace |
| database.mjs | `src/utils/database.mjs` | replace |
| index.ejs | `src/views/index.ejs` | replace |
| projects.ejs | `src/views/projects.ejs` | replace |
| project.ejs | `src/views/project.ejs` | replace |
| header.ejs | `src/views/partials/header.ejs` | new |
| footer.ejs | `src/views/partials/footer.ejs` | new |
| new.ejs | `src/views/new.ejs` | new |
| update-cdn-images.mjs | `update-cdn-images.mjs` (project root) | new |

You will need to create the `src/views/partials/` folder. Nothing else in your project changes, and no new npm packages are required.

## Gap 2 steps: the DigitalOcean CDN

This is the only manual part. Do it once.

1. In the DigitalOcean dashboard, open Spaces Object Storage and create a Space. Pick the region closest to you, give it a name, and leave file listing restricted.
2. Turn on the CDN for that Space. DigitalOcean gives you an endpoint that looks like `https://your-space.nyc3.cdn.digitaloceanspaces.com`.
3. Upload your three images. If you want to keep the current art, the originals are at `https://picsum.photos/seed/diener1/800/600`, `.../diener2/...`, and `.../diener3/...`. Download those, or use your own work.
4. For each uploaded file, set its permission to public, then copy its CDN link.
5. Open `update-cdn-images.mjs`, paste the three CDN links next to the matching project titles, save, and from your project root run `node update-cdn-images.mjs`. It updates the three rows in place, so it will not wipe any projects you added through the form.

After this, every image on your site loads from the DigitalOcean CDN, and any new project you add through the form uses a Spaces URL too.

## Test it locally

From your project root:

```
npm install
npm run dev
```

Then check, in order:

1. Open `/projects` and confirm the Add Project button shows.
2. Open `/projects/new`, fill the form, and submit. It should save and send you to the new project's page.
3. Reload `/projects` and confirm the new card is there.
4. Open the home page and a single project page and confirm the shared header and footer look right.

## One thing worth understanding

In `main.mjs`, the route for `/projects/new` sits **above** the route for `/projects/:id` on purpose. Express checks routes top to bottom. If `:id` came first, it would treat the word "new" as an id, run the detail lookup, and your form page would 404. Order matters here, so keep `/projects/new` above `/projects/:id` if you move things around.

## Commit with a clean history

The milestone also grades your Git history for clear, meaningful messages. Commit these in logical chunks rather than one lump:

```
git add src/views/partials/ src/views/index.ejs src/views/projects.ejs src/views/project.ejs
git commit -m "Refactor shared header and footer into EJS partials"

git add src/views/new.ejs src/main.mjs src/utils/database.mjs
git commit -m "Add new project page with create route and DB insert"

git add update-cdn-images.mjs
git commit -m "Add script to point project images at DigitalOcean Spaces CDN"

git push
```

If your DigitalOcean App is set to auto-deploy from GitHub, the push triggers a new deploy. If not, open the app and deploy the latest commit by hand. The CDN image swap runs against your database directly, so it takes effect without a redeploy.

## What this gets you

After these steps, your app has the four required pages built on EJS partials, reads and writes a MySQL database, and serves images from a DigitalOcean CDN. That is the full Module 9 functionality, ready to demonstrate at Module 11.
