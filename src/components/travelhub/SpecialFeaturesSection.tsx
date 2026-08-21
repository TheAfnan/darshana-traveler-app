import { Bot, DollarSign, Cloud, Calculator, Languages } from 'lucide-react';

const specialFeatures = [
  {
    id: 'ai-planner',
    title: 'AI Travel Planner',
    description: 'Chat-based planner tuned for Indian states, permits, best seasons, and sustainability goals.',
    icon: Bot,
  },
  {
    id: 'rupee-lock',
    title: 'Rupee Price Lock',
    description: 'Hold INR fares across trains, flights, and stays for 30 minutes while you decide.',
    icon: DollarSign,
  },
  {
    id: 'weather-forecast',
    title: 'Weather & Advisory',
    description: 'Real-time IMD feeds plus 5-day predictions for hill stations and beaches.',
    icon: Cloud,
  },
  {
    id: 'expense-calculator',
    title: 'Expense Calculator',
    description: 'Shows INR cost for hotels, trains, cabs, permits, and food before checkout.',
    icon: Calculator,
  },
  {
    id: 'language-selector',
    title: 'Language Selector',
    description: 'Switch between Hindi, English, and more so travellers feel at home.',
    icon: Languages,
  },
];

const SpecialFeaturesSection = () => (
  <section id="special" className="pt-16">
    <div className="text-center space-y-3">
      <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Smart add-ons</p>
      <h2 className="text-3xl font-semibold text-[#0f172a]">Features that set DarShana apart</h2>
    </div>

    <div className="mt-8 grid gap-4 md:grid-cols-3">
      {specialFeatures.map((feature) => (
        <div key={feature.id} className="rounded-3xl border border-slate-100 bg-white shadow-sm p-5 flex gap-4">
          <div className="rounded-2xl bg-[#06b6d4]/10 text-[#06b6d4] p-3">
            <feature.icon size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#0f172a]">{feature.title}</h3>
            <p className="text-sm text-slate-500">{feature.description}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default SpecialFeaturesSection;
