import { useState, useRef, useEffect, FormEvent } from 'react';
import { Menu, X, Volume2, VolumeX, Sparkles, Check, Send, Star, ArrowUpRight, Compass, Layers, Code, Palette, Quote, ArrowLeft, Download, ExternalLink, Filter, Search, Loader2, Eye, Upload, Video, Film, RefreshCw, Play, Music } from 'lucide-react';
import { AnimeStarryBackgroundCanvas } from './components/AnimeStarryBackgroundCanvas';

interface ProductTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  tags: string[];
  features: string[];
  price: string;
  rating: number;
}

const VIDEO_PRESETS = [
  {
    id: 'anime-sky',
    name: 'Anime Grass Field & Starry Sky',
    url: 'https://cdn.pixabay.com/video/2021/04/12/70860-536481774_large.mp4',
    description: 'Anime style starry night sky over peaceful green hills'
  },
  {
    id: 'clouds-default',
    name: 'Cinematic Clouds & Sky',
    url: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwlXH07IWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4',
    description: 'Atmospheric white clouds over deep blue sky'
  },
  {
    id: 'night-stars',
    name: 'Cosmic Galaxy & Starlight',
    url: 'https://cdn.pixabay.com/video/2019/04/23/23011-332490196_large.mp4',
    description: 'Luminous galaxy night sky with drifting stars'
  },
  {
    id: 'glowing-abstract',
    name: 'Liquid Glass Particles',
    url: 'https://cdn.pixabay.com/video/2020/05/25/40134-424888257_large.mp4',
    description: 'Minimalist ambient floating light motion'
  }
];

