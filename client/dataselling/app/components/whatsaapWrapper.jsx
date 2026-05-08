import Link from 'next/link';
import { MessageCircle } from 'lucide-react';

const WhatsAppLink = () => {
  const whatsappLink = 'https://whatsapp.com/channel/0029VbB174796H4JCaqzq43S';

  return (
    <div className="fixed right-5 bottom-5 z-30">
      <Link
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Join our WhatsApp channel"
        className="group inline-flex items-center gap-2 rounded-full bg-[#25D366] hover:bg-[#1FB855] text-white px-4 py-3 shadow-[0_12px_30px_-10px_rgba(37,211,102,.6)] transition-transform hover:-translate-y-0.5"
      >
        <MessageCircle size={20} className="shrink-0" />
        <span className="hidden md:inline text-sm font-semibold">Join WhatsApp channel</span>
      </Link>
    </div>
  );
};

export default WhatsAppLink;
