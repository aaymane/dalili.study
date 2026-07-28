'use client';

// Opens the existing global assistant widget (rendered once in app/layout.tsx)
// from anywhere else in the app, without creating a second chat instance or
// prop-drilling state through the layout. AssistantWidget listens for this
// same event name and flips its own `open` state — see components/AssistantWidget.tsx.
const OPEN_ASSISTANT_EVENT = 'dalili:open-assistant';

export function openAssistant() {
  window.dispatchEvent(new Event(OPEN_ASSISTANT_EVENT));
}

export { OPEN_ASSISTANT_EVENT };

interface Props {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function OpenAssistantButton({ children, className, style }: Props) {
  return (
    <button type="button" onClick={openAssistant} className={className} style={style}>
      {children}
    </button>
  );
}
