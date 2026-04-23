import type { Comment, Tag } from './types';

export const SYSTEM_TAGS: Tag[] = [
  { id: 't1', name: 'Не пересаживать', icon: '🔒', on: true,  custom: false },
  { id: 't2', name: 'VIP гость',       icon: '💎', on: true,  custom: false },
  { id: 't3', name: 'День Рождения',   icon: '🎈', on: true,  custom: false },
  { id: 't4', name: 'Может опоздать',  icon: '🐢', on: true,  custom: false },
  { id: 't5', name: 'Подарок',         icon: '🎁', on: false, custom: false },
  { id: 't6', name: 'Свой алкоголь',   icon: '🍷', on: false, custom: false },
  { id: 't7', name: 'Новый',           icon: '🆕', on: true,  custom: false },
  { id: 't8', name: 'С диванами',      icon: '🛋️', on: false, custom: false },
  { id: 't9', name: 'Не поздравлять',  icon: '🤫', on: true,  custom: false },
  { id: 't10', name: 'Годовщина',      icon: '💍', on: true,  custom: true  },
];

export const COMMENTS: Comment[] = [
  { id: 'c1', text: 'Соня',     on: true },
  { id: 'c2', text: 'Катя',     on: true },
  { id: 'c3', text: 'ВЗ',       on: true },
  { id: 'c4', text: 'То место', on: true },
  { id: 'c5', text: 'Ресто',    on: true },
];
