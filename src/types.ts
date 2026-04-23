export interface IconEntry {
  e: string;  // unicode emoji (fallback glyph); empty for Restoplace icons
  s: string;  // slug for path: /icons/<c>/<s>.svg
  c: string;  // category id
  t: string;  // space-separated search tags (Russian + English)
}

export interface IconCategory {
  id: string;
  name: string;
  short: string;
}

export interface Tag {
  id: string;
  name: string;
  /**
   * Icon reference. Two forms:
   *   - unicode emoji char (e.g. "🎂") — for Fluent Emoji
   *   - "<category>:<slug>" (e.g. "restoplace:birthday") — for any catalog icon
   */
  icon: string | null;
  on: boolean;
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
  onPick: (ref: string) => void;  // emits "<category>:<slug>"
  onClose: () => void;
  anchor: HTMLElement | null;
  currentTag?: Tag;
}
