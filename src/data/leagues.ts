export interface Team {
  name: string;
  slug: string;
}

export interface League {
  name: string;
  teams: Team[];
}

export const leagues: League[] = [
  {
    name: 'LCK',
    teams: [
      { name: 'Gen.G', slug: 'geng' },
      { name: 'DRX', slug: 'dragonx' },
      { name: 'T1', slug: 't1' },
      { name: 'Hanwha Life Esports', slug: 'hanwha-life-esports' },
      { name: 'Dplus KIA', slug: 'dplus-kia' },
      { name: 'Nongshim Red Force', slug: 'nongshim-red-force' },
      { name: 'BNK FEARX', slug: 'fearx' },
      { name: 'DN Freecs', slug: 'dn-freecs' },
      { name: 'OKSavingsBank BRION', slug: 'fredit-brion' },
      { name: 'KT Rolster', slug: 'kt-rolster' }
    ]
  },
  {
    name: 'LTA Sul',
    teams: [
      { name: 'Leviatan Esports', slug: 'leviatan-esports-league-of-legends' },
      { name: 'FURIA Esports', slug: 'furia-uppercut' },
      { name: 'LOUD', slug: 'loud' },
      { name: 'RED Canids', slug: 'red-canids' },
      { name: 'paiN Gaming', slug: 'pain-gaming' },
      { name: 'Fluxo W7M', slug: 'fluxo-w7m' },
      { name: 'Vivo Keyd Stars', slug: 'vivo-keyd-stars' },
      { name: 'Isurus Estral', slug: 'isurus-estral' }
    ]
  },
  {
    name: 'LTA Norte',
    teams: [
      { name: 'FlyQuest', slug: 'flyquest' },
      { name: 'Cloud9', slug: 'cloud9' },
      { name: '100 Thieves', slug: '100-thieves' },
      { name: 'Disguised', slug: 'disguised-league-of-legends' },
      { name: 'Dignitas', slug: 'dignitas' },
      { name: 'Team Liquid', slug: 'liquid' },
      { name: 'LYON', slug: 'lyon' },
      { name: 'Shopify Rebellion', slug: 'shopify-rebellion-league-of-legends' }
    ]
  },
  {
    name: 'LEC',
    teams: [
      { name: 'SK Gaming', slug: 'sk-gaming' },
      { name: 'Karmine Corp', slug: 'karmine-corp-academy' },
      { name: 'Fnatic', slug: 'fnatic' },
      { name: 'Team Vitality', slug: 'vitality' },
      { name: 'Team Heretics', slug: 'team-heretics' },
      { name: 'BDS', slug: 'bds' },
      { name: 'G2 Esports', slug: 'g2-esports' },
      { name: 'Movistar KOI', slug: 'mad-lions-league-of-legends' },
      { name: 'GIANTX', slug: 'giantx' },
      { name: 'Rogue', slug: 'rogue' }
    ]
  },
  {
    name: 'LPL',
    teams: [
      { name: 'Top Esports', slug: 'top-esports' },
      { name: 'Invictus Gaming', slug: 'invictus-gaming' },
      { name: 'Weibo Gaming', slug: 'weibo-gaming-league-of-legends' },
      { name: 'Bilibili Gaming', slug: 'bilibili-gaming' },
      { name: 'Anyone\'s Legend', slug: 'anyone-s-legend' },
      { name: 'Team WE', slug: 'we' },
      { name: 'Ultra Prime', slug: 'ultra-prime' },
      { name: 'FunPlus Phoenix', slug: 'funplus-phoenix' },
      { name: 'JD Gaming', slug: 'qg-reapers' },
      { name: 'Ninjas in Pyjamas', slug: 'ninjas-in-pyjamas' },
      { name: 'ThunderTalk Gaming', slug: 'tt' },
      { name: 'LGD Gaming', slug: 'lgd-gaming' },
      { name: 'Royal Never Give Up', slug: 'royal-never-give-up' },
      { name: 'EDward Gaming', slug: 'edward-gaming' },
      { name: 'Oh My God', slug: 'omg' },
      { name: 'LNG Esports', slug: 'lng-esports' }
    ]
  }
]; 