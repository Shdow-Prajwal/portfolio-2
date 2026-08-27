import { useState, useEffect, useRef, type ReactNode, type WheelEvent, type MouseEvent } from "react";
import { Mail, Menu, X, ArrowUpRight, Sun, Moon } from "lucide-react";
import "./App.css";


interface Skill {
  name: string;
  note: string;
}

interface Project {
  title: string;
  summary: string;
  details: string;
  stack: string[];
  link: string;
  image?: string;
  images?: string[];
}

interface PortfolioData {
  name: string;
  role: string;
  tagline: string;
  typewriterStrings: string[];
  status: string;
  projectNo: string;
  about: string;
  email: string;
  github: string;
  linkedin: string;
  skills: Skill[];
  projects: Project[];
}

const DATA: PortfolioData = {
  name: "Prajwal Aditya Vasist",
  role: "B.Tech CSE (Core), 2nd Year — VIT Chennai",
  tagline: "Learning new tech, building projects, and figuring out the cloud along the way.",
  typewriterStrings: [
    "Exploring Cloud & Infrastructure.",
    "Amateur Webdev",
    "Building Hands-on Web & IoT Apps.",
    "Exploring with Linux & Containers."
  ],
  status: "In progress",
  projectNo: "001",
  about:
    "I'm a 2nd-year B.Tech Computer Science and Engineering (Core) student at VIT Chennai. Outside of coursework, I enjoy learning new technology-related skills, playing video games, and exploring cloud deployment architectures.",
  email: "prajwaladityavasist@gmail.com",
  github: "https://github.com/Shdow-Prajwal",
  linkedin: "https://www.linkedin.com/in/prajwal-vasist-09739a42a/",
  skills: [
    { name: "JavaScript", note: "Basics & ES6+" },
    { name: "HTML & CSS", note: "Responsive UI & Layouts" },
    { name: "C / C++", note: "Core Language & Systems" },
    { name: "Git & GitHub", note: "Version Control Workflows" },
    { name: "Cloud", note: "Fundamentals & Deployment" },
  ],
  projects: [
    {
      title: "Battery Guardian",
      summary: "Flutter app that monitors battery health over BLE.",
      details:
        "A Flutter application that uses BLE to connect with an ESP-32 microcontroller and measures voltage and temperature in real time.",
      stack: ["Flutter", "BLE", "ESP-32"],
      link: "#",
      // Replace these paths with the actual filenames in your /public folder or import references
      images: [
        "/flutter ss/ss-1.jpeg",
        "/flutter ss/ss-2.jpeg",
        "/flutter ss/ss-3.jpeg",
      ],
    },
    {
      title: "Cosmic Warp Simulator",
      summary: "A simulator of black hole architecture and effects.",
      details:
        "A vibe-coded simulator that visualizes black hole physics and light curvature calculated via the Einstein field equations.",
      stack: ["JavaScript", "Canvas API", "WebGL"],
      link: "https://cosmic-warp-sim.lovable.app/",
      images:[
        "/blackhole.png",
      ],
    },
    {
      title: "Simple Portfolio Page",
      summary: "An earlier portfolio, hosted on AWS EC2.",
      details:
        "A minimal portfolio page hosted on an AWS EC2 instance — serving as my introduction to cloud deployments.",
      stack: ["HTML", "CSS", "AWS EC2"],
      link: "#",
      images:[
        "/portfolio.png",
      ]
    },
  ],
};

const SECTIONS = ["about", "skills", "projects", "contact"] as const;
type SectionId = (typeof SECTIONS)[number];

