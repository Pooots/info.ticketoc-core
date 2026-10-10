const Ecosystem = () => {
  const stakeholders = [
    {
      name: 'Event Organizers',
      description: 'Streamline planning, management, and recognition with powerful tools built for seamless event execution.',
      color: 'from-violet-500 to-purple-600',
      icon: '📋'
    },
    {
      name: 'Merchants',
      description: 'Simplify transactions with integrated POS, multi-currency support, and seamless payment processing.',
      color: 'from-orange-500 to-amber-600',
      icon: '💳'
    },
    {
      name: 'Communities',
      description: 'Foster engagement and connection across global audiences with social and community features.',
      color: 'from-green-500 to-emerald-600',
      icon: '🌐'
    },
    {
      name: 'Attendees',
      description: 'Enjoy smooth registration, instant confirmation, and memorable experiences from start to finish.',
      color: 'from-blue-500 to-cyan-600',
      icon: '🎫'
    }
  ];

  return (
    <section className="py-20 bg-black transition-colors duration-300">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-yellow-500 mb-6 animate-fade-in">
            <span className="text-sm font-semibold text-white uppercase tracking-wider">
              OUR ECOSYSTEM
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-4 animate-slide-up">
            <span className="text-white">Ticketoc Powers the</span>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              Growing Event Economy
            </span>
          </h2>
          <p className="text-lg text-zinc-300 max-w-2xl mx-auto animate-fade-in-delay">
            One platform connecting every stakeholder — from organizers and merchants to communities and attendees.
          </p>
        </div>

        {/* Ecosystem Visualization */}
        <div className="mb-16 animate-fade-in">
          <div className="relative max-w-4xl mx-auto rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900/50 p-6 md:p-10">
            <img
              src="/Ecosystem.png"
              alt="Ticketoc Platform Ecosystem - Event Organizers, Merchants, Communities, Attendees"
              className="w-full h-auto object-contain rounded-lg"
            />
          </div>
        </div>

        {/* Stakeholder Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stakeholders.map((stakeholder, index) => (
            <div
              key={index}
              className="group bg-zinc-900 rounded-2xl p-6 border border-zinc-800 hover:border-yellow-500 transition-all duration-300 hover:shadow-card-hover transform hover:-translate-y-2 animate-scale-in"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${stakeholder.color} mb-4 text-2xl`}>
                {stakeholder.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {stakeholder.name}
              </h3>
              <p className="text-zinc-300 leading-relaxed text-sm">
                {stakeholder.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Ecosystem;
