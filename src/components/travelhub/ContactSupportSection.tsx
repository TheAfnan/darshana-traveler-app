import { MessageCircle, Phone, Mail, Send } from 'lucide-react';
import type { FormEvent } from 'react';

const supportChannels = [
  { id: 'whatsapp', label: 'WhatsApp Concierge', value: '+91 87918 98194', icon: MessageCircle, action: 'Chat now', link: 'https://wa.me/918791898194' },
  { id: 'hotline', label: '24×7 India Desk', value: '+91 93685 68267', icon: Phone, action: 'Call', link: 'tel:+919368568267' },
  { id: 'email', label: 'Priority Email', value: 'support@darshana.travel', icon: Mail, action: 'Email', link: 'mailto:support@darshana.travel' },
];

const ContactSupportSection = () => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    alert('Thank you for your inquiry! Our travel experts will contact you shortly.');
    (e.target as HTMLFormElement).reset();
  };

  return (
    <section id="contact" className="pt-16">
      <div className="text-center space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">We travel with you</p>
        <h2 className="text-3xl font-semibold text-[#0f172a]">Contact & omni-channel support</h2>
        <p className="text-slate-500">WhatsApp, Messenger/chatbot, inquiry forms, and a dedicated hotline.</p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
        <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-100 bg-white shadow-sm p-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <input required className="rounded-2xl border border-slate-200 px-4 py-3 focus:outline-none focus:border-[#06b6d4]" placeholder="Full name" />
            <input required className="rounded-2xl border border-slate-200 px-4 py-3 focus:outline-none focus:border-[#06b6d4]" placeholder="Email" type="email" />
          </div>
          <input required className="rounded-2xl border border-slate-200 px-4 py-3 focus:outline-none focus:border-[#06b6d4]" placeholder="Phone / WhatsApp" />
          <textarea required className="rounded-2xl border border-slate-200 px-4 py-3 min-h-[140px] focus:outline-none focus:border-[#06b6d4]" placeholder="Inquiry details"></textarea>
          <button type="submit" className="w-full rounded-2xl bg-gradient-to-r from-[#06b6d4] to-[#0ea5e9] text-white font-semibold py-3 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-cyan-500/30 transition-all active:scale-[0.98]">
            <Send size={18} /> Submit inquiry
          </button>
        </form>

        <div className="space-y-4">
          {supportChannels.map((channel) => (
            <div key={channel.id} className="rounded-3xl border border-slate-100 bg-white shadow-sm p-5 flex items-center justify-between hover:border-cyan-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-cyan-50 text-[#06b6d4] p-3">
                  <channel.icon size={20} />
                </div>
                <div>
                  <p className="text-sm text-slate-400">{channel.label}</p>
                  <p className="text-lg font-semibold text-[#0f172a]">{channel.value}</p>
                </div>
              </div>
              <a 
                href={channel.link}
                target="_blank"
                rel="noreferrer"
                className="text-[#06b6d4] font-semibold text-sm hover:underline"
              >
                {channel.action}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactSupportSection;
