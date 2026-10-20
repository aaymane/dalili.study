// Tests des briques déterministes du cerveau (sans réseau) :
//   NEXT_PUBLIC_SUPABASE_URL=http://localhost SUPABASE_SECRET_KEY=x npx tsx scripts/check-assistant.ts
import assert from 'node:assert/strict';
import { countryOfSlug, expandWithGlossary, isCountryCode, rankForCountry } from '../lib/assistant/retrieval-hints';
import { detectDistress, parseModelFlags, stripFlagsLine } from '../lib/assistant/flags';
import { extractAndValidateSources } from '../lib/assistant/system-prompt';
import { usageOf } from '../lib/assistant/cost';
import { __test } from '../lib/assistant/answer';

// Pays
assert.equal(countryOfSlug('visa-etudiant-france-maroc-2026'), 'MA');
assert.equal(countryOfSlug('bourses-etudes-france-etudiants-tunisiens'), 'TN');
assert.equal(countryOfSlug('compte-bloque-visa-etudiant-france-guide'), null);
assert.equal(isCountryCode('MA'), true);
assert.equal(isCountryCode('toString'), false);
const ranked = rankForCountry(
  [
    { slug: 'visa-etudiant-france-tunisie-2026', similarity: 0.7 },
    { slug: 'compte-bloque-visa-etudiant-france-guide', similarity: 0.66 },
    { slug: 'visa-etudiant-france-maroc-2026', similarity: 0.65 },
  ],
  'MA'
);
assert.deepEqual(ranked.map(c => c.slug), ['visa-etudiant-france-maroc-2026', 'compte-bloque-visa-etudiant-france-guide']);
assert.equal(rankForCountry([{ slug: 'visa-etudiant-france-tunisie-2026', similarity: 0.7 }], null).length, 1);

// Lexique
assert.match(expandWithGlossary('c quoi CEF ?'), /Centre pour les études en France/);
assert.match(expandWithGlossary('ma carte vitale arrive quand'), /Carte Vitale/);
assert.equal(expandWithGlossary('bonjour'), 'bonjour');

// Drapeaux
assert.deepEqual(parseModelFlags('Réponse\nFLAGS: [legal, inventé, stress]\nSOURCES_USED: [1]'), ['legal', 'stress']);
assert.equal(detectDistress("j'ai plus envie de vivre"), true);
assert.equal(detectDistress('mon visa est refusé'), false);
assert.equal(stripFlagsLine('Texte\nFLAGS: [legal]'), 'Texte');
const { answer, sources } = extractAndValidateSources('Texte.\nFLAGS: [complex]\nSOURCES_USED: [1, 9]', [{ title: 'A', url: '/a', category: null, content: '' }]);
assert.equal(answer, 'Texte.');
assert.equal(sources.length, 1);

// Le streaming ne laisse jamais passer les lignes techniques, quel que soit le découpage
const full = 'Il te faut **877,50 €** par mois.\nDeuxième ligne.\nFLAGS: [legal]\nSOURCES_USED: [1,2]';
for (const size of [1, 2, 3, 5, 7, 13, 100]) {
  const hold = __test.createTailHolder();
  let out = '';
  for (let i = 0; i < full.length; i += size) out += hold(full.slice(i, i + size));
  assert.equal(out, 'Il te faut **877,50 €** par mois.\nDeuxième ligne.', `découpage ${size}`);
}
const refusal = __test.createTailHolder();
assert.equal(refusal('SOURCES_USED: []'), '');

// Coûts (Haiku 4.5 : 1 $ / 5 $ par million)
assert.equal(usageOf('claude-haiku-4-5', { input_tokens: 1000, output_tokens: 200, cache_creation_input_tokens: 0, cache_read_input_tokens: 4000 } as never).costUsd, 0.0024);
assert.equal(usageOf('modele-inconnu', { input_tokens: 1, output_tokens: 1 } as never).costUsd, null);

console.log('Cerveau : briques déterministes ✓');
