/* TECH@IIMB 2027 — v3 behaviour. Each feature initialises only where its container exists. */
(function () {
  "use strict";
  const store = { get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } } };
  const DEF = window.TECH_DEFAULT_CONTENT, pub = store.get("techiimb.content.published");
  const C = pub && pub.version === DEF.version ? pub : DEF, S = C.settings;
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const safeUrl = (u) => { try { const x = new URL(u); return /^https?:$/.test(x.protocol) ? x.href : ""; } catch (e) { return ""; } };
  const safeImg = (u) => (typeof u === "string" && (/^data:image\/(png|jpe?g|webp);base64,/.test(u) || /^assets\/[\w./-]+$/.test(u)) ? u : "");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const AR = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4"/></svg>';
  const PLUS = '<span class="ch" aria-hidden="true"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 1v10M1 6h10"/></svg></span>';
  const day = (i) => `Day ${i + 1}`, pad = (n) => String(n).padStart(2, "0");
  let tt; const toast = (m) => { const t = $("#toast"); if (!t) return; t.textContent = m; t.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => t.classList.remove("show"), 2400); };

  /* ---------- motion: reveals, wipes, counters, bars ---------- */
  const reveal = (el) => {
    el.classList.add("in");
    $$("[data-count]", el).concat(el.matches("[data-count]") ? [el] : []).forEach(count);
    if (el.classList.contains("bars")) el.classList.add("grown");
  };
  const io = !reduce && "IntersectionObserver" in window ? new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { reveal(e.target); io.unobserve(e.target); } }), { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }) : null;
  const watch = (el) => (io ? io.observe(el) : reveal(el));
  function count(el) {
    if (el.dataset.done) return; el.dataset.done = 1; const to = +el.dataset.count; if (reduce) { el.textContent = to; return; }
    const t0 = performance.now(); (function f(t) { const k = Math.min(1, (t - t0) / 1300); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(f); })(t0);
  }
  const observeAll = () => $$(".rv:not(.in),.wipe:not(.in),.stats:not(.in)").forEach(watch);

  /* ---------- header, drawer, subnav, to-top ---------- */
  const mb = $("#menuBtn"), dr = $("#drawer");
  const setDrawer = (o) => { dr.classList.toggle("open", o); dr.setAttribute("aria-hidden", !o); mb.setAttribute("aria-expanded", o); document.body.style.overflow = o ? "hidden" : "";
    $$("a", dr).forEach((a, i) => (a.style.transitionDelay = o ? i * 40 + "ms" : "0ms")); if (o) $("#drawerClose").focus(); else mb.focus(); };
  if (mb) { mb.onclick = () => setDrawer(true); $("#drawerClose").onclick = () => setDrawer(false); $$("a", dr).forEach((a) => a.addEventListener("click", () => setDrawer(false))); }
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && dr && dr.classList.contains("open")) setDrawer(false); });
  const toTop = $("#toTop"); toTop.onclick = () => scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  const sub = $$(".subnav a"), secs = sub.map((a) => document.getElementById(a.hash.slice(1))).filter(Boolean);
  let tk = false;
  addEventListener("scroll", () => { if (tk) return; tk = true; requestAnimationFrame(() => {
    toTop.classList.toggle("show", scrollY > innerHeight);
    if (secs.length) { let cur = null; secs.forEach((s) => { if (s.getBoundingClientRect().top < innerHeight * 0.4) cur = s.id; }); sub.forEach((a) => a.classList.toggle("on", a.hash === "#" + cur)); }
    tk = false; }); }, { passive: true });

  document.addEventListener("click", async (e) => {
    const c = e.target.closest("[data-copy]"); if (c) { try { await navigator.clipboard.writeText(c.dataset.copy); toast("Email address copied"); } catch (err) { toast("Select the address to copy it"); } }
    const t = e.target.closest("a[data-type]"); if (t) { try { sessionStorage.setItem("techiimb.enqType", t.dataset.type); } catch (err) {} const sel = $("#fType"); if (sel && t.hash === "#enquire" && t.pathname === location.pathname) sel.value = t.dataset.type; }
  });

  /* ---------- tablists ---------- */
  function tabs(box, sel, fn) {
    box.addEventListener("click", (e) => { const b = e.target.closest(sel); if (b) fn($$(sel, box).indexOf(b)); });
    box.addEventListener("keydown", (e) => { const it = $$(sel, box), i = it.indexOf(document.activeElement); if (i < 0) return;
      const m = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]; let n = m ? (i + m + it.length) % it.length : e.key === "Home" ? 0 : e.key === "End" ? it.length - 1 : null;
      if (n === null) return; e.preventDefault(); fn(n); $$(sel, box)[n].focus(); });
  }
  const setSel = (l, i) => l.forEach((b, j) => { b.setAttribute("aria-selected", j === i); b.tabIndex = j === i ? 0 : -1; });

  /* ---------- activity dialog ---------- */
  let dlgApi = null;
  if ($("#dlg")) {
    const dlg = $("#dlg"); let opener = null;
    const open = (id, from) => {
      const i = C.activities.findIndex((a) => a.id === id); if (i < 0) return; const a = C.activities[i]; if (from) opener = from; const reg = safeUrl(a.registrationUrl);
      const rows = [["When", `${day(a.day)} · ${esc(a.time)} · ${esc(C.days[a.day].title)}`], ["Format", esc(a.format)], ["How it works", esc(a.how)], ["Eligibility", esc(a.eligibility)], ["Rules & judging", esc(a.rules)],
        ["Registration", reg ? `<a href="${esc(reg)}" rel="noopener">Register for ${esc(a.name)}</a>` : esc(S.registrationNote)], ["Questions", `<a href="contact.html#enquire" data-type="Activities &amp; challenges">${esc(S.email)}</a>`]].filter((r) => r[1]);
      dlg.innerHTML = `<div class="dlg-head"><span class="eyebrow">${esc(a.category)}</span><h2 id="dlgTitle">${esc(a.name)}</h2><p>${esc(a.desc)}</p><button class="dlg-x" type="button" data-x>Close</button></div>
        <div class="dlg-body"><dl>${rows.map((r) => `<div class="dr"><dt>${r[0]}</dt><dd>${r[1]}</dd></div>`).join("")}</dl></div>
        <div class="dlg-foot"><div class="pager"><button class="btn btn-ghost" type="button" data-step="-1">Previous</button><button class="btn btn-ghost" type="button" data-step="1">Next</button></div>
        ${reg ? `<a class="btn btn-red" href="${esc(reg)}" rel="noopener">Register ${AR}</a>` : `<a class="btn btn-red" href="contact.html#enquire" data-type="Activities &amp; challenges">Ask about this activity ${AR}</a>`}</div>`;
      $$("[data-step]", dlg).forEach((b) => (b.onclick = () => { const n = C.activities[(i + +b.dataset.step + C.activities.length) % C.activities.length]; open(n.id); $(`[data-step="${b.dataset.step}"]`, dlg).focus(); }));
      $("[data-x]", dlg).onclick = () => dlg.close();
      if (location.hash !== "#activity-" + a.id) history.replaceState(null, "", "#activity-" + a.id);
      if (!dlg.open) { dlg.showModal(); $("[data-x]", dlg).focus(); }
    };
    dlg.addEventListener("close", () => { if (/^#activity-/.test(location.hash)) history.replaceState(null, "", location.pathname); if (opener && document.contains(opener)) opener.focus(); });
    dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
    const fromHash = () => { const m = location.hash.match(/^#activity-([\w-]+)$/); if (m) open(m[1]); };
    addEventListener("hashchange", fromHash);
    document.addEventListener("click", (e) => { const a = e.target.closest('a[href^="#activity-"]'); if (a) { e.preventDefault(); open(a.hash.slice(10), a); } });
    dlgApi = { open, fromHash };
  }

  /* ---------- programme ---------- */
  if ($("#dayTabs")) {
    let d = Math.max(0, ["#day-1", "#day-2", "#day-3"].indexOf(location.hash)), type = "All";
    const tb = $("#dayTabs"), toMin = (t) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
    tb.innerHTML = C.days.map((x, i) => `<button class="daycard rv" style="--i:${i}" role="tab" id="dt-${i}" aria-controls="sessions" aria-selected="${i === d}" tabindex="${i === d ? 0 : -1}"><small>${esc(x.label)}</small><b>${esc(x.title)}</b><span>${esc(x.question)}</span></button>`).join("");
    const render = () => {
      const x = C.days[d]; setSel($$(".daycard", tb), d);
      $("#dayTitle").textContent = `${day(d)} — ${x.title}`;
      const types = ["All", ...new Set(x.sessions.map((s) => s.type))]; if (!types.includes(type)) type = "All";
      $("#typeFilter").innerHTML = types.map((t) => `<button type="button" class="pill sm" aria-pressed="${t === type}" data-t="${esc(t)}">${t === "All" ? "All" : esc(t)}</button>`).join("");
      $("#sessions").innerHTML = x.sessions.map((s, k) => `<div class="session swap${type !== "All" && s.type !== type ? " dim" : ""}" style="animation-delay:${k * 40}ms"><time>${esc(s.time)}</time><div><strong>${esc(s.title)}</strong>${s.detail ? `<small>${esc(s.detail)}</small>` : ""}${s.speaker ? `<small>${esc(s.speaker)}</small>` : ""}${s.venue ? `<small>${esc(s.venue)}</small>` : ""}</div><span class="badge${s.type === "Keynote" ? " red" : ""}">${esc(s.type)}</span></div>`).join("");
      const lo = 540, hi = 1080, b = $("#bars"); b.classList.remove("grown");
      b.innerHTML = x.attractions.map((a, k) => { const l = ((toMin(a.start) - lo) / (hi - lo)) * 100, w = ((toMin(a.end) - toMin(a.start)) / (hi - lo)) * 100;
        const at = a.activity ? `data-act="${esc(a.activity)}"` : a.link ? `data-href="startup.html"` : "";
        return `<button type="button" class="bar" ${at} ${at ? "" : 'aria-disabled="true"'}><span class="bl">${esc(a.name)}<span>${esc(a.start)}–${esc(a.end)}</span></span><span class="track" aria-hidden="true"><span class="fill" style="left:${l}%;width:${w}%;transition-delay:${k * 60}ms"></span></span></button>`; }).join("");
      requestAnimationFrame(() => (io ? io.observe(b) : b.classList.add("grown")));
    };
    tabs(tb, ".daycard", (i) => { d = i; history.replaceState(null, "", "#day-" + (i + 1)); render(); });
    $("#typeFilter").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { type = b.dataset.t; render(); } });
    $("#bars").addEventListener("click", (e) => { const b = e.target.closest(".bar"); if (!b) return; if (b.dataset.act) location.href = "exhibition.html#activity-" + b.dataset.act; else if (b.dataset.href) location.href = b.dataset.href; });
    addEventListener("hashchange", () => { const i = ["#day-1", "#day-2", "#day-3"].indexOf(location.hash); if (i >= 0) { d = i; render(); $("#programme").scrollIntoView(); } });
    render(); if (location.hash.startsWith("#day-")) setTimeout(() => $("#programme").scrollIntoView(), 50);
  }

  /* ---------- technology explorer + matrix ---------- */
  if ($("#tlist")) {
    const T = C.technologies, SEC = C.sectors, tl = $("#tlist"); let ti = 0;
    tl.innerHTML = T.map((t, i) => `<button role="tab" id="tt-${i}" aria-controls="tpanel" aria-selected="${i === 0}" tabindex="${i ? -1 : 0}"><span class="n">${pad(i + 1)}</span>${esc(t.name)}</button>`).join("");
    const panel = () => { const t = T[ti]; $("#tpanel").setAttribute("aria-labelledby", "tt-" + ti);
      $("#tpanel").innerHTML = `<div class="swap"><span class="eyebrow">Technology track ${pad(ti + 1)}</span><h3>${esc(t.name)}</h3><p class="what">${esc(t.what)}</p>
        <dl><dt>Why it matters for India</dt><dd>${esc(t.why)}</dd><dt>Questions on the table</dt><dd><ul>${t.questions.map((q) => `<li>${esc(q)}</li>`).join("")}</ul></dd>
        <dt>Connected sectors</dt><dd><div class="pills" style="margin-top:6px">${t.sectors.map((s) => `<span class="pill sm">${esc((SEC.find((x) => x.id === s) || {}).name)}</span>`).join("")}</div></dd></dl></div>`; };
    tabs(tl, "button", (i) => { ti = i; setSel($$("button", tl), i); panel(); }); panel();
  }
  if ($("#matrix")) {
    const T = C.technologies, SEC = C.sectors, m = $("#matrix");
    m.insertAdjacentHTML("beforeend", `<thead><tr><th scope="col"><span class="sr-only">Technology</span></th>${SEC.map((s, j) => `<th scope="col" data-c="${j}"><button type="button" data-s="${j}" aria-pressed="false">${esc(s.name)}</button></th>`).join("")}</tr></thead>
      <tbody>${T.map((t, i) => `<tr data-r="${i}"><th scope="row"><button type="button" data-t="${i}" aria-pressed="false">${esc(t.name)}</button></th>${SEC.map((s, j) => `<td data-c="${j}">${t.sectors.includes(s.id) ? '<span class="dot" role="img" aria-label="Connected"></span>' : '<span class="nil" aria-label="Not connected">·</span>'}</td>`).join("")}</tr>`).join("")}</tbody>`);
    const set = (k, i) => {
      $$("tr[data-r]", m).forEach((r) => r.classList.toggle("row-on", k === "t" && +r.dataset.r === i));
      $$("[data-c]", m).forEach((c) => c.classList.toggle("col-on", k === "s" && +c.dataset.c === i));
      $$("button[data-t]", m).forEach((b) => b.setAttribute("aria-pressed", k === "t" && +b.dataset.t === i));
      $$("button[data-s]", m).forEach((b) => b.setAttribute("aria-pressed", k === "s" && +b.dataset.s === i));
      let h; if (k === "s") { const s = SEC[i], ts = T.filter((t) => t.sectors.includes(s.id)).map((t) => esc(t.name));
        h = `<h3 class="h-m">${esc(s.name)}</h3><p class="muted" style="margin-top:8px">${esc(s.p)} Discussed on ${day(s.session.day)}, ${esc(s.session.time)} — ${esc(s.session.title)}. Connected technologies: ${ts.join(", ")}.</p>`; }
      else { const t = T[i]; h = `<h3 class="h-m">${esc(t.name)}</h3><p class="muted" style="margin-top:8px">Connects to ${SEC.filter((s) => t.sectors.includes(s.id)).map((s) => esc(s.name)).join(", ")} — explored across the Day 2 panels, roundtables and expert talks.</p>`; }
      $("#sectorNote").innerHTML = `<div class="swap">${h}</div>`; };
    m.addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; b.dataset.s != null ? set("s", +b.dataset.s) : set("t", +b.dataset.t); });
    set("s", 1);
  }

  /* ---------- speakers ---------- */
  if ($("#speakerBox")) {
    const list = (C.speakers || []).filter((s) => s.published && s.name), box = $("#speakerBox");
    const desc = { "Keynote speakers": "Opening, national and closing keynotes frame each day’s question.", "Industry leaders": "Leaders building and deploying technology at scale.", "Founders & investors": "Builders and backers of India’s start-up ecosystem.", "Researchers & academics": "Scholars from IIM Bangalore and beyond, bringing the evidence.", "Policymakers & regulators": "The people shaping the rules, including at the Lawmakers Conclave." };
    if (list.length) {
      box.innerHTML = `<div class="grid g4">${list.map((s, i) => { const img = safeImg(s.photo); return `<button type="button" class="card rv" style="--i:${i % 4};padding:0;overflow:hidden" data-i="${i}">${img ? `<img src="${esc(img)}" alt="Portrait of ${esc(s.name)}" style="width:100%;aspect-ratio:4/5;object-fit:cover" loading="lazy">` : ""}<div style="padding:18px"><h3 style="margin:0">${esc(s.name)}</h3><p>${esc(s.designation)}${s.organisation ? ", " + esc(s.organisation) : ""}</p></div></button>`; }).join("")}</div>`;
      const d = document.createElement("dialog"); d.setAttribute("aria-labelledby", "spT"); document.body.appendChild(d);
      box.addEventListener("click", (e) => { const b = e.target.closest("[data-i]"); if (!b) return; const s = list[+b.dataset.i], img = safeImg(s.photo);
        d.innerHTML = `<div class="dlg-head"><span class="eyebrow">Speaker</span><h2 id="spT">${esc(s.name)}</h2><p>${esc(s.designation)}${s.organisation ? ", " + esc(s.organisation) : ""}</p><button class="dlg-x" type="button" data-x>Close</button></div>
          <div class="dlg-body" style="display:grid;grid-template-columns:${img ? "170px 1fr" : "1fr"};gap:24px;padding-top:24px;padding-bottom:28px">${img ? `<img src="${esc(img)}" alt="" style="width:100%;aspect-ratio:4/5;object-fit:cover;border-radius:4px">` : ""}<div>${s.bio ? `<p class="muted">${esc(s.bio)}</p>` : ""}${s.session ? `<p style="margin-top:14px"><b>Session:</b> ${esc(s.session)}</p>` : ""}</div></div>`;
        $("[data-x]", d).onclick = () => d.close(); d.showModal(); d.addEventListener("close", () => b.focus(), { once: true }); });
      d.addEventListener("click", (e) => { if (e.target === d) d.close(); });
    } else {
      box.innerHTML = `<p class="body-l rv" style="margin-bottom:28px">TECH@IIMB brings keynote speakers, industry leaders, founders, investors, researchers, academics and policymakers into one conversation. The speaker line-up is announced in June 2027.</p>
        <div class="grid g3">${C.speakerCategories.map((c, i) => `<div class="card rv" style="--i:${i % 3}"><span class="k">${pad(i + 1)}</span><h3>${esc(c)}</h3><p>${esc(desc[c] || "")}</p></div>`).join("")}
        <a class="card navy rv" style="--i:2" href="contact.html#enquire" data-type="Speaking opportunity"><span class="k">06</span><h3>Speak at TECH@IIMB</h3><p>Recommend a speaker or enquire about speaking opportunities.</p><span class="more link">Speaking enquiry ${AR}</span></a></div>`;
    }
  }

  /* ---------- activities ---------- */
  if ($("#agrid")) {
    let cat = "All", dd = -1, q = "";
    $("#catFilter").innerHTML = ["All", ...C.activityCategories].map((c) => `<button type="button" class="pill sm" aria-pressed="${c === cat}" data-c="${esc(c)}">${c === "All" ? "All activities" : esc(c)}</button>`).join("");
    $("#dayFilter").innerHTML = [-1, 0, 1, 2].map((x) => `<button type="button" class="pill sm" aria-pressed="${x === dd}" data-d="${x}">${x < 0 ? "Every day" : day(x)}</button>`).join("");
    const render = () => {
      $$("#catFilter button").forEach((b) => b.setAttribute("aria-pressed", b.dataset.c === cat)); $$("#dayFilter button").forEach((b) => b.setAttribute("aria-pressed", +b.dataset.d === dd));
      const L = C.activities.filter((a) => (cat === "All" || a.category === cat) && (dd < 0 || a.day === dd) && (!q || q.split(/\s+/).every((w) => (a.name + " " + a.tag + " " + a.desc + " " + a.how).toLowerCase().includes(w))));
      $("#count").textContent = `${L.length} of ${C.activities.length} activities`;
      $("#agrid").innerHTML = L.length ? L.map((a, k) => `<button type="button" class="card act swap" style="animation-delay:${k * 35}ms" data-id="${esc(a.id)}" aria-haspopup="dialog"><span class="meta"><span>${esc(a.tag)}</span><span>${pad(C.activities.indexOf(a) + 1)}</span></span><h3>${esc(a.name)}</h3><p>${esc(a.desc)}</p><span class="when"><span>${day(a.day)} · ${esc(a.time)}</span><span aria-hidden="true">→</span></span></button>`).join("")
        : `<div class="empty"><b>No activities match.</b><br>Try another category or day, or <button type="button" class="link" id="clr">clear the filters</button>.</div>`;
      const c = $("#clr"); if (c) c.onclick = () => { cat = "All"; dd = -1; q = ""; $("#q").value = ""; render(); };
    };
    $("#catFilter").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { cat = b.dataset.c; render(); } });
    $("#dayFilter").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { dd = +b.dataset.d; render(); } });
    let st; $("#q").addEventListener("input", (e) => { clearTimeout(st); st = setTimeout(() => { q = e.target.value.trim().toLowerCase(); render(); }, 120); });
    $("#agrid").addEventListener("click", (e) => { const b = e.target.closest(".act"); if (b && dlgApi) dlgApi.open(b.dataset.id, b); });
    render();
  }
  if (dlgApi) dlgApi.fromHash();

  /* ---------- futuretech ---------- */
  if ($("#steps")) {
    const F = C.futuretech; $("#ftIntro").textContent = F.intro; const apply = safeUrl(F.applyUrl);
    $("#ftActions").innerHTML = apply ? `<a class="btn btn-red" href="${esc(apply)}" rel="noopener">Apply on ${esc(F.applyPlatform)} ${AR}</a><a class="link" href="contact.html#enquire" data-type="FutureTech Challenge">Ask a question</a>`
      : `<a class="btn btn-red" href="contact.html#enquire" data-type="FutureTech Challenge">Ask about the challenge ${AR}</a><a class="link" href="#pitch">About the FutureTech Pitch</a>`;
    const extra = ["Challenge registrations open in February–March 2027.", "Each round narrows the field towards the teams who will present in Bengaluru.", "Shortlisted teams are invited to the final at the symposium.", "The FutureTech Challenge Final takes place on Day 3 of TECH@IIMB 2027, 14:00 – 15:30, at IIM Bangalore."];
    const st = $("#steps"); st.innerHTML = F.steps.map((s, i) => `<button class="step rv" style="--i:${i}" role="tab" id="fs-${i}" aria-controls="stepPanel" aria-selected="${i === 0}" tabindex="${i ? -1 : 0}"><small>Step ${pad(i + 1)}</small><b>${esc(s.h)}</b></button>`).join("");
    const show = (i) => { setSel($$(".step", st), i); $("#stepPanel").setAttribute("aria-labelledby", "fs-" + i); $("#stepPanel").innerHTML = `<div class="swap"><h3 class="h-m">${esc(F.steps[i].h)}</h3><p class="body-l" style="margin-top:8px">${esc(F.steps[i].p)} ${esc(extra[i] || "")}</p></div>`; };
    tabs(st, ".step", show); show(0);
    $("#ftInfo").innerHTML = F.info.map((x, i) => `<div class="card rv" style="--i:${i}"><span class="k">${pad(i + 1)}</span><h3>${esc(x.h)}</h3><p>${esc(x.v)}</p></div>`).join("");
    const th = (F.themes || []).filter(Boolean); if (th.length) $("#ftThemes").innerHTML = `<h3 class="h-m" style="margin-top:40px">Challenge themes</h3><div class="pills" style="margin-top:14px">${th.map((t) => `<span class="pill">${esc(t)}</span>`).join("")}</div>`;
  }

  /* ---------- about ---------- */
  if ($("#ttcs")) {
    const t = $("#ttcs"); t.innerHTML = C.pillars.map((p, i) => `<button class="step rv" style="--i:${i}" role="tab" id="pp-${i}" aria-controls="ttcsPanel" aria-selected="${i === 0}" tabindex="${i ? -1 : 0}"><small>${esc(p.n)}</small><b>${esc(p.k)}</b></button>`).join("");
    const show = (i) => { setSel($$(".step", t), i); const p = C.pillars[i]; $("#ttcsPanel").setAttribute("aria-labelledby", "pp-" + i); $("#ttcsPanel").innerHTML = `<div class="swap"><h3 class="h-m">${esc(p.h)}</h3><p class="body-l" style="margin-top:8px">${esc(p.p)}</p></div>`; };
    tabs(t, ".step", show); show(0);
  }
  if ($("#pillars")) $("#pillars").innerHTML = C.frameworks.map((f, i) => `<div style="padding:18px 0;border-top:1px solid var(--line)"><span class="eyebrow">${pad(i + 1)}</span><h3 class="h-s" style="margin-top:8px">${esc(f.h)}</h3><p class="muted" style="margin-top:6px">${esc(f.p)}</p></div>`).join("");
  if ($("#approachGrid")) $("#approachGrid").innerHTML = C.approach.map((a, i) => `<div class="card rv" style="--i:${i}"><span class="k">${pad(i + 1)}</span><h3>${esc(a.h)}</h3><p>${esc(a.p)}</p></div>`).join("");
  if ($("#csitmGrid")) $("#csitmGrid").innerHTML = C.whyCsitm.map((w, i) => `<div class="card rv" style="--i:${i % 2};padding:20px"><h3 style="margin:0;font-size:1.2rem">${esc(w.h)}</h3><p>${esc(w.p)}</p></div>`).join("");
  if ($("#reach")) $("#reach").innerHTML = C.reach.map((r) => `<span class="pill">${esc(r)}</span>`).join("");

  /* ---------- news + timeline ---------- */
  if ($("#news")) {
    const lim = +($("#news").dataset.limit || 99), n = (C.announcements || []).filter((a) => a.published).sort((a, b) => (b.date || "").localeCompare(a.date || "")).slice(0, lim);
    const extra = [{ k: "Pre-events", title: "December 2026: panel discussion on robotics", body: "The first pre-event, alongside the first poster release, opens the road to August 2027.", href: "pre-events.html" }];
    $("#news").innerHTML = n.map((a, i) => { const d = a.date ? new Date(a.date + "T00:00:00") : null;
      return `<article class="card rv" style="--i:${i}"><time datetime="${esc(a.date)}">${d && !isNaN(d) ? d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : ""}</time><h3>${esc(a.title)}</h3><p>${esc(a.body)}</p></article>`; }).join("")
      + (n.length < 3 ? extra.map((x) => `<a class="card rv" style="--i:2" href="${x.href}"><span class="k">${x.k}</span><h3>${x.title}</h3><p>${x.body}</p><span class="more link">Pre-events ${AR}</span></a>`).join("") : "");
  }
  if ($("#timeline")) {
    const P = C.pathway, now = new Date(), ym = now.getFullYear() + "-" + pad(now.getMonth() + 1); let cur = -1; P.forEach((p, i) => { if (p.ym <= ym) cur = i; });
    $("#timeline").innerHTML = `<span class="prog" id="tlProg" aria-hidden="true"></span>` + P.map((p, i) => `<li class="${i < cur ? "past" : ""}${i === cur ? " now" : ""}${i === P.length - 1 ? " final" : ""}"><span class="when">${esc(p.when)}</span><span class="dot" aria-hidden="true"></span>
      <div class="body card rv" style="--i:0"><span class="status">${i < cur ? "Completed" : i === cur ? "Now" : i === P.length - 1 ? "The symposium" : p.pre ? "Pre-event " + pad(p.pre) : "Upcoming"}</span><h3>${esc(p.h)}</h3><p>${esc(p.p)}</p></div></li>`).join("");
    const prog = $("#tlProg"), lis = $$("#timeline li");
    const grow = () => { if (cur < 0) return; const tgt = lis[cur].offsetTop + 30; prog.style.height = tgt + "px"; };
    io ? new IntersectionObserver(([e], o) => { if (e.isIntersecting) { grow(); o.disconnect(); } }, { threshold: 0.2 }).observe($("#timeline")) : grow();
  }

  /* ---------- contact: audiences, FAQ ---------- */
  if ($("#aud")) {
    const A = C.audiences, href = { about: "about.html", programme: "discussions.html", technology: "discussions.html#tracks", activities: "exhibition.html#experiences", futuretech: "startup.html", speakers: "pre-events.html", participate: "#enquire" };
    const lab = { about: "About the symposium", programme: "Discussions", technology: "Technology tracks", activities: "Activities & challenges", futuretech: "FutureTech Challenge", speakers: "Pre-events & news", participate: "Send an enquiry" };
    const au = $("#aud"); au.innerHTML = A.map((a, i) => `<button class="step rv" style="--i:${i % 3}" role="tab" id="au-${i}" aria-controls="audPanel" aria-selected="${i === 0}" tabindex="${i ? -1 : 0}"><small>${pad(i + 1)}</small><b>${esc(a.h)}</b></button>`).join("");
    const show = (i) => { setSel($$(".step", au), i); const a = A[i]; $("#audPanel").setAttribute("aria-labelledby", "au-" + i);
      $("#audPanel").innerHTML = `<div class="swap"><h3 class="h-m">${esc(a.h)}</h3><p class="body-l" style="margin-top:8px">${esc(a.p)}</p><div class="row" style="margin-top:18px">${a.links.map((l, k) => k === 0 ? `<a class="btn btn-white" href="${href[l]}">${lab[l]} ${AR}</a>` : `<a class="link" href="${href[l]}">${lab[l]}</a>`).join("")}</div></div>`; };
    tabs(au, ".step", show); show(0);
  }
  if ($("#faqList")) {
    $("#faqList").innerHTML = C.faqs.map((f, i) => `<h3><button class="acc-btn" type="button" aria-expanded="false" aria-controls="fa-${i}" id="fq-${i}">${esc(f.q)}${PLUS}</button></h3><div class="acc-panel" id="fa-${i}" role="region" aria-labelledby="fq-${i}"><div><p>${esc(f.a)}</p></div></div>`).join("");
    $$(".acc-panel").forEach((p) => p.setAttribute("aria-hidden", "true"));
    $("#faqList").addEventListener("click", (e) => { const b = e.target.closest(".acc-btn"); if (!b) return; const o = b.getAttribute("aria-expanded") !== "true"; b.setAttribute("aria-expanded", o); const p = $("#" + b.getAttribute("aria-controls")); p.classList.toggle("open", o); p.setAttribute("aria-hidden", !o); });
  }

  /* ---------- enquiry form → csitm@iimb.ac.in ---------- */
  if ($("#form")) {
    const f = $("#form"), status = $("#status"), btn = $("#send");
    try { const t = sessionStorage.getItem("techiimb.enqType"); if (t) { $("#fType").value = t; sessionStorage.removeItem("techiimb.enqType"); } } catch (e) {}
    const rules = { name: (v) => (v.trim().length < 2 ? "Enter your full name." : ""), email: (v) => (/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(v.trim()) ? "" : "Enter a valid email address."), type: (v) => (v ? "" : "Choose an enquiry type."), message: (v) => (v.trim().length < 10 ? "Write at least 10 characters." : "") };
    const check = (el) => { const m = rules[el.name](el.value), w = el.closest(".f"); w.classList.toggle("err", !!m); w.querySelector(".msg").textContent = m; el.setAttribute("aria-invalid", !!m); return !m; };
    Object.keys(rules).forEach((n) => { const el = f.elements[n]; const ms = el.closest(".f").querySelector(".msg"); ms.id = el.id + "-m"; el.setAttribute("aria-describedby", ms.id); el.addEventListener("blur", () => check(el)); el.addEventListener("input", () => { if (el.closest(".f").classList.contains("err")) check(el); }); });
    const show = (ok, h) => { status.className = "status show" + (ok ? "" : " bad"); status.innerHTML = h; status.focus(); };
    f.addEventListener("submit", async (e) => {
      e.preventDefault(); if (f.elements._honey.value) return;
      const valid = Object.keys(rules).map((n) => check(f.elements[n])).every(Boolean), consent = $("#fConsent").checked;
      $("#consentMsg").textContent = consent ? "" : "Please confirm that the team may use your details to reply.";
      if (!valid || !consent) { ($(".f.err input,.f.err select,.f.err textarea", f) || $("#fConsent")).focus(); return; }
      const d = { name: f.elements.name.value.trim(), email: f.elements.email.value.trim(), organisation: f.elements.organisation.value.trim(), type: f.elements.type.value, message: f.elements.message.value.trim(), page: document.title };
      const ep = safeUrl(S.formEndpoint), html0 = btn.innerHTML; btn.disabled = true; btn.textContent = "Sending…"; status.className = "status";
      try {
        if (!ep) throw new Error("no endpoint");
        const ctrl = new AbortController(), to = setTimeout(() => ctrl.abort(), 15000);
        const r = await fetch(ep, { method: "POST", signal: ctrl.signal, headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ ...d, _subject: `TECH@IIMB 2027 enquiry: ${d.type} — ${d.name}`, _replyto: d.email, _template: "table", _captcha: "false" }) });
        clearTimeout(to); const j = await r.json().catch(() => ({}));
        if (!r.ok || j.success === false || j.success === "false") throw new Error(j.message || "HTTP " + r.status);
        show(true, `<b>Thank you, ${esc(d.name.split(" ")[0])}.</b>Your enquiry has been sent to the TECH@IIMB organising team at csitm@iimb.ac.in. A reply will come to ${esc(d.email)}.`); f.reset();
      } catch (err) {
        const body = encodeURIComponent(`${d.message}\n\n— ${d.name}${d.organisation ? ", " + d.organisation : ""}\n${d.email}`);
        show(false, `<b>Your enquiry could not be sent just now.</b>Please try again in a moment, or email it directly to <a href="mailto:${esc(S.email)}?subject=${encodeURIComponent("TECH@IIMB 2027 enquiry: " + d.type)}&amp;body=${body}">${esc(S.email)}</a>. Your message is still in the form.`);
      } finally { btn.disabled = false; btn.innerHTML = html0; }
    });
  }

  /* ---------- PDF downloads inside the Claude artifact viewer (no effect on a normal web host) ---------- */
  if (window.claude && typeof window.claude.use === "function") {
    window.claude.use("downloads").then((dl) => {
      if (!dl) return;
      document.addEventListener("click", async (e) => {
        const a = e.target.closest("a[download]"); if (!a) return; e.preventDefault();
        try { const r = await fetch(a.href); if (!r.ok) throw { code: "unavailable" }; await dl.save({ filename: a.href.split("/").pop(), data: await r.blob() }); toast("Download saved"); }
        catch (err) { if (err && err.code === "declined") return; toast("Download isn’t available in this view"); }
      });
    }).catch(() => {});
  }

  observeAll();
})();
