import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronDown,
  Factory,
  Leaf,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  PackageCheck,
  ShieldCheck,
  Sprout,
  UserRound,
  Users,
  X,
  Youtube,
} from "lucide-react";
import { FormEvent, useState } from "react";

const features = [
  {
    icon: Leaf,
    title: "Traceability",
    text: "Track agrochemical usage from farm to factory.",
  },
  {
    icon: ShieldCheck,
    title: "Compliance",
    text: "Stay within safe limits and waiting periods.",
  },
  {
    icon: BarChart3,
    title: "Better Decisions",
    text: "Access accurate data and reports.",
  },
  {
    icon: Sprout,
    title: "Sustainable Tea",
    text: "Healthier crops, better quality, brighter future.",
  },
];

const testimonials = [
  {
    initials: "NP",
    name: "Nimal Perera",
    role: "Factory Manager",
    quote: "PureTeaAgro makes our factory records simple and organized. It saves a lot of time and effort.",
  },
  {
    initials: "SF",
    name: "Sujani Fernando",
    role: "Assistant Manager",
    quote: "The traceability system gives us confidence in our tea quality and compliance.",
  },
  {
    initials: "KJ",
    name: "Kasun Jayasinghe",
    role: "Estate Manager",
    quote: "It’s easy to use and really helps us manage our estates better.",
  },
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="site-shell">
      <header className="navbar">
        <a className="brand" href="#home" aria-label="PureTeaAgro home">
          <img src="/logo.png" alt="PureTeaAgro" />
          <span>pureTeaAgro</span>
        </a>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <nav className={menuOpen ? "nav-links open" : "nav-links"}>
          <a className="active" href="#home" onClick={() => setMenuOpen(false)}>Home</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
          <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
          <a className="login-button" href="#contact" onClick={() => setMenuOpen(false)}>
            <UserRound size={15} /> Login
          </a>
        </nav>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-overlay" />
          <div className="hero-content page-width">
            <p className="eyebrow">TEA INDUSTRY, REIMAGINED</p>
            <h1>Safer Tea.<br /><span>A Healthier Tomorrow.</span></h1>
            <p className="hero-copy">
              PureTeaAgro helps you track agrochemical usage,<br className="desktop-only" />
              ensure traceability and manage your tea production<br className="desktop-only" /> — all in one system.
            </p>
            <a className="primary-button" href="#contact">Get Started <ArrowRight size={18} /></a>
            <div className="location"><MapPin size={14} /> Thalawakele – Kandy District, Sri Lanka</div>
          </div>
          <div className="hero-badge">
            <span><Leaf size={19} /></span>
            <strong>Growing trust</strong>
            <small>from leaf to cup</small>
          </div>
        </section>

        <section className="features-section" id="features">
          <div className="section-heading">
            <p className="eyebrow green">KEY FEATURES</p>
            <h2>Everything You Need</h2>
            <p>One connected system for a safer, more sustainable tea industry.</p>
          </div>
          <div className="feature-grid page-width">
            {features.map(({ icon: Icon, title, text }) => (
              <article className="feature-card" key={title}>
                <div className="icon-circle"><Icon size={27} strokeWidth={2.2} /></div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="audience-section" id="about">
          <div className="audience-copy">
            <p className="eyebrow green">WHO IT&apos;S FOR</p>
            <h2>Built for Your Organization</h2>
            <p>Designed for factory managers, assistant managers and estate managers in the tea industry.</p>
            <div className="audience-list">
              <span><Factory size={18} /> Factory Manager</span>
              <span><UserRound size={18} /> Assistant Manager</span>
              <span><Sprout size={18} /> Estate Manager</span>
            </div>
          </div>
          <div className="estate-image">
            <div className="image-label"><MapPin size={15} /><span>Main Branch – Thalawakele<small>Kandy District</small></span></div>
          </div>
        </section>

        <section className="testimonials-section">
          <div className="section-heading">
            <p className="eyebrow green">WHAT OUR USERS SAY</p>
            <h2>Trusted by Tea Industry Professionals</h2>
          </div>
          <div className="testimonial-grid page-width">
            {testimonials.map((testimonial) => (
              <article className="testimonial-card" key={testimonial.name}>
                <div className="avatar">{testimonial.initials}</div>
                <div>
                  <p>“{testimonial.quote}”</p>
                  <strong>{testimonial.name}</strong>
                  <small>{testimonial.role}</small>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="cta-section" id="contact">
          <div className="cta-inner page-width">
            <div>
              <p className="eyebrow">GET STARTED TODAY</p>
              <h2>Join PureTeaAgro</h2>
              <p>Be part of a smarter, safer and more sustainable<br className="desktop-only" /> tea industry.</p>
            </div>
            <form className="signup-form" onSubmit={handleSubmit}>
              {submitted ? (
                <div className="success-message"><Check size={27} /> Thanks! We&apos;ll be in touch soon.</div>
              ) : (
                <>
                  <label><UserRound size={16} /><input required type="text" placeholder="Your Name" aria-label="Your Name" /></label>
                  <label><Mail size={16} /><input required type="email" placeholder="Your Email" aria-label="Your Email" /></label>
                  <button className="primary-button" type="submit">Sign Up Now <ArrowRight size={17} /></button>
                </>
              )}
            </form>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-main page-width">
          <div className="footer-brand">
            <a className="brand" href="#home"><img src="/logo.png" alt="PureTeaAgro" /><span>pureTeaAgro</span></a>
            <p>Traceability <i /> Compliance <i /> Sustainability</p>
          </div>
          <div className="footer-nav"><a href="#home">Home</a><a href="#about">About</a><a href="#features">Features</a><a href="#contact">Contact</a></div>
          <div className="footer-contact">
            <span><Mail size={13} /> info@pureteaagro.lk</span>
            <span><span className="phone">⌕</span> +94 81 234 5678</span>
            <span><MapPin size={13} /> Thalawakele, Kandy District, Sri Lanka</span>
          </div>
          <div className="socials"><a href="#contact" aria-label="LinkedIn"><Linkedin size={15} /></a><a href="#contact" aria-label="YouTube"><Youtube size={15} /></a></div>
        </div>
        <div className="copyright">© 2026 PureTeaAgro. All rights reserved.</div>
      </footer>
    </div>
  );
}

export default App;
