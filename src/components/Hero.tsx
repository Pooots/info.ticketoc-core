import { useRef, useState } from 'react';

const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !videoRef.current.muted;
      videoRef.current.muted = newMuted;
      if (!newMuted) videoRef.current.volume = 1;
      setIsMuted(newMuted);
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0a0a0a] dark:bg-black transition-colors duration-300">
      {/* Layered Background */}
      <div className="absolute inset-0 bg-grid-pattern"></div>
      <div className="absolute inset-0 bg-hero-grid opacity-80"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20"></div>
      
      {/* Dynamic Glow Orbs */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-yellow-400/25 to-orange-500/20 rounded-full blur-[100px] animate-glow-pulse"></div>
      <div className="absolute top-1/4 left-0 w-80 h-80 bg-orange-500/15 rounded-full blur-[80px] animate-float-slow"></div>
      <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-yellow-400/10 rounded-full blur-3xl animate-float"></div>
      
      {/* Subtle floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400/40 rounded-full animate-float"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${4 + i}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 py-12 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Information */}
          <div className="order-1 lg:order-1 flex flex-col justify-center text-center lg:text-left">
            {/* Badge - hidden on mobile */}
            <div className="hidden lg:inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-yellow-400/60 dark:border-yellow-500/70 bg-yellow-400/5 dark:bg-yellow-500/5 backdrop-blur-sm mb-6 animate-fade-in hero-badge-glow">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.8)]"></div>
              <span className="text-sm font-semibold text-gray-800 dark:text-white uppercase tracking-widest">
                Turn Your Events Into Experiences People Talk About
              </span>
            </div>

            {/* Accent line */}
            <div className="hidden lg:block w-12 h-0.5 bg-gradient-to-r from-yellow-400 to-transparent mb-4 animate-fade-in" />

            {/* Main Title / Logo */}
            <h1 className="mb-6 animate-slide-up">
              <img
                src="/images/ticketoc.png"
                alt="ticketoc"
                className="h-20 md:h-28 lg:h-36 w-auto object-contain mx-auto lg:mx-0 drop-shadow-[0_0_30px_rgba(251,191,36,0.15)]"
              />
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-gray-500 dark:text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed animate-fade-in-delay">
              One platform for all your ticketing needs. Events, adventures, dining, travel, and more — all in one place.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center animate-fade-in-delay-2">
              <a href="https://ticketoc.com/" target="_blank" rel="noopener noreferrer" className="group relative px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-xl overflow-hidden transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-yellow-500/30 transform hover:scale-[1.02] btn-glow inline-block text-center">
                <span className="relative z-10">Explore Events</span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </a>
              <a href="https://ticketoc.com/organizer/login" target="_blank" rel="noopener noreferrer" className="group relative px-8 py-4 border-2 border-yellow-400 text-yellow-400 font-bold rounded-xl overflow-hidden transition-all duration-300 hover:bg-yellow-400/10 transform hover:scale-[1.02] inline-block text-center">
                <span className="relative z-10">Be a Merchant Partner with us!</span>
              </a>
            </div>

            {/* Merchant Partner Info */}
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto lg:mx-0 animate-fade-in-delay-2">
              If you are a Organizer, attractions owners come and join us now!
            </p>

            {/* Scroll Indicator - desktop only */}
            <div className="hidden lg:block mt-12 lg:mt-16 animate-scroll-bounce">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Scroll to explore</p>
              <svg className="w-6 h-6 text-gray-500 dark:text-gray-400 mx-auto lg:mx-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>

          {/* Right: Video with Glowing Frame */}
          <div className="order-2 lg:order-2 flex items-center justify-center">
            <div className="relative w-full max-w-2xl p-2 animate-fade-in-delay">
              {/* Futuristic L-shaped corner frame */}
              <div className="absolute -top-0.5 -left-0.5 w-24 h-24 border-l-[3px] border-t-[3px] border-yellow-400 rounded-tl-lg animate-border-glow [box-shadow:0_0_15px_rgba(251,191,36,0.4)]" />
              <div className="absolute -top-0.5 -right-0.5 w-24 h-24 border-r-[3px] border-t-[3px] border-yellow-400 rounded-tr-lg animate-border-glow [box-shadow:0_0_15px_rgba(251,191,36,0.4)]" style={{ animationDelay: '0.5s' }} />
              <div className="absolute -bottom-0.5 -left-0.5 w-24 h-24 border-l-[3px] border-b-[3px] border-yellow-400 rounded-bl-lg animate-border-glow [box-shadow:0_0_15px_rgba(251,191,36,0.4)]" style={{ animationDelay: '1s' }} />
              <div className="absolute -bottom-0.5 -right-0.5 w-24 h-24 border-r-[3px] border-b-[3px] border-yellow-400 rounded-br-lg animate-border-glow [box-shadow:0_0_15px_rgba(251,191,36,0.4)]" style={{ animationDelay: '1.5s' }} />
              <div
                className="relative w-full rounded-xl overflow-hidden shadow-2xl border border-yellow-400/40 video-frame-glow cursor-pointer transition-all duration-300 hover:border-yellow-400/60"
                onClick={(e) => {
                if ((e.target as HTMLElement).closest('button')) return;
                isMuted ? toggleMute() : togglePlayPause();
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (isMuted ? toggleMute() : togglePlayPause())}
              aria-label={isMuted ? 'Click to unmute video' : undefined}
              >
              <video
                ref={videoRef}
                src="/ticketoc video.mp4"
                autoPlay
                controls
                {...(isMuted && { muted: true })}
                loop
                playsInline
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                className="w-full aspect-video bg-black object-cover"
              >
                Your browser does not support the video tag.
              </video>
              {/* Pause/Play button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlayPause();
                }}
                className="absolute bottom-4 left-4 p-2 rounded-lg bg-black/60 hover:bg-black/80 text-white transition-colors"
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7L8 5z" />
                  </svg>
                )}
              </button>
              {/* Mute button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMute();
                }}
                className={`absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isMuted
                    ? 'bg-yellow-400/90 hover:bg-yellow-400 text-black font-semibold'
                    : 'bg-black/60 hover:bg-black/80 text-white'
                }`}
                aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                title={isMuted ? 'Click for sound' : 'Mute'}
              >
                {isMuted ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                    </svg>
                    <span>Click for sound</span>
                  </>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                )}
              </button>
            </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator - mobile only, at very bottom of hero */}
        <div className="lg:hidden flex flex-col items-center animate-scroll-bounce pt-6 pb-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Scroll to explore</p>
          <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default Hero;
