import { useState, useEffect, useRef } from "react";

const GOLD = "#C9A96E";
const GOLD_LIGHT = "#D4BA8A";
const DARK = "#0A0A0A";
const DARK_CARD = "#111111";
const DARK_SURFACE = "#1A1A1A";
const GRAY = "#888888";
const LIGHT = "#F5F2ED";

const useInView = (threshold = 0.15) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
};

const useMobile = (bp = 768) => {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth <= bp);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [bp]);
  return mobile;
};

const FadeIn = ({ children, delay = 0, direction = "up", style = {} }) => {
  const [ref, inView] = useInView();
  const dirs = { up: "translateY(40px)", down: "translateY(-40px)", left: "translateX(40px)", right: "translateX(-40px)", none: "none" };
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "none" : dirs[direction],
      transition: `opacity 0.8s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}s, transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}s`,
      ...style
    }}>{children}</div>
  );
};

const Hamburger = ({ open, onClick }) => (
  <div onClick={onClick} style={{ cursor: "pointer", padding: 8, zIndex: 1100 }}>
    <div style={{
      width: 24, height: 2, background: GOLD, marginBottom: 6,
      transition: "all 0.3s", transform: open ? "rotate(45deg) translateY(8px)" : "none",
    }} />
    <div style={{
      width: 24, height: 2, background: GOLD, marginBottom: 6,
      transition: "all 0.3s", opacity: open ? 0 : 1,
    }} />
    <div style={{
      width: 24, height: 2, background: GOLD,
      transition: "all 0.3s", transform: open ? "rotate(-45deg) translateY(-8px)" : "none",
    }} />
  </div>
);

const Nav = ({ activeSection }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const mobile = useMobile();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const links = [
    { label: "Home", id: "hero" },
    { label: "Services", id: "services" },
    { label: "Fleet", id: "fleet" },
    { label: "Rentals", id: "rentals" },
    { label: "Contact", id: "contact" },
  ];
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled || menuOpen ? "rgba(10,10,10,0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? `1px solid rgba(201,169,110,0.15)` : "none",
        transition: "all 0.4s ease",
        padding: scrolled ? "12px 0" : "20px 0",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ cursor: "pointer", zIndex: 1100 }} onClick={() => scrollTo("hero")}>
            <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: mobile ? 18 : 22, fontWeight: 700, color: GOLD, letterSpacing: 3, textTransform: "uppercase" }}>
              Elite
            </span>
            <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: mobile ? 18 : 22, fontWeight: 300, color: "#fff", letterSpacing: 3, textTransform: "uppercase", marginLeft: 6 }}>
              Transport
            </span>
          </div>

          {mobile ? (
            <Hamburger open={menuOpen} onClick={() => setMenuOpen(!menuOpen)} />
          ) : (
            <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
              {links.map((l) => (
                <span key={l.id} onClick={() => scrollTo(l.id)} style={{
                  color: activeSection === l.id ? GOLD : "rgba(255,255,255,0.55)",
                  fontSize: 10, letterSpacing: 2.5, textTransform: "uppercase",
                  cursor: "pointer", transition: "color 0.3s",
                  fontFamily: "'Montserrat', 'Helvetica Neue', sans-serif", fontWeight: 500,
                  borderBottom: activeSection === l.id ? `1px solid ${GOLD}` : "1px solid transparent",
                  paddingBottom: 4,
                }}
                  onMouseEnter={e => e.target.style.color = GOLD}
                  onMouseLeave={e => { if (activeSection !== l.id) e.target.style.color = "rgba(255,255,255,0.55)"; }}
                >{l.label}</span>
              ))}
              <div style={{ width: 1, height: 16, background: "rgba(201,169,110,0.2)", marginLeft: 4 }} />
              <span onClick={() => scrollTo("contact")} style={{
                color: GOLD, fontSize: 10, letterSpacing: 2.5, textTransform: "uppercase",
                cursor: "pointer", fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
                transition: "all 0.3s", borderBottom: "1px solid transparent", paddingBottom: 4,
              }}
                onMouseEnter={e => { e.target.style.borderBottom = `1px solid ${GOLD}`; }}
                onMouseLeave={e => { e.target.style.borderBottom = "1px solid transparent"; }}
              >Reserve</span>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile fullscreen menu */}
      {mobile && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1050,
          background: "rgba(10,10,10,0.98)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 36,
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "all" : "none",
          transition: "opacity 0.4s ease",
        }}>
          {links.map((l, i) => (
            <span key={l.id} onClick={() => scrollTo(l.id)} style={{
              color: activeSection === l.id ? GOLD : "rgba(255,255,255,0.7)",
              fontSize: 14, letterSpacing: 4, textTransform: "uppercase",
              cursor: "pointer", fontFamily: "'Montserrat', sans-serif", fontWeight: 400,
              transition: "all 0.3s",
              transform: menuOpen ? "translateY(0)" : "translateY(20px)",
              transitionDelay: menuOpen ? `${i * 0.06}s` : "0s",
              opacity: menuOpen ? 1 : 0,
            }}>{l.label}</span>
          ))}
          <div style={{ width: 40, height: 1, background: "rgba(201,169,110,0.3)" }} />
          <span onClick={() => scrollTo("contact")} style={{
            color: DARK, background: GOLD, padding: "14px 40px",
            fontSize: 12, letterSpacing: 3, textTransform: "uppercase",
            cursor: "pointer", fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
            opacity: menuOpen ? 1 : 0, transition: "opacity 0.4s ease 0.4s",
          }}>Reserve Now</span>
        </div>
      )}
    </>
  );
};

