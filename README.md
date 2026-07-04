🖼️ Contact Sheet — Image Gallery

A filterable image gallery built for the CodeAlpha Frontend Development Internship (Task 1). Designed to feel like flipping through a photographer's contact sheet rather than a generic grid — category filters, hover reveals, and a full lightbox with keyboard navigation.

Features


Category filtering (Nature, Urban, Portrait, Abstract, All)
Lightbox view with next/prev navigation
Keyboard support — ← / → to navigate, Esc to close
Smooth hover transitions and image scaling
Lazy-loaded images for performance
Fully responsive grid across screen sizes


Tech Stack


HTML5
CSS3 (Grid, Flexbox, custom properties)
Vanilla JavaScript (no frameworks or libraries)


Project Structure

01-image-gallery/
├── index.html
├── style.css
└── script.js

Running Locally

No build step required.


Clone this repo
Open index.html directly in a browser, or serve it locally:


bash   npx serve .

How It Works


script.js renders 24 image "frames" from a small data array, each tagged with a category.
Clicking the filter buttons toggles a .hide class on non-matching frames.
Clicking any frame opens a lightbox (#lightbox) tracking the current index, updating the image, caption, and position counter (x / total — respecting the active filter).


Possible Improvements


Swap the placeholder photos (via picsum.photos) for real project photography
Add pinch-to-zoom on mobile
Add a masonry layout option


Author

Afifah Sheikh
📧 afifahsheikh4@gmail.com
🔗 LinkedIn · GitHub


Built as part of the CodeAlpha Frontend Development Internship — Task 1.



🧮 Ledger — Calculator

A keyboard-friendly calculator built for the CodeAlpha Frontend Development Internship (Task 2). Styled like a warm, brass instrument panel rather than a flat default calculator UI.

Features


Core arithmetic: addition, subtraction, multiplication, division
Extras: percentage, sign toggle (±), clear (AC)
Live-updating display with running operation history
Full keyboard support: digits, + − × / (or *), Enter/=, Backspace, Esc
Handles chained operations (e.g. 12 + 8 × 2 =)
Auto-shrinking font for long numbers, comma-formatted output


Tech Stack


HTML5
CSS3 (custom properties, grid layout)
Vanilla JavaScript (no frameworks or libraries)


Project Structure

02-calculator/
├── index.html
├── style.css
└── script.js

Running Locally

No build step required.


Clone this repo
Open index.html directly in a browser, or serve it locally:


bash   npx serve .

How It Works


State is tracked with three variables: current, previous, and operator.
Pressing an operator evaluates any pending operation first (so chained operations work correctly), then stores the running total.
formatNumber() handles comma separators, decimal points, and very large numbers via scientific notation.
Keyboard events are mapped to the same functions as button clicks, so both stay in sync.


Possible Improvements


Add memory functions (M+, M-, MR, MC)
Add a history log of previous calculations
Add scientific mode (sin, cos, sqrt, etc.)


Author

Afifah Sheikh
📧 afifahsheikh4@gmail.com
🔗 LinkedIn · GitHub


Built as part of the CodeAlpha Frontend Development Internship — Task 2.



📁 Afifah Sheikh — Portfolio Site

A personal portfolio built for the CodeAlpha Frontend Development Internship (Task 3), showcasing education, projects, skills, and accomplishments.

Features


Scroll-tracked side navigation rail (active section highlights as you scroll)
Scroll-reveal animations for each section
Animated skill bars that fill in when scrolled into view
Sections: Hero, At a Glance (stats), Education, Additional Accomplishments, Projects, Skills, Contact
Direct links to GitHub, LinkedIn, and email
Fully responsive layout


Tech Stack


HTML5
CSS3 (Grid, Flexbox, custom properties)
Vanilla JavaScript (Intersection Observer API for scroll effects)


Project Structure

03-portfolio/
├── index.html
├── style.css
└── script.js

Running Locally

No build step required.


Clone this repo
Open index.html directly in a browser, or serve it locally:


bash   npx serve .


(Optional) Deploy for free on GitHub Pages or Netlify.


Before You Publish — Checklist


 Replace the Download CV button's href="#" with a real link to your CV PDF
 Replace each project's Source link href="#" with its actual GitHub repo URL
 Double-check contact details (email, LinkedIn, GitHub) are current


How It Works


IntersectionObserver is used twice: once to fade/slide sections into view as you scroll, and once to animate the skill bar widths from 0% to their target percentage only when visible.
A second IntersectionObserver keeps the side rail's active dot in sync with whichever section is currently in the viewport.


Possible Improvements


Add a dark/light theme toggle
Add a blog or case-study section for deeper project write-ups
Add form-based contact instead of a mailto link


Author

Afifah Sheikh
📧 afifahsheikh4@gmail.com
🔗 LinkedIn · GitHub


Built as part of the CodeAlpha Frontend Development Internship — Task 3.





🎵 Sidecar — Music Player

A vinyl-inspired music player built for the CodeAlpha Frontend Development Internship (Task 4), with a custom JavaScript audio player and an optional panel for embedding any song directly from Spotify.

Features

Custom player


Play / pause, next / previous track
Scrubbable progress bar with live time display
Volume control
Shuffle and loop toggles
A spinning vinyl record + tonearm animation synced to playback state
Playlist view with an active-track indicator


Play from Spotify (bonus)


Paste any Spotify track, album, or playlist link
Loads Spotify's official embedded player — full songs, free account, no API keys or login flow required on this site


Tech Stack


HTML5 (<audio> element)
CSS3 (keyframe animations, custom properties)
Vanilla JavaScript (no frameworks or libraries)


Project Structure

04-music-player/
├── index.html
├── style.css
└── script.js

Running Locally

No build step required.


Clone this repo
Open index.html directly in a browser, or serve it locally:


bash   npx serve .

How It Works

Custom player
The demo tracks are royalty-free sample files. script.js wires the native <audio> element to the UI: timeupdate drives the progress bar and elapsed time, loadedmetadata sets the track duration, and ended either loops or auto-advances to the next track (respecting shuffle).

Spotify panel
This does not bypass Spotify's subscription rules. Spotify's Web Playback SDK (their official way to stream inside a custom player) requires a Premium account by design — that's Spotify's rule, not something we work around.

Instead, the panel builds an <iframe> pointing at Spotify's own official embed player: open.spotify.com/embed/{type}/{id}. That player streams full songs for anyone with a free Spotify account (with occasional audio ads, same as the free Spotify app) — no API keys, no OAuth login flow, and playback happens entirely inside Spotify's sandboxed iframe.

js// simplified from script.js
const match = url.pathname.match(/\/(track|album|playlist)\/([a-zA-Z0-9]+)/);
iframe.src = `https://open.spotify.com/embed/${type}/${id}`;

Trade-off: no in-app search — you paste a link. Building real search would require a registered Spotify developer app, and full custom playback would still require Premium via their SDK. The embed approach is the option that stays both free and within Spotify's terms.

Possible Improvements


Add a search bar that uses the Spotify Web API (Client Credentials flow) to look up tracks and auto-fill the link
Add drag-and-drop reordering for the custom playlist
Persist volume/shuffle/loop preferences between sessions


Author

Afifah Sheikh
📧 afifahsheikh4@gmail.com
🔗 LinkedIn · GitHub


Built as part of the CodeAlpha Frontend Development Internship — Task 4.
