const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/90 backdrop-blur-md border-b border-gray-200 dark:border-black-border transition-all duration-300 animate-fade-in">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <img
              src="/images/ticketoc.png"
              alt="ticketoc"
              className="h-10 w-auto object-contain"
            />
          </a>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {['Events', 'Fun', 'Eats', 'Life', 'Travels', 'Stay'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="relative text-gray-700 dark:text-gray-300 hover:text-yellow-400 transition-colors font-medium py-1 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:bg-gradient-to-r after:from-yellow-400 after:to-orange-500 after:w-0 hover:after:w-full after:transition-all after:duration-300"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Get Tickets Button */}
            <a href="https://ticketoc.com/" target="_blank" rel="noopener noreferrer" className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-yellow-500/30 transform hover:scale-105 btn-glow inline-block">
              Get Tickets
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
