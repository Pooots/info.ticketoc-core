const Services = () => {
  const services = [
    {
      id: 'events',
      icon: '📅',
      title: 'Ticketoc Events',
      description: 'Get tickets to the hottest concerts, conferences, workshops, and exclusive gatherings happening near you.',
      features: ['Concerts & Music Festivals', 'Business Conferences', 'Workshops & Seminars', 'Award Shows']
    },
    {
      id: 'explore',
      icon: '🎢',
      title: 'Ticketoc Explore',
      description: 'Discover thrilling activities and adventures for every age. From theme parks to escape rooms and beyond.',
      features: ['Theme Parks & Attractions', 'Adventure Sports', 'Escape Rooms', 'Family Entertainment']
    },
    {
      id: 'life',
      icon: '❤️',
      title: 'Ticketoc Life',
      description: 'Elevate your lifestyle with exclusive access to wellness, beauty, and self-care experiences.',
      features: ['Spa & Wellness', 'Fitness Classes', 'Beauty Experiences', 'Personal Development']
    },
    {
      id: 'eats',
      icon: '🍴',
      title: 'Ticketoc Eats',
      description: 'Reserve tables at top restaurants, food festivals, and culinary experiences with ease.',
      features: ['Restaurant Reservations', 'Food Festivals', 'Cooking Classes', 'Wine Tasting Events']
    },
    {
      id: 'travels',
      icon: '🚌',
      title: 'Ticketoc Travels',
      description: 'Book your journey seamlessly. Buses, ferries, and flights all in one convenient platform.',
      features: ['Bus Tickets', 'Ferry Bookings', 'Airline Reservations', 'Multi-modal Trips']
    },
    {
      id: 'stay',
      icon: '🏨',
      title: 'Ticketoc Stay',
      description: 'Find your perfect accommodation. From staycations to luxury hotels, we have you covered.',
      features: ['Hotel Reservations', 'Staycation Packages', 'Resort Bookings', 'Vacation Rentals']
    }
  ];

  return (
    <section className="py-20 bg-black transition-colors duration-300">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-yellow-500 mb-6 animate-fade-in">
            <span className="text-sm font-semibold text-white uppercase tracking-wider">
              OUR SERVICES
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-4 animate-slide-up">
            <span className="text-white">Everything You Need,</span>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">One Platform</span>
          </h2>
          <p className="text-lg text-zinc-300 max-w-2xl mx-auto animate-fade-in-delay">
            From unforgettable events to seamless travel bookings, Ticketoc brings all your ticketing needs together.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="group bg-zinc-900 rounded-2xl p-6 border border-zinc-800 hover:border-yellow-500 transition-all duration-300 hover:shadow-card-hover transform hover:-translate-y-2 animate-scale-in"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              {/* Icon */}
              <div className="text-5xl mb-4 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                {service.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-white mb-3">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-zinc-300 mb-4 leading-relaxed">
                {service.description}
              </p>

              {/* Features List */}
              <ul className="space-y-2">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-zinc-400">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full flex-shrink-0"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
