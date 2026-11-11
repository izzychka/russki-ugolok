# русский уголок ✿ — your little Russian corner

A private, lilac-themed Russian study website built for 30–60 minutes of daily study. No account, dependencies, framework, or build process required.

## Features

- Personal dashboard: daily plan (30 / 45 / 60 minutes), study timer, lesson progress, seven-day tracker, study streak
- Twelve beginner lessons in four units, including Cyrillic, pronouns, noun gender, verbs, and useful phrases
- 70 starter words with topics, transliterations, favourites, Russian browser speech
- Spaced-review flashcards (Again / Hard / Good / Easy), multiple-choice practice, Cyrillic typing practice
- Grammar reference cards, daily journal, vocabulary notes
- Local browser saving, JSON import/export and optional Supabase account sync
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

## Optional cloud sync using Supabase (free tier is usually enough)

This is optional and **manual**: click Upload after you study on one device; click Load from cloud before you study on the other. Local progress is the default and works without Supabase.

1. Create a project at https://supabase.com/.
2. In Supabase **SQL Editor**, paste and run `supabase-schema.sql`. It creates `public.user_state`, enables row-level security and restricts each signed-in user to their own row.
3. In **Authentication → Providers**, ensure **Email** is enabled (email OTP/magic links).
4. In **Authentication → URL Configuration**, add your published GitHub Pages URL, e.g. `https://YOUR_USERNAME.github.io/russki-ugolok/`, to **Redirect URLs**. You may also add `http://localhost:8000/` if testing locally. If Supabase requests a Site URL, use your published address.
5. From **Project Settings → API Keys** (may be labelled **Connect** or **Data API** in updated Supabase), copy the **Project URL** and the **publishable / anon key** to your website’s **Settings → Cloud sync**. **Never use a `service_role`, secret or private key here.**
6. Click **Save cloud configuration**, type your email, then **Email me a sign-in link**. Open it and return to the website.
7. Click **Check login**. Once signed in, click **Upload this device** to store your progress in your private Supabase row.
8. On another device, set the same URL/key, sign in with the same email, then **Load from cloud**.

**Important:** Cloud sync is **manual**, not real-time or automatic. Upload overwrites the existing cloud copy. Load overwrites the local copy. Use a JSON backup before large changes or a first sync. The site does not email your journal to anyone; Supabase stores whatever is in the uploaded JSON payload in your database.

**Privacy note:** Supabase keys are stored in browser localStorage on the device, and are designed to be publicly usable only when your database has properly configured row-level-security policies. Restrict access using the supplied SQL and never commit secret/server keys.

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
