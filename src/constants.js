export const LEVELS = [
  { name: 'Neófito',      min: 0,   max: 49,  color: '#9ca3af' },
  { name: 'Conjurador',   min: 50,  max: 119, color: '#60a5fa' },
  { name: 'Arcanista',    min: 120, max: 219, color: '#c084fc' },
  { name: 'Planeswalker', min: 220, max: 349, color: '#fbbf24' },
  { name: 'Lendário',     min: 350, max: 9999,color: '#f87171' },
]

export const RARITIES = [
  { key: 'comum',    label: 'Comum',    color: '#9ca3af', border: '#4b5563', bg: '#1f2937', art: 'FLAME',   pts: 15 },
  { key: 'incomum',  label: 'Incomum',  color: '#4ade80', border: '#166534', bg: '#052e16', art: 'POTION',  pts: 25 },
  { key: 'raro',     label: 'Raro',     color: '#60a5fa', border: '#1e40af', bg: '#0f172a', art: 'CRYSTAL', pts: 40 },
  { key: 'epico',    label: 'Épico',    color: '#c084fc', border: '#6b21a8', bg: '#1a0533', art: 'DRAGON',  pts: 60 },
  { key: 'lendario', label: 'Lendário', color: '#fbbf24', border: '#92400e', bg: '#1c0a00', art: 'PHOENIX', pts: 90 },
]

export const PENALTY_THRESHOLDS = [
  { limit: 0,   level: 'leve',   label: 'PENALIDADE LEVE',   color: '#f59e0b' },
  { limit: -20, level: 'media',  label: 'PENALIDADE MÉDIA',  color: '#f87171' },
  { limit: -40, level: 'severa', label: 'PENALIDADE SEVERA', color: '#dc2626' },
]

export const DEFAULT_PENALTIES = [
  { id: 'p1', titulo: 'Lavar a louça por 3 dias',        nivel: 'leve',   icone: '🍽' },
  { id: 'p2', titulo: 'Varrer a casa',                    nivel: 'leve',   icone: '🧹' },
  { id: 'p3', titulo: 'Sem videogame por uma semana',     nivel: 'media',  icone: '🎮' },
  { id: 'p4', titulo: 'Ajoelhar no milho por 5 minutos', nivel: 'media',  icone: '🌽' },
  { id: 'p5', titulo: 'Sem celular por uma semana',       nivel: 'severa', icone: '📵' },
  { id: 'p6', titulo: 'Escrever carta de desculpa',       nivel: 'severa', icone: '✉' },
]

export const PERFIS = [
  { id: '00000000-0000-0000-0000-000000000001', nome: 'Maria',  role: 'oraculo',  pin: '1152', emoji: '🔮' },
  { id: '00000000-0000-0000-0000-000000000002', nome: 'Denys',  role: 'guardiao', pin: '1152', emoji: '⚔' },
  { id: '00000000-0000-0000-0000-000000000003', nome: 'Junior', role: 'jogador',  pin: '0000', emoji: '★' },
]
