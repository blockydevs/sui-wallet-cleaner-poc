export type Classification = 'Legit' | 'Dubious' | 'Scam';

const SCAM_KEYWORDS = ['claim', 'airdrop', 'gift', 'reward', 'visit', 'official'];

export function classifyObject(obj: any): Classification {
  const display = obj.data?.display?.data;
  const name = display?.name || '';
  const description = display?.description || '';

  // Check text for scam indicators
  const textToCheck = (name + ' ' + description).toLowerCase();
  if (SCAM_KEYWORDS.some(keyword => textToCheck.includes(keyword))) {
    return 'Scam';
  }

  // Basic heuristic: if it has no display, it might be technical or dubious for a user
  if (!display) return 'Dubious';


  // Default random 50/50 between Dubious and Legit
  return Math.random() < 0.5 ? 'Legit' : 'Dubious';
}

