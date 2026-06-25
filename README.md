# Building Hope San Diego — frontend

The public website. Plain HTML/CSS/JS — no build step, no npm install required.

## Getting started

```bash
git clone https://github.com/<your-username>/buildinghopesd-frontend.git
cd buildinghopesd-frontend
code .
```

To preview: open `index.html` directly in a browser, or in VS Code install the
**Live Server** extension and click "Go Live" — that's the better option once
the chatbot widget needs to talk to the backend, since some browsers block
`fetch()` calls from a bare `file://` page.

## Structure
```
index.html / about.html / the-issue.html / events.html / get-involved.html / contact.html
css/style.css     Shared styles — design tokens at the top of the file
js/main.js        Nav toggle, footer year, placeholder form handling
js/chatbot.js     Chat widget — calls the backend's /chat endpoint
assets/images/    Logo, photos, event pictures go here
```

Every `[placeholder]` in the HTML is real content waiting to be written in —
mission statement, stats, team bios, event details.

## Connecting to the backend
The chatbot needs the backend running. Update the endpoint in
`js/chatbot.js`:
```js
const BHSD_CHAT_ENDPOINT = 'http://localhost:8000/chat'; // local dev
```
Change this to your deployed backend's URL once that exists.

## Deploying (no domain needed yet)
Push to GitHub, then connect the repo on Netlify or Vercel — either gives you
a free URL (e.g. `buildinghopesd.netlify.app`) with zero configuration. Add
your own domain later from the same dashboard whenever you buy one.