const Hero = () => {
  const mobile = useMobile();
  return (
    <section id="hero" style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: `linear-gradient(135deg, ${DARK} 0%, #1a1510 50%, ${DARK} 100%)`,
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        background: `radial-gradient(ellipse at 30% 50%, rgba(201,169,110,0.06) 0%, transparent 70%)`,
      }} />
      {!mobile && <>
        <div style={{
          position: "absolute", top: "15%", right: "8%", width: 300, height: 300,
          border: `1px solid rgba(201,169,110,0.08)`, borderRadius: "50%",
        }} />
        <div style={{
          position: "absolute", bottom: "10%", left: "5%", width: 200, height: 200,
          border: `1px solid rgba(201,169,110,0.05)`, borderRadius: "50%",
        }} />
      </>}
      <div style={{
        position: "absolute", top: "50%", left: 0, width: "100%", height: 1,
        background: `linear-gradient(90deg, transparent, rgba(201,169,110,0.1), transparent)`,
      }} />

      <div style={{ textAlign: "center", zIndex: 2, padding: mobile ? "0 20px" : "0 24px", maxWidth: 900 }}>
        <FadeIn delay={0.2}>
          <div style={{
            fontSize: mobile ? 9 : 11, letterSpacing: mobile ? 4 : 6, textTransform: "uppercase", color: GOLD,
            fontFamily: "'Montserrat', sans-serif", fontWeight: 500, marginBottom: mobile ? 24 : 32,
            display: "flex", alignItems: "center", justifyContent: "center", gap: mobile ? 10 : 16,
          }}>
            <span style={{ width: mobile ? 24 : 40, height: 1, background: GOLD, display: "inline-block" }} />
            Premium Chauffeur Services
            <span style={{ width: mobile ? 24 : 40, height: 1, background: GOLD, display: "inline-block" }} />
          </div>
        </FadeIn>
        <FadeIn delay={0.4}>
          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(32px, 8vw, 80px)",
            fontWeight: 300, color: "#fff", lineHeight: 1.1, margin: "0 0 24px",
            letterSpacing: -1,
          }}>
            Where Luxury Meets<br />
            <span style={{ fontWeight: 700, fontStyle: "italic", color: GOLD }}>Precision</span>
          </h1>
        </FadeIn>
        <FadeIn delay={0.6}>
          <p style={{
            fontFamily: "'Montserrat', sans-serif", fontSize: mobile ? 13 : 15, color: "rgba(255,255,255,0.5)",
            lineHeight: 1.8, maxWidth: 550, margin: "0 auto 40px", fontWeight: 300, letterSpacing: 0.5,
          }}>
            Exceptional executive transportation for discerning clients.
            Impeccable vehicles, professional chauffeurs, and an unwavering
            commitment to your comfort.
          </p>
        </FadeIn>
        <FadeIn delay={0.8}>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })} style={{
              background: GOLD, color: DARK, border: "none", padding: mobile ? "14px 32px" : "16px 48px",
              fontSize: 11, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer",
              fontFamily: "'Montserrat', sans-serif", fontWeight: 600, transition: "all 0.3s",
            }}
              onMouseEnter={e => { e.target.style.background = GOLD_LIGHT; e.target.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.target.style.background = GOLD; e.target.style.transform = "none"; }}
            >Reserve Your Ride</button>
            <button onClick={() => document.getElementById("fleet")?.scrollIntoView({ behavior: "smooth" })} style={{
              background: "transparent", color: GOLD, border: `1px solid ${GOLD}`, padding: mobile ? "14px 32px" : "16px 48px",
              fontSize: 11, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer",
              fontFamily: "'Montserrat', sans-serif", fontWeight: 500, transition: "all 0.3s",
            }}
              onMouseEnter={e => { e.target.style.background = "rgba(201,169,110,0.1)"; }}
              onMouseLeave={e => { e.target.style.background = "transparent"; }}
            >View Fleet</button>
          </div>
        </FadeIn>
      </div>

      {!mobile && (
        <div style={{
          position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
        }}>
          <span style={{ fontSize: 10, letterSpacing: 3, color: "rgba(255,255,255,0.3)", fontFamily: "'Montserrat', sans-serif", textTransform: "uppercase" }}>Scroll</span>
          <div style={{
            width: 1, height: 40, background: `linear-gradient(to bottom, rgba(201,169,110,0.5), transparent)`,
            animation: "pulse 2s ease-in-out infinite",
          }} />
        </div>
      )}
    </section>
  );
};

