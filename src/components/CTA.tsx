const CTA = () => {
  return (
    <section className="py-20 bg-white dark:bg-black transition-colors duration-300 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-orange-500/10 dark:from-yellow-400/5 dark:to-orange-500/5"></div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-64 bg-yellow-500/10 dark:bg-yellow-500/5 rounded-full blur-3xl animate-glow"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 mb-8 animate-fade-in">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-semibold text-white uppercase tracking-wider">
              Start Your Journey
            </span>
          </div>

          {/* Main Heading */}
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 animate-slide-up">
            <span className="text-gray-900 dark:text-white">Ready to Experience</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              Something Amazing?
            </span>
          </h2>

          {/* Description */}
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-delay">
            Join thousands of happy customers who trust Ticketoc for their events, travels, and lifestyle needs.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-delay-2">
            <a href="https://ticketoc.com/" target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-yellow-500/30 transform hover:scale-105 btn-glow inline-block text-center">
              Browse All Events
            </a>
            <button className="px-8 py-4 border-2 border-yellow-400 dark:border-yellow-500 text-gray-900 dark:text-white font-bold rounded-lg hover:bg-yellow-400/10 dark:hover:bg-yellow-500/10 transition-all duration-300 transform hover:scale-105">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
