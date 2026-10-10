const TheProblem = () => {
  const challenges = [
    {
      icon: (
        <span className="text-4xl" aria-hidden>🎟️</span>
      ),
      title: 'Selling tickets beyond your personal network',
    },
    {
      icon: (
        <span className="text-4xl" aria-hidden>📢</span>
      ),
      title: 'Reaching the right audience',
    },
    {
      icon: (
        <span className="text-4xl" aria-hidden>⏰</span>
      ),
      title: 'Managing registrations and check-ins',
    },
    {
      icon: (
        <span className="text-3xl font-bold text-green-500" aria-hidden>₱</span>
      ),
      title: 'Monetizing beyond ticket sales',
    },
  ];

  return (
    <section className="py-20 bg-zinc-950 transition-colors duration-300 overflow-hidden relative">
      {/* Subtle accent gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />
      
      <div className="container mx-auto px-6 relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-orange-500/80 mb-6 animate-fade-in">
            <span className="text-sm font-semibold text-orange-400 uppercase tracking-wider">
              THE PROBLEM
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 animate-slide-up">
            <span className="text-white">Running Events Is</span>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-500">
              Harder Than It Should Be
            </span>
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto animate-fade-in-delay">
            Event organizers often face the same challenges:
          </p>
        </div>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {challenges.map((challenge, index) => (
            <div
              key={index}
              className="group relative bg-zinc-900/80 rounded-2xl p-6 lg:p-8 border border-zinc-800 hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/5 transform hover:-translate-y-1 animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Icon container - neutral background to let colorful icons shine */}
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-white/5 mb-5 group-hover:bg-white/10 transition-colors duration-300">
                {challenge.icon}
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-white leading-snug">
                {challenge.title}
              </h3>

              {/* Bottom accent line on hover */}
              <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TheProblem;
