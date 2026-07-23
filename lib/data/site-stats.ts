// Single source of truth for the counts displayed across the site (homepage
// trust bar, /a-propos, /stats, tool teasers). Every number here is computed
// from the actual data — publishing a new article, ville or université
// updates these automatically, with nothing to edit by hand.
//
// getAllPosts() reads the filesystem, so this module is server-only. Call it
// once in a Server Component (page.tsx) and pass the numbers down as props
// to any 'use client' components that need to render them.

import { getAllPosts } from '@/lib/blog';
import { UNIVERSITIES } from '@/lib/universities';
import { CITIES } from '@/lib/cities';
import { PAYS_INFO, RENTREES } from '@/lib/calendrier-data';
import { CITY_SCORES } from '@/lib/comparer-scores';

export interface SiteStats {
  guidesCount: number;
  universitesCount: number;
  villesCount: number;
  /** Cities selectable in the /comparer tool (its own dataset — currently equal to villesCount). */
  villesComparateurCount: number;
  /** Options in the /calendrier country dropdown, including the "Autre pays" catch-all. */
  paysCalendrierCount: number;
  /** Named countries with dedicated content (excludes the "Autre" catch-all). */
  paysNommesCount: number;
  /** Intakes ("rentrées") supported by the /calendrier tool. */
  rentreesCount: number;
}

export function getSiteStats(): SiteStats {
  const paysKeys = Object.keys(PAYS_INFO);
  return {
    guidesCount: getAllPosts().length,
    universitesCount: Object.keys(UNIVERSITIES).length,
    villesCount: Object.keys(CITIES).length,
    villesComparateurCount: Object.keys(CITY_SCORES).length,
    paysCalendrierCount: paysKeys.length,
    paysNommesCount: paysKeys.filter(k => k !== 'autre').length,
    rentreesCount: Object.keys(RENTREES).length,
  };
}
