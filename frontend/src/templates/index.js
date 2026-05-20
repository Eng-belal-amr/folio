// Folio — Portfolio Generator
// 10 real HTML templates injected with CV data
// Free: lumiere, verdant, nova
// Pro: gilded, aurora, blush, slate, terra, arctic, obsidian (full 3D + animations)

export function generatePortfolio(templateSlug, data) {
  const generators = {
    lumiere: generateLumiere, verdant: generateVerdant, nova: generateNova,
    gilded: generateGilded, aurora: generateAurora, blush: generateBlush,
    slate: generateSlate, terra: generateTerra, arctic: generateArctic, obsidian: generateObsidian,
  }
  return (generators[templateSlug] || generateLumiere)(data)
}

const esc = (s='') => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
const skills = d => (d.skills||[]).sort((a,b)=>b.level-a.level).slice(0,12)
const exp    = d => (d.experience||[])
const projs  = d => (d.projects||[])

// ══════════════════════════════════════════════════════════════
// FREE 1 — LUMIÈRE  Minimal Editorial
// ══════════════════════════════════════════════════════════════
function generateLumiere(d) {
  const p = d.personal||{}
  return `<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(p.name)} — Portfolio</title>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Outfit:wght@300;400;500&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{--ink:#1a1814;--paper:#fafaf8;--gold:#c9973a;--muted:#7a7568;--border:#e8e4dc}
body{font-family:'Outfit',sans-serif;background:var(--paper);color:var(--ink);line-height:1.7;overflow-x:hidden}
h1,h2,h3{font-family:'Cormorant Garamond',serif}
nav{position:fixed;top:0;width:100%;padding:1.5rem 4rem;display:flex;justify-content:space-between;align-items:center;background:rgba(250,250,248,.95);backdrop-filter:blur(12px);border-bottom:1px solid var(--border);z-index:100;transition:padding .3s}
nav.scrolled{padding:1rem 4rem;box-shadow:0 2px 20px rgba(0,0,0,.05)}
.logo{font-family:'Cormorant Garamond',serif;font-size:1.4rem;font-weight:600;letter-spacing:.02em}
nav ul{list-style:none;display:flex;gap:2.5rem}
nav a{text-decoration:none;color:var(--muted);font-size:.85rem;letter-spacing:.08em;text-transform:uppercase;transition:color .2s;position:relative}
nav a::after{content:'';position:absolute;bottom:-4px;left:0;right:0;height:1px;background:var(--gold);transform:scaleX(0);transition:transform .3s;transform-origin:left}
nav a:hover{color:var(--ink)}
nav a:hover::after{transform:scaleX(1)}
.hero{min-height:100vh;display:flex;align-items:center;padding:8rem 4rem 4rem;max-width:1100px;margin:0 auto;opacity:0;transform:translateY(30px);animation:fadeUp .9s ease .2s forwards}
@keyframes fadeUp{to{opacity:1;transform:translateY(0)}}
.hero-eyebrow{font-size:.75rem;letter-spacing:.15em;text-transform:uppercase;color:var(--gold);margin-bottom:1.5rem}
.hero h1{font-size:clamp(3rem,6vw,5.5rem);line-height:1.05;margin-bottom:1.5rem;font-weight:600}
.hero h1 em{color:var(--gold);font-style:italic}
.hero-bio{font-size:1.1rem;color:var(--muted);max-width:480px;margin-bottom:2.5rem}
.hero-links{display:flex;gap:1rem;flex-wrap:wrap}
.btn{display:inline-block;padding:.9rem 2.5rem;background:var(--ink);color:var(--paper);text-decoration:none;font-size:.85rem;letter-spacing:.08em;text-transform:uppercase;transition:all .3s}
.btn:hover{background:var(--gold);transform:translateY(-2px)}
.btn-outline{background:transparent;border:1px solid var(--ink);color:var(--ink)}
.btn-outline:hover{background:var(--ink);color:var(--paper)}
section{padding:6rem 4rem;max-width:1100px;margin:0 auto}
.reveal{opacity:0;transform:translateY(40px);transition:opacity .8s ease,transform .8s ease}
.reveal.visible{opacity:1;transform:translateY(0)}
.section-label{font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;color:var(--gold);margin-bottom:1rem}
h2.section-title{font-size:clamp(2rem,4vw,3rem);margin-bottom:3rem;font-weight:600}
.skills-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:1.5rem}
.skill-item{padding:1.5rem;border:1px solid var(--border);transition:all .3s}
.skill-item:hover{border-color:var(--gold);transform:translateY(-4px);box-shadow:0 10px 30px rgba(201,151,58,.1)}
.skill-name{font-size:.9rem;font-weight:500;margin-bottom:.75rem;display:flex;justify-content:space-between}
.skill-pct{color:var(--gold);font-size:.8rem}
.skill-bar{height:2px;background:var(--border)}
.skill-fill{height:100%;background:var(--gold);width:0;transition:width 1.4s cubic-bezier(.16,1,.3,1)}
.exp-list{display:flex;flex-direction:column;gap:3rem}
.exp-item{display:grid;grid-template-columns:200px 1fr;gap:2rem;padding-bottom:3rem;border-bottom:1px solid var(--border)}
.exp-item:last-child{border:none}
.exp-meta{color:var(--muted);font-size:.85rem}
.exp-company{font-weight:500;color:var(--ink);margin-bottom:.25rem}
.exp-role{font-size:1.15rem;font-family:'Cormorant Garamond',serif;font-weight:600;margin-bottom:.75rem}
.projects-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:2rem}
.project-card{padding:2rem;border:1px solid var(--border);transition:all .3s;position:relative;overflow:hidden}
.project-card::before{content:'';position:absolute;bottom:0;left:0;width:100%;height:2px;background:var(--gold);transform:scaleX(0);transition:transform .4s;transform-origin:left}
.project-card:hover{transform:translateY(-4px);box-shadow:0 20px 40px rgba(0,0,0,.06)}
.project-card:hover::before{transform:scaleX(1)}
.project-name{font-family:'Cormorant Garamond',serif;font-size:1.4rem;font-weight:600;margin-bottom:.75rem}
.tags{display:flex;gap:.5rem;flex-wrap:wrap;margin-top:1rem}
.tag{font-size:.7rem;padding:.3rem .75rem;border:1px solid var(--border);color:var(--muted)}
footer{text-align:center;padding:3rem;border-top:1px solid var(--border);color:var(--muted);font-size:.8rem}
@media(max-width:768px){nav{padding:1rem 1.5rem}nav ul{display:none}.hero,section{padding:4rem 1.5rem}.exp-item{grid-template-columns:1fr}}
</style></head><body>
<nav id="nav">
  <div class="logo">${esc(p.name?.split(' ')[0]||'Portfolio')}</div>
  <ul><li><a href="#skills">Skills</a></li><li><a href="#experience">Experience</a></li><li><a href="#projects">Projects</a></li><li><a href="#contact">Contact</a></li></ul>
</nav>
<section class="hero">
  <div>
    <div class="hero-eyebrow">${esc(p.location||'Available for work')}</div>
    <h1>${esc(p.name?.split(' ')[0]||'')} <em>${esc(p.name?.split(' ').slice(1).join(' ')||'')}</em><br>${esc(p.title||'')}</h1>
    <p class="hero-bio">${esc(p.bio||'')}</p>
    <div class="hero-links">
      ${p.email?`<a href="mailto:${esc(p.email)}" class="btn">Get in Touch</a>`:''}
      ${p.github?`<a href="${esc(p.github)}" target="_blank" class="btn btn-outline">GitHub</a>`:''}
    </div>
  </div>
</section>
<section id="skills" class="reveal">
  <div class="section-label">Expertise</div>
  <h2 class="section-title">Skills &amp; Technologies</h2>
  <div class="skills-grid">
    ${skills(d).map(s=>`<div class="skill-item">
      <div class="skill-name"><span>${esc(s.name)}</span><span class="skill-pct">${s.level}</span></div>
      <div class="skill-bar"><div class="skill-fill" data-w="${s.level}%"></div></div>
    </div>`).join('')}
  </div>
</section>
<section id="experience" class="reveal">
  <div class="section-label">Career</div>
  <h2 class="section-title">Work Experience</h2>
  <div class="exp-list">
    ${exp(d).map(e=>`<div class="exp-item">
      <div class="exp-meta"><div class="exp-company">${esc(e.company)}</div><div>${esc(e.duration)}</div></div>
      <div><div class="exp-role">${esc(e.role)}</div><p style="color:var(--muted)">${esc(e.description)}</p></div>
    </div>`).join('')}
  </div>
</section>
<section id="projects" class="reveal">
  <div class="section-label">Work</div>
  <h2 class="section-title">Selected Projects</h2>
  <div class="projects-grid">
    ${projs(d).map(pr=>`<div class="project-card">
      <div class="project-name">${esc(pr.name)}</div>
      <p style="color:var(--muted);font-size:.9rem">${esc(pr.description)}</p>
      <div class="tags">${(pr.tech||[]).map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div>
      ${pr.link?`<a href="${esc(pr.link)}" target="_blank" style="display:inline-block;margin-top:1rem;color:var(--gold);font-size:.85rem;text-decoration:none">View →</a>`:''}
    </div>`).join('')}
  </div>
</section>
<section id="contact" class="reveal">
  <div class="section-label">Get in touch</div>
  <h2 class="section-title">Contact</h2>
  <div style="display:flex;gap:1.5rem;flex-wrap:wrap;align-items:center">
    ${p.email?`<a href="mailto:${esc(p.email)}" class="btn">${esc(p.email)}</a>`:''}
    ${p.linkedin?`<a href="${esc(p.linkedin)}" target="_blank" class="btn btn-outline">LinkedIn</a>`:''}
  </div>
</section>
<footer>© ${new Date().getFullYear()} ${esc(p.name)} · Built with Folio</footer>
<script>
window.addEventListener('scroll',()=>{
  document.getElementById('nav').classList.toggle('scrolled',scrollY>50)
  document.querySelectorAll('.reveal').forEach(el=>{
    if(el.getBoundingClientRect().top<window.innerHeight*.85)el.classList.add('visible')
  })
})
const io=new IntersectionObserver(entries=>entries.forEach(e=>{
  if(e.isIntersecting){const f=e.target;f.style.width=f.dataset.w;io.unobserve(f)}
}),{threshold:.3})
document.querySelectorAll('.skill-fill').forEach(f=>io.observe(f))
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();document.querySelector(a.getAttribute('href'))?.scrollIntoView({behavior:'smooth'})}))
</script></body></html>`
}

// ══════════════════════════════════════════════════════════════
// FREE 2 — VERDANT  Bold Teal
// ══════════════════════════════════════════════════════════════
function generateVerdant(d) {
  const p = d.personal||{}
  return `<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(p.name)} — Portfolio</title>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{--teal:#0d9488;--teal-dark:#0f766e;--teal-light:#ccfbf1;--bg:#f0fdf9;--ink:#134e4a;--white:#fff}
body{font-family:'Space Grotesk',sans-serif;background:var(--bg);color:var(--ink);overflow-x:hidden}
nav{position:fixed;top:0;width:100%;padding:1.2rem 3rem;display:flex;justify-content:space-between;align-items:center;background:var(--white);border-bottom:2px solid var(--teal);z-index:100}
.logo{font-weight:700;font-size:1.2rem;color:var(--teal)}
nav ul{list-style:none;display:flex;gap:2rem}
nav a{text-decoration:none;color:var(--ink);font-size:.9rem;font-weight:500;padding:.4rem .8rem;border-radius:4px;transition:all .2s}
nav a:hover{background:var(--teal);color:var(--white)}
.hero{min-height:100vh;display:grid;grid-template-columns:1fr 1fr;align-items:center;padding:6rem 3rem 3rem;gap:4rem;max-width:1200px;margin:0 auto}
.hero-tag{display:inline-block;background:var(--teal);color:var(--white);font-size:.75rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;padding:.4rem 1rem;border-radius:999px;margin-bottom:1.5rem;animation:slideIn .6s ease}
@keyframes slideIn{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
.hero h1{font-size:clamp(2.5rem,5vw,4.5rem);line-height:1.1;font-weight:700;margin-bottom:1.5rem;animation:fadeUp .8s ease .2s both}
.hero h1 span{color:var(--teal)}
@keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
.hero-bio{color:#4b7272;font-size:1.05rem;margin-bottom:2rem;line-height:1.8;animation:fadeUp .8s ease .4s both}
.hero-cta{display:flex;gap:1rem;flex-wrap:wrap;animation:fadeUp .8s ease .5s both}
.btn-p{padding:.9rem 2rem;background:var(--teal);color:var(--white);border:none;border-radius:8px;font-family:'Space Grotesk',sans-serif;font-size:.9rem;font-weight:600;cursor:pointer;text-decoration:none;transition:all .2s}
.btn-p:hover{background:var(--teal-dark);transform:translateY(-2px);box-shadow:0 8px 25px rgba(13,148,136,.3)}
.btn-o{padding:.9rem 2rem;background:transparent;color:var(--teal);border:2px solid var(--teal);border-radius:8px;font-family:'Space Grotesk',sans-serif;font-size:.9rem;font-weight:600;text-decoration:none;transition:all .2s}
.btn-o:hover{background:var(--teal);color:var(--white)}
.hero-visual{display:grid;grid-template-columns:1fr 1fr;gap:1rem;animation:fadeUp .8s ease .6s both}
.stat-card{background:var(--white);border:2px solid var(--teal-light);border-radius:16px;padding:1.5rem;text-align:center;transition:all .3s}
.stat-card:hover{border-color:var(--teal);transform:translateY(-4px);box-shadow:0 12px 30px rgba(13,148,136,.15)}
.stat-num{font-size:2.5rem;font-weight:700;color:var(--teal);font-family:'Space Mono',monospace}
.stat-label{font-size:.8rem;color:#4b7272;margin-top:.3rem}
section{padding:5rem 3rem;max-width:1200px;margin:0 auto}
.sec-header{display:flex;align-items:center;gap:1rem;margin-bottom:3rem}
.sec-num{font-family:'Space Mono',monospace;font-size:.75rem;color:var(--teal);background:var(--teal-light);padding:.3rem .7rem;border-radius:4px;font-weight:700}
h2{font-size:2rem;font-weight:700}
.skills-wrap{display:flex;flex-direction:column;gap:1rem}
.sk-row{display:flex;align-items:center;gap:1.5rem;background:var(--white);padding:1rem 1.5rem;border-radius:12px;border:1px solid var(--teal-light);transition:all .3s;opacity:0;transform:translateX(-20px)}
.sk-row.in{opacity:1;transform:translateX(0)}
.sk-row:hover{border-color:var(--teal);box-shadow:0 4px 20px rgba(13,148,136,.1)}
.sk-name{font-weight:600;font-size:.9rem;min-width:130px}
.sk-cat{font-size:.7rem;background:var(--teal-light);color:var(--teal-dark);padding:.2rem .6rem;border-radius:999px;font-weight:600}
.sk-track{flex:1;height:8px;background:var(--teal-light);border-radius:999px;overflow:hidden}
.sk-fill{height:100%;background:linear-gradient(90deg,var(--teal-dark),var(--teal));border-radius:999px;width:0;transition:width 1.3s cubic-bezier(.16,1,.3,1)}
.sk-pct{font-family:'Space Mono',monospace;font-size:.75rem;color:var(--teal);min-width:36px;text-align:right;font-weight:700}
.tl{position:relative;padding-left:2rem}
.tl::before{content:'';position:absolute;left:0;top:0;bottom:0;width:2px;background:linear-gradient(to bottom,var(--teal),var(--teal-light))}
.tl-item{position:relative;margin-bottom:3rem;padding-left:2rem;opacity:0;transform:translateY(20px);transition:all .6s}
.tl-item.in{opacity:1;transform:translateY(0)}
.tl-dot{position:absolute;left:-2.55rem;top:.3rem;width:14px;height:14px;background:var(--teal);border-radius:50%;border:3px solid var(--bg);box-shadow:0 0 0 3px var(--teal-light)}
.tl-role{font-size:1.1rem;font-weight:700;color:var(--ink)}
.tl-company{color:var(--teal);font-weight:600;margin:.2rem 0}
.tl-date{font-size:.8rem;color:#4b7272;font-family:'Space Mono',monospace;margin-bottom:.75rem;background:var(--teal-light);display:inline-block;padding:.2rem .6rem;border-radius:4px}
.proj-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:1.5rem}
.proj-card{background:var(--white);border:2px solid var(--teal-light);border-radius:16px;padding:2rem;transition:all .3s;position:relative;overflow:hidden;opacity:0;transform:translateY(30px)}
.proj-card.in{opacity:1;transform:translateY(0)}
.proj-card::before{content:'';position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,var(--teal-dark),var(--teal))}
.proj-card:hover{transform:translateY(-6px);border-color:var(--teal);box-shadow:0 20px 40px rgba(13,148,136,.15)}
.proj-name{font-size:1.2rem;font-weight:700;margin-bottom:.75rem}
.proj-desc{color:#4b7272;font-size:.9rem;margin-bottom:1rem;line-height:1.7}
.proj-tags{display:flex;gap:.5rem;flex-wrap:wrap}
.proj-tag{font-size:.7rem;background:var(--teal-light);color:var(--teal-dark);padding:.3rem .7rem;border-radius:999px;font-weight:600}
footer{background:var(--ink);color:var(--teal-light);text-align:center;padding:2rem;font-size:.85rem}
@media(max-width:768px){.hero{grid-template-columns:1fr;padding-top:5rem}.hero-visual{display:none}nav ul{display:none}section{padding:3rem 1.5rem}}
</style></head><body>
<nav><div class="logo">${esc(p.name?.split(' ')[0]||'Dev')}.js</div>
  <ul><li><a href="#skills">Skills</a></li><li><a href="#experience">Experience</a></li><li><a href="#projects">Projects</a></li><li><a href="#contact">Contact</a></li></ul>
</nav>
<div class="hero">
  <div>
    <span class="hero-tag">${esc(p.location||'Open to work')}</span>
    <h1>Hi, I'm <span>${esc(p.name||'')}</span></h1>
    <p class="hero-bio">${esc(p.bio||'')}</p>
    <div class="hero-cta">
      ${p.email?`<a href="mailto:${esc(p.email)}" class="btn-p">Get in Touch</a>`:''}
      ${p.github?`<a href="${esc(p.github)}" target="_blank" class="btn-o">GitHub</a>`:''}
    </div>
  </div>
  <div class="hero-visual">
    <div class="stat-card"><div class="stat-num">${(d.experience||[]).length}</div><div class="stat-label">Jobs</div></div>
    <div class="stat-card"><div class="stat-num">${(d.projects||[]).length}</div><div class="stat-label">Projects</div></div>
    <div class="stat-card"><div class="stat-num">${(d.skills||[]).length}</div><div class="stat-label">Skills</div></div>
    <div class="stat-card"><div class="stat-num">${d.overall_score||'—'}</div><div class="stat-label">CV Score</div></div>
  </div>
</div>
<section id="skills">
  <div class="sec-header"><span class="sec-num">01</span><h2>Skills</h2></div>
  <div class="skills-wrap">
    ${skills(d).map(s=>`<div class="sk-row">
      <span class="sk-name">${esc(s.name)}</span>
      <span class="sk-cat">${esc(s.category)}</span>
      <div class="sk-track"><div class="sk-fill" data-w="${s.level}%"></div></div>
      <span class="sk-pct">${s.level}%</span>
    </div>`).join('')}
  </div>
</section>
<section id="experience">
  <div class="sec-header"><span class="sec-num">02</span><h2>Experience</h2></div>
  <div class="tl">
    ${exp(d).map(e=>`<div class="tl-item">
      <div class="tl-dot"></div>
      <div class="tl-role">${esc(e.role)}</div>
      <div class="tl-company">${esc(e.company)}</div>
      <div class="tl-date">${esc(e.duration)}</div>
      <p style="color:#4b7272;font-size:.95rem">${esc(e.description)}</p>
    </div>`).join('')}
  </div>
</section>
<section id="projects">
  <div class="sec-header"><span class="sec-num">03</span><h2>Projects</h2></div>
  <div class="proj-grid">
    ${projs(d).map(pr=>`<div class="proj-card">
      <div class="proj-name">${esc(pr.name)}</div>
      <div class="proj-desc">${esc(pr.description)}</div>
      <div class="proj-tags">${(pr.tech||[]).map(t=>`<span class="proj-tag">${esc(t)}</span>`).join('')}</div>
      ${pr.link?`<a href="${esc(pr.link)}" target="_blank" style="display:inline-block;margin-top:1rem;color:var(--teal);font-size:.85rem;font-weight:700;text-decoration:none">View →</a>`:''}
    </div>`).join('')}
  </div>
</section>
<section id="contact">
  <div class="sec-header"><span class="sec-num">04</span><h2>Contact</h2></div>
  <div style="display:flex;gap:1rem;flex-wrap:wrap">
    ${p.email?`<a href="mailto:${esc(p.email)}" class="btn-p">${esc(p.email)}</a>`:''}
    ${p.linkedin?`<a href="${esc(p.linkedin)}" target="_blank" class="btn-o">LinkedIn</a>`:''}
  </div>
</section>
<footer>© ${new Date().getFullYear()} ${esc(p.name)} · Built with Folio</footer>
<script>
const io=new IntersectionObserver(entries=>entries.forEach(e=>{
  if(e.isIntersecting){
    e.target.classList.add('in')
    if(e.target.querySelector)e.target.querySelectorAll?.('.sk-fill').forEach(f=>{f.style.width=f.dataset.w})
  }
}),{threshold:.15})
document.querySelectorAll('.sk-row,.tl-item,.proj-card').forEach(el=>io.observe(el))
const skio=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.style.width=e.target.dataset.w;skio.unobserve(e.target)}}),{threshold:.3})
document.querySelectorAll('.sk-fill').forEach(f=>skio.observe(f))
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();document.querySelector(a.getAttribute('href'))?.scrollIntoView({behavior:'smooth'})}))
</script></body></html>`
}

// ══════════════════════════════════════════════════════════════
// FREE 3 — NOVA  Dark Dev
// ══════════════════════════════════════════════════════════════
function generateNova(d) {
  const p = d.personal||{}
  return `<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(p.name)} — Portfolio</title>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{--bg:#0d1117;--s:#161b22;--b:#30363d;--blue:#58a6ff;--glow:rgba(88,166,255,.15);--text:#e6edf3;--muted:#8b949e}
body{font-family:'Inter',sans-serif;background:var(--bg);color:var(--text);overflow-x:hidden}
.cursor{width:20px;height:20px;border:2px solid var(--blue);border-radius:50%;position:fixed;pointer-events:none;z-index:9999;transition:transform .1s,opacity .3s;mix-blend-mode:screen}
.cursor-dot{width:6px;height:6px;background:var(--blue);border-radius:50%;position:fixed;pointer-events:none;z-index:9999;transform:translate(-50%,-50%)}
nav{position:fixed;top:0;width:100%;padding:1rem 3rem;display:flex;justify-content:space-between;align-items:center;background:rgba(13,17,23,.95);backdrop-filter:blur(16px);border-bottom:1px solid var(--b);z-index:100}
.logo{font-family:'JetBrains Mono',monospace;font-size:.95rem;color:var(--blue)}
nav ul{list-style:none;display:flex;gap:2rem}
nav a{text-decoration:none;color:var(--muted);font-size:.85rem;font-family:'JetBrains Mono',monospace;transition:color .2s}
nav a:hover{color:var(--blue)}
.hero{min-height:100vh;display:flex;flex-direction:column;justify-content:center;padding:6rem 3rem 3rem;max-width:1100px;margin:0 auto}
.typing-container{font-family:'JetBrains Mono',monospace;font-size:.9rem;color:var(--muted);margin-bottom:2rem;min-height:1.5rem}
.typing{color:var(--blue)}
.cursor-blink{animation:blink 1s step-end infinite;color:var(--blue)}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
.hero h1{font-size:clamp(3rem,7vw,6rem);font-weight:700;line-height:1;margin-bottom:1rem;letter-spacing:-.02em;opacity:0;animation:fadeUp .8s ease .8s forwards}
@keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:none}}
.hero h1 .dim{color:var(--muted);font-weight:300}
.hero-bio{color:var(--muted);max-width:560px;margin-bottom:2.5rem;opacity:0;animation:fadeUp .8s ease 1s forwards}
.hero-links{display:flex;gap:1rem;flex-wrap:wrap;opacity:0;animation:fadeUp .8s ease 1.2s forwards}
.lbtn{padding:.7rem 1.5rem;border:1px solid var(--b);color:var(--text);text-decoration:none;font-family:'JetBrains Mono',monospace;font-size:.8rem;transition:all .2s}
.lbtn:hover{border-color:var(--blue);color:var(--blue);box-shadow:0 0 20px var(--glow)}
.lbtn.primary{background:var(--blue);color:var(--bg);border-color:var(--blue)}
.lbtn.primary:hover{box-shadow:0 0 30px rgba(88,166,255,.4)}
section{padding:5rem 3rem;max-width:1100px;margin:0 auto}
.sh{display:flex;align-items:center;gap:1rem;margin-bottom:3rem}
.sn{font-family:'JetBrains Mono',monospace;font-size:.75rem;color:var(--blue);opacity:.7}
.sl{flex:1;height:1px;background:var(--b)}
h2{font-size:1.4rem;font-weight:600;white-space:nowrap}
.skills-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:1rem}
.sk{background:var(--s);border:1px solid var(--b);padding:1.25rem;transition:all .3s;opacity:0;transform:translateY(20px)}
.sk.in{opacity:1;transform:none}
.sk:hover{border-color:var(--blue);background:#1c2128}
.sk-top{display:flex;justify-content:space-between;margin-bottom:.75rem}
.sk-n{font-size:.9rem;font-weight:500}
.sk-p{font-family:'JetBrains Mono',monospace;font-size:.75rem;color:var(--blue)}
.sk-track{height:3px;background:var(--b)}
.sk-fill{height:100%;background:linear-gradient(90deg,var(--blue),#79c0ff);width:0;transition:width 1.3s cubic-bezier(.16,1,.3,1)}
.exp-list{display:flex;flex-direction:column;gap:2rem}
.exp-card{background:var(--s);border:1px solid var(--b);border-left:3px solid var(--blue);padding:1.5rem;transition:all .2s;opacity:0;transform:translateX(-20px)}
.exp-card.in{opacity:1;transform:none}
.exp-card:hover{background:#1c2128}
.exp-head{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:.5rem}
.exp-role{font-weight:600}
.exp-date{font-family:'JetBrains Mono',monospace;font-size:.75rem;color:var(--muted);background:var(--b);padding:.2rem .5rem}
.exp-co{color:var(--blue);font-size:.9rem;margin-bottom:.75rem}
.proj-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1.5rem}
.proj-card{background:var(--s);border:1px solid var(--b);padding:1.5rem;transition:all .3s;position:relative;overflow:hidden;opacity:0;transform:translateY(30px)}
.proj-card.in{opacity:1;transform:none}
.proj-card::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,var(--glow),transparent);opacity:0;transition:.3s}
.proj-card:hover{border-color:var(--blue);transform:translateY(-4px)}
.proj-card:hover::after{opacity:1}
.proj-n{font-weight:600;margin-bottom:.5rem;position:relative}
.proj-d{color:var(--muted);font-size:.875rem;margin-bottom:1rem;position:relative}
.proj-tags{display:flex;gap:.5rem;flex-wrap:wrap;position:relative}
.ptag{font-family:'JetBrains Mono',monospace;font-size:.65rem;padding:.2rem .6rem;border:1px solid var(--b);color:var(--muted)}
footer{text-align:center;padding:2rem;border-top:1px solid var(--b);color:var(--muted);font-family:'JetBrains Mono',monospace;font-size:.75rem}
@media(max-width:768px){nav ul{display:none}section,.hero{padding:3rem 1.5rem}}
</style></head><body>
<div class="cursor" id="cur"></div>
<div class="cursor-dot" id="dot"></div>
<nav>
  <div class="logo"><span style="color:var(--muted)">~/</span>${esc(p.name?.split(' ')[0]?.toLowerCase()||'dev')}</div>
  <ul><li><a href="#skills">skills</a></li><li><a href="#experience">experience</a></li><li><a href="#projects">projects</a></li><li><a href="#contact">contact</a></li></ul>
</nav>
<div class="hero">
  <div class="typing-container" id="typing-el"></div>
  <h1>${esc(p.name||'')}<br><span class="dim">${esc(p.title||'')}</span></h1>
  <p class="hero-bio">${esc(p.bio||'')}</p>
  <div class="hero-links">
    ${p.email?`<a href="mailto:${esc(p.email)}" class="lbtn primary">contact_me()</a>`:''}
    ${p.github?`<a href="${esc(p.github)}" target="_blank" class="lbtn">github</a>`:''}
    ${p.linkedin?`<a href="${esc(p.linkedin)}" target="_blank" class="lbtn">linkedin</a>`:''}
  </div>
</div>
<section id="skills">
  <div class="sh"><span class="sn">01.</span><h2>skills</h2><div class="sl"></div></div>
  <div class="skills-grid">
    ${skills(d).map(s=>`<div class="sk">
      <div class="sk-top"><span class="sk-n">${esc(s.name)}</span><span class="sk-p">${s.level}%</span></div>
      <div class="sk-track"><div class="sk-fill" data-w="${s.level}%"></div></div>
    </div>`).join('')}
  </div>
</section>
<section id="experience">
  <div class="sh"><span class="sn">02.</span><h2>experience</h2><div class="sl"></div></div>
  <div class="exp-list">
    ${exp(d).map(e=>`<div class="exp-card">
      <div class="exp-head"><span class="exp-role">${esc(e.role)}</span><span class="exp-date">${esc(e.duration)}</span></div>
      <div class="exp-co">${esc(e.company)}</div>
      <p style="color:var(--muted);font-size:.9rem">${esc(e.description)}</p>
    </div>`).join('')}
  </div>
</section>
<section id="projects">
  <div class="sh"><span class="sn">03.</span><h2>projects</h2><div class="sl"></div></div>
  <div class="proj-grid">
    ${projs(d).map(pr=>`<div class="proj-card">
      <div class="proj-n">${esc(pr.name)}</div>
      <div class="proj-d">${esc(pr.description)}</div>
      <div class="proj-tags">${(pr.tech||[]).map(t=>`<span class="ptag">${esc(t)}</span>`).join('')}</div>
      ${pr.link?`<a href="${esc(pr.link)}" target="_blank" style="display:block;margin-top:1rem;color:var(--blue);font-size:.8rem;font-family:'JetBrains Mono',monospace;text-decoration:none">→ view_project()</a>`:''}
    </div>`).join('')}
  </div>
</section>
<section id="contact">
  <div class="sh"><span class="sn">04.</span><h2>contact</h2><div class="sl"></div></div>
  <div style="display:flex;gap:1rem;flex-wrap:wrap">
    ${p.email?`<a href="mailto:${esc(p.email)}" class="lbtn primary">${esc(p.email)}</a>`:''}
    ${p.linkedin?`<a href="${esc(p.linkedin)}" target="_blank" class="lbtn">linkedin</a>`:''}
  </div>
</section>
<footer>// ${esc(p.name)} · ${new Date().getFullYear()} · built_with(folio)</footer>
<script>
// Custom cursor
const cur=document.getElementById('cur'),dot=document.getElementById('dot')
let mx=0,my=0,cx=0,cy=0
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;dot.style.left=mx+'px';dot.style.top=my+'px'})
;(function anim(){cx+=(mx-cx)*.12;cy+=(my-cy)*.12;cur.style.left=(cx-10)+'px';cur.style.top=(cy-10)+'px';requestAnimationFrame(anim)})()
document.querySelectorAll('a,button').forEach(el=>{el.addEventListener('mouseenter',()=>cur.style.transform='scale(2)');el.addEventListener('mouseleave',()=>cur.style.transform='scale(1)')})
// Typing effect
const lines=["// Hello, world!","const dev = '${esc(p.name||'Dev')}'","// ${esc(p.title||'Developer')}"]
let li=0,ci=0,el=document.getElementById('typing-el')
function type(){if(ci<lines[li].length){el.innerHTML=lines[li].slice(0,++ci)+'<span class="cursor-blink">|</span>';setTimeout(type,40)}else{setTimeout(()=>{ci=0;li=(li+1)%lines.length;el.innerHTML='';type()},1800)}}
type()
// Scroll animations
const io=new IntersectionObserver(en=>en.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in')}),{threshold:.15})
document.querySelectorAll('.sk,.exp-card,.proj-card').forEach(el=>io.observe(el))
const sio=new IntersectionObserver(en=>en.forEach(e=>{if(e.isIntersecting){e.target.style.width=e.target.dataset.w;sio.unobserve(e.target)}}),{threshold:.3})
document.querySelectorAll('.sk-fill').forEach(f=>sio.observe(f))
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();document.querySelector(a.getAttribute('href'))?.scrollIntoView({behavior:'smooth'})}))
</script></body></html>`
}

// ══════════════════════════════════════════════════════════════
// PRO 1 — GILDED  Luxury Gold + 3D Floating Crystals
// ══════════════════════════════════════════════════════════════
function generateGilded(d) {
  const p = d.personal||{}
  return `<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(p.name)} — Portfolio</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400;700&display=swap" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{--bg:#0a0904;--s:#16130c;--gold:#d4a843;--gl:#e8c96b;--gd:#a8822e;--text:#f5f0e8;--muted:#8a8070}
body{font-family:'Lato',sans-serif;background:var(--bg);color:var(--text);overflow-x:hidden}
#c3d{position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none}
.overlay{position:fixed;inset:0;background:radial-gradient(ellipse at center,transparent 40%,rgba(10,9,4,.8));z-index:1;pointer-events:none}
nav{position:fixed;top:0;width:100%;padding:1.5rem 4rem;display:flex;justify-content:space-between;align-items:center;z-index:100;background:linear-gradient(to bottom,rgba(10,9,4,.98),transparent)}
.logo{font-family:'Playfair Display',serif;font-size:1.3rem;color:var(--gold);letter-spacing:.1em}
nav ul{list-style:none;display:flex;gap:2.5rem}
nav a{text-decoration:none;color:var(--muted);font-size:.8rem;letter-spacing:.15em;text-transform:uppercase;transition:color .3s;position:relative}
nav a::after{content:'';position:absolute;bottom:-6px;left:0;right:0;height:1px;background:var(--gold);transform:scaleX(0);transition:.3s;transform-origin:center}
nav a:hover{color:var(--gold)}
nav a:hover::after{transform:scaleX(1)}
.hero{min-height:100vh;display:flex;align-items:center;justify-content:center;text-align:center;padding:6rem 3rem;position:relative;z-index:2}
.hero-inner{max-width:800px}
.hero-orn{color:var(--gold);font-size:1.2rem;letter-spacing:.4em;margin-bottom:2.5rem;opacity:0;animation:fadeIn 1s ease .3s forwards}
@keyframes fadeIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
.hero h1{font-family:'Playfair Display',serif;font-size:clamp(3rem,7vw,5.5rem);font-weight:400;line-height:1.1;margin-bottom:1rem;opacity:0;animation:fadeIn 1s ease .6s forwards}
.hero h1 span{color:var(--gold);font-style:italic}
.hero-title{font-size:.85rem;letter-spacing:.35em;text-transform:uppercase;color:var(--muted);margin-bottom:2rem;opacity:0;animation:fadeIn 1s ease .9s forwards}
.divider{width:80px;height:1px;background:linear-gradient(90deg,transparent,var(--gold),transparent);margin:2rem auto;opacity:0;animation:fadeIn 1s ease 1s forwards}
.hero-bio{color:var(--muted);font-size:1rem;font-weight:300;max-width:520px;margin:0 auto 3rem;line-height:2;opacity:0;animation:fadeIn 1s ease 1.1s forwards}
.gold-btn{display:inline-block;padding:1rem 3rem;border:1px solid var(--gold);color:var(--gold);text-decoration:none;font-size:.8rem;letter-spacing:.2em;text-transform:uppercase;transition:all .4s;position:relative;overflow:hidden;opacity:0;animation:fadeIn 1s ease 1.3s forwards}
.gold-btn::before{content:'';position:absolute;inset:0;background:var(--gold);transform:scaleX(0);transition:.4s;transform-origin:left;z-index:-1}
.gold-btn:hover{color:var(--bg)}
.gold-btn:hover::before{transform:scaleX(1)}
section{padding:6rem 4rem;max-width:1100px;margin:0 auto;position:relative;z-index:2}
.sec-orn{text-align:center;color:var(--gold);opacity:.3;letter-spacing:.3em;font-size:.7rem;margin-bottom:.5rem}
h2{font-family:'Playfair Display',serif;font-size:2.5rem;font-weight:400;text-align:center;margin-bottom:.5rem}
.gold-line{width:60px;height:1px;background:var(--gold);margin:1.5rem auto 3.5rem}
.skills-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:1px;background:rgba(212,168,67,.08)}
.sk-item{background:var(--s);padding:2rem 1.5rem;text-align:center;transition:all .4s;opacity:0;transform:translateY(20px)}
.sk-item.in{opacity:1;transform:none}
.sk-item:hover{background:#201e14}
.sk-name{font-size:.8rem;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin-bottom:1.25rem}
.sk-ring{width:72px;height:72px;margin:0 auto;position:relative}
.sk-ring svg{transform:rotate(-90deg)}
.sk-num{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:.85rem;color:var(--gold);font-weight:700}
.exp-list{display:flex;flex-direction:column;gap:0}
.exp-item{display:grid;grid-template-columns:220px 1fr;gap:3rem;padding:3rem 0;border-bottom:1px solid rgba(212,168,67,.12);opacity:0;transform:translateX(-30px);transition:all .8s}
.exp-item.in{opacity:1;transform:none}
.exp-item:last-child{border:none}
.exp-left{text-align:right}
.exp-co{color:var(--gold);font-size:.85rem;letter-spacing:.12em;text-transform:uppercase}
.exp-date{color:var(--muted);font-size:.8rem;margin-top:.3rem}
.exp-role{font-family:'Playfair Display',serif;font-size:1.3rem;margin-bottom:.75rem}
.proj-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:2rem}
.proj-card{border:1px solid rgba(212,168,67,.12);padding:2rem;transition:all .4s;position:relative;overflow:hidden;opacity:0;transform:translateY(30px)}
.proj-card.in{opacity:1;transform:none}
.proj-card::before{content:'';position:absolute;top:-1px;left:20%;right:20%;height:1px;background:var(--gold);transform:scaleX(0);transition:.4s;transform-origin:center}
.proj-card:hover{background:rgba(212,168,67,.03);border-color:rgba(212,168,67,.3)}
.proj-card:hover::before{transform:scaleX(1)}
.proj-name{font-family:'Playfair Display',serif;font-size:1.2rem;margin-bottom:.75rem}
.ptag{font-size:.7rem;padding:.25rem .6rem;border:1px solid rgba(212,168,67,.25);color:var(--muted);margin:.2rem;display:inline-block}
footer{text-align:center;padding:3rem;border-top:1px solid rgba(212,168,67,.1);color:var(--muted);font-size:.75rem;letter-spacing:.1em;position:relative;z-index:2}
@media(max-width:768px){nav{padding:1rem 1.5rem}nav ul{display:none}section{padding:4rem 1.5rem}.exp-item{grid-template-columns:1fr}}
</style></head><body>
<canvas id="c3d"></canvas>
<div class="overlay"></div>
<nav>
  <div class="logo">${esc(p.name?.split(' ')[0]||'Portfolio')}</div>
  <ul><li><a href="#skills">Skills</a></li><li><a href="#experience">Experience</a></li><li><a href="#projects">Projects</a></li><li><a href="#contact">Contact</a></li></ul>
</nav>
<div class="hero">
  <div class="hero-inner">
    <div class="hero-orn">— ✦ —</div>
    <h1>${esc(p.name?.split(' ')[0]||'')} <span>${esc(p.name?.split(' ').slice(1).join(' ')||'')}</span></h1>
    <div class="hero-title">${esc(p.title||'')}</div>
    <div class="divider"></div>
    <p class="hero-bio">${esc(p.bio||'')}</p>
    ${p.email?`<a href="mailto:${esc(p.email)}" class="gold-btn">Get in Touch</a>`:''}
  </div>
</div>
<section id="skills"><div class="sec-orn">✦ Skills ✦</div><h2>Expertise</h2><div class="gold-line"></div>
  <div class="skills-grid">
    ${skills(d).map(s=>`<div class="sk-item">
      <div class="sk-name">${esc(s.name)}</div>
      <div class="sk-ring">
        <svg width="72" height="72" viewBox="0 0 72 72">
          <circle cx="36" cy="36" r="30" fill="none" stroke="rgba(212,168,67,.15)" stroke-width="5"/>
          <circle cx="36" cy="36" r="30" fill="none" stroke="#d4a843" stroke-width="5"
            stroke-dasharray="${(s.level/100)*188.5} 188.5" stroke-linecap="round" style="transition:stroke-dasharray 1.4s cubic-bezier(.16,1,.3,1)"/>
        </svg>
        <div class="sk-num">${s.level}</div>
      </div>
    </div>`).join('')}
  </div>
</section>
<section id="experience"><div class="sec-orn">✦ Career ✦</div><h2>Experience</h2><div class="gold-line"></div>
  <div class="exp-list">
    ${exp(d).map(e=>`<div class="exp-item">
      <div class="exp-left"><div class="exp-co">${esc(e.company)}</div><div class="exp-date">${esc(e.duration)}</div></div>
      <div><div class="exp-role">${esc(e.role)}</div><p style="color:var(--muted);font-weight:300;line-height:1.9">${esc(e.description)}</p></div>
    </div>`).join('')}
  </div>
</section>
<section id="projects"><div class="sec-orn">✦ Work ✦</div><h2>Selected Projects</h2><div class="gold-line"></div>
  <div class="proj-grid">
    ${projs(d).map(pr=>`<div class="proj-card">
      <div class="proj-name">${esc(pr.name)}</div>
      <p style="color:var(--muted);font-size:.9rem;font-weight:300;margin-bottom:1rem;line-height:1.8">${esc(pr.description)}</p>
      <div>${(pr.tech||[]).map(t=>`<span class="ptag">${esc(t)}</span>`).join('')}</div>
      ${pr.link?`<a href="${esc(pr.link)}" target="_blank" style="display:inline-block;margin-top:1.2rem;color:var(--gold);font-size:.8rem;text-decoration:none;letter-spacing:.1em">VIEW PROJECT →</a>`:''}
    </div>`).join('')}
  </div>
</section>
<section id="contact"><div class="sec-orn">✦ Contact ✦</div><h2>Get In Touch</h2><div class="gold-line"></div>
  <div style="text-align:center">
    ${p.email?`<a href="mailto:${esc(p.email)}" class="gold-btn" style="opacity:1;animation:none">${esc(p.email)}</a>`:''}
    <div style="margin-top:2rem;color:var(--muted);font-size:.85rem;letter-spacing:.05em">
      ${p.linkedin?`<a href="${esc(p.linkedin)}" target="_blank" style="color:var(--gold);text-decoration:none;margin:0 1rem">LinkedIn</a>`:''}
      ${p.github?`<a href="${esc(p.github)}" target="_blank" style="color:var(--gold);text-decoration:none;margin:0 1rem">GitHub</a>`:''}
    </div>
  </div>
</section>
<footer>✦ ${esc(p.name)} © ${new Date().getFullYear()} · Built with Folio ✦</footer>
<script>
// Three.js — floating crystal shards
const canvas=document.getElementById('c3d')
const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true})
renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,2))
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(60,innerWidth/innerHeight,.1,100)
camera.position.z=8
// Multiple octahedra crystals
const crystals=[]
const mat=new THREE.MeshBasicMaterial({color:0xd4a843,wireframe:true,transparent:true,opacity:.25})
for(let i=0;i<12;i++){
  const size=.3+Math.random()*.8
  const geo=new THREE.OctahedronGeometry(size,0)
  const mesh=new THREE.Mesh(geo,mat.clone())
  mesh.position.set((Math.random()-.5)*16,(Math.random()-.5)*12,(Math.random()-.5)*6)
  mesh.rotation.set(Math.random()*Math.PI,Math.random()*Math.PI,Math.random()*Math.PI)
  mesh.userData={rx:(.002+Math.random()*.006)*(Math.random()>.5?1:-1),ry:(.002+Math.random()*.006)*(Math.random()>.5?1:-1),vy:(.001+Math.random()*.003)*(Math.random()>.5?1:-1)}
  scene.add(mesh);crystals.push(mesh)
}
// Gold particles
const pgeo=new THREE.BufferGeometry(),pp=new Float32Array(400*3)
for(let i=0;i<1200;i++)pp[i]=(Math.random()-.5)*30
pgeo.setAttribute('position',new THREE.BufferAttribute(pp,3))
scene.add(new THREE.Points(pgeo,new THREE.PointsMaterial({color:0xe8c96b,size:.04,transparent:true,opacity:.5})))
function animate(){
  requestAnimationFrame(animate)
  crystals.forEach(c=>{c.rotation.x+=c.userData.rx;c.rotation.y+=c.userData.ry;c.position.y+=c.userData.vy;if(Math.abs(c.position.y)>7)c.userData.vy*=-1})
  renderer.render(scene,camera)
}
animate()
window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)})
// Scroll animations
const io=new IntersectionObserver(en=>en.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in')}),{threshold:.1})
document.querySelectorAll('.sk-item,.exp-item,.proj-card').forEach(el=>io.observe(el))
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();document.querySelector(a.getAttribute('href'))?.scrollIntoView({behavior:'smooth'})}))
</script></body></html>`
}

// ══════════════════════════════════════════════════════════════
// PRO 2 — AURORA  Violet + 3D Morphing Blob
// ══════════════════════════════════════════════════════════════
function generateAurora(d) {
  const p = d.personal||{}
  return `<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(p.name)} — Portfolio</title>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{--bg:#06030f;--v1:#5b21b6;--v2:#7c3aed;--v3:#a855f7;--v4:#d8b4fe;--text:#f5f3ff;--muted:#a78bca;--s:rgba(124,58,237,.12)}
body{font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--text);overflow-x:hidden}
#c3d{position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;opacity:.7}
nav{position:fixed;top:0;width:100%;padding:1.2rem 3rem;display:flex;justify-content:space-between;align-items:center;z-index:100;background:rgba(6,3,15,.85);backdrop-filter:blur(24px);border-bottom:1px solid rgba(168,85,247,.2)}
.logo{font-family:'Syne',sans-serif;font-size:1.2rem;font-weight:800;background:linear-gradient(135deg,var(--v3),var(--v4));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
nav ul{list-style:none;display:flex;gap:2rem}
nav a{text-decoration:none;color:var(--muted);font-size:.85rem;transition:color .2s}
nav a:hover{color:var(--v4)}
.hero{min-height:100vh;display:flex;align-items:center;padding:6rem 3rem 3rem;max-width:1100px;margin:0 auto;position:relative;z-index:1}
.hero-left{flex:1}
.badge{display:inline-flex;align-items:center;gap:.6rem;background:rgba(124,58,237,.2);border:1px solid rgba(168,85,247,.35);padding:.5rem 1.2rem;border-radius:999px;font-size:.78rem;color:var(--v4);margin-bottom:2rem;backdrop-filter:blur(8px);opacity:0;animation:fadeUp .8s ease .3s forwards}
.pulse{width:7px;height:7px;background:var(--v3);border-radius:50%;animation:pulse 2s ease infinite}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(1.6)}}
@keyframes fadeUp{from{opacity:0;transform:translateY(25px)}to{opacity:1;transform:none}}
.hero h1{font-family:'Syne',sans-serif;font-size:clamp(2.8rem,6vw,5.5rem);font-weight:800;line-height:1.05;margin-bottom:1.2rem;opacity:0;animation:fadeUp .8s ease .5s forwards}
.grad-text{background:linear-gradient(135deg,var(--v3),var(--v4),#f0abfc);-webkit-background-clip:text;-webkit-text-fill-color:transparent;display:inline}
.hero-sub{font-size:.95rem;color:var(--muted);margin-bottom:.5rem;opacity:0;animation:fadeUp .8s ease .7s forwards}
.hero-bio{font-size:1rem;color:var(--muted);max-width:500px;margin-bottom:2.5rem;line-height:1.9;font-style:italic;opacity:0;animation:fadeUp .8s ease .8s forwards}
.vbtn{display:inline-block;padding:.9rem 2.5rem;text-decoration:none;border-radius:14px;font-weight:600;font-size:.9rem;transition:all .3s;opacity:0;animation:fadeUp .8s ease 1s forwards}
.vbtn-p{background:linear-gradient(135deg,var(--v1),var(--v2));color:var(--text);box-shadow:0 0 30px rgba(124,58,237,.3)}
.vbtn-p:hover{box-shadow:0 0 50px rgba(124,58,237,.6);transform:translateY(-3px)}
.vbtn-o{background:transparent;color:var(--v3);border:1px solid rgba(168,85,247,.4);margin-left:1rem}
.vbtn-o:hover{background:rgba(124,58,237,.2);border-color:var(--v3)}
section{padding:5rem 3rem;max-width:1100px;margin:0 auto;position:relative;z-index:1}
.stag{font-size:.75rem;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:var(--v3);margin-bottom:.5rem}
h2{font-family:'Syne',sans-serif;font-size:2.2rem;font-weight:800;margin-bottom:3rem}
.skills-wrap{display:flex;flex-direction:column;gap:.75rem}
.sk{display:flex;align-items:center;gap:1.5rem;background:var(--s);border:1px solid rgba(168,85,247,.12);padding:1rem 1.5rem;border-radius:14px;transition:all .3s;opacity:0;transform:translateX(-25px)}
.sk.in{opacity:1;transform:none}
.sk:hover{border-color:rgba(168,85,247,.4);background:rgba(124,58,237,.18);box-shadow:0 4px 25px rgba(124,58,237,.15)}
.sk-n{font-weight:500;min-width:140px;font-size:.9rem}
.sk-cat-badge{font-size:.65rem;background:rgba(168,85,247,.2);color:var(--v4);padding:.2rem .6rem;border-radius:999px;font-weight:600}
.sk-track{flex:1;height:7px;background:rgba(168,85,247,.12);border-radius:999px;overflow:hidden}
.sk-fill{height:100%;background:linear-gradient(90deg,var(--v1),var(--v3),#f0abfc);border-radius:999px;width:0;transition:width 1.4s cubic-bezier(.16,1,.3,1)}
.sk-pct{font-size:.8rem;color:var(--v4);min-width:40px;text-align:right;font-weight:700}
.exp-cards{display:flex;flex-direction:column;gap:1.5rem}
.exp-card{background:var(--s);border:1px solid rgba(168,85,247,.12);border-radius:18px;padding:2rem;transition:all .3s;opacity:0;transform:translateY(25px)}
.exp-card.in{opacity:1;transform:none}
.exp-card:hover{border-color:rgba(168,85,247,.35);background:rgba(124,58,237,.18)}
.exp-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:.5rem;flex-wrap:wrap;gap:.5rem}
.exp-role{font-family:'Syne',sans-serif;font-weight:700;font-size:1.05rem}
.exp-date{font-size:.78rem;color:var(--muted);background:rgba(168,85,247,.15);padding:.3rem .8rem;border-radius:999px}
.exp-co{color:var(--v4);font-size:.9rem;margin-bottom:.75rem;font-weight:500}
.proj-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1.5rem}
.proj-card{background:var(--s);border:1px solid rgba(168,85,247,.12);border-radius:18px;padding:2rem;transition:all .3s;position:relative;overflow:hidden;opacity:0;transform:translateY(30px)}
.proj-card.in{opacity:1;transform:none}
.glow-orb{position:absolute;top:-50px;right:-50px;width:120px;height:120px;background:radial-gradient(circle,rgba(168,85,247,.3),transparent);border-radius:50%;transition:.4s}
.proj-card:hover{transform:translateY(-7px);border-color:rgba(168,85,247,.4);box-shadow:0 25px 50px rgba(124,58,237,.25)}
.proj-card:hover .glow-orb{transform:scale(1.5)}
.proj-n{font-family:'Syne',sans-serif;font-weight:700;font-size:1.1rem;margin-bottom:.75rem;position:relative}
.proj-d{color:var(--muted);font-size:.875rem;margin-bottom:1rem;position:relative;line-height:1.7}
.ptag{font-size:.7rem;background:rgba(168,85,247,.18);color:var(--v4);padding:.3rem .7rem;border-radius:999px;font-weight:600;margin:.2rem;display:inline-block}
footer{text-align:center;padding:2.5rem;border-top:1px solid rgba(168,85,247,.12);color:var(--muted);font-size:.85rem;position:relative;z-index:1}
@media(max-width:768px){nav ul{display:none}section,.hero{padding:3rem 1.5rem}}
</style></head><body>
<canvas id="c3d"></canvas>
<nav>
  <div class="logo">${esc(p.name?.split(' ')[0]||'Portfolio')}</div>
  <ul><li><a href="#skills">Skills</a></li><li><a href="#experience">Experience</a></li><li><a href="#projects">Projects</a></li><li><a href="#contact">Contact</a></li></ul>
</nav>
<div class="hero">
  <div class="hero-left">
    <div class="badge"><span class="pulse"></span>${esc(p.location||'Open to opportunities')}</div>
    <h1>I'm <span class="grad-text">${esc(p.name||'')}</span></h1>
    <div class="hero-sub">${esc(p.title||'')}</div>
    <p class="hero-bio">${esc(p.bio||'')}</p>
    <div>
      ${p.email?`<a href="mailto:${esc(p.email)}" class="vbtn vbtn-p">Get in Touch</a>`:''}
      ${p.github?`<a href="${esc(p.github)}" target="_blank" class="vbtn vbtn-o">GitHub</a>`:''}
    </div>
  </div>
</div>
<section id="skills"><div class="stag">What I know</div><h2>Skills &amp; Tech</h2>
  <div class="skills-wrap">
    ${skills(d).map(s=>`<div class="sk">
      <span class="sk-n">${esc(s.name)}</span>
      <span class="sk-cat-badge">${esc(s.category)}</span>
      <div class="sk-track"><div class="sk-fill" data-w="${s.level}%"></div></div>
      <span class="sk-pct">${s.level}%</span>
    </div>`).join('')}
  </div>
</section>
<section id="experience"><div class="stag">Where I've been</div><h2>Experience</h2>
  <div class="exp-cards">
    ${exp(d).map(e=>`<div class="exp-card">
      <div class="exp-top"><span class="exp-role">${esc(e.role)}</span><span class="exp-date">${esc(e.duration)}</span></div>
      <div class="exp-co">${esc(e.company)}</div>
      <p style="color:var(--muted);font-size:.9rem;line-height:1.8">${esc(e.description)}</p>
    </div>`).join('')}
  </div>
</section>
<section id="projects"><div class="stag">What I've built</div><h2>Projects</h2>
  <div class="proj-grid">
    ${projs(d).map(pr=>`<div class="proj-card">
      <div class="glow-orb"></div>
      <div class="proj-n">${esc(pr.name)}</div>
      <div class="proj-d">${esc(pr.description)}</div>
      <div>${(pr.tech||[]).map(t=>`<span class="ptag">${esc(t)}</span>`).join('')}</div>
      ${pr.link?`<a href="${esc(pr.link)}" target="_blank" style="display:inline-block;margin-top:1rem;color:var(--v4);font-size:.85rem;font-weight:600;text-decoration:none">View →</a>`:''}
    </div>`).join('')}
  </div>
</section>
<section id="contact"><div class="stag">Say hello</div><h2>Contact</h2>
  <div style="display:flex;gap:1rem;flex-wrap:wrap">
    ${p.email?`<a href="mailto:${esc(p.email)}" class="vbtn vbtn-p" style="opacity:1;animation:none">${esc(p.email)}</a>`:''}
    ${p.linkedin?`<a href="${esc(p.linkedin)}" target="_blank" class="vbtn vbtn-o" style="opacity:1;animation:none">LinkedIn</a>`:''}
  </div>
</section>
<footer>© ${new Date().getFullYear()} ${esc(p.name)} · Built with Folio</footer>
<script>
// Three.js morphing blob
const canvas=document.getElementById('c3d')
const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true})
renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,2))
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(60,innerWidth/innerHeight,.1,100)
camera.position.set(4,0,8)
// Main blob
const geo=new THREE.IcosahedronGeometry(2.5,5)
const origPos=geo.attributes.position.array.slice()
const mat=new THREE.MeshBasicMaterial({color:0x7c3aed,wireframe:true,transparent:true,opacity:.15})
const blob=new THREE.Mesh(geo,mat)
scene.add(blob)
// Orbiting spheres
const orbs=[]
for(let i=0;i<5;i++){
  const og=new THREE.SphereGeometry(.15+Math.random()*.25,12,12)
  const om=new THREE.MeshBasicMaterial({color:i%2===0?0xa855f7:0xd8b4fe,transparent:true,opacity:.5})
  const o=new THREE.Mesh(og,om);scene.add(o)
  orbs.push({mesh:o,angle:Math.random()*Math.PI*2,radius:3+Math.random()*2,speed:.005+Math.random()*.01,vy:Math.random()*.02-.01})
}
// Particles
const pgeo=new THREE.BufferGeometry(),pp=new Float32Array(600*3)
for(let i=0;i<1800;i++)pp[i]=(Math.random()-.5)*30
pgeo.setAttribute('position',new THREE.BufferAttribute(pp,3))
scene.add(new THREE.Points(pgeo,new THREE.PointsMaterial({color:0xa855f7,size:.035,transparent:true,opacity:.45})))
let t=0
function animate(){
  requestAnimationFrame(animate);t+=.008
  // Morph blob
  const pos=geo.attributes.position.array
  for(let i=0;i<pos.length;i+=3){
    const ox=origPos[i],oy=origPos[i+1],oz=origPos[i+2]
    const noise=Math.sin(ox*2+t)*Math.cos(oy*2+t*.7)*Math.sin(oz*1.5+t*.5)*.3
    pos[i]=ox+noise;pos[i+1]=oy+noise*.8;pos[i+2]=oz+noise*.6
  }
  geo.attributes.position.needsUpdate=true
  blob.rotation.y+=.004;blob.rotation.x+=.002
  // Orbit
  orbs.forEach(o=>{
    o.angle+=o.speed
    o.mesh.position.set(Math.cos(o.angle)*o.radius,Math.sin(t+o.angle)*.8,Math.sin(o.angle)*o.radius)
  })
  renderer.render(scene,camera)
}
animate()
window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)})
const io=new IntersectionObserver(en=>en.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in')}),{threshold:.12})
document.querySelectorAll('.sk,.exp-card,.proj-card').forEach(el=>io.observe(el))
const sio=new IntersectionObserver(en=>en.forEach(e=>{if(e.isIntersecting){e.target.style.width=e.target.dataset.w;sio.unobserve(e.target)}}),{threshold:.3})
document.querySelectorAll('.sk-fill').forEach(f=>sio.observe(f))
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();document.querySelector(a.getAttribute('href'))?.scrollIntoView({behavior:'smooth'})}))
</script></body></html>`
}

// PRO 3–7: use the premium base with different 3D shapes + color themes
function generateBlush(d)   { return premiumTemplate(d,'blush',   {bg:'#0f0408',a1:'#be185d',a2:'#ec4899',a3:'#f9a8d4',text:'#fdf2f8',muted:'#be779b',shape:'torus',     title:'Warm & Creative'}) }
function generateSlate(d)   { return premiumTemplate(d,'slate',   {bg:'#020617',a1:'#1e40af',a2:'#3b82f6',a3:'#93c5fd',text:'#f0f9ff',muted:'#7aa8cf',shape:'box',       title:'Bold & Structured'}) }
function generateTerra(d)   { return premiumTemplate(d,'terra',   {bg:'#0c0805',a1:'#92400e',a2:'#d97706',a3:'#fcd34d',text:'#fffbeb',muted:'#b58a50',shape:'dodeca',    title:'Earthy & Authentic'}) }
function generateArctic(d)  { return premiumTemplate(d,'arctic',  {bg:'#030d1a',a1:'#0c4a6e',a2:'#0284c7',a3:'#7dd3fc',text:'#f0f9ff',muted:'#5a9abf',shape:'icosa',    title:'Ice-Cold Precision'}) }
function generateObsidian(d){ return premiumTemplate(d,'obsidian',{bg:'#03020a',a1:'#4c1d95',a2:'#7c3aed',a3:'#c4b5fd',text:'#ede9fe',muted:'#8b7cc0',shape:'knot',     title:'Premium Dark Mode'}) }

function premiumTemplate(d, slug, cfg) {
  const p = d.personal||{}
  const shapes = {
    torus:   `(() => { const g = new THREE.TorusGeometry(2.2,.6,24,100); return g })()`,
    box:     `(() => { const g = new THREE.BoxGeometry(3,3,3); return g })()`,
    dodeca:  `(() => { const g = new THREE.DodecahedronGeometry(2.2,0); return g })()`,
    icosa:   `(() => { const g = new THREE.IcosahedronGeometry(2.2,2); return g })()`,
    knot:    `(() => { const g = new THREE.TorusKnotGeometry(1.8,.5,128,16); return g })()`,
  }
  const shapeCode = shapes[cfg.shape] || shapes.torus

  return `<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(p.name)} — Portfolio</title>
<link href="https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;700;800&family=Satoshi:wght@300;400;500;700&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Outfit',sans-serif;background:${cfg.bg};color:${cfg.text};overflow-x:hidden;line-height:1.7}
#c3d{position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;opacity:.5}
.vignette{position:fixed;inset:0;background:radial-gradient(ellipse 80% 80% at 50% 50%,transparent 50%,${cfg.bg}cc);z-index:1;pointer-events:none}
nav{position:fixed;top:1rem;left:50%;transform:translateX(-50%);z-index:100;background:${cfg.bg}ee;backdrop-filter:blur(20px);border:1px solid ${cfg.a2}33;border-radius:999px;padding:.75rem 2rem;display:flex;align-items:center;gap:3rem;width:fit-content;max-width:90vw}
.logo{font-size:1rem;font-weight:700;color:${cfg.a3};white-space:nowrap}
nav ul{list-style:none;display:flex;gap:1.5rem}
nav a{text-decoration:none;color:${cfg.muted};font-size:.8rem;transition:color .2s}
nav a:hover{color:${cfg.a3}}
.hero{min-height:100vh;display:flex;align-items:center;justify-content:center;text-align:center;padding:6rem 2rem;position:relative;z-index:2}
.hero-inner{max-width:750px}
.hero-eyebrow{display:inline-block;font-size:.75rem;font-weight:600;letter-spacing:.15em;text-transform:uppercase;color:${cfg.a2};background:${cfg.a1}33;border:1px solid ${cfg.a2}44;padding:.4rem 1.2rem;border-radius:999px;margin-bottom:2rem;opacity:0;animation:rise .8s ease .2s forwards}
@keyframes rise{from{opacity:0;transform:translateY(20px) scale(.95)}to{opacity:1;transform:none}}
.hero h1{font-size:clamp(2.8rem,7vw,5.5rem);font-weight:800;line-height:1.05;margin-bottom:1.2rem;opacity:0;animation:rise .8s ease .4s forwards}
.hl{background:linear-gradient(135deg,${cfg.a2},${cfg.a3});-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.hero-role{font-size:.95rem;color:${cfg.muted};letter-spacing:.05em;margin-bottom:.75rem;opacity:0;animation:rise .8s ease .6s forwards}
.hero-bio{color:${cfg.muted};font-size:1rem;max-width:500px;margin:0 auto 2.5rem;line-height:1.9;opacity:0;animation:rise .8s ease .7s forwards}
.cta-wrap{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;opacity:0;animation:rise .8s ease .9s forwards}
.btn-main{padding:.9rem 2.5rem;background:${cfg.a2};color:${cfg.bg};text-decoration:none;border-radius:12px;font-weight:700;font-size:.9rem;transition:all .3s;box-shadow:0 0 30px ${cfg.a2}44}
.btn-main:hover{transform:translateY(-3px);box-shadow:0 0 50px ${cfg.a2}66}
.btn-sec{padding:.9rem 2rem;background:transparent;color:${cfg.a3};border:1px solid ${cfg.a2}55;border-radius:12px;font-weight:500;font-size:.9rem;text-decoration:none;transition:all .3s}
.btn-sec:hover{background:${cfg.a1}33;border-color:${cfg.a2}}
section{padding:5rem 3rem;max-width:1100px;margin:0 auto;position:relative;z-index:2}
.stag{font-size:.72rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:${cfg.a2};margin-bottom:.4rem}
h2{font-size:2.2rem;font-weight:800;margin-bottom:3rem}
.sk-list{display:flex;flex-direction:column;gap:.75rem}
.sk{display:flex;align-items:center;gap:1.5rem;background:${cfg.a1}18;border:1px solid ${cfg.a2}18;padding:1rem 1.5rem;border-radius:14px;transition:all .3s;opacity:0;transform:translateX(-20px)}
.sk.in{opacity:1;transform:none}
.sk:hover{border-color:${cfg.a2}55;background:${cfg.a1}28;box-shadow:inset 0 0 20px ${cfg.a1}20}
.sk-n{font-weight:600;min-width:140px;font-size:.9rem}
.sk-badge{font-size:.65rem;background:${cfg.a2}22;color:${cfg.a3};padding:.2rem .6rem;border-radius:999px}
.sk-track{flex:1;height:7px;background:${cfg.a1}22;border-radius:999px;overflow:hidden;position:relative}
.sk-fill{height:100%;background:linear-gradient(90deg,${cfg.a1},${cfg.a2},${cfg.a3});border-radius:999px;width:0;transition:width 1.4s cubic-bezier(.16,1,.3,1)}
.sk-track::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,.1),transparent);animation:sheen 2s ease infinite}
@keyframes sheen{from{transform:translateX(-100%)}to{transform:translateX(200%)}}
.sk-pct{font-size:.8rem;color:${cfg.a3};min-width:42px;text-align:right;font-weight:700}
.exp-list{display:flex;flex-direction:column;gap:1.5rem}
.exp-card{background:${cfg.a1}15;border:1px solid ${cfg.a2}18;border-left:3px solid ${cfg.a2};border-radius:0 16px 16px 0;padding:2rem;transition:all .3s;opacity:0;transform:translateY(25px)}
.exp-card.in{opacity:1;transform:none}
.exp-card:hover{background:${cfg.a1}25;border-color:${cfg.a2}55}
.exp-top{display:flex;justify-content:space-between;flex-wrap:wrap;gap:.5rem;margin-bottom:.4rem}
.exp-role{font-weight:700;font-size:1.05rem}
.exp-date{font-size:.78rem;color:${cfg.muted};background:${cfg.a1}30;padding:.3rem .8rem;border-radius:999px}
.exp-co{color:${cfg.a3};font-size:.9rem;margin-bottom:.75rem;font-weight:600}
.proj-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1.5rem}
.proj-card{background:${cfg.a1}15;border:1px solid ${cfg.a2}18;border-radius:20px;padding:2rem;transition:all .35s;position:relative;overflow:hidden;opacity:0;transform:translateY(35px)}
.proj-card.in{opacity:1;transform:none}
.proj-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,${cfg.a1},${cfg.a2},${cfg.a3});transform:scaleX(0);transition:.4s;transform-origin:left}
.proj-card:hover{transform:translateY(-8px);border-color:${cfg.a2}44;box-shadow:0 30px 60px ${cfg.a1}33}
.proj-card:hover::before{transform:scaleX(1)}
.proj-n{font-size:1.15rem;font-weight:700;margin-bottom:.75rem}
.proj-d{color:${cfg.muted};font-size:.875rem;margin-bottom:1.2rem;line-height:1.75}
.ptag{font-size:.7rem;background:${cfg.a2}20;color:${cfg.a3};padding:.3rem .7rem;border-radius:999px;font-weight:600;margin:.2rem;display:inline-block;transition:.2s}
.ptag:hover{background:${cfg.a2}40}
footer{text-align:center;padding:3rem;border-top:1px solid ${cfg.a2}18;color:${cfg.muted};font-size:.85rem;position:relative;z-index:2}
@media(max-width:768px){nav ul{display:none};section,.hero{padding:3rem 1.5rem}}
</style></head><body>
<canvas id="c3d"></canvas>
<div class="vignette"></div>
<nav>
  <div class="logo">${esc(p.name?.split(' ')[0]||'Portfolio')}</div>
  <ul><li><a href="#skills">Skills</a></li><li><a href="#exp">Experience</a></li><li><a href="#proj">Projects</a></li><li><a href="#contact">Contact</a></li></ul>
</nav>
<div class="hero">
  <div class="hero-inner">
    <div class="hero-eyebrow">${esc(cfg.title)}</div>
    <h1><span class="hl">${esc(p.name?.split(' ')[0]||'')}</span> ${esc(p.name?.split(' ').slice(1).join(' ')||'')}</h1>
    <div class="hero-role">${esc(p.title||'')}</div>
    <p class="hero-bio">${esc(p.bio||'')}</p>
    <div class="cta-wrap">
      ${p.email?`<a href="mailto:${esc(p.email)}" class="btn-main">Get in Touch</a>`:''}
      ${p.github?`<a href="${esc(p.github)}" target="_blank" class="btn-sec">GitHub</a>`:''}
      ${p.linkedin?`<a href="${esc(p.linkedin)}" target="_blank" class="btn-sec">LinkedIn</a>`:''}
    </div>
  </div>
</div>
<section id="skills"><div class="stag">Expertise</div><h2>Skills &amp; Technologies</h2>
  <div class="sk-list">
    ${skills(d).map(s=>`<div class="sk">
      <span class="sk-n">${esc(s.name)}</span>
      <span class="sk-badge">${esc(s.category)}</span>
      <div class="sk-track"><div class="sk-fill" data-w="${s.level}%"></div></div>
      <span class="sk-pct">${s.level}%</span>
    </div>`).join('')}
  </div>
</section>
<section id="exp"><div class="stag">Career</div><h2>Work Experience</h2>
  <div class="exp-list">
    ${exp(d).map(e=>`<div class="exp-card">
      <div class="exp-top"><span class="exp-role">${esc(e.role)}</span><span class="exp-date">${esc(e.duration)}</span></div>
      <div class="exp-co">${esc(e.company)}</div>
      <p style="color:${cfg.muted};font-size:.9rem;line-height:1.8">${esc(e.description)}</p>
    </div>`).join('')}
  </div>
</section>
<section id="proj"><div class="stag">Work</div><h2>Selected Projects</h2>
  <div class="proj-grid">
    ${projs(d).map(pr=>`<div class="proj-card">
      <div class="proj-n">${esc(pr.name)}</div>
      <div class="proj-d">${esc(pr.description)}</div>
      <div>${(pr.tech||[]).map(t=>`<span class="ptag">${esc(t)}</span>`).join('')}</div>
      ${pr.link?`<a href="${esc(pr.link)}" target="_blank" style="display:inline-block;margin-top:1.2rem;color:${cfg.a3};font-size:.85rem;font-weight:600;text-decoration:none">View Project →</a>`:''}
    </div>`).join('')}
  </div>
</section>
<section id="contact"><div class="stag">Get in Touch</div><h2>Contact</h2>
  <div style="display:flex;gap:1rem;flex-wrap:wrap">
    ${p.email?`<a href="mailto:${esc(p.email)}" class="btn-main">${esc(p.email)}</a>`:''}
    ${p.linkedin?`<a href="${esc(p.linkedin)}" target="_blank" class="btn-sec">LinkedIn</a>`:''}
  </div>
</section>
<footer>© ${new Date().getFullYear()} ${esc(p.name)} · Built with Folio</footer>
<script>
// Three.js 3D scene
const canvas=document.getElementById('c3d')
const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true})
renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,2))
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(65,innerWidth/innerHeight,.1,100)
camera.position.set(0,0,7)
// Main shape — wireframe
const geo=${shapeCode}
const mat=new THREE.MeshBasicMaterial({color:'${cfg.a2}',wireframe:true,transparent:true,opacity:.18})
const mesh=new THREE.Mesh(geo,mat)
scene.add(mesh)
// Inner solid with emissive glow effect
const geo2=geo.clone()
const mat2=new THREE.MeshBasicMaterial({color:'${cfg.a1}',transparent:true,opacity:.05})
scene.add(new THREE.Mesh(geo2,mat2))
// Orbiting rings
for(let i=0;i<3;i++){
  const rg=new THREE.TorusGeometry(3+i*.8,.02,8,80)
  const rm=new THREE.MeshBasicMaterial({color:'${cfg.a3}',transparent:true,opacity:.12+i*.04})
  const ring=new THREE.Mesh(rg,rm)
  ring.rotation.x=Math.PI*(.3+i*.25)
  ring.rotation.y=Math.PI*i*.2
  scene.add(ring)
}
// Particles
const pgeo=new THREE.BufferGeometry(),pp=new Float32Array(800*3)
for(let i=0;i<2400;i++)pp[i]=(Math.random()-.5)*28
pgeo.setAttribute('position',new THREE.BufferAttribute(pp,3))
scene.add(new THREE.Points(pgeo,new THREE.PointsMaterial({color:'${cfg.a3}',size:.03,transparent:true,opacity:.4})))
// Mouse parallax
let mx=0,my=0
document.addEventListener('mousemove',e=>{mx=(e.clientX/innerWidth-.5)*2;my=(e.clientY/innerHeight-.5)*2})
let t=0
function animate(){
  requestAnimationFrame(animate);t+=.005
  mesh.rotation.x+=.003;mesh.rotation.y+=.005;mesh.rotation.z+=.001
  camera.position.x+=(mx*.5-camera.position.x)*.02
  camera.position.y+=(-my*.3-camera.position.y)*.02
  camera.lookAt(0,0,0)
  renderer.render(scene,camera)
}
animate()
window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)})
// Scroll reveal
const io=new IntersectionObserver(en=>en.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in')}),{threshold:.1})
document.querySelectorAll('.sk,.exp-card,.proj-card').forEach(el=>io.observe(el))
const sio=new IntersectionObserver(en=>en.forEach(e=>{if(e.isIntersecting){e.target.style.width=e.target.dataset.w;sio.unobserve(e.target)}}),{threshold:.3})
document.querySelectorAll('.sk-fill').forEach(f=>sio.observe(f))
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();document.querySelector(a.getAttribute('href'))?.scrollIntoView({behavior:'smooth'})}))
</script></body></html>`
}