const services = [
  { icon: "🏢", title: "Corporate Transfer", desc: "Seamless point-to-point transportation for executives, board members, and VIP clients. Punctual, discreet, and professional." },
  { icon: "✈️", title: "Airport Service", desc: "First-class airport transfers with flight tracking, meet & greet, and luggage assistance. SJC, SFO, and OAK coverage." },
  { icon: "🎉", title: "Special Events", desc: "Weddings, galas, wine tours, and exclusive occasions. Make every arrival a statement with our luxury fleet." },
  { icon: "📋", title: "Corporate Accounts", desc: "Dedicated account management for companies. Volume pricing, consolidated billing, and priority booking for your team." },
];

const Services = () => {
  const mobile = useMobile();
  return (
    <section id="services" style={{ background: DARK_SURFACE, padding: mobile ? "80px 20px" : "120px 24px", position: "relative" }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg, transparent, rgba(201,169,110,0.2), transparent)`,
      }} />
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: mobile ? 48 : 80 }}>
            <span style={{
              fontSize: 11, letterSpacing: 5, textTransform: "uppercase", color: GOLD,
              fontFamily: "'Montserrat', sans-serif", fontWeight: 500,
            }}>What We Offer</span>
            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif", fontSize: mobile ? 28 : "clamp(32px, 5vw, 48px)",
              fontWeight: 300, color: "#fff", marginTop: 16,
            }}>
              Tailored <span style={{ fontStyle: "italic", color: GOLD }}>Services</span>
            </h2>
          </div>
        </FadeIn>
        <div style={{
          display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(auto-fit, minmax(240px, 1fr))", gap: 20,
        }}>
          {services.map((s, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div style={{
                background: DARK_CARD, padding: mobile ? 28 : 40, border: `1px solid rgba(201,169,110,0.08)`,
                transition: "all 0.4s ease", cursor: "default", height: "100%",
                position: "relative", overflow: "hidden",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(201,169,110,0.3)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(201,169,110,0.08)"; e.currentTarget.style.transform = "none"; }}
              >
                <div style={{ fontSize: 28, marginBottom: 20 }}>{s.icon}</div>
                <h3 style={{
                  fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 600,
                  color: "#fff", marginBottom: 12, letterSpacing: 0.5,
                }}>{s.title}</h3>
                <p style={{
                  fontFamily: "'Montserrat', sans-serif", fontSize: 13, color: GRAY,
                  lineHeight: 1.8, fontWeight: 300,
                }}>{s.desc}</p>
                <div style={{
                  position: "absolute", bottom: 0, left: 0, width: "100%", height: 2,
                  background: `linear-gradient(90deg, ${GOLD}, transparent)`, opacity: 0.3,
                }} />
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

const fleet = [
  { name: "Cadillac Escalade ESV", category: "Premium SUV", passengers: "Up to 7", features: ["Leather Interior", "Privacy Glass", "Wi-Fi", "Refreshments"], emoji: "🚙" },
  { name: "Lincoln Continental", category: "Executive Sedan", passengers: "Up to 3", features: ["Heated Seats", "Noise Cancellation", "USB-C", "Premium Audio"], emoji: "🚗" },
  { name: "Mercedes-Benz Sprinter", category: "Executive Van", passengers: "Up to 12", features: ["Conference Seating", "LED Ambient", "Entertainment", "Luggage Bay"], emoji: "🚐" },
];

const Fleet = () => {
  const mobile = useMobile();
  return (
    <section id="fleet" style={{ background: DARK, padding: mobile ? "80px 20px" : "120px 24px", position: "relative" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: mobile ? 48 : 80 }}>
            <span style={{
              fontSize: 11, letterSpacing: 5, textTransform: "uppercase", color: GOLD,
              fontFamily: "'Montserrat', sans-serif", fontWeight: 500,
            }}>Our Vehicles</span>
            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif", fontSize: mobile ? 28 : "clamp(32px, 5vw, 48px)",
              fontWeight: 300, color: "#fff", marginTop: 16,
            }}>
              The <span style={{ fontStyle: "italic", color: GOLD }}>Fleet</span>
            </h2>
          </div>
        </FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          {fleet.map((v, i) => (
            <FadeIn key={i} delay={i * 0.15}>
              <div style={{
                background: DARK_SURFACE, border: `1px solid rgba(201,169,110,0.08)`,
                overflow: "hidden", transition: "all 0.4s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(201,169,110,0.25)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(201,169,110,0.08)"; }}
              >
                <div style={{
                  height: mobile ? 160 : 200, background: `linear-gradient(135deg, #111, #1e1e1e)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  position: "relative", overflow: "hidden",
                }}>
                  <div style={{
                    position: "absolute", inset: 0,
                    background: `radial-gradient(ellipse at 50% 80%, rgba(201,169,110,0.08), transparent)`,
                  }} />
                  <span style={{ fontSize: 48, filter: "grayscale(0.3)" }}>{v.emoji}</span>
                  <div style={{
                    position: "absolute", top: 12, right: 12, background: "rgba(201,169,110,0.15)",
                    padding: "5px 12px", backdropFilter: "blur(10px)",
                  }}>
                    <span style={{
                      fontSize: 9, letterSpacing: 2, color: GOLD, textTransform: "uppercase",
                      fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
                    }}>{v.category}</span>
                  </div>
                </div>
                <div style={{ padding: mobile ? "20px 20px 24px" : "28px 28px 32px" }}>
                  <h3 style={{
                    fontFamily: "'Playfair Display', Georgia, serif", fontSize: mobile ? 18 : 22, color: "#fff",
                    fontWeight: 600, marginBottom: 6,
                  }}>{v.name}</h3>
                  <p style={{
                    fontFamily: "'Montserrat', sans-serif", fontSize: 13, color: GOLD,
                    fontWeight: 500, marginBottom: 16, letterSpacing: 0.5,
                  }}>{v.passengers} passengers</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {v.features.map((f, fi) => (
                      <span key={fi} style={{
                        fontSize: 11, color: GRAY, fontFamily: "'Montserrat', sans-serif",
                        background: "rgba(255,255,255,0.04)", padding: "5px 10px",
                        letterSpacing: 0.5, fontWeight: 400,
                      }}>{f}</span>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

const Rentals = () => {
  const [activeTab, setActiveTab] = useState("trailer");
  const mobile = useMobile();
  return (
    <section id="rentals" style={{ background: DARK_SURFACE, padding: mobile ? "80px 20px" : "120px 24px", position: "relative" }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg, transparent, rgba(201,169,110,0.2), transparent)`,
      }} />
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: mobile ? 36 : 60 }}>
            <span style={{
              fontSize: 11, letterSpacing: 5, textTransform: "uppercase", color: GOLD,
              fontFamily: "'Montserrat', sans-serif", fontWeight: 500,
            }}>Also Available</span>
            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif", fontSize: mobile ? 28 : "clamp(32px, 5vw, 48px)",
              fontWeight: 300, color: "#fff", marginTop: 16,
            }}>
              Equipment <span style={{ fontStyle: "italic", color: GOLD }}>Rentals</span>
            </h2>
          </div>
        </FadeIn>
        <FadeIn delay={0.2}>
          <div style={{ display: "flex", justifyContent: "center", gap: 0, marginBottom: mobile ? 32 : 48 }}>
            {[
              { id: "trailer", label: "3-Car Trailer" },
              { id: "truck", label: "Dodge Ram 3500" },
            ].map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                background: activeTab === t.id ? GOLD : "transparent",
                color: activeTab === t.id ? DARK : "rgba(255,255,255,0.6)",
                border: `1px solid ${activeTab === t.id ? GOLD : "rgba(201,169,110,0.2)"}`,
                padding: mobile ? "12px 20px" : "14px 36px", fontSize: mobile ? 10 : 12,
                letterSpacing: 2, textTransform: "uppercase",
                cursor: "pointer", fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
                transition: "all 0.3s",
              }}>{t.label}</button>
            ))}
          </div>
        </FadeIn>
        <FadeIn delay={0.3}>
          <div style={{
            background: DARK_CARD, border: `1px solid rgba(201,169,110,0.1)`,
            display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 0, overflow: "hidden",
          }}>
            <div style={{
              background: `linear-gradient(135deg, #151515, #1a1a1a)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative", minHeight: mobile ? 180 : 320,
            }}>
              <div style={{
                position: "absolute", inset: 0,
                background: `radial-gradient(ellipse at 50% 50%, rgba(201,169,110,0.05), transparent)`,
              }} />
              <span style={{ fontSize: mobile ? 56 : 72 }}>{activeTab === "trailer" ? "🚛" : "🛻"}</span>
            </div>
            <div style={{ padding: mobile ? 28 : 48, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <h3 style={{
                fontFamily: "'Playfair Display', Georgia, serif", fontSize: mobile ? 22 : 26, color: "#fff",
                fontWeight: 600, marginBottom: 14,
              }}>
                {activeTab === "trailer" ? "3-Car Carrier Trailer" : "Dodge Ram 3500 (2025)"}
              </h3>
              <p style={{
                fontFamily: "'Montserrat', sans-serif", fontSize: 13, color: GRAY,
                lineHeight: 1.8, marginBottom: 20, fontWeight: 300,
              }}>
                {activeTab === "trailer"
                  ? "Professional-grade 3-car carrier trailer available for daily, weekly, or monthly rental. Perfect for dealers, auctions, and transport professionals."
                  : "2025 Dodge Ram 3500 heavy-duty truck available for rental. Ideal for towing, hauling, and commercial applications. Fully equipped and maintained."}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                {(activeTab === "trailer"
                  ? ["Capacity: 3 vehicles", "Hydraulic ramps", "Full insurance available", "Daily / Weekly / Monthly rates"]
                  : ["Cummins 6.7L Turbo Diesel", "Towing capacity: 22,000+ lbs", "Crew Cab configuration", "Daily / Weekly / Monthly rates"]
                ).map((f, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ color: GOLD, fontSize: 10 }}>◆</span>
                    <span style={{
                      fontFamily: "'Montserrat', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.7)",
                      fontWeight: 400,
                    }}>{f}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })} style={{
                background: "transparent", color: GOLD, border: `1px solid ${GOLD}`,
                padding: "12px 32px", fontSize: 11, letterSpacing: 2, textTransform: "uppercase",
                cursor: "pointer", fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
                transition: "all 0.3s", alignSelf: "flex-start",
              }}
                onMouseEnter={e => { e.target.style.background = "rgba(201,169,110,0.1)"; }}
                onMouseLeave={e => { e.target.style.background = "transparent"; }}
              >Inquire Now</button>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

const stats = [
  { value: "5,000+", label: "Rides Completed" },
  { value: "99.8%", label: "On-Time Rate" },
  { value: "4.9", label: "Client Rating" },
  { value: "24/7", label: "Availability" },
];

const Stats = () => {
  const mobile = useMobile();
  return (
    <section style={{
      background: DARK, padding: mobile ? "60px 20px" : "80px 24px",
      borderTop: `1px solid rgba(201,169,110,0.08)`,
      borderBottom: `1px solid rgba(201,169,110,0.08)`,
    }}>
      <div style={{
        maxWidth: 1000, margin: "0 auto",
        display: "grid", gridTemplateColumns: mobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: mobile ? 32 : 40,
      }}>
        {stats.map((s, i) => (
          <FadeIn key={i} delay={i * 0.1}>
            <div style={{ textAlign: "center" }}>
              <div style={{
                fontFamily: "'Playfair Display', Georgia, serif", fontSize: mobile ? 32 : 42, color: GOLD,
                fontWeight: 300, marginBottom: 8,
              }}>{s.value}</div>
              <div style={{
                fontFamily: "'Montserrat', sans-serif", fontSize: mobile ? 9 : 11, color: GRAY,
                letterSpacing: 3, textTransform: "uppercase", fontWeight: 500,
              }}>{s.label}</div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
};

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", date: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const mobile = useMobile();
  const inputStyle = {
    width: "100%", background: "rgba(255,255,255,0.03)", border: `1px solid rgba(201,169,110,0.15)`,
    padding: "14px 18px", color: "#fff", fontSize: 14,
    fontFamily: "'Montserrat', sans-serif", fontWeight: 300,
    outline: "none", transition: "border-color 0.3s", boxSizing: "border-box",
    borderRadius: 0, WebkitAppearance: "none",
  };
  return (
    <section id="contact" style={{ background: DARK_SURFACE, padding: mobile ? "80px 20px" : "120px 24px", position: "relative" }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg, transparent, rgba(201,169,110,0.2), transparent)`,
      }} />
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: mobile ? 40 : 60 }}>
            <span style={{
              fontSize: 11, letterSpacing: 5, textTransform: "uppercase", color: GOLD,
              fontFamily: "'Montserrat', sans-serif", fontWeight: 500,
            }}>Get In Touch</span>
            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif", fontSize: mobile ? 28 : "clamp(32px, 5vw, 48px)",
              fontWeight: 300, color: "#fff", marginTop: 16,
            }}>
              Book Your <span style={{ fontStyle: "italic", color: GOLD }}>Ride</span>
            </h2>
            <p style={{
              fontFamily: "'Montserrat', sans-serif", fontSize: 14, color: GRAY,
              marginTop: 16, fontWeight: 300, lineHeight: 1.7,
            }}>
              Reach out and we'll have you on the road in no time. Available 24/7.
            </p>
          </div>
        </FadeIn>
        {!submitted ? (
          <FadeIn delay={0.2}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 16 }}>
                <input placeholder="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  style={inputStyle} onFocus={e => e.target.style.borderColor = GOLD} onBlur={e => e.target.style.borderColor = "rgba(201,169,110,0.15)"} />
                <input placeholder="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  style={inputStyle} onFocus={e => e.target.style.borderColor = GOLD} onBlur={e => e.target.style.borderColor = "rgba(201,169,110,0.15)"} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 16 }}>
                <input placeholder="Phone" type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                  style={inputStyle} onFocus={e => e.target.style.borderColor = GOLD} onBlur={e => e.target.style.borderColor = "rgba(201,169,110,0.15)"} />
                <select value={form.service} onChange={e => setForm({ ...form, service: e.target.value })}
                  style={{ ...inputStyle, color: form.service ? "#fff" : GRAY }}>
                  <option value="" style={{ background: DARK_CARD }}>Select Service</option>
                  <option value="corporate" style={{ background: DARK_CARD }}>Corporate Transfer</option>
                  <option value="airport" style={{ background: DARK_CARD }}>Airport Service</option>
                  <option value="event" style={{ background: DARK_CARD }}>Special Event</option>
                  <option value="trailer" style={{ background: DARK_CARD }}>Trailer Rental</option>
                  <option value="truck" style={{ background: DARK_CARD }}>Truck Rental</option>
                </select>
              </div>
              <input placeholder="Preferred Date & Time" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                style={inputStyle} onFocus={e => e.target.style.borderColor = GOLD} onBlur={e => e.target.style.borderColor = "rgba(201,169,110,0.15)"} />
              <textarea placeholder="Additional details or special requests..." rows={4}
                value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                style={{ ...inputStyle, resize: "vertical" }}
                onFocus={e => e.target.style.borderColor = GOLD} onBlur={e => e.target.style.borderColor = "rgba(201,169,110,0.15)"} />
              <button onClick={() => setSubmitted(true)} style={{
                background: GOLD, color: DARK, border: "none", padding: "16px 48px",
                fontSize: 12, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer",
                fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
                transition: "all 0.3s", alignSelf: "center", marginTop: 8,
                width: mobile ? "100%" : "auto",
              }}
                onMouseEnter={e => { e.target.style.background = GOLD_LIGHT; }}
                onMouseLeave={e => { e.target.style.background = GOLD; }}
              >Send Request</button>
            </div>
          </FadeIn>
        ) : (
          <FadeIn>
            <div style={{ textAlign: "center", padding: mobile ? "40px 0" : "60px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 20 }}>✓</div>
              <h3 style={{
                fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, color: GOLD, marginBottom: 12,
              }}>Request Received</h3>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 14, color: GRAY, fontWeight: 300 }}>
                Our team will contact you shortly to confirm your booking.
              </p>
            </div>
          </FadeIn>
        )}
        <FadeIn delay={0.4}>
          <div style={{
            display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(3, 1fr)",
            gap: mobile ? 28 : 32, marginTop: mobile ? 60 : 80, paddingTop: mobile ? 40 : 60,
            borderTop: `1px solid rgba(201,169,110,0.1)`,
          }}>
            {[
              { icon: "📞", label: "Phone", value: "(669) 333-4965" },
              { icon: "✉️", label: "Email", value: "info@elitetransport.com" },
              { icon: "📍", label: "Based In", value: "San Jose, California" },
            ].map((c, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 24, marginBottom: 10 }}>{c.icon}</div>
                <div style={{
                  fontFamily: "'Montserrat', sans-serif", fontSize: 10, letterSpacing: 3,
                  color: GOLD, textTransform: "uppercase", marginBottom: 6, fontWeight: 600,
                }}>{c.label}</div>
                <div style={{
                  fontFamily: "'Montserrat', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.7)",
                  fontWeight: 300,
                }}>{c.value}</div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

const Footer = () => {
  const mobile = useMobile();
  return (
    <footer style={{
      background: DARK, padding: mobile ? "36px 20px 28px" : "48px 24px 32px",
      borderTop: `1px solid rgba(201,169,110,0.08)`,
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
        <div style={{ marginBottom: 20 }}>
          <span style={{
            fontFamily: "'Playfair Display', Georgia, serif", fontSize: mobile ? 16 : 20, fontWeight: 700,
            color: GOLD, letterSpacing: 3, textTransform: "uppercase",
          }}>Elite</span>
          <span style={{
            fontFamily: "'Playfair Display', Georgia, serif", fontSize: mobile ? 16 : 20, fontWeight: 300,
            color: "#fff", letterSpacing: 3, textTransform: "uppercase", marginLeft: 6,
          }}>Transport</span>
        </div>
        <p style={{
          fontFamily: "'Montserrat', sans-serif", fontSize: mobile ? 10 : 12, color: "rgba(255,255,255,0.3)",
          fontWeight: 300, letterSpacing: 0.5,
        }}>
          © 2026 Elite Transport LLC. All rights reserved. · San Jose, CA · Licensed & Insured
        </p>
      </div>
    </footer>
  );
};

export default function App() {
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600;1,700&family=Montserrat:wght@300;400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    const sections = ["hero", "services", "fleet", "rentals", "contact"];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); });
      },
      { threshold: 0.3 }
    );
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <div style={{ background: DARK, minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { background: ${DARK}; }
        ::selection { background: ${GOLD}; color: ${DARK}; }
        input::placeholder, textarea::placeholder { color: ${GRAY}; }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
      `}</style>
      <Nav activeSection={activeSection} />
      <Hero />
      <Services />
      <Stats />
      <Fleet />
      <Rentals />
      <Contact />
      <Footer />
    </div>
  );
}
