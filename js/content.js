/*
 * TECH@IIMB 2027 — single source of content for every public page.
 * Sources: the TECH@IIMB 2027 booklet, concept note, website brief and content plan.
 * Empty fields are simply not shown on the site. admin.html edits a copy of this object.
 */
window.TECH_DEFAULT_CONTENT = {
  version: 2,
  settings: {
    eventName: "TECH@IIMB 2027",
    theme: "The Next Technology Revolution: India at the Frontier",
    tagline: "Understand it. Question it. Shape it.",
    month: "August 2027",
    startDate: "",            // ISO date (YYYY-MM-DD). Countdown appears once set.
    endDate: "",
    venue: "IIM Bangalore",
    address: "Indian Institute of Management Bangalore, Bannerghatta Road, Bengaluru, Karnataka 560076",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Indian+Institute+of+Management+Bangalore",
    email: "csitm@iimb.ac.in",
    phone: "",
    registrationUrl: "",      // when set, "Register" buttons link here
    registrationNote: "Challenge registrations open in February–March 2027.",
    social: { linkedin: "", instagram: "", x: "", youtube: "" },
    // Email delivery for the enquiry form. FormSubmit forwards each submission to the address in the URL.
    // The first submission triggers a one-time activation email to csitm@iimb.ac.in that must be confirmed.
    formEndpoint: "https://formsubmit.co/ajax/csitm@iimb.ac.in"
  },

  pillars: [
    { n: "01", k: "Think", h: "A space to think, not just to showcase.", p: "Rigorous inquiry and grounded debate on where technologies are heading and what they mean for organisations, markets and society." },
    { n: "02", k: "Test", h: "Evidence alongside experience.", p: "Research findings meet operating experience and policy realities, so conclusions are tested from more than one side." },
    { n: "03", k: "Connect", h: "Perspectives that rarely share a room.", p: "Academics, founders, regulators and technology builders participate in one conversation, with room to disagree productively." },
    { n: "04", k: "Shape", h: "From dialogue to direction.", p: "Exchanges build lasting connections and sharpen the questions India’s technology leaders take back to their work." }
  ],

  frameworks: [
    { h: "Conversation across disciplines", p: "Bring academic research, industry practice and public policy into the same room. Connecting distinct perspectives can build a fuller understanding of technology’s opportunities, trade-offs and consequences." },
    { h: "India as a technology context", p: "Place India’s experience at the centre of the discussion. Initiatives such as Aadhaar, UPI and the wider India Stack offer distinctive perspectives on digital transformation, with lessons relevant to India and the wider Global South." },
    { h: "Collaboration & capability building", p: "Strengthen connections among stakeholders and support the capabilities needed for India to shape technology’s future and leadership." }
  ],

  approach: [
    { h: "Neutral by design", p: "Convened by an academic institution with no single product, platform or policy position to promote. Firms, regulators and researchers can speak candidly." },
    { h: "Evidence-led", p: "Claims about AI, tokenised assets and digital public infrastructure are examined against research and real-world practice." },
    { h: "India at the centre", p: "Aadhaar, UPI and the India Stack are treated as primary case studies, with lessons for India and the wider Global South." },
    { h: "Research. Practice. Policy. Together.", p: "Three days built around cross-sector conversation rather than separate tracks for separate audiences." }
  ],

  whyCsitm: [
    { h: "Research depth", p: "CSITM, Information Systems and IIM Bangalore faculty work on themes including AI in organisations, blockchain and token economies, Digital Public Infrastructure and technology in development contexts." },
    { h: "Convening reach", p: "The Centre engages with academia, government and industry through events, projects and related activities." },
    { h: "Institutional credibility", p: "IIM Bangalore offers a trusted setting for candid conversations among firms, regulators, researchers and other stakeholders." },
    { h: "Bengaluru ecosystem", p: "As India’s technology capital, Bengaluru brings together global capability centres, a dense start-up ecosystem and many of the builders of India’s digital public infrastructure." }
  ],

  days: [
    {
      id: "day1", label: "Day 01", title: "The Technology Frontier", question: "What is coming?",
      summary: "Expert sessions and discussions on emerging technologies, the launch of the CSITM Tech Report, a technology expo, Frontier Labs, product showcases and the NSRCEL product launch — plus activities and challenges throughout the day.",
      sessions: [
        { time: "08:30 – 09:30", title: "Registration", type: "Registration", detail: "", venue: "" },
        { time: "10:00 – 11:00", title: "Opening Keynote and launch of the CSITM Tech Report", type: "Keynote", detail: "", venue: "" },
        { time: "11:00 – 12:30", title: "Speaker Session", type: "Session", detail: "", venue: "" },
        { time: "12:30 – 13:30", title: "Hosted Technology Tables", type: "Networking", detail: "Lunch", venue: "" },
        { time: "13:30 – 15:00", title: "Expert Q&A", type: "Session", detail: "", venue: "" },
        { time: "15:30 – 17:00", title: "Tech for India Workshop", type: "Workshop", detail: "", venue: "" },
        { time: "17:00 – 18:00", title: "Debate", type: "Debate", detail: "", venue: "" },
        { time: "18:00 onwards", title: "Technology Leaders Dinner", type: "Networking", detail: "", venue: "" }
      ],
      attractions: [
        { name: "Tech Expo", start: "10:00", end: "17:00" },
        { name: "Frontier Futures Exchange", start: "10:00", end: "17:00", activity: "frontier-futures-exchange" },
        { name: "Frontier Labs", start: "10:00", end: "17:00" },
        { name: "Design Battle", start: "11:00", end: "12:30", activity: "design-battle" },
        { name: "Breach the Vault", start: "11:00", end: "15:00", activity: "breach-the-vault" },
        { name: "Tech Case Challenge", start: "14:00", end: "15:30", activity: "tech-case-challenge" }
      ]
    },
    {
      id: "day2", label: "Day 02", title: "Technology Meets Sectors", question: "What will it change?",
      summary: "Six sectors — AI Tech, FinTech, HealthTech, EdTech, AgriTech, and ClimateTech & Energy — explored through panel discussions, expert talks and roundtables. A Hardware Foundry, Tech Escape Room, Open Quiz Challenge and Agent vs Analyst run alongside.",
      sessions: [
        { time: "09:00 – 09:30", title: "Registration", type: "Registration", detail: "", venue: "" },
        { time: "10:00 – 10:30", title: "Opening Keynote", type: "Keynote", detail: "", venue: "" },
        { time: "11:00 – 12:30", title: "Panel Discussions", type: "Panel", detail: "FinTech · EdTech", venue: "" },
        { time: "12:30 – 13:30", title: "Sector Table", type: "Networking", detail: "Lunch", venue: "" },
        { time: "13:30 – 15:00", title: "Roundtable Discussions", type: "Roundtable", detail: "AgriTech · ClimateTech & Energy", venue: "" },
        { time: "15:30 – 17:00", title: "Expert Talks", type: "Session", detail: "AI Tech · HealthTech", venue: "" },
        { time: "17:00 – 18:00", title: "Debate", type: "Debate", detail: "", venue: "" }
      ],
      attractions: [
        { name: "Prompt Detective", start: "10:00", end: "16:00", activity: "prompt-detective" },
        { name: "Tech Escape Room", start: "10:00", end: "16:00", activity: "tech-escape-room" },
        { name: "Hardware Foundry", start: "11:00", end: "16:00", activity: "hardware-foundry" },
        { name: "Agent vs Analyst", start: "14:00", end: "15:30", activity: "agent-vs-analyst" },
        { name: "Open Quiz Challenge", start: "15:00", end: "16:00", activity: "open-quiz-challenge" }
      ]
    },
    {
      id: "day3", label: "Day 03", title: "India @ the Frontier", question: "What should India build?",
      summary: "India’s potential and the global market. A Lawmakers Conclave puts policymakers and the people building tech in the same room. The day closes with the Great Technology Debate, the closing keynote and the release of the Bengaluru Declaration on Technology 2030.",
      sessions: [
        { time: "09:00 – 09:30", title: "Registration", type: "Registration", detail: "", venue: "" },
        { time: "10:00 – 11:00", title: "National Keynote", type: "Keynote", detail: "", venue: "" },
        { time: "11:30 – 12:30", title: "Expert Hot Seat", type: "Session", detail: "", venue: "" },
        { time: "12:30 – 13:30", title: "Lunch", type: "Networking", detail: "", venue: "" },
        { time: "13:30 – 15:00", title: "Lawmakers Conclave", type: "Policy", detail: "A small-format session where policymakers and the people building tech sit in the same room and talk directly.", venue: "" },
        { time: "15:30 – 16:30", title: "The Great Technology Debate", type: "Debate", detail: "", venue: "" },
        { time: "17:00 – 18:00", title: "Closing Keynote and Bengaluru Declaration on Technology 2030", type: "Keynote", detail: "", venue: "" }
      ],
      attractions: [
        { name: "Tech Hunt", start: "11:00", end: "12:30", activity: "tech-hunt" },
        { name: "Code Golf", start: "11:00", end: "12:30", activity: "code-golf" },
        { name: "Lightning Talk", start: "11:00", end: "16:00", activity: "lightning-talk" },
        { name: "FutureTech Pitch", start: "13:30", end: "15:00", activity: "futuretech-pitch" },
        { name: "FutureTech Challenge Final", start: "14:00", end: "15:30", link: "futuretech" }
      ]
    }
  ],

  technologies: [
    { id: "genai", name: "Generative AI", short: "Gen AI",
      what: "Models that produce text, images, code and other content from prompts.",
      why: "For India, generative AI raises questions about multilingual access, productivity in a services-led economy, and how organisations govern quality, trust and intellectual property.",
      questions: ["Which work changes first, and how do organisations adapt?", "How do we evaluate outputs we can’t easily verify?"],
      sectors: ["ai", "edtech", "healthtech", "fintech"] },
    { id: "agentic", name: "Agentic AI", short: "Agents",
      what: "AI systems that plan and carry out multi-step tasks using tools, with varying degrees of autonomy.",
      why: "As agents move into enterprise operations — including India’s global capability centres — accountability, oversight and the value of human judgment become central questions.",
      questions: ["Where should humans stay in the loop?", "Who is accountable when an agent acts?"],
      sectors: ["ai", "fintech", "healthtech", "agritech"] },
    { id: "tokenised", name: "Tokenised assets & blockchain", short: "Tokens",
      what: "Representing assets and rights as digital tokens on shared ledgers.",
      why: "Tokenisation is being tested in financial market infrastructure worldwide. India’s experience with payments innovation offers a distinctive lens on regulation, settlement and trust.",
      questions: ["What does tokenisation change about market infrastructure?", "How should regulation keep pace?"],
      sectors: ["fintech", "climate", "agritech"] },
    { id: "dpi", name: "Digital Public Infrastructure", short: "DPI",
      what: "Population-scale shared digital rails — identity, payments and data exchange — such as Aadhaar, UPI and the wider India Stack.",
      why: "India’s DPI is a primary case study for the symposium, with lessons for India and the wider Global South on inclusion, competition and governance.",
      questions: ["What made India’s DPI work at scale?", "What travels to other countries — and what doesn’t?"],
      sectors: ["fintech", "healthtech", "edtech", "agritech"] },
    { id: "quantum", name: "Quantum computing", short: "Quantum",
      what: "Computing that uses quantum-mechanical effects to tackle specific classes of problems.",
      why: "Research capability, talent and readiness for changes in cryptography are long-horizon questions for India.",
      questions: ["What is realistic, and on what timeline?", "How should organisations prepare today?"],
      sectors: ["ai", "fintech", "climate"] },
    { id: "semis", name: "Semiconductors", short: "Chips",
      what: "The chips that underpin computing, communications and every technology on this page.",
      why: "Chip design talent, manufacturing ambitions and supply-chain resilience shape India’s technology future.",
      questions: ["Where can India build durable advantage?", "How exposed are supply chains?"],
      sectors: ["ai", "climate", "healthtech"] }
  ],

  sectors: [
    { id: "ai", name: "AI Tech", p: "Intelligent systems and the next wave of AI.", session: { day: 1, time: "15:30 – 17:00", title: "Expert Talks" } },
    { id: "fintech", name: "FinTech", p: "Technology reshaping financial services.", session: { day: 1, time: "11:00 – 12:30", title: "Panel Discussions" } },
    { id: "healthtech", name: "HealthTech", p: "New possibilities for healthcare delivery.", session: { day: 1, time: "15:30 – 17:00", title: "Expert Talks" } },
    { id: "edtech", name: "EdTech", p: "Technology transforming education and learning.", session: { day: 1, time: "11:00 – 12:30", title: "Panel Discussions" } },
    { id: "agritech", name: "AgriTech", p: "Digital innovation across agriculture.", session: { day: 1, time: "13:30 – 15:00", title: "Roundtable Discussions" } },
    { id: "climate", name: "ClimateTech & Energy", p: "Technology for climate and energy transitions.", session: { day: 1, time: "13:30 – 15:00", title: "Roundtable Discussions" } }
  ],

  activityCategories: [
    "Cybersecurity & problem-solving",
    "Design, creativity & communication",
    "Coding & business",
    "AI, innovation & exploration"
  ],

  activities: [
    { id: "breach-the-vault", name: "Breach the Vault", category: "Cybersecurity & problem-solving", tag: "Cybersecurity", day: 0, time: "11:00 – 15:00",
      desc: "A cybersecurity challenge for ethical hacking and digital security.",
      how: "Solve puzzles on web security, cryptography, digital forensics, phishing detection and physical security. Earn points as the live leaderboard tracks top performers.",
      format: "Individual or pairs", eligibility: "", rules: "", registrationUrl: "" },
    { id: "hardware-foundry", name: "Hardware Foundry", category: "AI, innovation & exploration", tag: "Hardware & innovation", day: 1, time: "11:00 – 16:00",
      desc: "A hands-on innovation space where students, startups and researchers showcase prototypes.",
      how: "Prototypes include sensors, drones, IoT boards and printed circuit boards. Explore inventions through demonstrations and hands-on interactions.",
      format: "Showcase & hands-on experience", eligibility: "", rules: "", registrationUrl: "" },
    { id: "tech-escape-room", name: "Tech Escape Room", category: "Cybersecurity & problem-solving", tag: "Team challenge", day: 1, time: "10:00 – 16:00",
      desc: "A team-based challenge featuring technology-themed puzzles.",
      how: "Puzzles span cybersecurity, cryptography and logical reasoning. Work together, crack the clues, and escape before time runs out.",
      format: "Team", eligibility: "", rules: "", registrationUrl: "" },
    { id: "design-battle", name: "Design Battle", category: "Design, creativity & communication", tag: "Design & creativity", day: 0, time: "11:00 – 12:30",
      desc: "Teams get a poorly designed app or website and 60 minutes to redesign it.",
      how: "Surprise challenges and design restrictions add to the pressure. Each team gets two minutes to present, and the audience votes for the winner.",
      format: "Team · 60-minute redesign · 2-minute presentation", eligibility: "", rules: "", registrationUrl: "" },
    { id: "lightning-talk", name: "Lightning Talk", category: "Design, creativity & communication", tag: "Communication", day: 2, time: "11:00 – 16:00",
      desc: "An individual challenge with a random technology topic.",
      how: "Speak for five minutes, testing knowledge, quick thinking, communication and the ability to articulate ideas on the spot.",
      format: "Individual · 5 minutes", eligibility: "", rules: "", registrationUrl: "" },
    { id: "code-golf", name: "Code Golf", category: "Coding & business", tag: "Programming", day: 2, time: "11:00 – 12:30",
      desc: "Solve programming challenges under time constraints by writing the shortest possible code.",
      how: "The participant with the shortest code in the least time wins.",
      format: "Individual", eligibility: "", rules: "", registrationUrl: "" },
    { id: "frontier-futures-exchange", name: "Frontier Futures Exchange", category: "AI, innovation & exploration", tag: "Prediction market", day: 0, time: "10:00 – 17:00",
      desc: "A prediction market where participants use free virtual tokens to forecast what comes next in AI — from innovations to model performance.",
      how: "Three rotating challenges are featured: Machine vs Market, Scenario Flash and Forecast Duel. A new round begins every 20 minutes. Real-time market prices show the crowd’s view, and each round ends with the Frontier Futures Index announcement naming the most accurate forecasters.",
      format: "Open · free virtual tokens · 20-minute rounds", eligibility: "", rules: "", registrationUrl: "" },
    { id: "tech-case-challenge", name: "Tech Case Challenge", category: "Coding & business", tag: "Business problem-solving", day: 0, time: "14:00 – 15:30",
      desc: "A team challenge for groups of up to three participants.",
      how: "Teams receive real industry problems and limited time to develop a solution.",
      format: "Teams of up to 3", eligibility: "", rules: "", registrationUrl: "" },
    { id: "prompt-detective", name: "Prompt Detective", category: "AI, innovation & exploration", tag: "Generative AI", day: 1, time: "10:00 – 16:00",
      desc: "Study an AI-generated image and guess the prompt that could have created it.",
      how: "The closest and most creative prompt wins.",
      format: "", eligibility: "", rules: "", registrationUrl: "" },
    { id: "tech-hunt", name: "Tech Hunt", category: "Cybersecurity & problem-solving", tag: "Campus challenge", day: 2, time: "11:00 – 12:30",
      desc: "A technology-themed treasure hunt.",
      how: "Follow clues, solve puzzles and complete challenges from one destination to the next. Each clue tests technology knowledge, logical thinking, problem-solving and observation.",
      format: "", eligibility: "", rules: "", registrationUrl: "" },
    { id: "agent-vs-analyst", name: "Agent vs Analyst", category: "Coding & business", tag: "AI vs human judgment", day: 1, time: "14:00 – 15:30",
      desc: "A live challenge where an AI agent competes with a team of four IIMB MBA students.",
      how: "Both sides solve the same business case and analyse the same data within 45 minutes, then present recommendations to judges. The event compares their strengths and weaknesses, exploring AI capability and the value of human judgment.",
      format: "Live showcase · 45-minute case", eligibility: "", rules: "", registrationUrl: "" },
    { id: "futuretech-pitch", name: "FutureTech Pitch", category: "AI, innovation & exploration", tag: "Ideas & pitching", day: 2, time: "13:30 – 15:00",
      desc: "A closed, judge-selected pitch opportunity for students and researchers.",
      how: "Present novel models, prototypes and research ideas to industry leaders, founders and investors. Only six selected ideas will be presented, with opportunities for funding, mentorship or collaboration.",
      format: "Closed · judge-selected · 6 ideas", eligibility: "", rules: "", registrationUrl: "" },
    { id: "open-quiz-challenge", name: "Open Quiz Challenge", category: "Design, creativity & communication", tag: "Open participation", day: 1, time: "15:00 – 16:00",
      desc: "A fast-paced, open technology quiz covering famous innovators and new trends.",
      how: "Anyone can join, with no restriction on team size.",
      format: "Open · any team size", eligibility: "Open to all attendees", rules: "", registrationUrl: "" }
  ],

  futuretech: {
    intro: "The FutureTech Challenge brings students together to tackle real-world problems — to develop solutions, test their ideas and present their work. It runs through multiple selection rounds, with the final at TECH@IIMB 2027.",
    finalSlot: "Day 3 · 14:00 – 15:30",
    applyUrl: "",              // when set, an "Apply" button appears
    applyPlatform: "Unstop",
    milestone: "June 2027",
    themes: [],                // one entry per theme; shown when filled
    info: [
      { h: "Who it is for", v: "Student innovators who want to take on real-world problems with technology." },
      { h: "How it works", v: "Develop a solution, test your idea and present your work. Submissions progress through multiple rounds of selection." },
      { h: "The final", v: "Shortlisted teams present at the FutureTech Challenge Final on Day 3 of TECH@IIMB 2027, 14:00 – 15:30, at IIM Bangalore." },
      { h: "Timeline", v: "Challenge registrations open in February–March 2027, with challenge milestones in June 2027." }
    ],
    steps: [
      { h: "Register & submit", p: "Register and submit your solution." },
      { h: "Selection rounds", p: "Submissions progress through multiple rounds of selection." },
      { h: "Shortlist", p: "Selected participants are shortlisted." },
      { h: "Final at TECH@IIMB", p: "Shortlisted teams present at the final during the symposium." }
    ]
  },

  speakers: [],               // { name, designation, organisation, bio, session, photo (data URL / path), published }

  speakerCategories: ["Keynote speakers", "Industry leaders", "Founders & investors", "Researchers & academics", "Policymakers & regulators"],

  pathway: [
    { when: "November 2026", ym: "2026-11", h: "Website & teaser", p: "Fix dates, start the website, teaser release." },
    { when: "December 2026", ym: "2026-12", h: "Panel discussion", p: "First poster release and a panel discussion on robotics.", pre: 1 },
    { when: "February – March 2027", ym: "2027-02", h: "Roundtable & challenge registrations", p: "Industry and institutional roundtable on India and emerging technologies. Registrations open for challenges.", pre: 2 },
    { when: "April – May 2027", ym: "2027-04", h: "Quiz competition", p: "Technical quiz competition, and private invitations sent.", pre: 3 },
    { when: "June 2027", ym: "2027-06", h: "Speakers & FutureTech", p: "Speaker announcements and FutureTech Challenge milestones.", pre: 4 },
    { when: "July 2027", ym: "2027-07", h: "Debate competition", p: "A debate competition on India’s technical future.", pre: 5 },
    { when: "August 2027", ym: "2027-08", h: "TECH@IIMB 2027", p: "Three days at IIM Bangalore." }
  ],

  announcements: [
    { date: "2026-11-01", title: "TECH@IIMB 2027 theme announced", body: "This year’s symposium will focus on The Next Technology Revolution: India at the Frontier. August 2027, IIM Bangalore, three days.", published: true },
    { date: "2026-11-01", title: "Five conversations on the road to August", body: "A panel discussion on robotics, an industry and institutional roundtable, a technical quiz, the FutureTech Challenge and a debate on India’s technical future lead up to the symposium.", published: true }
  ],

  audiences: [
    { id: "students", h: "Students", p: "Challenge registrations, quiz and debate competitions, the FutureTech Challenge and other activities.", links: ["activities", "futuretech", "speakers"] },
    { id: "industry", h: "Industry professionals", p: "Attend sessions, contribute to discussions and explore speaking opportunities.", links: ["programme", "technology", "participate"] },
    { id: "founders", h: "Founders & startups", p: "Explore product showcases, the technology expo and the FutureTech Pitch.", links: ["programme", "activities", "participate"] },
    { id: "academics", h: "Academics & researchers", p: "Participate in research discussions and present selected ideas where applicable.", links: ["about", "technology", "activities"] },
    { id: "partners", h: "Institutions & partners", p: "Explore collaboration and partnership opportunities with CSITM and IIM Bangalore.", links: ["about", "participate"] },
    { id: "media", h: "Media", p: "Follow announcements and write to the organising team for media enquiries.", links: ["speakers", "participate"] }
  ],

  reach: ["Senior industry leaders", "Technology professionals", "Founders and investors", "Policymakers and regulators", "Academics", "Students", "Media"],

  faqs: [
    { q: "What is TECH@IIMB?", a: "TECH@IIMB is the annual technology symposium convened by the Centre for Software and IT Management (CSITM) at IIM Bangalore — a three-day gathering of scholars, practitioners, policymakers and founders." },
    { q: "When and where is TECH@IIMB 2027?", a: "TECH@IIMB 2027 takes place over three days in August 2027 at IIM Bangalore, Bannerghatta Road, Bengaluru." },
    { q: "How do I take part in the challenges?", a: "Challenge registrations open in February–March 2027. For questions before then, write to csitm@iimb.ac.in." },
    { q: "Who can take part in the FutureTech Challenge?", a: "The FutureTech Challenge is for student innovators. Teams progress through selection rounds, and shortlisted teams present at the final on Day 3." },
    { q: "Can the programme change?", a: "Session details and timings may be updated as the symposium approaches. This website always shows the latest programme." },
    { q: "How can my organisation partner with TECH@IIMB?", a: "Write to the organising team at csitm@iimb.ac.in, or use the enquiry form and choose ‘Sponsorship / partnership’." }
  ]
};
