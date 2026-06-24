'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const ARTICLES = [
  {
    category: 'Banque',
    accentRgb: '34,197,94',
    accent: '#22C55E',
    thumbnail: '/images/blog/compte-sans-adresse.webp',
    title: "Comment ouvrir un compte bancaire en France sans adresse fixe",
    excerpt: "C'est l'un des premiers obstacles des étudiants internationaux. Sans compte, impossible de signer un bail ou de toucher les aides. On t'explique les vraies solutions qui fonctionnent.",
    readTime: '6 min',
    date: '28 mai 2025',
    slug: 'comment-ouvrir-compte-bancaire-france-sans-adresse-fixe',
  },
  {
    category: 'Logement',
    accentRgb: '239,179,112',
    accent: '#EFB370',
    thumbnail: '/images/blog/caf.webp',
    title: "CAF étudiant étranger : délais, documents et erreurs à éviter",
    excerpt: "L'aide au logement peut atteindre 200 €/mois — mais beaucoup d'étudiants ratent le délai ou font des erreurs dans le dossier. Le guide complet pour ne rien rater.",
    readTime: '8 min',
    date: '14 mai 2025',
    slug: 'caf-etudiant-etranger-delais-documents-erreurs',
  },
  {
    category: 'Visa',
    accentRgb: '77,143,255',
    accent: '#4d8fff',
    thumbnail: '/images/blog/visa-tout-savoir.webp',
    title: "Visa étudiant France : tout ce qu'il faut savoir avant de partir",
    excerpt: "VLS-TS, Campus France, validation OFII... Le parcours visa est semé d'obstacles. Ce guide recense toutes les étapes dans l'ordre, avec les délais réels à anticiper.",
    readTime: '10 min',
    date: '2 mai 2025',
    slug: 'visa-etudiant-france-tout-savoir-avant-partir',
  },
];

const headerOverlayVariants = {
  rest:  { opacity: 0 },
  hover: { opacity: 1, transition: { duration: 0.3 } },
};

const arrowVariants = {
  rest:  { x: 0 },
  hover: { x: 5, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } },
};

const ctaUnderlineVariants = {
  rest:  { scaleX: 0 },
  hover: { scaleX: 1, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } },
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const itemVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

