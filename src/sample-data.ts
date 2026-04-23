import type { Comment, Tag } from './types';

export const SYSTEM_TAGS: Tag[] = [
  { id: 't1',  name: 'Не пересаживать', icon: 'restoplace:not-transplant', on: true  },
  { id: 't2',  name: 'VIP гость',       icon: 'restoplace:vip',            on: true  },
  { id: 't3',  name: 'День Рождения',   icon: 'restoplace:birthday',       on: true  },
  { id: 't4',  name: 'Может опоздать',  icon: 'restoplace:may-be-late',    on: true  },
  { id: 't5',  name: 'Подарок',         icon: 'restoplace:certificate',    on: false },
  { id: 't6',  name: 'Свой алкоголь',   icon: 'restoplace:own-alcohol',    on: false },
  { id: 't7',  name: 'Новый',           icon: 'restoplace:new',            on: true  },
  { id: 't8',  name: 'С диванами',      icon: 'restoplace:sofa',           on: false },
  { id: 't9',  name: 'Не поздравлять',  icon: 'restoplace:nohappy',        on: true  },
  { id: 't10', name: 'Годовщина',       icon: '💍',                         on: true  },
];

export const COMMENTS: Comment[] = [
  { id: 'c1', text: 'Соня',     on: true },
  { id: 'c2', text: 'Катя',     on: true },
  { id: 'c3', text: 'ВЗ',       on: true },
  { id: 'c4', text: 'То место', on: true },
  { id: 'c5', text: 'Ресто',    on: true },
];