const SAMPLE_PRODUCTS: ProductTemplate[] = [
  {
    id: 'prod-1',
    title: 'Aura Glassmorphic OS',
    category: 'Web Apps',
    description: 'A desktop-grade web application template featuring translucent liquid glass widgets, dark theme controls, and customizable dock architecture.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    tags: ['React', 'Tailwind', 'Liquid Glass', 'Dashboard'],
    features: ['Dark Mode Native', 'Responsive Grid Engine', 'Customizable Widgets', 'Sound FX Included'],
    price: '$89',
    rating: 4.9,
  },
  {
    id: 'prod-2',
    title: 'Serene Quiet Notes',
    category: 'Productivity',
    description: 'Minimalist distraction-free note-taking workspace with markdown preview, ambient sound generator, and offline sync.',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    tags: ['Markdown', 'Zen Design', 'Local State', 'Audio Synth'],
    features: ['Offline First', 'Focus Mode', 'Export to PDF/MD', 'Custom Typography'],
    price: '$49',
    rating: 4.8,
  },
  {
    id: 'prod-3',
    title: 'Chronos Portfolio Ultra',
    category: 'Portfolios',
    description: 'High-impact portfolio canvas with smooth motion transitions, interactive project case studies, and WebGL particle backgrounds.',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    tags: ['Motion', 'Portfolio', 'Case Studies', 'WebGL'],
    features: ['Smooth Scroll', '3D Project Cards', 'CMS Ready', 'SEO Optimized'],
    price: '$69',
    rating: 5.0,
  },
  {
    id: 'prod-4',
    title: 'Vortex SaaS Analytics',
    category: 'Dashboards',
    description: 'Real-time telemetry and revenue analytics dashboard with customizable charts, user activity maps, and automated exports.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    tags: ['Analytics', 'Recharts', 'SaaS', 'Real-time'],
    features: ['Live Metrics', 'CSV Export', 'User Role Management', 'Responsive Sidebar'],
    price: '$119',
    rating: 4.9,
  },
  {
    id: 'prod-5',
    title: 'Lumina Luxury Commerce',
    category: 'E-Commerce',
    description: 'High-fashion and luxury brand storefront with 3D product viewports, smooth cart drawer, and instant checkout flows.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    tags: ['Storefront', 'Cart Drawer', 'Stripe Ready', '3D Viewer'],
    features: ['Instant Search', 'Multi-Currency', 'Wishlist Persistence', 'Micro-Animations'],
    price: '$129',
    rating: 4.7,
  },
  {
    id: 'prod-6',
    title: 'Kaze Creative Agency Kit',
    category: 'Portfolios',
    description: 'Bold agency presentation platform featuring horizontal scroll sections, magnetic cursors, and video showcase grids.',
    image: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=800&q=80',
    tags: ['Agency', 'Video Showcase', 'Creative', 'Magnetic UI'],
    features: ['Horizontal Layout', 'Video Backdrops', 'Contact Form Modal', 'Lightweight Bundle'],
    price: '$99',
    rating: 4.9,
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('Home');
  const [viewMode, setViewMode] = useState<'home' | 'journey'>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  
  // Background video & audio state
  const [videoSrc, setVideoSrc] = useState<string>(
    'https://cdn.pixabay.com/video/2021/04/12/70860-536481774_large.mp4'
  );
  const [customVideoName, setCustomVideoName] = useState<string | null>('Anime Grass Field & Starry Sky');
  const [showVideoModal, setShowVideoModal] = useState<boolean>(false);
  const [customUrlInput, setCustomUrlInput] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Background audio state linked to the sound button
  const [audioSrc, setAudioSrc] = useState<string>(
    'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3'
  );
  const audioRef = useRef<HTMLAudioElement>(null);

  // Product showcase page state
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<ProductTemplate | null>(null);

  // Feedback form state
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  const navItems = [
    { name: 'Home', id: 'home' },
    { name: 'About Us', id: 'about' },
    { name: 'Service', id: 'service' },
    { name: 'Price List', id: 'price-list' },
    { name: 'Feedback', id: 'feedback' },
  ];

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      setIsVideoLoaded(false);
      setIsBuffering(true);
      video.load();
      video.play().catch(() => {});
    }
  }, [viewMode, videoSrc]);

  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setVideoSrc(objectUrl);
      setCustomVideoName(file.name);
      setIsVideoLoaded(false);
      setIsBuffering(true);
      setShowVideoModal(false);
    }
  };

  const handleApplyCustomUrl = (e: FormEvent) => {
    e.preventDefault();
    if (customUrlInput.trim()) {
      setVideoSrc(customUrlInput.trim());
      setCustomVideoName('Custom Video URL');
      setIsVideoLoaded(false);
      setIsBuffering(true);
      setShowVideoModal(false);
    }
  };

  const toggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
    }

    if (audioRef.current) {
      audioRef.current.muted = nextMuted;
      if (!nextMuted) {
        audioRef.current.play().catch((err) => {
          console.log('Audio playback initialized:', err);
        });
      } else {
        audioRef.current.pause();
      }
    }
  };

  const handleNavClick = (item: { name: string; id: string }) => {
    if (viewMode !== 'home') {
      setViewMode('home');
      setTimeout(() => {
        const element = document.getElementById(item.id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      setActiveTab(item.name);
      setIsMobileMenuOpen(false);
      const element = document.getElementById(item.id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleBeginJourney = () => {
    setViewMode('journey');
    setIsLoadingTemplates(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Simulate high-fidelity asset loading for templates
    setTimeout(() => {
      setIsLoadingTemplates(false);
    }, 1200);
  };

  const handleFeedbackSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (feedbackName.trim() && feedbackMsg.trim()) {
      setFeedbackSubmitted(true);
      setTimeout(() => {
        setFeedbackName('');
        setFeedbackMsg('');
        setFeedbackSubmitted(false);
      }, 4000);
    }
  };

  const categories = ['All', 'Web Apps', 'Productivity', 'Dashboards', 'Portfolios', 'E-Commerce'];

  const filteredProducts = SAMPLE_PRODUCTS.filter(prod => {
    const matchesCategory = selectedCategory === 'All' || prod.category === selectedCategory;
    const matchesSearch = prod.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          prod.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="relative min-h-screen w-full bg-[#001e2e] text-white selection:bg-white/20 font-sans">
      
      {/* PERSISTENT FULLSCREEN BACKGROUND (STAYS ACTIVE ACROSS ALL PAGES AND VIEWS) */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Base Gradient Fallback */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#001e2e] via-[#002b42] to-[#001a28] z-0" />
        <AnimeStarryBackgroundCanvas />

        {/* Video Skeleton / Buffering Overlay */}
        <div
          className={`absolute inset-0 z-[1] bg-[#002b42]/60 backdrop-blur-[2px] transition-opacity duration-700 flex items-end justify-end p-6 pointer-events-none ${
            !isVideoLoaded || isBuffering ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-full liquid-glass text-xs text-muted-foreground/80 animate-pulse">
            <div className="w-2 h-2 rounded-full bg-white/70 animate-ping" />
            <span>{!isVideoLoaded ? 'Loading background video...' : 'Buffering video stream...'}</span>
          </div>
        </div>


        {/* Fullscreen Video Background */}
        <video
          ref={videoRef}
          key={videoSrc}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          preload="auto"
          onLoadedMetadata={() => setIsVideoLoaded(true)}
          onLoadedData={() => setIsBuffering(false)}
          onCanPlay={() => setIsBuffering(false)}
          onPlaying={() => setIsBuffering(false)}
          className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-500 contrast-[1.08] brightness-[1.10] saturate-[1.10] ${
            isVideoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          src={videoSrc}
        />

        {/* Background Audio Stream (Synced with Sound Controls) */}
        <audio
          ref={audioRef}
          src={audioSrc}
          loop
          preload="auto"
        />
      </div>

      {/* Sticky Top Header Navigation */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#002842]/80 border-b border-white/10 transition-all">
        <div className="flex row justify-between items-center px-8 py-5 max-w-7xl w-full mx-auto">
          {/* Logo */}
          <button 
            onClick={() => {
              setViewMode('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-3xl tracking-tight text-foreground flex items-baseline gap-0.5 cursor-pointer bg-transparent border-0 p-0 text-left"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Nhts.Au<sup className="text-xs leading-none">®</sup>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = viewMode === 'home' && activeTab === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item)}
                  className={`text-sm transition-colors cursor-pointer ${
                    isActive ? 'text-foreground font-medium border-b border-white/60 pb-0.5' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {item.name}
                </button>
              );
            })}
          </nav>

          {/* Desktop CTA & Sound Controls */}
          <div className="hidden md:flex items-center gap-3">
            {viewMode === 'home' ? (
              <>
                {/* Audio Sound Button & Track Selection Menu */}
                <button
                  onClick={toggleSound}
                  aria-label="Toggle background audio"
                  className={`liquid-glass rounded-full px-3 py-2.5 transition-all cursor-pointer flex items-center gap-2 ${
                    !isMuted
                      ? 'text-emerald-400 border border-emerald-500/40 shadow-[0_0_15px_rgba(52,211,153,0.25)] bg-emerald-500/10'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  title={isMuted ? "Bật âm thanh nền" : "Tắt âm thanh nền"}
                >
                  {!isMuted ? (
                    <>
                      <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />
                      <span className="flex items-end gap-0.5 h-3 px-0.5">
                        <span className="w-0.5 h-full bg-emerald-400 animate-[bounce_1s_infinite_100ms]" />
                        <span className="w-0.5 h-2/3 bg-emerald-300 animate-[bounce_1s_infinite_300ms]" />
                        <span className="w-0.5 h-4/5 bg-emerald-400 animate-[bounce_1s_infinite_200ms]" />
                      </span>
                    </>
                  ) : (
                    <VolumeX className="w-4 h-4" />
                  )}
                </button>

                <button
                  onClick={handleBeginJourney}
                  className="liquid-glass rounded-full px-6 py-2.5 text-sm text-foreground hover:scale-[1.03] transition-transform cursor-pointer font-normal flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                  <span>Begin Journey</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setViewMode('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="liquid-glass rounded-full px-6 py-2.5 text-sm text-foreground hover:scale-[1.03] transition-transform cursor-pointer font-normal flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Controls */}
          <div className="flex items-center gap-2 md:hidden">
            {viewMode === 'home' && (
              <button
                onClick={toggleSound}
                aria-label="Toggle background audio"
                className={`liquid-glass rounded-full p-2 transition-all cursor-pointer ${
                  !isMuted ? 'text-emerald-400 bg-emerald-500/10' : 'text-muted-foreground'
                }`}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              </button>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="liquid-glass rounded-full p-2 text-foreground focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden px-8 py-6 mx-6 mb-4 liquid-glass rounded-2xl animate-fade-rise border border-white/10">
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item)}
                  className={`text-left text-base transition-colors ${
                    activeTab === item.name ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {item.name}
                </button>
              ))}
              <div className="pt-2 border-t border-white/10 mt-2 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (viewMode === 'journey') {
                      setViewMode('home');
                    } else {
                      handleBeginJourney();
                    }
                  }}
                  className="liquid-glass rounded-full w-full py-3 text-sm text-foreground text-center flex items-center justify-center gap-2"
                >
                  {viewMode === 'journey' ? (
                    <>
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back to Home</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Begin Journey</span>
                    </>
                  )}
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* VIEW 1: MAIN HOMEPAGE */}
      {viewMode === 'home' && (
        <>
          {/* SECTION 1: HERO VIEWPORT (#home) */}
          <section id="home" className="relative z-10 min-h-[calc(100vh-81px)] w-full flex flex-col justify-between overflow-hidden">
            {/* Hero Content */}
            <main className="relative z-10 flex flex-col items-center text-center px-6 pt-28 pb-32 my-auto">
              <h1
                className="text-5xl sm:text-7xl md:text-8xl leading-[0.95] tracking-[-2.46px] max-w-7xl font-normal text-foreground animate-fade-rise"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                Where <em className="not-italic text-muted-foreground">ideas</em> become{' '}
                <em className="not-italic text-muted-foreground">timeless design.</em>
              </h1>

              <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mt-8 leading-relaxed animate-fade-rise-delay">
                We're designing tools for deep thinkers, bold creators, and quiet rebels. Amid the chaos, we build digital spaces for sharp focus and inspired work.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 mt-12 animate-fade-rise-delay-2">
                <button
                  onClick={() => handleNavClick(navItems[1])}
                  className="liquid-glass rounded-full px-12 py-4 text-base text-foreground hover:scale-[1.03] cursor-pointer transition-transform duration-300"
                >
                  Explore Below
                </button>
                <button
                  onClick={handleBeginJourney}
                  className="px-6 py-4 text-sm text-foreground hover:text-white transition-colors cursor-pointer flex items-center gap-2 group"
                >
                  <span>Begin Journey</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </main>

            <div className="relative z-10 px-8 py-6 max-w-7xl w-full mx-auto flex justify-between items-center text-xs text-muted-foreground/60">
              <span>Scroll to explore sections</span>
              <span className="tracking-widest uppercase">Cinematic Experience</span>
            </div>
          </section>

          {/* SECTIONS BENEATH HOME BACKGROUND */}
          <div className="relative z-20 bg-gradient-to-b from-[#002842]/60 via-[#001f35]/75 to-[#001729]/80 backdrop-blur-[2px] border-t border-white/10">

            {/* SECTION 2: ABOUT US (#about) */}
            <section id="about" className="py-28 px-8 max-w-7xl mx-auto scroll-mt-20">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-xs uppercase tracking-widest text-muted-foreground/80 mb-3 block">Who We Are</span>
                <h2 
                  className="text-4xl sm:text-6xl text-foreground font-normal mb-6"
                  style={{ fontFamily: "'Instrument Serif', serif" }}
                >
                  Crafting Digital Quietude
                </h2>
                <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                  At Nhts.Au, we believe digital experiences should provoke clarity rather than fatigue. We blend architectural restraint with fluid interactive elegance.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="liquid-glass p-8 rounded-3xl border border-white/10 hover:border-white/20 transition-all">
                  <div className="w-12 h-12 rounded-2xl liquid-glass flex items-center justify-center mb-6 text-foreground">
                    <Compass className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-medium mb-3 text-foreground" style={{ fontFamily: "'Instrument Serif', serif" }}>
                    Unwavering Focus
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Stripping away algorithmic noise to give users a sanctuary for focused creation, deep thought, and uninterrupted flow.
                  </p>
                </div>

                <div className="liquid-glass p-8 rounded-3xl border border-white/10 hover:border-white/20 transition-all">
                  <div className="w-12 h-12 rounded-2xl liquid-glass flex items-center justify-center mb-6 text-foreground">
                    <Layers className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-medium mb-3 text-foreground" style={{ fontFamily: "'Instrument Serif', serif" }}>
                    Liquid Design
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Interfaces that breathe and respond with subtle glassmorphic depth, smooth tactile interactions, and cinematic rhythm.
                  </p>
                </div>

                <div className="liquid-glass p-8 rounded-3xl border border-white/10 hover:border-white/20 transition-all">
                  <div className="w-12 h-12 rounded-2xl liquid-glass flex items-center justify-center mb-6 text-foreground">
                    <Code className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-medium mb-3 text-foreground" style={{ fontFamily: "'Instrument Serif', serif" }}>
                    Crafted Engineering
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Built on high-performance web standards, lightweight codebases, and seamless sub-second interactive rendering.
                  </p>
                </div>
              </div>
            </section>

            {/* SECTION 3: SERVICE (#service) */}
            <section id="service" className="py-28 px-8 max-w-7xl mx-auto border-t border-white/10 scroll-mt-20">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                <div>
                  <span className="text-xs uppercase tracking-widest text-muted-foreground/80 mb-3 block">What We Deliver</span>
                  <h2 
                    className="text-4xl sm:text-6xl text-foreground font-normal"
                    style={{ fontFamily: "'Instrument Serif', serif" }}
                  >
                    Our Capabilities
                  </h2>
                </div>
                <p className="text-muted-foreground text-sm max-w-md">
                  Custom digital architecture tailored for brands and creators aiming to build memorable, high-impact products.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  {
                    icon: <Palette className="w-6 h-6" />,
                    title: 'Visual Identity & Branding',
                    desc: 'Bespoke typographic hierarchies, color palettes, and motion guidelines that embody prestige and longevity.',
                    tags: ['Design System', 'Typography', 'Brand Strategy']
                  },
                  {
                    icon: <Code className="w-6 h-6" />,
                    title: 'Full-Stack Web Architecture',
                    desc: 'Next-generation web applications built with React, Vite, and Cloud infrastructure for instant, responsive feel.',
                    tags: ['React', 'TypeScript', 'Tailwind', 'Cloud Run']
                  },
                  {
                    icon: <Layers className="w-6 h-6" />,
                    title: 'Cinematic Micro-Interactions',
                    desc: 'Glassmorphic HUD interfaces, WebGL shader background visuals, and physical spring animations.',
                    tags: ['Motion', 'Shaders', 'UI/UX']
                  },
                  {
                    icon: <Compass className="w-6 h-6" />,
                    title: 'Product Strategy & Audit',
                    desc: 'Refining complex product flows, removing friction points, and elevating visual presentation for high conversion.',
                    tags: ['UX Strategy', 'Usability Audits', 'Conversion']
                  },
                ].map((srv, idx) => (
                  <div key={idx} className="liquid-glass p-8 rounded-3xl border border-white/10 hover:border-white/25 transition-all group">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-2xl liquid-glass flex items-center justify-center text-foreground group-hover:scale-110 transition-transform">
                        {srv.icon}
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-2xl font-normal mb-3 text-foreground" style={{ fontFamily: "'Instrument Serif', serif" }}>
                      {srv.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                      {srv.desc}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {srv.tags.map(t => (
                        <span key={t} className="text-xs px-3 py-1 rounded-full liquid-glass text-muted-foreground">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION 4: PRICE LIST (#price-list) */}
            <section id="price-list" className="py-28 px-8 max-w-7xl mx-auto border-t border-white/10 scroll-mt-20">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-xs uppercase tracking-widest text-muted-foreground/80 mb-3 block">Investment</span>
                <h2 
                  className="text-4xl sm:text-6xl text-foreground font-normal mb-6"
                  style={{ fontFamily: "'Instrument Serif', serif" }}
                >
                  Price List & Tiers
                </h2>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Transparent investments engineered for projects at every scale.
                </p>

                {/* Monthly / Annual Toggle */}
                <div className="flex items-center justify-center gap-3 mt-8">
                  <span className={`text-xs ${billingCycle === 'monthly' ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>Monthly</span>
                  <button
                    onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                    className="liquid-glass w-12 h-6 rounded-full p-1 flex items-center cursor-pointer transition-all"
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                  <span className={`text-xs ${billingCycle === 'annual' ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                    Annual <span className="text-emerald-400 text-[10px] ml-1">(Save 20%)</span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Tier 1 */}
                <div className="liquid-glass p-8 rounded-3xl border border-white/10 flex flex-col justify-between hover:border-white/20 transition-all">
                  <div>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Essential</span>
                    <h3 className="text-3xl text-foreground mt-2 mb-4 font-normal" style={{ fontFamily: "'Instrument Serif', serif" }}>
                      Design Sprint
                    </h3>
                    <div className="text-4xl font-normal text-foreground mb-6" style={{ fontFamily: "'Instrument Serif', serif" }}>
                      {billingCycle === 'annual' ? '$1,490' : '$1,890'}
                      <span className="text-xs text-muted-foreground font-sans ml-1">/ project</span>
                    </div>
                    <ul className="space-y-3 mb-8 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Full Hero & Landing Page</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Glassmorphic Theme System</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Fully Responsive React App</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> 5-Day Fast Turnaround</li>
                    </ul>
                  </div>
                  <button onClick={handleBeginJourney} className="liquid-glass w-full py-3 rounded-full text-sm text-foreground hover:scale-[1.02] transition-transform cursor-pointer">
                    Select Essential
                  </button>
                </div>

                {/* Tier 2 - Highlighted */}
                <div className="liquid-glass p-8 rounded-3xl border border-white/30 relative flex flex-col justify-between shadow-2xl scale-[1.02]">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] uppercase tracking-widest text-white border border-white/30">
                    Most Popular
                  </div>
                  <div>
                    <span className="text-xs font-medium text-white/80 uppercase tracking-widest">Studio Pro</span>
                    <h3 className="text-3xl text-foreground mt-2 mb-4 font-normal" style={{ fontFamily: "'Instrument Serif', serif" }}>
                      Full Digital Product
                    </h3>
                    <div className="text-4xl font-normal text-foreground mb-6" style={{ fontFamily: "'Instrument Serif', serif" }}>
                      {billingCycle === 'annual' ? '$3,290' : '$3,990'}
                      <span className="text-xs text-muted-foreground font-sans ml-1">/ project</span>
                    </div>
                    <ul className="space-y-3 mb-8 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Complete Web Application</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Cinematic Background Visuals</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Custom Interactive Motion Effects</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> API & Backend Integration</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Priority Support & Maintenance</li>
                    </ul>
                  </div>
                  <button onClick={handleBeginJourney} className="liquid-glass w-full py-3.5 rounded-full text-sm font-medium text-foreground hover:scale-[1.02] transition-transform cursor-pointer border border-white/30">
                    Select Studio Pro
                  </button>
                </div>

                {/* Tier 3 */}
                <div className="liquid-glass p-8 rounded-3xl border border-white/10 flex flex-col justify-between hover:border-white/20 transition-all">
                  <div>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Enterprise</span>
                    <h3 className="text-3xl text-foreground mt-2 mb-4 font-normal" style={{ fontFamily: "'Instrument Serif', serif" }}>
                      Bespoke Ecosystem
                    </h3>
                    <div className="text-4xl font-normal text-foreground mb-6" style={{ fontFamily: "'Instrument Serif', serif" }}>
                      Custom
                      <span className="text-xs text-muted-foreground font-sans ml-1">/ quote</span>
                    </div>
                    <ul className="space-y-3 mb-8 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Multi-Platform Design System</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Dedicated Creative Engineering Team</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> 24/7 SLA & Custom Security</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Continuous Iteration & Evolution</li>
                    </ul>
                  </div>
                  <button onClick={handleBeginJourney} className="liquid-glass w-full py-3 rounded-full text-sm text-foreground hover:scale-[1.02] transition-transform cursor-pointer">
                    Contact Sales
                  </button>
                </div>
              </div>
            </section>

            {/* SECTION 5: FEEDBACK (#feedback) */}
            <section id="feedback" className="py-28 px-8 max-w-7xl mx-auto border-t border-white/10 scroll-mt-20">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-xs uppercase tracking-widest text-muted-foreground/80 mb-3 block">Testimonials</span>
                <h2 
                  className="text-4xl sm:text-6xl text-foreground font-normal mb-6"
                  style={{ fontFamily: "'Instrument Serif', serif" }}
                >
                  Voices of Creators
                </h2>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Hear what visionary founders and designers say about working with Nhts.Au.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                {[
                  {
                    quote: "Nhts.Au elevated our digital presence into a piece of art. Our users constantly comment on the serene, focused visual atmosphere.",
                    author: "Evelyn Thorne",
                    role: "Founder, Zenith Labs"
                  },
                  {
                    quote: "The liquid glass aesthetic combined with ultra-fast loading times created an unforgettable first impression for our launch.",
                    author: "Marcus Vance",
                    role: "Design Director, Horizon"
                  },
                  {
                    quote: "Meticulous attention to detail, flawless typography, and a team that genuinely cares about craft and deep quiet design.",
                    author: "Sora Takahashi",
                    role: "Lead Architect, Studio Kaze"
                  },
                ].map((t, i) => (
                  <div key={i} className="liquid-glass p-8 rounded-3xl border border-white/10 flex flex-col justify-between">
                    <div>
                      <Quote className="w-8 h-8 text-white/20 mb-4" />
                      <p className="text-sm text-muted-foreground leading-relaxed italic mb-6">
                        "{t.quote}"
                      </p>
                    </div>
                    <div>
                      <div className="flex gap-1 mb-2">
                        {[...Array(5)].map((_, s) => (
                          <Star key={s} className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                        ))}
                      </div>
                      <div className="text-sm font-medium text-foreground">{t.author}</div>
                      <div className="text-xs text-muted-foreground">{t.role}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Interactive Feedback Form */}
              <div className="max-w-2xl mx-auto liquid-glass p-8 rounded-3xl border border-white/10">
                <h3 className="text-2xl text-foreground font-normal mb-2" style={{ fontFamily: "'Instrument Serif', serif" }}>
                  Leave Your Feedback
                </h3>
                <p className="text-xs text-muted-foreground mb-6">
                  Share your thoughts or questions directly with our design team.
                </p>

                {feedbackSubmitted ? (
                  <div className="p-6 rounded-2xl liquid-glass text-center border border-emerald-500/30 text-emerald-300 animate-fade-rise">
                    <Sparkles className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
                    <div className="text-base font-medium mb-1">Thank you for your feedback!</div>
                    <div className="text-xs text-muted-foreground">We value your message and will get back to you shortly.</div>
                  </div>
                ) : (
                  <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Your Name</label>
                        <input
                          type="text"
                          required
                          value={feedbackName}
                          onChange={(e) => setFeedbackName(e.target.value)}
                          placeholder="e.g. Alex Morgan"
                          className="w-full px-4 py-2.5 rounded-xl liquid-glass border border-white/10 text-sm text-foreground focus:outline-none focus:border-white/30"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Rating</label>
                        <div className="flex items-center gap-1 py-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setFeedbackRating(star)}
                              className="cursor-pointer p-1"
                            >
                              <Star className={`w-5 h-5 ${star <= feedbackRating ? 'fill-amber-300 text-amber-300' : 'text-white/20'}`} />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Your Message</label>
                      <textarea
                        required
                        rows={3}
                        value={feedbackMsg}
                        onChange={(e) => setFeedbackMsg(e.target.value)}
                        placeholder="Share your thoughts with us..."
                        className="w-full px-4 py-2.5 rounded-xl liquid-glass border border-white/10 text-sm text-foreground focus:outline-none focus:border-white/30 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="liquid-glass w-full py-3 rounded-full text-sm text-foreground hover:scale-[1.01] transition-transform cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Send Feedback</span>
                    </button>
                  </form>
                )}
              </div>
            </section>

            {/* Global Footer */}
            <footer className="border-t border-white/10 py-12 px-8 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="text-base text-foreground font-normal" style={{ fontFamily: "'Instrument Serif', serif" }}>
                  Nhts.Au®
                </span>
                <span>— Designed for quiet minds and bold creators.</span>
              </div>

              <div className="flex items-center gap-6">
                {navItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item)}
                    className="hover:text-foreground transition-colors cursor-pointer"
                  >
                    {item.name}
                  </button>
                ))}
              </div>

              <div>© {new Date().getFullYear()} Nhts.Au Inc. All rights reserved.</div>
            </footer>
          </div>
        </>
      )}

      {/* VIEW 2: DEDICATED JOURNEY PAGE (PRODUCT SHOWCASE / TEMPLATE CATALOG) */}
      {viewMode === 'journey' && (
        <main className="relative z-10 min-h-[calc(100vh-81px)] bg-gradient-to-b from-[#002842]/65 via-[#001c2f]/75 to-[#001524]/80 backdrop-blur-sm px-6 py-12">
          <div className="max-w-7xl mx-auto">
            
            {/* Top Bar with Back Button & Breadcrumbs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-white/10">
              <div>
                <button
                  onClick={() => {
                    setViewMode('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-white transition-colors cursor-pointer mb-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Home</span>
                </button>
                <h1 
                  className="text-3xl sm:text-5xl text-foreground font-normal"
                  style={{ fontFamily: "'Instrument Serif', serif" }}
                >
                  Product Templates & Exclusive Designs
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Loading premium interface collections & sample product showcases
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-4 py-2 rounded-full liquid-glass border border-white/10 text-xs text-emerald-400 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Status: Loading Live Assets</span>
                </div>
              </div>
            </div>

            {/* Loading Indicator Header Banner */}
            {isLoadingTemplates ? (
              <div className="p-12 rounded-3xl liquid-glass border border-white/10 text-center my-12 animate-fade-rise">
                <Loader2 className="w-10 h-10 animate-spin text-white/80 mx-auto mb-4" />
                <h3 className="text-2xl font-normal text-foreground mb-2" style={{ fontFamily: "'Instrument Serif', serif" }}>
                  Initializing Product Template Catalog...
                </h3>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Synchronizing interface data, liquid glass system, and visual assets. Please wait a moment.
                </p>
                <div className="w-48 h-1.5 bg-white/10 rounded-full mx-auto mt-6 overflow-hidden">
                  <div className="h-full bg-white/70 animate-pulse rounded-full w-2/3" />
                </div>
              </div>
            ) : (
              <>
                {/* Search & Filter Controls */}
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-10">
                  {/* Category Pills */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                    <Filter className="w-4 h-4 text-muted-foreground mr-1 flex-shrink-0" />
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`text-xs px-4 py-2 rounded-full transition-all flex-shrink-0 cursor-pointer ${
                          selectedCategory === cat
                            ? 'bg-white text-[#002842] font-medium shadow-md'
                            : 'liquid-glass text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Search Bar */}
                  <div className="relative min-w-[260px]">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search product templates..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-full liquid-glass border border-white/10 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-white/30"
                    />
                  </div>
                </div>

                {/* Products Showcase Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProducts.map((prod) => (
                    <div
                      key={prod.id}
                      className="liquid-glass rounded-3xl overflow-hidden border border-white/10 hover:border-white/25 transition-all group flex flex-col justify-between"
                    >
                      <div>
                        {/* Preview Image with Overlay */}
                        <div className="relative h-48 w-full overflow-hidden bg-black/40">
                          <img
                            src={prod.image}
                            alt={prod.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                          />
                          <div className="absolute top-3 left-3 px-3 py-1 rounded-full liquid-glass text-[10px] text-white/90 border border-white/20">
                            {prod.category}
                          </div>
                          <div className="absolute top-3 right-3 px-3 py-1 rounded-full liquid-glass text-[10px] text-amber-300 font-medium border border-white/20 flex items-center gap-1">
                            <Star className="w-3 h-3 fill-amber-300" />
                            <span>{prod.rating}</span>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="p-6">
                          <h3
                            className="text-2xl text-foreground font-normal mb-2 group-hover:text-amber-200 transition-colors"
                            style={{ fontFamily: "'Instrument Serif', serif" }}
                          >
                            {prod.title}
                          </h3>
                          <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                            {prod.description}
                          </p>

                          {/* Feature Highlights */}
                          <div className="space-y-1.5 mb-6">
                            {prod.features.slice(0, 3).map((feat, fidx) => (
                              <div key={fidx} className="flex items-center gap-2 text-[11px] text-muted-foreground/90">
                                <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                                <span>{feat}</span>
                              </div>
                            ))}
                          </div>

                          {/* Tech Tags */}
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            {prod.tags.map((t) => (
                              <span key={t} className="text-[10px] px-2.5 py-0.5 rounded-full liquid-glass text-muted-foreground/80">
                                #{t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="p-6 pt-0 flex items-center justify-between gap-3 border-t border-white/5 mt-4">
                        <div className="text-lg font-normal text-foreground" style={{ fontFamily: "'Instrument Serif', serif" }}>
                          {prod.price}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedProduct(prod)}
                            className="liquid-glass px-4 py-2 rounded-full text-xs text-foreground hover:scale-105 transition-transform cursor-pointer flex items-center gap-1.5"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Preview</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredProducts.length === 0 && (
                  <div className="text-center py-20 liquid-glass rounded-3xl border border-white/10">
                    <p className="text-muted-foreground text-sm">No product templates matched your search keywords.</p>
                    <button
                      onClick={() => {
                        setSelectedCategory('All');
                        setSearchQuery('');
                      }}
                      className="mt-4 px-6 py-2 rounded-full liquid-glass text-xs text-foreground cursor-pointer"
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </>
            )}

          </div>
        </main>
      )}

      {/* Product Template Preview Dialog Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-rise">
          <div className="liquid-glass max-w-2xl w-full rounded-3xl overflow-hidden relative border border-white/20">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full liquid-glass text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative h-64 w-full">
              <img src={selectedProduct.image} alt={selectedProduct.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#002842] via-transparent to-transparent" />
            </div>

            <div className="p-8">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs px-3 py-1 rounded-full liquid-glass text-amber-300">
                  {selectedProduct.category}
                </span>
                <span className="text-xs text-muted-foreground">Rating: {selectedProduct.rating} / 5.0 ★</span>
              </div>

              <h2 className="text-3xl font-normal text-foreground mb-3" style={{ fontFamily: "'Instrument Serif', serif" }}>
                {selectedProduct.title}
              </h2>

              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                {selectedProduct.description}
              </p>

              <div className="mb-6">
                <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Key Features:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedProduct.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-foreground">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="text-2xl font-normal text-foreground" style={{ fontFamily: "'Instrument Serif', serif" }}>
                  {selectedProduct.price}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      alert(`Downloading sample preview: ${selectedProduct.title}`);
                    }}
                    className="liquid-glass px-6 py-2.5 rounded-full text-xs text-foreground hover:scale-105 transition-transform cursor-pointer flex items-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Demo</span>
                  </button>
                  <button
                    onClick={() => {
                      alert(`Registered experience for template ${selectedProduct.title}. Our design team will contact you shortly!`);
                      setSelectedProduct(null);
                    }}
                    className="bg-white text-[#002842] font-medium px-6 py-2.5 rounded-full text-xs hover:bg-white/90 transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Use Template</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Background Video Settings Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-rise">
          <div className="liquid-glass border border-white/20 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-foreground relative shadow-2xl overflow-hidden">
            <button
              onClick={() => setShowVideoModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10 transition-colors text-muted-foreground hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl liquid-glass flex items-center justify-center text-amber-300 border border-white/10">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-2xl font-normal" style={{ fontFamily: "'Instrument Serif', serif" }}>
                  Background Video Settings
                </h3>
                <p className="text-xs text-muted-foreground">
                  Upload custom video files or select from curated presets
                </p>
              </div>
            </div>

            {/* Currently Active Badge */}
            <div className="mb-6 p-3.5 rounded-2xl liquid-glass border border-white/10 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Current Background:</span>
              <span className="text-emerald-400 font-medium truncate max-w-[220px]">
                {customVideoName || 'Default Video'}
              </span>
            </div>

            {/* Upload Local File */}
            <div className="mb-5">
              <label className="block text-[11px] uppercase tracking-widest text-muted-foreground mb-2 font-medium">
                1. Upload Local Video File (MP4/WebM)
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/webm,video/ogg,video/quicktime,video/*"
                onChange={handleVideoFileUpload}
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-white/20 hover:border-white/40 rounded-2xl p-5 text-center cursor-pointer transition-all liquid-glass group"
              >
                <Upload className="w-7 h-7 mx-auto mb-2 text-amber-300 group-hover:scale-110 transition-transform" />
                <p className="text-xs sm:text-sm font-medium text-foreground">Click to upload your video file</p>
                <p className="text-[11px] text-muted-foreground/80 mt-1">
                  Supports MP4, WebM, MOV video files from your device
                </p>
              </div>
            </div>

            {/* Custom URL Input */}
            <div className="mb-5">
              <label className="block text-[11px] uppercase tracking-widest text-muted-foreground mb-2 font-medium">
                2. Enter Direct Video Link
              </label>
              <form onSubmit={handleApplyCustomUrl} className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://example.com/background.mp4"
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-xl liquid-glass border border-white/10 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-white/30"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-white text-[#002842] text-xs font-medium hover:bg-white/90 transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </form>
            </div>

            {/* Presets */}
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-muted-foreground mb-2.5 font-medium">
                3. Curated Presets
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {VIDEO_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setVideoSrc(preset.url);
                      setCustomVideoName(preset.name);
                      setIsVideoLoaded(false);
                      setIsBuffering(true);
                      setShowVideoModal(false);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      videoSrc === preset.url
                        ? 'liquid-glass border-amber-300/60 text-foreground bg-white/10'
                        : 'liquid-glass border-white/10 text-muted-foreground hover:text-foreground hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-foreground truncate">{preset.name}</span>
                      {videoSrc === preset.url && (
                        <span className="w-2 h-2 rounded-full bg-amber-300" />
                      )}
                    </div>
                    <span className="text-[10px] text-muted-foreground/80 line-clamp-1">{preset.description}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