export default function BlogPreviewSection() {
  const sectionRef = useRef(null);

  return (
    <section
      ref={sectionRef}
      style={{
        padding: 'clamp(44px,6vw,88px) clamp(16px,5vw,80px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background nebula — warm tint, different from other sections */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: '15%', left: '60%',
        width: '55vw', height: '70vh',
        background: 'radial-gradient(ellipse at right, rgba(239,179,112,0.03) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />
      <div aria-hidden="true" style={{
        position: 'absolute', top: '50%', left: '-5%',
        width: '40vw', height: '60vh',
        background: 'radial-gradient(ellipse at left, rgba(1,77,248,0.035) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* ── Header row ── */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 24,
            flexWrap: 'wrap',
            marginBottom: 'clamp(40px,7vw,80px)',
          }}
        >
          {/* Left: badge + title */}
          <div>
            <div style={{
              display: 'inline-flex', marginBottom: 18,
              padding: '5px 16px',
              border: '1px solid rgba(1,77,248,0.3)',
              borderRadius: 100, background: 'rgba(1,77,248,0.07)',
            }}>
              <span style={{
                fontFamily: 'var(--font-montserrat)',
                fontSize: '0.6rem', fontWeight: 700,
                letterSpacing: '0.24em', textTransform: 'uppercase',
                color: 'rgba(77,143,255,0.85)',
              }}>Guide &amp; Ressources</span>
            </div>

            <h2 style={{
              fontFamily: 'var(--font-bebas)',
              fontWeight: 400,
              fontSize: 'clamp(3rem,7vw,8rem)',
              lineHeight: 0.9, letterSpacing: '0.04em',
              color: '#fff', margin: 0,
            }}>
              DU CONTENU<br />
              <span style={{ color: 'rgba(255,255,255,0.92)' }}>POUR T&apos;AIDER.</span>
            </h2>
          </div>

          {/* Right: see-all CTA */}
          <Link href="/blog" style={{ textDecoration: 'none' }}>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                paddingBottom: 4,
                cursor: 'pointer',
              }}
            >
              <span style={{
                fontFamily: 'var(--font-montserrat)',
                fontSize: '0.65rem', fontWeight: 700,
                letterSpacing: '0.16em', textTransform: 'uppercase',
                color: 'rgba(77,143,255,0.65)',
              }}>
                Voir tous les guides
              </span>
              <span style={{ color: 'rgba(77,143,255,0.5)', fontSize: '0.8rem' }}>→</span>
            </motion.div>
          </Link>
        </motion.div>

        {/* ── Cards grid ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px,100%), 1fr))',
            gap: 'clamp(14px,2.5vw,26px)',
            alignItems: 'stretch',
          }}
        >
          {ARTICLES.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              style={{ textDecoration: 'none', display: 'block' }}
            >
            <motion.article
              variants={itemVariants}
              initial="rest"
              whileHover="hover"
              animate="rest"
              style={{
                background: `linear-gradient(160deg, rgba(${article.accentRgb},0.08) 0%, rgba(1,4,16,0.97) 55%)`,
                borderWidth: 1, borderStyle: 'solid',
                borderColor: `rgba(${article.accentRgb},0.18)`,
                borderRadius: 22,
                overflow: 'hidden',
                cursor: 'pointer',
                display: 'flex', flexDirection: 'column',
                backdropFilter: 'blur(18px)',
                WebkitBackdropFilter: 'blur(18px)',
                position: 'relative',
              }}
            >
              {/* Border glow that intensifies on hover */}
              <motion.div
                aria-hidden="true"
                variants={{
                  rest:  { opacity: 0 },
                  hover: { opacity: 1, transition: { duration: 0.3 } },
                }}
                style={{
                  position: 'absolute', inset: -1,
                  borderRadius: 22,
                  border: `1px solid rgba(${article.accentRgb},0.55)`,
                  boxShadow: `0 0 32px rgba(${article.accentRgb},0.2), 0 0 64px rgba(${article.accentRgb},0.08)`,
                  pointerEvents: 'none',
                  zIndex: 10,
                }}
              />

              {/* ── Thumbnail cover ── */}
              <div style={{
                height: 'clamp(148px,18vw,184px)',
                position: 'relative',
                overflow: 'hidden',
                flexShrink: 0,
                background: '#010410',
              }}>
                {/* Real thumbnail image */}
                <Image
                  src={article.thumbnail}
                  alt={article.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                />

                {/* Dark overlay for readability of badges */}
                <div aria-hidden="true" style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(1,4,16,0.35)',
                }} />

                {/* Bottom fade into card body */}
                <div aria-hidden="true" style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%',
                  background: 'linear-gradient(to bottom, transparent, rgba(1,4,16,0.85))',
                }} />

                {/* Bottom accent scan line */}
                <div aria-hidden="true" style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
                  background: `linear-gradient(90deg, transparent, rgba(${article.accentRgb},0.5), transparent)`,
                }} />

                {/* Hover brightness overlay */}
                <motion.div
                  aria-hidden="true"
                  variants={headerOverlayVariants}
                  style={{
                    position: 'absolute', inset: 0,
                    background: `rgba(${article.accentRgb},0.08)`,
                    pointerEvents: 'none',
                  }}
                />

                {/* Category tag — top-left */}
                <div style={{
                  position: 'absolute', top: 16, left: 16,
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '5px 11px',
                  background: 'rgba(1,4,16,0.7)',
                  border: `1px solid rgba(${article.accentRgb},0.35)`,
                  borderRadius: 100,
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                }}>
                  <div style={{
                    width: 5, height: 5, borderRadius: '50%',
                    background: article.accent,
                    boxShadow: `0 0 6px ${article.accent}`,
                    flexShrink: 0,
                  }} />
                  <span style={{
                    fontFamily: 'var(--font-montserrat)',
                    fontSize: '0.52rem', fontWeight: 700,
                    letterSpacing: '0.16em', textTransform: 'uppercase',
                    color: article.accent,
                  }}>{article.category}</span>
                </div>

                {/* Read time — top-right */}
                <div style={{
                  position: 'absolute', top: 16, right: 16,
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '5px 10px',
                  background: 'rgba(1,4,16,0.65)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 100,
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                }}>
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.35)" strokeWidth="2"/>
                    <path d="M12 7v5l3 3" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span style={{
                    fontFamily: 'var(--font-montserrat)',
                    fontSize: '0.5rem', fontWeight: 600,
                    letterSpacing: '0.1em',
                    color: 'rgba(255,255,255,0.92)',
                  }}>{article.readTime}</span>
                </div>
              </div>

              {/* ── Card body ── */}
              <div style={{
                padding: 'clamp(20px,3vw,28px)',
                display: 'flex', flexDirection: 'column',
                flex: 1,
                position: 'relative', zIndex: 1,
              }}>

                {/* Article title */}
                <h3 style={{
                  fontFamily: 'var(--font-bebas)',
                  fontWeight: 400,
                  fontSize: 'clamp(1.5rem,2.5vw,2rem)',
                  lineHeight: 1.0, letterSpacing: '0.03em',
                  color: '#fff',
                  margin: '0 0 clamp(10px,1.5vw,14px)',
                }}>
                  {article.title}
                </h3>

                {/* Excerpt — 3-line clamp */}
                <p style={{
                  fontFamily: 'var(--font-dm-sans)',
                  fontWeight: 400,
                  fontSize: 'clamp(0.82rem,1.1vw,0.9rem)',
                  lineHeight: 1.72,
                  color: 'rgba(255,255,255,0.92)',
                  margin: '0 0 clamp(18px,2.5vw,24px)',
                  flex: 1,
                  // 3-line clamp
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}>
                  {article.excerpt}
                </p>

                {/* Divider */}
                <div style={{
                  height: 1,
                  background: `linear-gradient(90deg, rgba(${article.accentRgb},0.25), rgba(255,255,255,0.05) 60%, transparent)`,
                  marginBottom: 'clamp(14px,2vw,18px)',
                }} />

                {/* Footer row: date + CTA */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                }}>
                  {/* Date */}
                  <span style={{
                    fontFamily: 'var(--font-montserrat)',
                    fontSize: '0.55rem', fontWeight: 600,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.92)',
                  }}>
                    {article.date}
                  </span>

                  {/* CTA */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    position: 'relative',
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-montserrat)',
                      fontSize: '0.6rem', fontWeight: 700,
                      letterSpacing: '0.12em', textTransform: 'uppercase',
                      color: article.accent,
                    }}>
                      Lire l&apos;article
                    </span>
                    <motion.span
                      variants={arrowVariants}
                      style={{
                        color: article.accent,
                        fontSize: '0.75rem',
                        display: 'inline-block',
                      }}
                      aria-hidden="true"
                    >
                      →
                    </motion.span>

                    {/* Underline that slides in on hover */}
                    <motion.div
                      variants={ctaUnderlineVariants}
                      style={{
                        position: 'absolute',
                        bottom: -2, left: 0,
                        right: 14, // exclude arrow
                        height: 1,
                        background: article.accent,
                        transformOrigin: 'left center',
                        opacity: 0.6,
                      }}
                    />
                  </div>
                </div>
              </div>
            </motion.article>
            </Link>
          ))}
        </motion.div>

        {/* ── Bottom CTA strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.55 }}
          style={{
            marginTop: 'clamp(28px,5vw,48px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
          }}
        >
          <div style={{
            flex: 1, height: 1, maxWidth: 160,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08))',
          }} />
          <span style={{
            fontFamily: 'var(--font-dm-sans)',
            fontWeight: 400, fontSize: '0.8rem',
            color: 'rgba(255,255,255,0.92)',
            letterSpacing: '0.02em',
          }}>
            Nouveaux guides chaque semaine
          </span>
          <div style={{
            flex: 1, height: 1, maxWidth: 160,
            background: 'linear-gradient(90deg, rgba(255,255,255,0.08), transparent)',
          }} />
        </motion.div>

      </div>
    </section>
  );
}
