/* TECH@IIMB 2027 — admin dashboard (front-end foundation).
 * Edits a working copy of window.TECH_DEFAULT_CONTENT.
 *  - "Save draft"          → localStorage  techiimb.content.draft
 *  - "Publish to preview"  → localStorage  techiimb.content.published (the public site reads this in the same browser)
 *  - "Data" tab            → copy the JSON and replace js/content.js (or POST it to a CMS/backend) to publish for everyone.
 * Authentication and a shared backend are NOT implemented here; see the gate screen. */
(function () {
  "use strict";
  const K = { draft: "techiimb.content.draft", pub: "techiimb.content.published", enq: "techiimb.enquiries", gate: "techiimb.admin.entered" };
  const st = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } },
    del(k) { try { localStorage.removeItem(k); } catch (e) {} }
  };
  const DEF = window.TECH_DEFAULT_CONTENT;
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const pick = (o) => (o && o.version === DEF.version ? o : null);
  let D = clone(pick(st.get(K.draft)) || pick(st.get(K.pub)) || DEF);
  let dirty = false;
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  let tt; function toast(m) { const t = $("#toast"); t.textContent = m; t.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => t.classList.remove("show"), 2400); }
  function confirmDlg(title, msg) { return new Promise((res) => { $("#dlgT").textContent = title; $("#dlgM").textContent = msg; $("#dlg").classList.add("on"); $("#dlgYes").focus();
    const done = (v) => { $("#dlg").classList.remove("on"); $("#dlgYes").onclick = $("#dlgNo").onclick = null; res(v); }; $("#dlgYes").onclick = () => done(true); $("#dlgNo").onclick = () => done(false); }); }

  /* ---------- gate ---------- */
  function enter() { $("#gate").style.display = "none"; $("#app").classList.add("on"); try { sessionStorage.setItem(K.gate, "1"); } catch (e) {} render(); }
  $("#enter").onclick = enter;
  try { if (sessionStorage.getItem(K.gate)) enter(); } catch (e) {}

  /* ---------- path helpers & validation ---------- */
  const getP = (o, p) => p.split(".").reduce((a, k) => (a == null ? a : a[k]), o);
  function setP(o, p, v) { const ks = p.split("."); const last = ks.pop(); const t = ks.reduce((a, k) => a[k], o); t[last] = v; }
  const V = {
    url: (v) => (!v || /^https:\/\/[^\s]+\.[^\s]+$/.test(v) ? "" : "Use a full https:// link."),
    email: (v) => (!v || /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(v) ? "" : "Enter a valid email address."),
    date: (v) => (!v || /^\d{4}-\d{2}-\d{2}$/.test(v) ? "" : "Use YYYY-MM-DD."),
    time: (v) => (!v || /^\d{2}:\d{2}$/.test(v) ? "" : "Use HH:MM (24h)."),
    req: (v) => (String(v || "").trim() ? "" : "Required.")
  };
  function markDirty() { dirty = true; $("#dirtyPill").textContent = "Unsaved changes"; $("#dirtyPill").className = "pill dirty"; }
  function markClean(msg) { dirty = false; $("#dirtyPill").textContent = msg; $("#dirtyPill").className = "pill ok"; }
  addEventListener("beforeunload", (e) => { if (dirty) { e.preventDefault(); e.returnValue = ""; } });

  /* field: [key, label, type, opts] ; type: text|textarea|url|email|date|time|select|check|lines|image */
  function field(path, label, type = "text", o = {}) {
    const v = getP(D, path); const id = "f_" + path.replace(/\./g, "_"); const full = o.full || type === "textarea" || type === "lines" ? " full" : "";
    const req = o.req ? ' data-req="1"' : ""; const hint = o.hint ? `<span class="h">${esc(o.hint)}</span>` : "";
    let inp;
    if (type === "textarea") inp = `<textarea id="${id}" data-p="${path}" data-t="text"${req}>${esc(v)}</textarea>`;
    else if (type === "lines") inp = `<textarea id="${id}" data-p="${path}" data-t="lines">${esc((v || []).join("\n"))}</textarea>`;
    else if (type === "select") inp = `<select id="${id}" data-p="${path}" data-t="${o.num ? "num" : "text"}">${o.options.map(([val, lab]) => `<option value="${esc(val)}"${String(val) === String(v) ? " selected" : ""}>${esc(lab)}</option>`).join("")}</select>`;
    else if (type === "check") return `<label class="f" style="flex-direction:row;align-items:center;gap:8px"><input type="checkbox" id="${id}" data-p="${path}" data-t="check"${v ? " checked" : ""}> ${esc(label)}</label>`;
    else if (type === "image") { const img = typeof v === "string" && v ? `<img class="thumb" src="${esc(v)}" alt="">` : ""; inp = `<div style="display:flex;gap:10px;align-items:center">${img}<input type="file" accept="image/png,image/jpeg,image/webp" data-img="${path}" id="${id}">${v ? `<button class="btn danger" data-clearimg="${path}">Remove</button>` : ""}</div>`; }
    else inp = `<input id="${id}" data-p="${path}" data-t="text" data-v="${type}" type="${type === "date" ? "date" : type === "email" ? "email" : type === "url" ? "url" : "text"}" value="${esc(v)}"${req} placeholder="${esc(o.ph || "")}">`;
    return `<div class="f${full}"><label for="${id}">${esc(label)}</label>${inp}${hint}<span class="e"></span></div>`;
  }
  function validate(el) {
    let m = ""; const v = el.value; if (el.dataset.req) m = V.req(v); if (!m && el.dataset.v && V[el.dataset.v]) m = V[el.dataset.v](v.trim());
    const f = el.closest(".f"); if (f) { f.classList.toggle("err", !!m); f.querySelector(".e").textContent = m; } return !m;
  }
  document.addEventListener("input", (e) => { const el = e.target; if (!el.dataset || !el.dataset.p) return;
    let v = el.dataset.t === "check" ? el.checked : el.dataset.t === "lines" ? el.value.split("\n").map((x) => x.trim()).filter(Boolean) : el.dataset.t === "num" ? +el.value : el.value;
    setP(D, el.dataset.p, typeof v === "string" && el.dataset.v ? v.trim() : v); markDirty(); if (el.dataset.v || el.dataset.req) validate(el);
    const lbl = el.closest("details") && el.closest("details").querySelector("summary b"); if (lbl && /\.(name|title)$/.test(el.dataset.p)) lbl.textContent = el.value || "Untitled"; });
  document.addEventListener("change", (e) => { const el = e.target; if (el.dataset && el.dataset.p && (el.tagName === "SELECT" || el.type === "checkbox")) el.dispatchEvent(new Event("input", { bubbles: true }));
    if (el.dataset && el.dataset.img && el.files[0]) loadImage(el.files[0], el.dataset.img); });
  document.addEventListener("click", (e) => { const b = e.target.closest("[data-clearimg]"); if (b) { setP(D, b.dataset.clearimg, ""); markDirty(); render(); } });
  function loadImage(file, path) {
    if (file.size > 8e6) { toast("Image too large (max 8 MB)"); return; }
    const r = new FileReader(); r.onload = () => { const img = new Image(); img.onload = () => {
      const max = 640, k = Math.min(1, max / Math.max(img.width, img.height)); const c = document.createElement("canvas"); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height); setP(D, path, c.toDataURL("image/jpeg", 0.85)); markDirty(); render(); toast("Photo added (resized to " + c.width + "×" + c.height + ")"); };
      img.onerror = () => toast("That file could not be read as an image"); img.src = r.result; }; r.readAsDataURL(file);
  }

  /* ---------- list editor ---------- */
  function listEditor(arrPath, title, fieldsFn, blank, opts = {}) {
    const arr = getP(D, arrPath) || [];
    const items = arr.map((it, i) => `<details class="item" data-k="${arrPath}.${i}"${opts.openIdx === i || OPEN.has(arrPath + "." + i) ? " open" : ""}><summary><b>${esc(title(it) || "Untitled")}</b><small>${esc(opts.meta ? opts.meta(it) : "#" + (i + 1))}</small></summary>
      <div class="body"><div class="grid">${fieldsFn(arrPath + "." + i, it)}</div>
      <div class="row-actions"><button class="btn" data-mv="${arrPath}|${i}|-1" ${i === 0 ? "disabled" : ""}>↑ Up</button><button class="btn" data-mv="${arrPath}|${i}|1" ${i === arr.length - 1 ? "disabled" : ""}>↓ Down</button><button class="btn danger" data-rm="${arrPath}|${i}">Delete</button></div></div></details>`).join("");
    return `${items || `<div class="empty">Nothing here yet.</div>`}<button class="btn" style="margin-top:6px" data-add="${arrPath}" data-blank='${esc(JSON.stringify(blank))}'>+ Add ${esc(opts.noun || "item")}</button>`;
  }
  document.addEventListener("click", async (e) => {
    const mv = e.target.closest("[data-mv]"), rm = e.target.closest("[data-rm]"), ad = e.target.closest("[data-add]");
    if (mv) { const [p, i, d] = mv.dataset.mv.split("|"); const a = getP(D, p); const j = +i + +d; [a[i], a[j]] = [a[j], a[i]]; markDirty(); render(j); }
    if (rm) { const [p, i] = rm.dataset.rm.split("|"); if (!(await confirmDlg("Delete this item?", "This removes it from the draft. You can discard the draft to undo."))) return; getP(D, p).splice(+i, 1); markDirty(); render(); }
    if (ad) { const a = getP(D, ad.dataset.add); a.push(JSON.parse(ad.dataset.blank)); markDirty(); render(a.length - 1); }
  });

  /* ---------- views ---------- */
  let view = "overview", progDay = 0;
  const VIEWS = {
    overview: ["Overview", "Readiness and configuration status"],
    settings: ["Event settings", "Dates, venue, contact, registration and integrations"],
    programme: ["Programme", "Sessions and parallel activities for each day"],
    activities: ["Activities", "Descriptions, eligibility, rules and registration links"],
    speakers: ["Speakers", "Profiles appear on the site once marked published"],
    announcements: ["Announcements", "News feed shown under Speakers & Updates"],
    futuretech: ["FutureTech Challenge", "Themes, dates and application link"],
    faqs: ["FAQs", "Questions on the Participate page"],
    enquiries: ["Enquiries", "Submissions captured by this browser’s preview"],
    data: ["Data & publishing", "Export, import and reset content"]
  };
  $("#tabs").innerHTML = Object.entries(VIEWS).map(([k, [t]], i) => `<button class="tab" data-v="${k}">${t}<span class="n">${String(i + 1).padStart(2, "0")}</span></button>`).join("");
  $("#tabs").addEventListener("click", (e) => { const b = e.target.closest(".tab"); if (b) { view = b.dataset.v; $$("details.item[open]").forEach((d) => d.removeAttribute("open")); render(); } });

  let OPEN = new Set();
  function render(openIdx) {
    OPEN = new Set($$("details.item[open]").map((d) => d.dataset.k));
    $$(".tab").forEach((b) => (b.dataset.v === view ? b.setAttribute("aria-current", "page") : b.removeAttribute("aria-current")));
    $("#viewTitle").textContent = VIEWS[view][0]; $("#viewSub").textContent = VIEWS[view][1];
    const v = $("#view"); const o = { openIdx };
    if (view === "overview") {
      const S = D.settings, enq = st.get(K.enq) || [];
      const chk = [[!!S.startDate, "Event dates set (enables the countdown)"], [!!S.registrationUrl, "Main registration link"], [!!S.email, "Official contact email"], [!!S.formEndpoint, "Enquiry form delivery endpoint"],
        [Object.values(S.social || {}).some(Boolean), "Official social media links"], [!!D.futuretech.applyUrl, "FutureTech application link (Unstop)"], [(D.futuretech.themes || []).length > 0, "FutureTech challenge themes"],
        [D.speakers.some((s) => s.published), "At least one published speaker"], [D.activities.some((a) => a.registrationUrl), "Activity registration links"]];
      v.innerHTML = `<div class="stats"><div class="stat"><b>${D.days.reduce((a, d) => a + d.sessions.length, 0)}</b><span>Programme sessions</span></div><div class="stat"><b>${D.activities.length}</b><span>Activities</span></div>
        <div class="stat"><b>${D.speakers.filter((s) => s.published).length}/${D.speakers.length}</b><span>Speakers published</span></div><div class="stat"><b>${D.announcements.filter((a) => a.published).length}</b><span>Live announcements</span></div><div class="stat"><b>${enq.length}</b><span>Enquiries (this browser)</span></div></div>
        <div class="card"><h3>Launch readiness</h3><ul class="check">${chk.map(([ok, t]) => `<li><i>${ok ? "✅" : "⏳"}</i><span>${esc(t)}${ok ? "" : " — <span style='color:var(--warn)'>awaiting confirmation</span>"}</span></li>`).join("")}</ul></div>
        <div class="card"><h3>Still to configure before going live</h3><ul class="check">
          <li><i>🔒</i><span><b>Authentication.</b> Serve this page only behind server-side login (e.g. institutional SSO). It currently has no access control.</span></li>
          <li><i>🗄️</i><span><b>Shared content store.</b> Edits are saved in this browser. To publish for everyone, export the JSON (Data tab) into <code>js/content.js</code>, or connect a headless CMS / API that serves it.</span></li>
          <li><i>✉️</i><span><b>Form delivery.</b> Enquiries are sent through FormSubmit to csitm@iimb.ac.in. The first submission triggers a one-time activation email to that inbox, which must be confirmed. Swap the endpoint for your own API at any time.</span></li>
          <li><i>📊</i><span><b>Analytics & consent.</b> Not installed. Add only with an appropriate consent notice.</span></li>
          <li><i>🧾</i><span><b>Registration.</b> Registrations are expected on an external platform (Unstop is planned for FutureTech); add the links when available.</span></li></ul></div>`;
    }
    if (view === "settings") {
      v.innerHTML = `<div class="card"><h3>Event</h3><div class="grid">${field("settings.eventName", "Event name", "text", { req: 1 })}${field("settings.theme", "Theme", "text", { req: 1 })}${field("settings.tagline", "Tagline")}
        ${field("settings.month", "Month label", "text", { hint: "Shown until exact dates are set" })}${field("settings.startDate", "Start date", "date", { hint: "Setting this starts the public countdown" })}${field("settings.endDate", "End date", "date")}</div></div>
        <div class="card"><h3>Venue</h3><div class="grid">${field("settings.venue", "Venue")}${field("settings.mapUrl", "Map link", "url")}${field("settings.address", "Address", "textarea")}</div></div>
        <div class="card"><h3>Registration & contact</h3><div class="grid">${field("settings.registrationUrl", "Main registration link", "url", { ph: "https://" })}${field("settings.email", "Official email", "email")}
        ${field("settings.registrationNote", "Message while registration is closed", "textarea")}${field("settings.formEndpoint", "Enquiry form endpoint (POST JSON)", "url", { hint: "e.g. a form-service URL or your backend API" })}</div></div>
        <div class="card"><h3>Social media</h3><div class="grid">${["linkedin", "instagram", "x", "youtube"].map((k) => field("settings.social." + k, k === "x" ? "X (Twitter)" : k[0].toUpperCase() + k.slice(1), "url")).join("")}</div></div>`;
    }
    if (view === "programme") {
      const d = D.days[progDay], dp = "days." + progDay;
      v.innerHTML = `<div class="seg">${D.days.map((x, i) => `<button aria-pressed="${i === progDay}" data-pd="${i}">Day ${i + 1} · ${esc(x.title)}</button>`).join("")}</div>
        <div class="card"><h3>Day details</h3><div class="grid">${field(dp + ".title", "Title", "text", { req: 1 })}${field(dp + ".question", "Guiding question")}${field(dp + ".summary", "Summary", "textarea")}</div></div>
        <div class="card"><h3>Sessions</h3>${listEditor(dp + ".sessions", (s) => s.title, (p) => field(p + ".time", "Time", "text", { req: 1, ph: "10:00 – 11:00" }) + field(p + ".title", "Title", "text", { req: 1 })
          + field(p + ".type", "Type", "select", { options: ["Registration", "Keynote", "Session", "Panel", "Roundtable", "Workshop", "Debate", "Policy", "Networking"].map((x) => [x, x]) }) + field(p + ".venue", "Venue / room")
          + field(p + ".speaker", "Speaker(s)") + field(p + ".detail", "Detail", "textarea"), { time: "", title: "", type: "Session", detail: "", venue: "", speaker: "" }, { ...o, noun: "session", meta: (s) => s.time })}</div>
        <div class="card"><h3>Running in parallel</h3>${listEditor(dp + ".attractions", (a) => a.name, (p) => field(p + ".name", "Name", "text", { req: 1 }) + field(p + ".start", "Start", "time", { req: 1, ph: "10:00" }) + field(p + ".end", "End", "time", { req: 1, ph: "17:00" })
          + field(p + ".activity", "Linked activity", "select", { options: [["", "— none —"], ...D.activities.map((a) => [a.id, a.name])] }), { name: "", start: "10:00", end: "11:00", activity: "" }, { noun: "attraction", meta: (a) => `${a.start}–${a.end}` })}</div>`;
      $$("[data-pd]").forEach((b) => (b.onclick = () => { progDay = +b.dataset.pd; $$("details.item[open]").forEach((d) => d.removeAttribute("open")); render(); }));
    }
    if (view === "activities") {
      v.innerHTML = `<div class="card">${listEditor("activities", (a) => a.name, (p, a) => field(p + ".name", "Name", "text", { req: 1 }) + field(p + ".tag", "Tag") + field(p + ".category", "Category", "select", { options: D.activityCategories.map((c) => [c, c]) })
        + field(p + ".day", "Day", "select", { num: 1, options: D.days.map((d, i) => [i, `Day ${i + 1}`]) }) + field(p + ".time", "Time") + field(p + ".format", "Format / team size")
        + field(p + ".desc", "Short description", "textarea") + field(p + ".how", "How it works", "textarea") + field(p + ".eligibility", "Eligibility", "textarea", { hint: "Leave empty to show ‘To be confirmed’" })
        + field(p + ".rules", "Rules, judging & timings", "textarea") + field(p + ".registrationUrl", "Registration link", "url", { full: 1 }),
        { id: "activity-" + Date.now().toString(36), name: "", category: D.activityCategories[0], tag: "", day: 0, time: "", desc: "", how: "", format: "", eligibility: "", rules: "", registrationUrl: "", status: "tbc" }, { ...o, noun: "activity", meta: (a) => `Day ${a.day + 1} · ${a.time}` })}</div>`;
    }
    if (view === "speakers") {
      v.innerHTML = `<div class="card"><p style="color:var(--muted);margin:0 0 14px">Only use approved photographs and information. Speakers appear publicly only when “Published” is ticked.</p>${listEditor("speakers", (s) => s.name, (p) => field(p + ".name", "Full name", "text", { req: 1 }) + field(p + ".designation", "Designation") + field(p + ".organisation", "Organisation")
        + field(p + ".session", "Session") + field(p + ".photo", "Photograph", "image", { full: 1 }) + field(p + ".bio", "Short biography", "textarea") + field(p + ".published", "Published on the website", "check"),
        { name: "", designation: "", organisation: "", bio: "", session: "", photo: "", published: false }, { ...o, noun: "speaker", meta: (s) => (s.published ? "Published" : "Draft") })}</div>`;
    }
    if (view === "announcements") {
      v.innerHTML = `<div class="card">${listEditor("announcements", (a) => a.title, (p) => field(p + ".date", "Date", "date", { req: 1 }) + field(p + ".title", "Title", "text", { req: 1 }) + field(p + ".body", "Text", "textarea") + field(p + ".published", "Published", "check"),
        { date: new Date().toISOString().slice(0, 10), title: "", body: "", published: false }, { ...o, noun: "announcement", meta: (a) => `${a.date} · ${a.published ? "Live" : "Draft"}` })}</div>`;
    }
    if (view === "futuretech") {
      v.innerHTML = `<div class="card"><div class="grid">${field("futuretech.intro", "Introduction", "textarea")}${field("futuretech.applyUrl", "Application link", "url", { hint: "Planned through Unstop" })}${field("futuretech.applyPlatform", "Platform label")}
        ${field("futuretech.finalSlot", "Final slot")}${field("futuretech.milestone", "Milestone")}${field("futuretech.themes", "Challenge themes (one per line)", "lines", { hint: "Five themes expected — leave empty to show ‘To be confirmed’" })}</div></div>
        <div class="card"><h3>Information cards</h3>${listEditor("futuretech.info", (x) => x.h, (p) => field(p + ".h", "Heading", "text", { req: 1 }) + field(p + ".v", "Text", "textarea"), { h: "", v: "" }, { noun: "card" })}</div>`;
    }
    if (view === "faqs") v.innerHTML = `<div class="card">${listEditor("faqs", (f) => f.q, (p) => field(p + ".q", "Question", "text", { req: 1, full: 1 }) + field(p + ".a", "Answer", "textarea"), { q: "", a: "" }, { ...o, noun: "FAQ" })}</div>`;
    if (view === "enquiries") {
      const q = (st.get(K.enq) || []).slice().reverse();
      v.innerHTML = `<div class="card"><p style="color:var(--muted);margin:0 0 14px">Enquiries from the public contact form are emailed to <b>csitm@iimb.ac.in</b> through the endpoint set in Event settings, with the sender as reply-to. Any listed below were saved in this browser only.</p>
        ${q.length ? `<div style="overflow:auto"><table><thead><tr><th>Received</th><th>Name</th><th>Email</th><th>Type</th><th>Message</th></tr></thead><tbody>${q.map((x) => `<tr><td>${esc(new Date(x.at).toLocaleString("en-IN"))}</td><td>${esc(x.name)}<br><small style="color:var(--dim)">${esc(x.org)}</small></td><td>${esc(x.email)}</td><td>${esc(x.type)}</td><td>${esc(x.message)}</td></tr>`).join("")}</tbody></table></div>
        <div class="row-actions"><button class="btn" id="copyCsv">Copy as CSV</button><button class="btn danger" id="clearEnq">Clear all</button></div>` : `<div class="empty">No enquiries yet.</div>`}</div>`;
      const cc = $("#copyCsv"); if (cc) cc.onclick = () => copy(["received,name,org,email,type,message", ...q.map((x) => [x.at, x.name, x.org, x.email, x.type, x.message].map((c) => `"${String(c || "").replace(/"/g, '""')}"`).join(","))].join("\n"));
      const ce = $("#clearEnq"); if (ce) ce.onclick = async () => { if (await confirmDlg("Clear enquiries?", "Removes all enquiries stored in this browser.")) { st.del(K.enq); render(); } };
    }
    if (view === "data") {
      v.innerHTML = `<div class="card"><h3>Export content</h3><p style="color:var(--muted);margin:0 0 10px">To publish for all visitors, replace the object in <code>js/content.js</code> with this JSON (<code>window.TECH_DEFAULT_CONTENT = …;</code>), or send it to your CMS/API.</p>
        <textarea class="code" readonly id="exp" aria-label="Content JSON">${esc(JSON.stringify(D, null, 2))}</textarea><div class="row-actions"><button class="btn pri" id="copyExp">Copy JSON</button><button class="btn" id="copyJs">Copy as content.js</button></div></div>
        <div class="card"><h3>Import content</h3><div class="grid"><div class="f full"><label for="impFile">From file</label><input type="file" id="impFile" accept="application/json,.json"></div>
        <div class="f full"><label for="imp">Or paste JSON</label><textarea class="code" id="imp" style="min-height:140px"></textarea><span class="e" id="impErr"></span></div></div><div class="row-actions"><button class="btn" id="doImp">Load into draft</button></div></div>
        <div class="card"><h3>Reset</h3><div class="row-actions"><button class="btn danger" id="discard">Discard draft &amp; preview</button><button class="btn danger" id="reset">Reset draft to original content</button></div></div>`;
      $("#copyExp").onclick = () => copy(JSON.stringify(D, null, 2));
      $("#copyJs").onclick = () => copy("window.TECH_DEFAULT_CONTENT = " + JSON.stringify(D, null, 2) + ";\n");
      $("#impFile").onchange = (e) => { const f = e.target.files[0]; if (!f) return; f.text().then((t) => { $("#imp").value = t; }); };
      $("#doImp").onclick = () => { try { const o = JSON.parse($("#imp").value); if (!o || o.version !== DEF.version || !Array.isArray(o.days) || !o.settings) throw new Error("This doesn’t look like TECH@IIMB content (version " + DEF.version + ")."); D = o; markDirty(); toast("Imported into draft"); render(); }
        catch (err) { $("#impErr").textContent = err.message; } };
      $("#discard").onclick = async () => { if (await confirmDlg("Discard draft and preview?", "The public site in this browser will show the original content again.")) { st.del(K.draft); st.del(K.pub); D = clone(DEF); markClean("Draft discarded"); render(); } };
      $("#reset").onclick = async () => { if (await confirmDlg("Reset draft?", "Replaces the draft with the original content. Nothing is published until you publish.")) { D = clone(DEF); markDirty(); render(); } };
    }
  }
  async function copy(t) { try { await navigator.clipboard.writeText(t); toast("Copied to clipboard"); } catch (e) { const ta = $("#exp"); if (ta) { ta.focus(); ta.select(); } toast("Clipboard unavailable — text selected, press Ctrl/Cmd+C"); } }

  /* ---------- save / publish ---------- */
  function validAll() { let ok = true; $$("[data-v],[data-req]").forEach((el) => { if (!validate(el)) ok = false; });
    const urlBad = []; const chkU = (u, w) => { if (u && !/^https:\/\//.test(u)) urlBad.push(w); };
    chkU(D.settings.registrationUrl, "Main registration link"); chkU(D.settings.formEndpoint, "Form endpoint"); chkU(D.futuretech.applyUrl, "FutureTech link"); D.activities.forEach((a) => chkU(a.registrationUrl, a.name + " registration link"));
    Object.entries(D.settings.social || {}).forEach(([k, u]) => chkU(u, k + " link"));
    if (urlBad.length) { toast("Fix links (https only): " + urlBad.slice(0, 2).join(", ")); return false; } if (!ok) toast("Please fix the highlighted fields"); return ok; }
  $("#saveBtn").onclick = () => { if (st.set(K.draft, D)) markClean("Draft saved " + new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })); else toast("Could not save — browser storage unavailable or full"); };
  $("#pubBtn").onclick = () => { if (!validAll()) return; if (st.set(K.pub, D) && st.set(K.draft, D)) { markClean("Published to preview"); toast("Published — open the public site in this browser to see it"); } else toast("Could not publish — storage unavailable or full (large photos?)"); };
})();
