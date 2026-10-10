const eventImages = [
  { src: '/p1.jpg', alt: 'JCI Baliwag Buntal community event' },
  { src: '/p2.jpg', alt: 'Vibrant stage performance' },
  { src: '/p3.jpg', alt: 'Formal awards ceremony' },
  { src: '/p4.jpg', alt: '2nd International Awards Night' },
  { src: '/p5.jpg', alt: 'Wedding Suppliers Association event' },
  { src: '/p6.jpg', alt: 'Awards gala celebration' },
];

const SocialProof = () => {
  return (
    <section className="py-20 bg-black transition-colors duration-300 overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-yellow-500 mb-6 animate-fade-in">
            <span className="text-sm font-semibold text-white uppercase tracking-wider">
              SOCIAL PROOF
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-4 animate-slide-up">
            <span className="text-white">Events Powered by</span>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              Ticketoc
            </span>
          </h2>
          <p className="text-lg text-zinc-300 max-w-2xl mx-auto animate-fade-in-delay">
            Trusted by organizers, communities, and brands creating meaningful experiences.
          </p>
        </div>

        {/* Professional Grid Layout - 3 columns, uniform cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
          {eventImages.map((img, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl md:rounded-2xl border border-zinc-800 hover:border-yellow-500/50 transition-all duration-300 bg-zinc-900/50"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              {/* Subtle gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
