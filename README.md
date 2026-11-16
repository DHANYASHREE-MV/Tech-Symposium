# TECH@IIMB 2027 | Official Website

The official website of **TECH@IIMB 2027**, the annual technology symposium of the **Indian Institute of Management Bangalore (IIMB)**, convened by the **Centre for Software and IT Management (CSITM)**.

The website serves as the central digital platform for event information, technology discussions, exhibitions, startup initiatives, partnerships, announcements, and enquiries.

## Overview

TECH@IIMB 2027 is a static website developed using:

- **HTML5** – Page structure and content
- **CSS3** – Styling and responsive layouts
- **JavaScript** – Interactions and dynamic content
- **Python 3** – Local development server and page generation

The project does not require any frontend framework, database, package manager, or build installation.

## Features

- Responsive website with a modern interface.
- Dedicated pages for event information and activities.
- Technology discussions, tracks, sectors, and speaker information.
- Exhibition showcasing 13 activities.
- FutureTech Challenge and startup programme.
- Pre-event timeline and announcements.
- Partnership information and enquiry form.
- Contact form, FAQs, and venue information.
- Admin dashboard for managing event content.
- Centralised content management through JavaScript.

## Project Structure

```text
tech-iimb-website/
│
├── index.html              # Home
├── about.html              # About the event
├── discussions.html        # Programme, tracks and speakers
├── exhibition.html         # Exhibition and 13 activities
├── startup.html            # FutureTech Challenge and startup programme
├── pre-events.html         # Pre-event timeline and announcements
├── partner.html            # Partnerships and enquiry form
├── contact.html            # Contact, FAQs and venue
├── admin.html              # Organiser content dashboard
│
├── css/
│   └── site.css            # Website styles
│
├── js/
│   ├── content.js           # Event content and configuration
│   ├── site.js              # Website interactions and forms
│   └── admin.js             # Admin dashboard functionality
│
├── assets/                  # Images, logos, fonts and PDFs
│
└── tools/
    ├── build.py             # Static HTML page generator
    └── credits.json         # Image credits and attributions
```

## Getting Started

### Prerequisites

Make sure you have the following installed:

- A modern web browser (Google Chrome, Microsoft Edge, Firefox, or Safari).
- Python 3, available from [python.org](https://www.python.org/downloads/).

No additional dependencies or package installations are required.

### Run Locally

**1. Download or clone the repository**

```bash
git clone <repository-url>
```

Alternatively, download the repository as a ZIP file and extract it.

**2. Open the project directory**

Navigate to the extracted project folder.

On Windows, open the folder in File Explorer, click the address bar, type `cmd`, and press Enter.

**3. Start the local development server**

```bash
python -m http.server 8000
```

On macOS or Linux, use:

```bash
python3 -m http.server 8000
```

**4. Open the website**

Visit the following URL in your browser:

```text
http://localhost:8000
```

The admin dashboard is available at:

```text
http://localhost:8000/admin.html
```

**5. Stop the server**

Press `Ctrl + C` in the terminal.

> **Note:** Do not open `index.html` directly by double-clicking it. The website must run through a local HTTP server for fonts, navigation, and form functionality to work correctly.

## Admin Dashboard

The project includes an organiser-facing admin dashboard at `admin.html`.

It allows organisers to update website content directly through the browser.

To publish changes:

1. Open `http://localhost:8000/admin.html`.
2. Edit the required event information.
3. Navigate to **Data & Publishing**.
4. Select **Copy as content.js**.
5. Replace the existing `js/content.js` file with the updated content.
6. Redeploy the website.

**Important:** Changes made in the dashboard are stored only in the local browser until they are exported and published. The dashboard does not directly update the live website.

## Content Management

All event-related content is maintained centrally in:

```text
js/content.js
```

This file contains:

- Event programme and schedule
- Exhibition activities
- Speaker information
- Announcements and updates
- FAQs
- Event dates and links
- Website settings

To update the website:

1. Open `js/content.js`.
2. Modify the required content.
3. Save the changes.
4. Redeploy the updated files.

Fields left empty are automatically hidden on the website.

### Updating Website Layout and Text

The common website structure, including headers, footers, and page text, is generated using:

```text
tools/build.py
```

After making changes to this file, regenerate the public HTML pages using:

```bash
python tools/build.py
```

This regenerates and overwrites the eight public HTML pages.

> Make shared layout and page text changes in `tools/build.py` rather than editing the generated HTML files directly.

### Updating the Brand Name

To display `TECH@IIMB` without the year:

1. Open `tools/build.py`.
2. Locate the `BRAND_YEAR` variable.
3. Set its value to an empty string:

```python
BRAND_YEAR = ""
```

4. Regenerate the pages:

```bash
python tools/build.py
```

## Contact Form Configuration

The Contact and Partner pages use **FormSubmit** to deliver enquiries to:

`csitm@iimb.ac.in`

The configured endpoint is maintained in `js/content.js`:

```javascript
formEndpoint: "https://formsubmit.co/ajax/csitm@iimb.ac.in"
```

### One-Time Activation

After deploying the website:

1. Submit a test enquiry through the live website.
2. Check the inbox of `csitm@iimb.ac.in`.
3. Open the activation email received from FormSubmit.
4. Click **Activate Form**.

Once activated, subsequent enquiries will be delivered automatically.

> **Important:** The contact form will not function when the website is opened directly from the local file system or through a Claude preview link. Use a local HTTP server for local testing and a deployed website for live enquiries.

## Deployment

The website can be deployed to any static hosting provider. Upload the project files while preserving the existing folder structure.

Supported deployment options include:

### GitHub Pages

1. Push the project files to a GitHub repository.
2. Open the repository's **Settings**.
3. Navigate to **Pages**.
4. Under Build and Deployment, select **Deploy from a branch**.
5. Choose the `main` branch and `/ (root)` folder.
6. Save the configuration.

GitHub Pages will publish the website using the repository's static files.

### Netlify / Vercel

- Drag and drop the project folder into Netlify, or connect the GitHub repository.
- For Vercel, import the repository and configure it as a static website.
- No build command is required.

### IIMB Web Server

Copy the complete project folder into the appropriate web root directory or designated subdirectory on the IIMB web server.

## Pre-Deployment Checklist

Before publishing the website, ensure that:

- [ ] The contact form has been activated through FormSubmit.
- [ ] The `admin.html` dashboard is protected behind server authentication or excluded from public deployment.
- [ ] Confirmed event dates are updated in `js/content.js`.
- [ ] Registration links are verified and working.
- [ ] Speaker details and announcements are up to date.
- [ ] All internal navigation links work correctly.
- [ ] Images, fonts, and other assets load successfully.
- [ ] Image credits are retained in the website footer.

## Credits and Acknowledgements

- **Campus photographs and engravings:** TECH@IIMB 2027 booklet and concept note, CSITM, IIM Bangalore.
- **Additional campus photographs:** Wikimedia Commons, licensed under CC BY-SA. Individual authors and attributions are documented in `tools/credits.json` and the website footer.
- **Typography:** Anek Latin, licensed under the SIL Open Font License.

All image credits and licence attributions must be retained when redistributing or deploying the website.

---

© 2026 **TECH@IIMB** | Centre for Software and IT Management (CSITM) | Indian Institute of Management Bangalore

Contact: [csitm@iimb.ac.in](mailto:csitm@iimb.ac.in)
