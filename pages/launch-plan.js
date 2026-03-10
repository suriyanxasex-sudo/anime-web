import Head from 'next/head';
import Navbar from '../components/Navbar';
import { FaCheckCircle, FaFileContract, FaMoneyBillWave, FaServer } from 'react-icons/fa';

const steps = [
  {
    icon: <FaFileContract className="text-[#FB7299]" />,
    title: 'Get legal content licenses',
    detail:
      'Only stream movies you have rights to distribute. Start with indie studios or regional distributors.',
  },
  {
    icon: <FaMoneyBillWave className="text-[#FB7299]" />,
    title: 'Set up subscription plans',
    detail:
      'Launch with simple tiers: Basic ($4.99), Standard ($8.99), and Premium ($12.99) with monthly billing.',
  },
  {
    icon: <FaServer className="text-[#FB7299]" />,
    title: 'Build a reliable streaming stack',
    detail:
      'Use video CDN + secure playback + payment gateway. Add DRM when you scale.',
  },
  {
    icon: <FaCheckCircle className="text-[#FB7299]" />,
    title: 'Focus on one niche first',
    detail:
      'Pick a market (anime, classics, local cinema) and win that niche before expanding.',
  },
];

export default function LaunchPlanPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Head>
        <title>Launch Your Streaming Business | JPLUS</title>
      </Head>

      <Navbar />

      <main className="max-w-5xl mx-auto px-4 md:px-8 py-10">
        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#151515] to-[#0B0B0B] p-8 md:p-12 mb-8">
          <p className="text-[#FB7299] uppercase tracking-[0.3em] text-xs font-black mb-4">Creator roadmap</p>
          <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tight mb-4">
            Build a Netflix-style website
          </h1>
          <p className="text-white/80 max-w-3xl leading-relaxed">
            You can absolutely build a subscription streaming platform, but the key is to run it legally:
            use licensed movies and charge users for access.
          </p>
        </section>

        <section className="grid gap-4 md:gap-5">
          {steps.map((step) => (
            <article
              key={step.title}
              className="flex gap-4 items-start rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:p-6"
            >
              <div className="text-2xl mt-1">{step.icon}</div>
              <div>
                <h2 className="font-bold text-lg mb-1">{step.title}</h2>
                <p className="text-white/70">{step.detail}</p>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