export default function App() {
  const [active, setActive] = useState<SectionId>("about");
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const projectsRef = useRef<HTMLDivElement>(null);

  // Toggle Dark/Light Theme Attribute
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Observer for active nav items & smooth entry animations (.is-visible)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id as SectionId);
            entry.target.classList.add("is-visible");
          }
        });
      },
      { rootMargin: "-20% 0px -35% 0px" }
    );

    SECTIONS.forEach((sectionId) => {
      const el = document.getElementById(sectionId);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (sectionId: SectionId) => {
    setMenuOpen(false);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  // Convert Vertical Wheel Scroll to Horizontal Track Scroll
  const handleProjectWheel = (e: WheelEvent<HTMLDivElement>) => {
    if (projectsRef.current) {
      const container = projectsRef.current;
      const isAtLeftBoundary = container.scrollLeft === 0 && e.deltaY < 0;
      const isAtRightBoundary =
        container.scrollLeft + container.clientWidth >= container.scrollWidth - 1 &&
        e.deltaY > 0;

      // Only hijack scroll when scrolling within horizontal bounds
      if (!isAtLeftBoundary && !isAtRightBoundary) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      }
    }
  };

  // Track cursor coordinates inside skill cards for spotlight hover effect
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <div className="bp-root">
      <div className="bp-bg-grid" aria-hidden="true" />

      {/* Header Bar */}
      <nav className="bp-nav">
        <div className="bp-nav-inner">
          <span className="bp-brand">
            {DATA.name.split(" ")[0]} <span className="bp-brand-dim">/ cloud</span>
          </span>

          <div className="bp-nav-right">
            <div className="bp-nav-links">
              {SECTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => scrollTo(s)}
                  className={`bp-nav-link ${active === s ? "is-active" : ""}`}
                >
                  {s}
                </button>
              ))}
            </div>

            <button
              className="bp-theme-btn"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              className="bp-menu-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle Navigation Menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {menuOpen && (
          <div className="bp-nav-mobile">
            {SECTIONS.map((s) => (
              <button
                key={s}
                onClick={() => scrollTo(s)}
                className={`bp-nav-mobile-link ${active === s ? "is-active" : ""}`}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header className="bp-hero">
        <div className="bp-hero-inner">
          <div className="bp-eyebrow">{DATA.role}</div>
          <h1 className="bp-title">{DATA.name}</h1>

          <div className="bp-typewriter-wrapper">
            <Typewriter phrases={DATA.typewriterStrings} />
          </div>

          <p className="bp-tagline">{DATA.tagline}</p>

          <div className="bp-cta-row">
            <button className="bp-btn-primary" onClick={() => scrollTo("projects")}>
              View projects <ArrowUpRight size={15} />
            </button>
            <button className="bp-btn-ghost" onClick={() => scrollTo("contact")}>
              Get in touch
            </button>
          </div>
        </div>
      </header>

      {/* About Section */}
      <Section id="about" title="About">
        <p className="bp-about">{DATA.about}</p>
      </Section>

      {/* Skills Section */}
      <Section id="skills" title="Skills">
        <div className="bp-skills-grid">
          {DATA.skills.map((s) => (
            <div
              key={s.name}
              className="bp-skill-card"
              onMouseMove={handleMouseMove}
            >
              <div className="bp-skill-spotlight" />
              <div className="bp-skill-name">{s.name}</div>
              <div className="bp-skill-note">{s.note}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Horizontal Projects Section */}
      <Section id="projects" title="Projects">
        <div
          ref={projectsRef}
          className="bp-projects-horizontal-scroll"
          onWheel={handleProjectWheel}
        >
          {DATA.projects.map((p) => (
            <div key={p.title} className="bp-project-card-large">
              <div>
                <div className="bp-project-card-header">
                  <h3 className="bp-project-card-title">{p.title}</h3>
                  {p.link && p.link !== "#" && (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noreferrer"
                      className="bp-contact-link"
                      style={{ padding: "0.4rem" }}
                    >
                      <ArrowUpRight size={16} />
                    </a>
                  )}
                </div>

                <div className="bp-project-image-placeholder">
                  {p.images && p.images.length > 0 ? (
                    <AutoImageSlider images={p.images} title={p.title} />
                  ) : p.image ? (
                    <img src={p.image} alt={p.title} />
                  ) : (
                    <span>[ Media Placeholder ]</span>
                  )}
                </div>

                <p className="bp-project-card-desc">{p.details}</p>
              </div>

              <div className="bp-tags">
                {p.stack.map((t) => (
                  <span key={t} className="bp-tag">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Contact Section */}
      <Section id="contact" title="Contact">
        <p className="bp-about">Reach out — happy to talk cloud, projects, or opportunities.</p>
        <div className="bp-contact-row">
          <a href={`mailto:${DATA.email}`} className="bp-contact-link">
            <Mail size={16} /> {DATA.email}
          </a>
          <a href={DATA.github} target="_blank" rel="noreferrer" className="bp-contact-link">
            GitHub
          </a>
          <a href={DATA.linkedin} target="_blank" rel="noreferrer" className="bp-contact-link">
            LinkedIn
          </a>
        </div>
      </Section>

      <footer className="bp-footer">END OF DOCUMENT · {DATA.name}</footer>
    </div>
  );
}

function AutoImageSlider({ images, title }: { images: string[]; title: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [images]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", minHeight: "220px", overflow: "hidden" }}>
      <img
        src={images[currentIndex]}
        alt={`${title} snapshot ${currentIndex + 1}`}
        style={{
          width: "100%",
          height: "100%",
          maxHeight: "260px",
          objectFit: "contain",
          objectPosition: "center",
          display: "block",
          transition: "opacity 0.4s ease-in-out"
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "6px",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          padding: "4px 8px",
          borderRadius: "12px",
          backdropFilter: "blur(4px)"
        }}
      >
        {images.map((_, idx) => (
          <span
            key={idx}
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: idx === currentIndex ? "#3b82f6" : "rgba(255, 255, 255, 0.5)",
              transition: "background-color 0.3s ease"
            }}
          />
        ))}
      </div>
    </div>
  );
}

function Typewriter({ phrases }: { phrases: string[] }) {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    if (subIndex === phrases[index].length + 1 && !reverse) {
      const timeout = setTimeout(() => setReverse(true), 1800);
      return () => clearTimeout(timeout);
    }
    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % phrases.length);
      return;
    }
    const timeout = setTimeout(() => setSubIndex((prev) => prev + (reverse ? -1 : 1)), reverse ? 40 : 80);
    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, phrases]);

  return (
    <span>
      $&gt; {phrases[index].substring(0, subIndex)}
      <span className="bp-cursor" aria-hidden="true" />
    </span>
  );
}

function Section({ id, title, children }: { id: SectionId; title: string; children: ReactNode }) {
  return (
    <section id={id} className="bp-section">
      <div className="bp-section-inner">
        <div className="bp-section-head">
          <span className="bp-section-title">{title}</span>
          <span className="bp-section-rule" />
        </div>
        {children}
      </div>
    </section>
  );
}