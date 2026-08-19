const INTERESTS = [
  'education',
  'health',
  'career',
  'leadership',
  'community',
  'entrepreneurship',
];

function InterestCheckboxes({ selected, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {INTERESTS.map((interest) => (
        <label
          key={interest}
          className="flex items-center gap-2 border border-line px-3 py-2 text-sm text-ink cursor-pointer hover:border-forest/40 transition-colors"
        >
          <input
            type="checkbox"
            checked={selected.includes(interest)}
            onChange={() => onChange(interest)}
            className="h-4 w-4 accent-forest"
          />
          <span className="capitalize">{interest}</span>
        </label>
      ))}
    </div>
  );
}

export { INTERESTS };
export default InterestCheckboxes;
