// Vérifie l'API de contenu de l'app avant un déploiement :
//   - chaque guide cité par le Parcours-quête existe ;
//   - chaque terme du lexique pointe vers une étape existante ;
//   - chaque chiffre cité par une étape existe dans regulatory-figures.ts.
// Usage : npx tsx scripts/check-content.ts

import fs from 'fs';
import path from 'path';

import { buildFigures, buildTools } from '@/lib/content/api';
import { GLOSSARY } from '@/lib/content/glossary';
import { getGuide } from '@/lib/content/guides';
import { JOURNEY, SAFETY } from '@/lib/content/journey';

const errors: string[] = [];
const exists = (slug: string) => fs.existsSync(path.join(process.cwd(), 'content', 'blog', `${slug}.mdx`));
const stepIds = new Set(JOURNEY.map(s => s.id));
const figures = buildFigures();

for (const step of JOURNEY) {
  for (const [country, slugs] of Object.entries(step.guides)) {
    for (const slug of slugs ?? []) if (!exists(slug)) errors.push(`Étape ${step.id} (${country}) : guide introuvable « ${slug} »`);
  }
  for (const f of step.figures ?? []) {
    const table = f.kind === 'figure' ? figures.verified : figures.pending;
    if (!(f.id in table)) errors.push(`Étape ${step.id} : chiffre inconnu « ${f.id} »`);
  }
}
if (!exists(SAFETY.guide)) errors.push(`Bouclier : guide introuvable « ${SAFETY.guide} »`);
for (const t of GLOSSARY) if (t.stepId && !stepIds.has(t.stepId)) errors.push(`Lexique ${t.term} : étape inconnue « ${t.stepId} »`);

const slugs = new Set(JOURNEY.flatMap(s => Object.values(s.guides).flat()));
for (const slug of Array.from(slugs)) if (exists(slug) && !getGuide(slug)?.blocks.length) errors.push(`Guide vide après parsing : ${slug}`);

const cases = buildTools().budget.cases;
if (cases.some(c => !c.expected)) errors.push('Simulateur : un cas de test ne se calcule pas');

console.log(`${JOURNEY.length} étapes, ${slugs.size} guides cités, ${GLOSSARY.length} termes, ${cases.length} cas de test du simulateur.`);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('Contenu cohérent ✓');
