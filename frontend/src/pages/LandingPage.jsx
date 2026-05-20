import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowRight, FileText, Code2, Rocket, Menu, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const steps = [
  { n: '01', title: 'Upload your CV', desc: 'Drop your PDF and we extract everything — skills, projects, education, experience.' },
  { n: '02', title: 'Review suggestions', desc: 'Get honest feedback on gaps and improvements before your portfolio goes live.' },
  { n: '03', title: 'Pick a template', desc: 'Choose from 10 beautifully designed templates — 3 free, 7 Pro with 3D effects.' },
  { n: '04', title: 'Download & deploy', desc: 'Get a single HTML file ready to open in your browser or deploy in seconds.' },
]

const templates = [
  { name: 'Lumiere',  style: 'Minimal & Editorial',  accent: 'bg-canvas-950 text-canvas-50', tag: 'Free',  pro: false },
  { name: 'Verdant',  style: 'Creative & Bold',       accent: 'bg-teal text-white',           tag: 'Free',  pro: false },
  { name: 'Nova',     style: 'Dark & Futuristic',     accent: 'bg-blue-900 text-blue-200',    tag: 'Free',  pro: false },
  { name: 'Gilded',   style: 'Luxury + 3D Particles', accent: 'bg-yellow-900 text-yellow-300',tag: 'Pro',   pro: true  },
  { name: 'Aurora',   style: 'Vibrant + 3D Torus',   accent: 'bg-violet text-white',         tag: 'Pro',   pro: true  },
  { name: 'Obsidian', style: 'Premium + 3D Effects',  accent: 'bg-purple-950 text-purple-300',tag: 'Pro',   pro: true  },
]

