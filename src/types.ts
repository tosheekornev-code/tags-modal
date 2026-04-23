export interface IconEntry {
  e: string;  // unicode emoji (fallback glyph if SVG fails to load)
  s: string;  // slug for path: /icons/<c>/<s>.svg
  c: string;  // category id
  t: string;  // space-separated search tags (Russian + English)
}

export interface IconCategory {
  id: string;
  name: string;
  short: string; // short label / emoji for tab button (legacy; kept for reference)
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
  onPick: (emoji: string) => void;
  onClose: () => void;
  anchor: HTMLElement | null;
  currentTag?: Tag;
}
