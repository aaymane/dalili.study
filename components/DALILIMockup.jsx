'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import splashMockup from '../public/mockups/splash_mockup.png';
import homeMockup from '../public/mockups/home_mockup.png';

const MOCKUPS = [
  { id: 'home', label: 'Accueil', image: homeMockup },
  { id: 'splash', label: 'Splash', image: splashMockup },
];

const PILLS = ['Mentorat', 'Hébergement', 'Communauté'];

export default function DALILIMockup() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % MOCKUPS.length);
    }, 3500);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="dalili-mockup-section" aria-label="DALILI mobile app preview">
      <div className="dalili-mockup-inner">
        <div className="dalili-mockup-copy">
          <p className="dalili-mockup-kicker">Application mobile</p>
          <h2>DALILI dans ta poche</h2>
          <div className="dalili-mockup-pills" aria-label="DALILI pillars">
            {PILLS.map((pill) => (
              <span key={pill}>{pill}</span>
            ))}
          </div>
        </div>

        <div className="dalili-phone-stage" aria-live="polite">
          {MOCKUPS.map((mockup, index) => {
            const isActive = index === activeIndex;

            return (
              <figure
                key={mockup.id}
                className="dalili-phone-figure"
                data-active={isActive}
                style={{
                  '--phone-tilt': index === 0 ? '-3deg' : '3deg',
                  '--phone-offset': index === 0 ? '16px' : '-16px',
                }}
              >
                <Image
                  src={mockup.image}
                  alt={`Aperçu ${mockup.label} de l'application DALILI dans un iPhone 17 Pro Max`}
                  sizes="(max-width: 767px) 62vw, (max-width: 1199px) 34vw, 360px"
                  priority={index === 0}
                  placeholder="blur"
                />
              </figure>
            );
          })}
        </div>

        <div className="dalili-mockup-dots" aria-label="Choisir l'aperçu">
          {MOCKUPS.map((mockup, index) => (
            <button
              key={mockup.id}
              type="button"
              aria-label={`Afficher ${mockup.label}`}
              aria-pressed={index === activeIndex}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .dalili-mockup-section {
          position: relative;
          overflow: hidden;
          padding: clamp(72px, 9vw, 128px) clamp(18px, 5vw, 80px);
          background: linear-gradient(145deg, #060d1f 0%, #0a1a42 42%, #102a70 100%);
          color: #fff;
        }

        .dalili-mockup-inner {
          width: min(1120px, 100%);
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(0, 0.82fr) minmax(420px, 1.18fr);
          align-items: center;
          gap: clamp(32px, 6vw, 84px);
        }

        .dalili-mockup-copy {
          min-width: 0;
        }

        .dalili-mockup-kicker {
          margin: 0 0 14px;
          color: rgba(164, 190, 255, 0.92);
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        h2 {
          margin: 0;
          max-width: 520px;
          font-size: clamp(2.7rem, 6vw, 5.9rem);
          line-height: 0.95;
          font-weight: 900;
          letter-spacing: 0;
        }

        .dalili-mockup-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 28px;
        }

        .dalili-mockup-pills span {
          display: inline-flex;
          align-items: center;
          min-height: 38px;
          padding: 0 16px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.88);
          font-size: 0.84rem;
          font-weight: 700;
          backdrop-filter: blur(14px);
        }

        .dalili-phone-stage {
          position: relative;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          align-items: end;
          gap: clamp(14px, 2.5vw, 28px);
          min-height: clamp(480px, 62vw, 720px);
        }

        .dalili-phone-stage::before {
          content: '';
          position: absolute;
          left: 50%;
          bottom: 5%;
          width: min(82%, 620px);
          height: 24%;
          transform: translateX(-50%);
          border-radius: 999px;
          background: rgba(1, 77, 248, 0.24);
          filter: blur(42px);
          pointer-events: none;
        }

        .dalili-phone-figure {
          position: relative;
          z-index: 1;
          margin: 0;
          transform: translateY(18px) translateX(var(--phone-offset)) rotate(var(--phone-tilt)) scale(0.92);
          opacity: 0.54;
          transition:
            opacity 700ms ease,
            transform 700ms cubic-bezier(0.22, 1, 0.36, 1),
            filter 700ms ease;
          filter: saturate(0.88) brightness(0.88);
        }

        .dalili-phone-figure[data-active='true'] {
          transform: translateY(-8px) translateX(0) rotate(0deg) scale(1);
          opacity: 1;
          filter: saturate(1.04) brightness(1);
        }

        .dalili-phone-figure :global(img) {
          width: 100%;
          height: auto;
          display: block;
        }

        .dalili-mockup-dots {
          grid-column: 2;
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-top: 22px;
        }

        .dalili-mockup-dots button {
          width: 10px;
          height: 10px;
          padding: 0;
          border: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.35);
          cursor: pointer;
          transition: width 240ms ease, background 240ms ease, transform 240ms ease;
        }

        .dalili-mockup-dots button[aria-pressed='true'] {
          width: 28px;
          border-radius: 999px;
          background: #4d8fff;
          transform: translateY(-1px);
        }

        @media (max-width: 900px) {
          .dalili-mockup-inner {
            grid-template-columns: 1fr;
            text-align: center;
          }

          h2 {
            margin: 0 auto;
          }

          .dalili-mockup-pills {
            justify-content: center;
          }

          .dalili-phone-stage {
            width: min(680px, 100%);
            min-height: auto;
            margin: 4px auto 0;
          }

          .dalili-mockup-dots {
            grid-column: auto;
          }
        }

        @media (max-width: 560px) {
          .dalili-mockup-section {
            padding-inline: 14px;
          }

          .dalili-phone-stage {
            gap: 8px;
          }

          .dalili-phone-figure {
            transform: translateY(10px) translateX(0) rotate(0deg) scale(0.9);
          }

          .dalili-phone-figure[data-active='true'] {
            transform: translateY(-6px) translateX(0) rotate(0deg) scale(1);
          }

          .dalili-mockup-pills span {
            min-height: 34px;
            padding-inline: 12px;
            font-size: 0.78rem;
          }
        }
      `}</style>
    </section>
  );
}
