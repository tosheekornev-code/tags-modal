export interface IconEntry {
  e: string;  // unicode emoji (fallback glyph)
  d: string;  // directory name in fluentui-emoji repo (Title Case)
  s: string;  // file slug (snake_case)
  c: string;  // category id
  t: string;  // space-separated search tags (Russian + English)
}

export interface IconCategory {
  id: string;
  name: string;
  short: string; // short label / emoji for tab button
}

export interface Tag {
  id: string;
  name: string;
  icon: string | null; // unicode emoji character
  on: boolean;
  custom: boolean;
  isNew?: boolean;
}

export interface Comment {
  id: string;
  text: string;
  on: boolean;
}

export interface TagsModalProps {
  initialTags: Tag[];
  comments: Comment[];
  onChangeTags?: (tags: Tag[]) => void;
  onChangeComments?: (comments: Comment[]) => void;
  onClose?: () => void;
}

export interface PickerProps {
  recents: string[];
  onPick: (emoji: string) => void;
  onClose: () => void;
  anchor: HTMLElement | null;
  currentTag: Tag | undefined;
}
