# JRT Consulting Limited — Website

A static, five-page website for JRT Consulting Limited (Port Moresby, PNG), modelled on the rm2o-website structure but simplified. Plain HTML/CSS/JS — no build step or framework.

## Pages

| Page | File |
|---|---|
| Landing (logo + motto) | `index.html` |
| About Us | `about.html` |
| Mission & Vision | `mission-vision.html` |
| Our Team | `team.html` |
| Contact Us | `contact.html` |

- `css/style.css` — all styles. Colours come from the company profile: bronze `#6B4423`, copper `#A0703F`, charcoal `#33302C`, taupe `#8A7F73`, cream `#FAF5EF`.
- `js/script.js` — mobile nav, scroll reveal, team card expand, contact form.
- `assets/` — logo (transparent), eagle mark, favicon, social share image.

## Common edits

**Add director portraits.** Save photos (portrait orientation, about 800×1000px) as `assets/team/ruth.jpg`, `natasha.jpg`, `joshua.jpg`. In `team.html`, find each `<!-- PORTRAIT: ... -->` comment (two per director: the card and the expanded view) and put the `<img class="photo" ...>` tag shown in the comment inside that `.portrait` div.

**Edit bios.** In `team.html`, each card has a short bio (inside `.hover-bio`, shown on hover) and a full bio, qualification, background, sectors and skills (inside the card's `<template>`, shown when the card is clicked).

**Contact form.** Out of the box, submitting opens the visitor's email app addressed to enquiries@jrtconsultingltd.com. To receive submissions directly instead, create a free form at [formspree.io](https://formspree.io) and replace `YOUR_FORM_ID` in `contact.html`.

**Office hours.** Not yet in the profile — add them to the contact card in `contact.html` when ready.

## Preview locally

Open the folder in VS Code, install the **Live Server** extension, right-click `index.html` → **Open with Live Server**. (Double-clicking `index.html` also works.)

## Publish with GitHub Pages

Repo **Settings → Pages → Source: Deploy from branch → `main` / root**. The site will appear at `https://joshuaturia.github.io/jrt_consulting_website/`. If you later point a custom domain (e.g. jrtconsultingltd.com) at it, add a `CNAME` file and update the `canonical` / `og:` URLs in each page's `<head>`.

Fonts (Cormorant Garamond, Inter) and icons (Font Awesome) load from CDNs, so an internet connection is needed.
