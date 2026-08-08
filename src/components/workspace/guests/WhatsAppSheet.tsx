import { useEffect } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  guestName?: string;
  guestCount?: number;
  guestIds?: string[];
  audiencePreset?: string;
  onSend?: () => void;
}

export function WhatsAppSheet({ isOpen, onClose, guestName, guestCount, guestIds, audiencePreset }: Props) {
  useEffect(() => {
    if (isOpen) {
      window.dispatchEvent(
        new CustomEvent('open-communication', {
          detail: { guestIds, audiencePreset, guestName }
        })
      );
      onClose();
    }
  }, [isOpen, onClose, guestIds, audiencePreset]);

  return null;
}

