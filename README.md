# TECH@IIMB 2027 — website

A static multi-page site with no build step. Upload the folder to any static host, such as GitHub Pages, Netlify or IIMB's own web server.

## Version 3 — black & navy
Pages: `index.html` · `about.html` · `discussions.html` · `exhibition.html` · `startup.html` · `pre-events.html` · `partner.html` · `contact.html`, plus `admin.html`, which is for the organisers and is not linked from the public pages.

Deep links:
- `discussions.html#day-2` opens a specific day.
- `exhibition.html#activity-code-golf` opens a specific activity.

Downloads: `assets/docs/TECH-IIMB-2027-Booklet.pdf` and `assets/docs/TECH-IIMB-Concept-Note.pdf` (compressed).

Brand name: `tools/build3.py` has `BRAND_YEAR = "2027"`. Set it to `""` and rebuild to show "TECH@IIMB" without the year everywhere.

Motion:
- page-to-page transitions (Chrome and Edge)
- scroll reveals, image wipes and number counters
- hover lifts and a themes ticker

All of these switch off for visitors who prefer reduced motion.

## Content
All event content lives in `js/content.js`. Fields left empty are simply not shown on the site. Some features switch on as soon as their fields are filled:
- `settings.registrationUrl` adds Register buttons.
- `futuretech.applyUrl` adds an Apply button.
- `futuretech.themes` lists the challenge themes.
- Speakers marked `published: true` appear with their portrait and biography.

`admin.html` edits this content and can copy it out as a new `content.js`. Its "Publish to preview" button only changes what you see in your own browser. Before going live, put `admin.html` behind server-side login or remove it from the public deployment.



## Contact form → csitm@iimb.ac.in
The form posts JSON to `https://formsubmit.co/ajax/csitm@iimb.ac.in`, set in `settings.formEndpoint`. Each email includes the enquiry type in the subject, the sender as reply-to, and a table of the fields.

**One-time activation:** the first enquiry sent from the live site triggers an activation email from FormSubmit to csitm@iimb.ac.in. Someone with access to that inbox must click **Activate Form**. Submissions are delivered from then on. After activating, FormSubmit can issue a random alias for the address; put it in the endpoint URL so the address isn't exposed in the code.

To use IIMB's own mail system instead, point `formEndpoint` at an internal API that accepts the same JSON POST.

If delivery fails, visitors see an error with a direct link to email csitm@iimb.ac.in, and their message stays in the form.

## Credits
Five campus photographs are from Wikimedia Commons under CC BY-SA licences, credited in each page footer under "Image credits". Keep those credits if you reuse the photographs. The other photographs and the engravings come from the TECH@IIMB 2027 booklet and concept note.

The fonts, Anek Latin and Martel, are under the SIL Open Font License.
