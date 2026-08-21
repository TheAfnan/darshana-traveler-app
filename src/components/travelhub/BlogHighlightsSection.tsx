import { CalendarDays } from 'lucide-react';

const blogPosts = [
  {
    slug: 'konkan-monsoon-drive',
    title: 'Konkan monsoon drive itinerary',
    excerpt: 'Coastal highway stops, homestays, and spice farm experiences between Mumbai and Goa.',
    date: 'Nov 25, 2025',
    tags: ['Roadtrip', 'Konkan', 'Monsoon'],
  },
  {
    slug: 'northeast-permit-guide',
    title: 'Permit guide for Northeast expeditions',
    excerpt: 'ILP/PAP walkthrough for Arunachal, Sikkim, Nagaland, plus responsible travel tips.',
    date: 'Nov 12, 2025',
    tags: ['Permits', 'Northeast India'],
  },
  {
    slug: 'ayurveda-retreat-checklist',
    title: 'Ayurveda retreat packing checklist',
    excerpt: 'What to carry for Panchakarma, beach yoga, and Kerala monsoon therapies.',
    date: 'Oct 30, 2025',
    tags: ['Wellness', 'Kerala'],
  },
];

const BlogHighlightsSection = () => (
  <section id="blog" className="pt-16">
    <div className="text-center space-y-3">
      <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Travel guide & blog</p>
      <h2 className="text-3xl font-semibold text-[#0f172a]">Fresh guides for SEO + retention</h2>
    </div>

    <div className="mt-8 grid gap-6 md:grid-cols-3">
      {blogPosts.map((post) => (
        <article key={post.slug} className="rounded-3xl border border-slate-100 bg-white shadow-sm p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <CalendarDays size={16} /> {post.date}
          </div>
          <h3 className="text-xl font-semibold text-[#0f172a]">{post.title}</h3>
          <p className="text-sm text-slate-500">{post.excerpt}</p>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 rounded-full bg-slate-50 text-slate-500 text-xs">
                {tag}
              </span>
            ))}
          </div>
          <button 
            onClick={() => alert(`Reading: ${post.title}\n(Full article coming soon!)`)}
            className="text-[#06b6d4] font-semibold text-sm hover:underline text-left"
          >
            Read guide →
          </button>
        </article>
      ))}
    </div>
  </section>
);

export default BlogHighlightsSection;
