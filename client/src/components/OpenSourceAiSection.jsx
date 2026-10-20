import React from 'react';
import { ShieldCheck, Cpu, DollarSign, Lock, HeartHandshake, HardDrive } from 'lucide-react';

export function OpenSourceAiSection() {
  const principles = [
    {
      icon: Lock,
      title: 'True Data Privacy',
      desc: 'Your messy to-dos, sensitive notes, and confidential brain dumps stay 100% on your device. Nothing is streamed to external corporate AI endpoints.'
    },
    {
      icon: DollarSign,
      title: 'Zero API Subscriptions',
      desc: 'No credit cards, rate limits, or per-token API charges. You own your computational pipeline once the weights are downloaded.'
    },
    {
      icon: Cpu,
      title: 'Powered by Gemma 3 4B',
      desc: "Built on Google's lightweight open-weight foundation model. Optimized for concise structured outputs and fast on-device inference via Ollama."
    },
    {
      icon: HardDrive,
      title: 'Hardware & Energy Honesty',
      desc: 'Local AI eliminates SaaS billing, but relies on your local CPU/GPU and electricity. Gemma 3 4B strikes the optimal balance between performance and low resource usage.'
    },
    {
      icon: HeartHandshake,
      title: 'Model Freedom & Open Source',
      desc: 'Not locked to a proprietary vendor. Switch between compatible models anytime simply by changing an environment variable.'
    },
    {
      icon: ShieldCheck,
      title: 'Zero Surveillance Telemetry',
      desc: 'No hidden telemetry trackers, analytics beacons, or third-party cookies. The application respects your digital sovereignty.'
    }
  ];

  return (
    <section className="bg-white rounded-2xl border border-lazy-border shadow-soft p-6 sm:p-8 my-8">
      <div className="max-w-3xl mb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-lazy-green">
          Open-Source AI Philosophy
        </span>
        <h2 className="text-xl sm:text-2xl font-extrabold text-lazy-brown-deep mt-1">
          Why Open-Weight AI Matters
        </h2>
        <p className="text-xs sm:text-sm text-lazy-muted mt-2 leading-relaxed">
          The Lazy Payoff isn't an interface wrapper around a closed API. It is designed from the ground up to empower users with local, sovereign intelligence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {principles.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-xl border border-lazy-border/70 bg-lazy-bg/30 hover:border-lazy-green/40 hover:bg-lazy-bg transition"
            >
              <div className="w-8 h-8 rounded-lg bg-lazy-sand flex items-center justify-center text-lazy-green mb-3">
                <Icon className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-lazy-brown-deep mb-1">
                {item.title}
              </h3>
              <p className="text-xs text-lazy-muted leading-relaxed">
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
