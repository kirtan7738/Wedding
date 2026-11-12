import { useState } from 'react';
import wedding from '../content/wedding.js';
import { whatsappShareUrl } from '../lib/share.js';

/** WhatsApp share + copy link (spec §5.9). */
export default function ShareBar() {
  const [copied, setCopied] = useState(false);
  const { share, copy } = wedding;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(share.url);
    } catch {
      const input = document.createElement('input');
      input.value = share.url;
      document.body.appendChild(input);
      input.select();
      document.execCommand?.('copy');
      input.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="share-bar">
      <a className="btn btn--whatsapp" data-share="whatsapp" href={whatsappShareUrl(share.message, share.url)} target="_blank" rel="noopener noreferrer">
        <svg viewBox="0 0 24 24" aria-hidden="true" className="btn-icon">
          <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3a.5.5 0 0 0 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.1 5.1 0 0 0 1.1 2.7 11.6 11.6 0 0 0 4.5 4c1.7.7 2.3.8 3.1.6a2.6 2.6 0 0 0 1.7-1.2 2.1 2.1 0 0 0 .2-1.2c-.1-.1-.3-.2-.5-.3Z" />
        </svg>
        <span>{copy.share}</span>
      </a>
      <button type="button" className="btn btn--ghost" onClick={copyLink}>
        {copied ? copy.copied : copy.copyLink}
      </button>
    </div>
  );
}
