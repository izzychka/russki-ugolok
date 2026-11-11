# русский уголок ✿ — your little Russian corner

A private, lilac-themed Russian study website built for 30–60 minutes of daily study. No account, dependencies, framework, or build process required.

## Features

- Personal dashboard: daily plan (30 / 45 / 60 minutes), study timer, lesson progress, seven-day tracker, study streak
- Twelve beginner lessons in four units, including Cyrillic, pronouns, noun gender, verbs, and useful phrases
- 70 starter words with topics, transliterations, favourites, Russian browser speech
- Spaced-review flashcards (Again / Hard / Good / Easy), multiple-choice practice, Cyrillic typing practice
- Grammar reference cards, daily journal, vocabulary notes
- Local browser saving, JSON import/export and optional passwordless Supabase sync
- Mobile-friendly layout, keyboard navigation, zero required packages

## Use it locally

Open `index.html` in a browser. You can also run a local server to simulate hosting:

```sh
python -m http.server 8000
```

Open http://localhost:8000. The site works without internet except for Google Fonts, optional speech voice availability, and optional Supabase sync.

## Publish on GitHub Pages

1. Create a new **public or private GitHub repository** (your site content will be public when published). Name it `russki-ugolok`, for example.
2. Upload everything inside this folder to the repository root, **including** the hidden `.github` folder. Or use Git:

   ```sh
   git init
   git add .
   git commit -m "Create my Russian study corner"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/russki-ugolok.git
   git push -u origin main
   ```

3. In GitHub repository **Settings → Pages → Build and deployment → Source**, choose **GitHub Actions**.
4. The included `.github/workflows/pages.yml` publishes after pushing to `main`. Your URL will usually be `https://YOUR_USERNAME.github.io/russki-ugolok/`.

No `npm install` is necessary. All routes use `#/...`, which works on static GitHub Pages hosting.

## How saving works

The website automatically saves all changes to browser `localStorage`, under `russki_corner_v1`. This is **private to each browser + URL**. It does not automatically travel between devices, and it may be removed if you clear site data or use private mode. Export a JSON backup in **Settings → Keep your progress safe**.

When you later publish from `file:///` to GitHub Pages, your browser considers the GitHub URL a different site. Export locally, then import once on the published site, or set up cloud sync.

## Automatic cloud sync — one secret code, no email login

Cloud sync is optional. The site always saves instantly in the browser and works offline. Once connected, it also **automatically uploads changes** to Supabase after a short pause, and **checks the cloud whenever you open or return to the site**. No account or email address is required on the website.

### One-time setup (about five steps)

1. Create or open your free project at https://supabase.com/dashboard. If you already created one for the earlier version of this website, **reuse it**.
2. In **SQL Editor → New query**, paste the **entire updated `supabase-schema.sql`** file and click **Run**. The result shows a UUID under **COPY THIS PRIVATE SYNC CODE INTO THE WEBSITE**. Copy and privately store it. Rerunning the SQL keeps the existing code and existing cloud progress.
3. In **Project Settings → API Keys**, copy your **Project URL** and **publishable key** (or the legacy **anon** key). Never put a `service_role` or secret key into the site.
4. On your Russian website, go to **Settings → Cloud sync**. Paste the **Project URL**, **publishable/anon key** and **private sync code**. Click **Connect & sync**.
5. On your other device, open the same website and enter the same three values once. From then on, changes sync automatically; you do not need to log in or press Save.

Your existing local study progress is preserved. If the cloud is empty, the website uploads your current progress. If this browser is empty but your cloud already has progress, it downloads that progress automatically. If **both** contain different work, the site asks you to choose which to keep. It will not silently overwrite your writing. A JSON export is a good precaution before the first connection.

### Security and limitations

- The URL and publishable/anon key are designed to be public. The **sync code is private**, works like an access key, and is stored only in your browser. **Do not publish it on GitHub, paste it into screenshots, or share it.**
- The SQL disables direct browser access to the study database table, and exposes only two functions which verify the unguessable sync code.
- The code is a bearer secret: someone who obtains it could read or modify your study data. Supabase also remains the administrator of the database. For a personal hobby site, this removes login while protecting against casual public access.
- Sync runs when online, after local changes, on opening the page, and on returning to the tab. It is **not** live character-by-character collaboration. If two devices change the same progress simultaneously, the site flags a conflict; in Settings, choose **Keep this device** or **Use cloud save** after exporting a backup if needed.
- Clearing your browser's site data removes the saved configuration and local copy. The cloud copy remains; enter the three connection values again to recover it.
- The existing email-login Supabase table, if you created it in the previous version, is left untouched. This new version uses `russki_single_save` and the two new RPC functions instead.

### Updating an existing deployed copy

If your site is already live on GitHub Pages, you do **not** need a new repository. Replace these files in the repository root with the updated versions: `index.html`, `app.js`, `cloud.js`, `supabase-schema.sql` (and optionally this `README.md`). Commit the changes, then refresh the published site after the GitHub Actions deployment finishes. Your browser progress is retained.

## Customize

- `styles.css`: appearance and colours
- `data.js`: lessons, word bank and grammar content
- `app.js`: page rendering, practice, progress and study logic
- `cloud.js`: optional Supabase connection
- `assets/favicon.svg`: browser icon

## Notes

- The course is designed as a friendly *starting point*, not a comprehensive grammar textbook. Transliterations are rough pronunciation guides, not precise IPA.
- Russian speech relies on the browser/device having a Russian speech synthesis voice.
- In desktop practice, press **Space** to reveal a flashcard when no control is focused.
- The focus timer logs whole minutes when you select **Finish & log**. You can also use **Log minutes manually**.
- Repeating the lesson at your pace is encouraged. Once you finish the course, start practising and add new words to `data.js`.

Made with ♡ for little daily steps.
