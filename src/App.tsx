import { TagsModal } from './TagsModal';
import { COMMENTS, SYSTEM_TAGS } from './sample-data';
import './tags-modal.css';

export function App() {
  return (
    <div style={{ minHeight: '100vh', background: '#eef0f4' }}>
      <TagsModal
        initialTags={SYSTEM_TAGS.map(t => ({ ...t }))}
        comments={COMMENTS.map(c => ({ ...c }))}
      />
    </div>
  );
}