const testimonials = [
  {
    name: 'Ahmed K.',
    role: 'Frontend Developer',
    text: "I uploaded my CV on a Friday and had a live portfolio by Saturday morning. The analysis told me exactly what was missing. Landed 3 interviews the next week.",
    score: 91,
  },
  {
    name: 'Sara M.',
    role: 'UX Designer',
    text: "The Aurora template with the 3D effects made my portfolio look like nothing else from Egyptian designers. My clients were genuinely impressed.",
    score: 88,
  },
  {
    name: 'Omar T.',
    role: 'Full Stack Developer',
    text: "I had no idea how to build a portfolio. Folio did everything — analyzed my CV, found weak spots, and generated a full HTML file I just dragged to Netlify.",
    score: 84,
  },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-canvas-50 grain">

      {/* NAV */}
      <nav className="flex items-center justify-between px-8 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="font-display text-2xl font-semibold text-canvas-950 tracking-tight">folio</span>
          <span className="w-1.5 h-1.5 rounded-full bg-gold mt-1" />
        </div>

        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => navigate('/templates')} className="text-canvas-500 hover:text-canvas-950 text-sm transition-colors">Templates</button>
          <a href="#how" className="text-canvas-500 hover:text-canvas-950 text-sm transition-colors">How it works</a>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <button onClick={() => navigate(user.isAdmin ? '/admin' : '/dashboard')}
                className="text-sm font-medium text-canvas-600 hover:text-canvas-950 transition-colors px-3 py-2">
                Dashboard
              </button>
              <button onClick={() => { logout(); navigate('/') }}
                className="text-sm text-canvas-400 hover:text-canvas-700 transition-colors">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login"
                className="relative text-sm font-medium text-canvas-700 hover:text-canvas-950 transition-colors px-3 py-2 group">
                Sign in
                <span className="absolute bottom-0 left-3 right-3 h-px bg-gold scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </Link>
              <Link to="/register"
                className="relative inline-flex items-center gap-2 bg-canvas-950 text-canvas-50 text-sm font-medium px-5 py-2.5 rounded-full overflow-hidden group transition-all hover:shadow-lg hover:shadow-gold/20">
                <span className="absolute inset-0 bg-gold translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative transition-colors duration-300 group-hover:text-canvas-950">Get started</span>
                <ArrowRight size={14} className="relative transition-colors duration-300 group-hover:text-canvas-950" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-canvas-500 hover:text-canvas-950 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 bg-canvas-950/60 backdrop-blur-sm z-40" onClick={() => setMobileOpen(false)}>
          <div className="absolute top-0 right-0 bottom-0 w-72 bg-white shadow-2xl p-8 flex flex-col gap-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <span className="font-display text-xl font-semibold text-canvas-950">folio</span>
              <button onClick={() => setMobileOpen(false)}><X size={20} className="text-canvas-400" /></button>
            </div>
            <div className="flex flex-col gap-4 flex-1">
              <button onClick={() => { navigate('/templates'); setMobileOpen(false) }}
                className="text-left text-canvas-700 font-medium hover:text-canvas-950 transition-colors">
                Templates
              </button>
              <a href="#how" onClick={() => setMobileOpen(false)}
                className="text-canvas-700 font-medium hover:text-canvas-950 transition-colors">
                How it works
              </a>
            </div>
            <div className="flex flex-col gap-3 border-t border-canvas-100 pt-6">
              {user ? (
                <>
                  <button
                    onClick={() => { navigate(user.isAdmin ? '/admin' : '/dashboard'); setMobileOpen(false) }}
                    className="w-full bg-canvas-950 text-canvas-50 py-3 rounded-2xl font-medium text-sm hover:bg-gold hover:text-canvas-950 transition-all">
                    Dashboard
                  </button>
                  <button
                    onClick={() => { logout(); navigate('/'); setMobileOpen(false) }}
                    className="w-full border border-canvas-200 text-canvas-600 py-3 rounded-2xl font-medium text-sm">
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)}
                    className="w-full text-center border border-canvas-200 text-canvas-700 py-3 rounded-2xl font-medium text-sm">
                    Sign in
                  </Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)}
                    className="w-full text-center bg-canvas-950 text-canvas-50 py-3 rounded-2xl font-medium text-sm hover:bg-gold hover:text-canvas-950 transition-all">
                    Get started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-8 pt-16 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-gold-muted text-gold-dark text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-8 border border-gold/20">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-dark" />
              CV to Portfolio in minutes
            </div>
            <h1 className="font-display text-6xl md:text-7xl font-semibold text-canvas-950 leading-[1.05] mb-6 text-balance">
              Your work deserves a{' '}
              <em className="text-gold-dark not-italic">beautiful</em>{' '}
              home online.
            </h1>
            <p className="text-canvas-500 text-lg leading-relaxed mb-10 max-w-lg">
              Upload your CV and we will analyze it, suggest improvements, then generate a real portfolio website — download it as a single file, open in your browser, deploy anywhere.
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              <button
                onClick={() => navigate(user ? '/upload' : '/register')}
                className="inline-flex items-center gap-3 bg-canvas-950 text-canvas-50 px-8 py-4 rounded-full text-base font-medium hover:bg-gold hover:text-canvas-950 transition-all group"
              >
                {user ? 'Upload your CV' : 'Start for free'}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => navigate('/templates')}
                className="text-canvas-600 text-sm underline underline-offset-4 hover:text-canvas-950 transition-colors">
                Browse templates
              </button>
            </div>
            <div className="flex items-center gap-6 mt-10 pt-8 border-t border-canvas-200">
              {[['PDF upload', FileText], ['No code needed', Code2], ['Deploy anywhere', Rocket]].map(([label, Icon]) => (
                <div key={label} className="flex items-center gap-2 text-canvas-400 text-sm">
                  <Icon size={14} /><span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hero card */}
          <div className="relative hidden lg:block">
            <div className="bg-white rounded-3xl border border-canvas-200 p-6 shadow-xl shadow-canvas-200/50 animate-float">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-300" />
                <div className="w-3 h-3 rounded-full bg-yellow-300" />
                <div className="w-3 h-3 rounded-full bg-green-300" />
                <span className="ml-2 text-canvas-400 text-xs font-mono">portfolio.html</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gold-muted flex-shrink-0 flex items-center justify-center">
                    <span className="font-display text-gold-dark font-semibold text-sm">S</span>
                  </div>
                  <div>
                    <p className="font-semibold text-canvas-950 text-sm">Sara Ahmed</p>
                    <p className="text-canvas-400 text-xs">Full Stack Developer</p>
                  </div>
                </div>
                <div className="h-px bg-canvas-100" />
                <div className="flex gap-2 flex-wrap">
                  {['React', 'Node.js', 'TypeScript', 'AWS'].map(s => (
                    <span key={s} className="bg-canvas-100 text-canvas-600 text-xs px-2.5 py-1 rounded-lg font-mono">{s}</span>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[['Score', '87/100'], ['Template', 'Lumiere'], ['Status', 'Ready'], ['Deploy', 'Netlify']].map(([k, v]) => (
                    <div key={k} className="bg-canvas-50 rounded-xl p-3 border border-canvas-100">
                      <p className="text-canvas-400 text-xs">{k}</p>
                      <p className="text-canvas-950 text-sm font-medium mt-0.5">{v}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute -right-4 top-8 bg-gold text-canvas-950 rounded-2xl px-4 py-3 shadow-lg font-semibold text-sm">87 / 100 ✦</div>
            <div className="absolute -left-4 bottom-10 bg-teal text-white rounded-2xl px-4 py-3 shadow-lg text-sm font-medium">Portfolio ready!</div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="bg-canvas-950 py-20">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-14">
            <h2 className="font-display text-5xl font-semibold text-canvas-50 mb-3">How it works</h2>
            <p className="text-canvas-400">Four steps from CV to live portfolio.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {steps.map(({ n, title, desc }) => (
              <div key={n}>
                <div className="font-display text-6xl font-bold text-canvas-800 mb-4 leading-none">{n}</div>
                <h3 className="font-body text-canvas-50 font-semibold mb-2">{title}</h3>
                <p className="text-canvas-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEMPLATES */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="font-display text-5xl font-semibold text-canvas-950 mb-2">10 Templates</h2>
              <p className="text-canvas-400">3 free · 7 Pro with 3D effects powered by Three.js</p>
            </div>
            <button onClick={() => navigate(user ? '/templates' : '/register')}
              className="text-canvas-500 text-sm hover:text-canvas-950 transition-colors underline underline-offset-4">
              View all
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {templates.map(({ name, style, accent, tag, pro }) => (
              <div key={name}
                className="rounded-2xl overflow-hidden border border-canvas-200 hover:border-canvas-400 transition-all cursor-pointer hover:-translate-y-1 group"
                onClick={() => navigate(user ? '/templates' : '/register')}>
                <div className={`h-28 ${accent} flex items-end p-3 relative`}>
                  <div className="absolute top-2 right-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${pro ? 'bg-gold text-canvas-950' : 'bg-white/20 text-white'}`}>
                      {pro ? 'Pro' : 'Free'}
                    </span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute inset-0 bg-black/20 flex items-center justify-center">
                    <span className="bg-white text-canvas-950 text-xs font-medium px-3 py-1.5 rounded-full">Preview</span>
                  </div>
                </div>
                <div className="p-3 bg-white">
                  <p className="font-semibold text-canvas-950 text-sm">{name}</p>
                  <p className="text-canvas-400 text-xs">{style}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-5xl font-semibold text-canvas-950 mb-3">What clients say</h2>
            <p className="text-canvas-400">Real results from real portfolios.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, text, score }) => (
              <div key={name} className="bg-canvas-50 rounded-3xl p-6 border border-canvas-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gold-muted flex items-center justify-center flex-shrink-0">
                    <span className="font-display font-bold text-gold-dark">{name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-canvas-950 text-sm">{name}</p>
                    <p className="text-canvas-400 text-xs">{role}</p>
                  </div>
                  <div className="ml-auto bg-gold-muted text-gold-dark text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0">
                    {score}/100
                  </div>
                </div>
                <p className="text-canvas-600 text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gold-muted border-y border-gold/20 py-20">
        <div className="max-w-2xl mx-auto px-8 text-center">
          <h2 className="font-display text-5xl font-semibold text-canvas-950 mb-4">Ready to stand out?</h2>
          <p className="text-canvas-500 text-lg mb-10">Upload your CV and have a real portfolio ready in under 5 minutes.</p>
          <button
            onClick={() => navigate(user ? '/upload' : '/register')}
            className="inline-flex items-center gap-3 bg-canvas-950 text-canvas-50 px-10 py-4 rounded-full text-lg font-medium hover:bg-canvas-800 transition-all group"
          >
            {user ? 'Upload your CV' : 'Create free account'}
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-canvas-400 text-sm mt-4">Free plan available · No credit card required</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-canvas-200 py-8 px-8 flex items-center justify-between max-w-6xl mx-auto text-canvas-400 text-sm">
        <div className="flex items-center gap-2">
          <span className="font-display font-semibold text-canvas-950">folio</span>
          <span className="w-1 h-1 rounded-full bg-gold" />
        </div>
        <p>© {new Date().getFullYear()} Folio</p>
        <div className="flex gap-4">
          <Link to="/login" className="hover:text-canvas-950 transition-colors">Sign in</Link>
          <Link to="/register" className="hover:text-canvas-950 transition-colors">Register</Link>
        </div>
      </footer>
    </div>
  )
}
