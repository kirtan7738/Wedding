import wedding from '../content/wedding.js';

/** Appears 0.5 s into the opening; jumps straight to the invitation (spec §5.1). */
export default function SkipButton({ onSkip }) {
  return (
    <button type="button" className="skip-btn" onClick={onSkip}>
      {wedding.copy.skip}
    </button>
  );
}
