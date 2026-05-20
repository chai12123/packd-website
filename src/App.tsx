/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  Truck, 
  Package, 
  Zap, 
  Snowflake, 
  BadgeCheck, 
  ShieldCheck, 
  TrendingUp, 
  MapPin, 
  Clock, 
  ArrowRight, 
  ChevronDown, 
  Menu, 
  X, 
  FileText, 
  LayoutDashboard, 
  Database, 
  Phone, 
  MessageCircle, 
  CheckCircle,
  Building,
  Utensils,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  Calculator,
  User,
  Quote
} from "lucide-react";

// --- STATS DATA WITH SIMULATED COUNTER ---
const statsData = [
  { id: "stat-1", limit: 300, prefix: "", suffix: "+", label: "เที่ยวขนส่งต่อเดือน", icon: Truck },
  { id: "stat-2", limit: 30, prefix: "", suffix: "+", label: "จังหวัดที่ครอบคลุม", icon: MapPin },
  { id: "stat-3", limit: 99.2, prefix: "", suffix: "%", label: "อัตราส่งตรงเวลา", icon: Clock, decimal: true },
  { id: "stat-4", limit: 500, prefix: "", suffix: "K", label: "ประกันสินค้า/เที่ยว (บาท)", icon: ShieldCheck }
];

// --- FLOATING TRUCK DATA CARDS (Hero right) ---
const floatingCards = [
  { id: "float-1", label: "GPS Status", value: "Active • 24/7", color: "text-[#10B981]", bg: "bg-emerald-50" },
  { id: "float-2", label: "Temperature", value: "4°C (Stable)", color: "text-[#FF6B35]", bg: "bg-orange-50" },
  { id: "float-3", label: "ETA Delivery", value: "14:30 (On-Time)", color: "text-[#0A1F33]", bg: "bg-slate-50" },
  { id: "float-4", label: "Est. Cost", value: "฿2,340/km", color: "text-indigo-600", bg: "bg-indigo-50" }
];

export default function App() {
  // Mobile Nav Menu State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Stats Counters
  const [counts, setCounts] = useState([0, 0, 0, 0]);
  const statsSectionRef = useRef<HTMLDivElement>(null);

  // Active Accordion Q&A State
  const [activeFAQIndex, setActiveFAQIndex] = useState<number | null>(0);

  // Quick Quote Estimator State
  const [quoteDistance, setQuoteDistance] = useState<number>(120);
  const [quoteWeight, setQuoteWeight] = useState<number>(500);
  const [quoteService, setQuoteService] = useState<string>("express");
  const [estimatedPrice, setEstimatedPrice] = useState<number>(2160);

  // Modal Open/Close for interactive lead form
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    company: "",
    origin: "กรุงเทพฯ",
    destination: "ชลบุรี",
    productType: "ชิ้นส่วนยานยนต์",
    acceptedTerms: true
  });

  // Calculate live estimate whenever distance, weight, or service changes
  useEffect(() => {
    let baseRate = 8; // standard rate per km
    if (quoteService === "express") baseRate = 12;
    if (quoteService === "coldchain") baseRate = 18;

    // Weight multiplier
    let weightMultiplier = 1.0;
    if (quoteWeight > 3000) weightMultiplier = 1.8;
    else if (quoteWeight > 1000) weightMultiplier = 1.4;
    else if (quoteWeight > 500) weightMultiplier = 1.1;

    const price = Math.round(quoteDistance * baseRate * weightMultiplier);
    setEstimatedPrice(price);
  }, [quoteDistance, quoteWeight, quoteService]);

  // Observer for counting animation
  useEffect(() => {
    const currentRef = statsSectionRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        let startTime = 0;
        const duration = 1500; // ms

        const animate = (timestamp: number) => {
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / duration, 1);

          setCounts([
            Math.floor(progress * 300),
            Math.floor(progress * 30),
            parseFloat((progress * 99.2).toFixed(1)),
            Math.floor(progress * 500)
          ]);

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            setCounts([300, 30, 99.2, 500]);
          }
        };

        requestAnimationFrame(animate);
        observer.unobserve(currentRef);
      }
    }, { threshold: 0.2 });

    observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  // Simple handle scroll to elements
  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const submitQuoteRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setIsQuoteModalOpen(false);
      // Reset form
      setFormData({
        name: "",
        phone: "",
        company: "",
        origin: "กรุงเทพฯ",
        destination: "ชลบุรี",
        productType: "ชิ้นส่วนยานยนต์",
        acceptedTerms: true
      });
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans antialiased text-[#0A1F33]">
      
      {/* 1. STICKY NAVBAR */}
      <nav className="sticky top-0 z-50 w-full border-b border-[#E5E7EB] bg-white/90 backdrop-blur-md transition-shadow duration-300 hover:shadow-sm">
        <div id="nav-container" className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
          
          {/* Brand Logo */}
          <button onClick={() => scrollToSection("hero")} className="flex items-center space-x-2 text-2xl font-bold tracking-tight text-[#0A1F33] focus:outline-none">
            <span>Packd</span>
            <span className="h-2 w-2 rounded-full bg-[#FF6B35]"></span>
          </button>

          {/* Center Links (Desktop only) */}
          <div className="hidden items-center space-x-8 md:flex">
            <button onClick={() => scrollToSection("services")} className="text-sm font-medium text-[#6B7280] transition-colors hover:text-[#0A1F33]">บริการ</button>
            <button onClick={() => scrollToSection("why-us")} className="text-sm font-medium text-[#6B7280] transition-colors hover:text-[#0A1F33]">จุดเด่น</button>
            <button onClick={() => scrollToSection("fleet")} className="text-sm font-medium text-[#6B7280] transition-colors hover:text-[#0A1F33]">ฟลีท</button>
            <button onClick={() => scrollToSection("coverage")} className="text-sm font-medium text-[#6B7280] transition-colors hover:text-[#0A1F33]">พื้นที่ให้บริการ</button>
            <button onClick={() => scrollToSection("testimonials")} className="text-sm font-medium text-[#6B7280] transition-colors hover:text-[#0A1F33]">ลูกค้าของเรา</button>
            <button onClick={() => scrollToSection("faq")} className="text-sm font-medium text-[#6B7280] transition-colors hover:text-[#0A1F33]">ถาม-ตอบ</button>
          </div>

          {/* Right Controls */}
          <div className="hidden items-center space-x-4 lg:flex">
            <a 
              href="https://line.me/ti/p/~@packdlogistics" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center space-x-1.5 rounded-lg border border-[#E5E7EB] bg-white px-3.5 py-2 text-sm font-semibold text-[#6B7280] transition-all hover:bg-slate-50 hover:text-[#0A1F33]"
            >
              <MessageCircle className="h-4 w-4 text-[#06C755]" />
              <span>@packdlogistics</span>
            </a>
            <a 
              href="tel:0812345678" 
              className="flex items-center space-x-1.5 rounded-lg border border-[#E5E7EB] bg-white px-3.5 py-2 text-sm font-semibold text-[#6B7280] transition-all hover:bg-slate-50 hover:text-[#0A1F33]"
            >
              <Phone className="h-4 w-4 text-[#0A1F33]" />
              <span>081-234-5678</span>
            </a>
            <button 
              id="request-quote-nav-btn"
              onClick={() => setIsQuoteModalOpen(true)}
              className="group flex items-center space-x-1.5 rounded-lg bg-[#FF6B35] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#E55A2B] hover:shadow"
            >
              <span>ขอใบเสนอราคา</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Mobile Menu Hamburger */}
          <button 
            id="mobile-hamburger-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            aria-label="Toggle Menu"
            className="rounded p-2 text-[#0A1F33] hover:bg-slate-100 lg:hidden"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div id="mobile-menu-dropdown" className="border-t border-[#E5E7EB] bg-white px-4 py-6 shadow-lg lg:hidden">
            <div className="flex flex-col space-y-4">
              <button onClick={() => scrollToSection("services")} className="inline-block text-left text-base font-semibold text-[#0A1F33] py-2">บริการ</button>
              <button onClick={() => scrollToSection("why-us")} className="inline-block text-left text-base font-semibold text-[#0A1F33] py-2">จุดเด่น</button>
              <button onClick={() => scrollToSection("fleet")} className="inline-block text-left text-base font-semibold text-[#0A1F33] py-2">ฟลีท</button>
              <button onClick={() => scrollToSection("coverage")} className="inline-block text-left text-base font-semibold text-[#0A1F33] py-2">พื้นที่ให้บริการ</button>
              <button onClick={() => scrollToSection("testimonials")} className="inline-block text-left text-base font-semibold text-[#0A1F33] py-2">ลูกค้าของเรา</button>
              <button onClick={() => scrollToSection("faq")} className="inline-block text-left text-base font-semibold text-[#0A1F33] py-2">ถาม-ตอบ</button>
              
              <div className="grid grid-cols-2 gap-3 pt-4">
                <a 
                  href="https://line.me/ti/p/~@packdlogistics" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-center space-x-1.5 rounded-lg border border-[#E5E7EB] bg-white py-3 text-sm font-semibold text-[#0A1F33]"
                >
                  <MessageCircle className="h-4 w-4 text-[#06C755]" />
                  <span>LINE ID</span>
                </a>
                <a 
                  href="tel:0812345678" 
                  className="flex items-center justify-center space-x-1.5 rounded-lg border border-[#E5E7EB] bg-white py-3 text-sm font-semibold text-[#0A1F33]"
                >
                  <Phone className="h-4 w-4" />
                  <span>โทรหาเรา</span>
                </a>
              </div>
              <button 
                id="mobile-quote-btn"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsQuoteModalOpen(true);
                }}
                className="w-full rounded-lg bg-[#FF6B35] py-3 text-center text-base font-bold text-white shadow"
              >
                ขอใบเสนอราคาฟรี ใน 30 นาที
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* 2. HERO SECTION */}
      <section id="hero" className="relative flex min-h-[calc(100vh-80px)] w-full items-center overflow-hidden bg-dot-pattern py-12 md:py-24">
        {/* Ambient top & bottom gradients */}
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-white to-transparent"></div>
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#FAFAFA] to-transparent"></div>

        <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-8">
            
            {/* Hero Left */}
            <div id="hero-left-col" className="flex flex-col space-y-6 md:space-y-8">
              <div>
                <span className="inline-flex items-center space-x-2 rounded-full bg-[#FF6B35]/10 px-4 py-1.5 text-sm font-bold text-[#FF6B35]">
                  <span>🚚 Data-Driven Road Logistics</span>
                </span>
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-[#0A1F33] sm:text-5xl md:text-6xl md:leading-tight lg:text-7xl">
                ขนส่งแม่นยำ<br />
                <span className="bg-gradient-to-r from-[#0A1F33] via-[#1A3A5C] to-[#FF6B35] bg-clip-text text-transparent">ต้นทุนโปร่งใส</span><br />
                ขับเคลื่อนด้วยข้อมูล
              </h1>

              <p className="max-w-xl text-lg leading-relaxed text-[#6B7280] md:text-xl">
                ขนส่งทุกเที่ยวตรวจสอบได้ทุกบาทผ่านระบบอัจฉริยะ 
                ช่วยให้จัดสรรงบประมาณได้อย่างแม่นยำ พร้อมรับใบเสนอราคาไวใน 30 นาที
              </p>

              <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                <button 
                  onClick={() => setIsQuoteModalOpen(true)}
                  className="rounded-lg bg-[#FF6B35] px-8 py-4 text-center text-lg font-bold text-white shadow-md transition-all hover:scale-[1.01] hover:bg-[#E55A2B] hover:shadow-lg focus:outline-none"
                >
                  ขอใบเสนอราคา →
                </button>
                <a 
                  href="https://line.me/ti/p/~@packdlogistics"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center space-x-2 rounded-lg border-2 border-[#0A1F33] bg-transparent px-8 py-4 text-center text-lg font-bold text-[#0A1F33] transition-all hover:bg-slate-50 focus:outline-none"
                >
                  <MessageCircle className="h-5 w-5 text-[#06C755]" />
                  <span>แชทกับเราใน LINE</span>
                </a>
              </div>

              {/* Trust parameters */}
              <div className="border-t border-[#E5E7EB] pt-6">
                <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-sm font-medium text-[#6B7280]">
                  <span className="flex items-center space-x-1.5">
                    <span className="text-amber-500">⭐</span>
                    <span className="font-mono text-[#0A1F33] font-bold">99.2%</span>
                    <span>On-Time Delivery</span>
                  </span>
                  <span className="hidden h-4 w-px bg-slate-300 sm:inline"></span>
                  <span className="flex items-center space-x-1.5">
                    <span>🛡️</span>
                    <span>ประกันสินค้าสูงสุด</span>
                    <span className="font-mono text-[#0A1F33] font-bold">500,000</span>
                    <span>บาท/เที่ยว</span>
                  </span>
                  <span className="hidden h-4 w-px bg-slate-300 sm:inline"></span>
                  <span className="flex items-center space-x-1.5">
                    <span>📡</span>
                    <span>GPS เรียลไทม์ 24/7</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Hero Right: Interactive Dashboard Visuals */}
            <div id="hero-right-col" className="relative hidden items-center justify-center lg:flex">
              <div className="relative w-full max-w-[500px]">
                {/* Background decorative vector */}
                <div className="absolute -top-12 -left-12 h-72 w-72 rounded-full bg-[#FF6B35]/5 blur-3xl"></div>
                <div className="absolute -bottom-12 -right-12 h-72 w-72 rounded-full bg-blue-500/5 blur-3xl"></div>

                {/* Main Truck SVG Illustration with Dashboard Theme */}
                <div className="relative animate-float rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-2xl">
                  
                  {/* Decorative Route SVG inside */}
                  <svg className="mb-4 h-56 w-full rounded-lg bg-slate-50" viewBox="0 0 400 240">
                    {/* Grid background inside mock visual */}
                    <defs>
                      <pattern id="inner-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(229, 231, 235, 0.4)" strokeWidth="1"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#inner-grid)" />
                    
                    {/* Route track */}
                    <path d="M50,180 Q150,40 250,160 T350,80" fill="none" stroke="#E2E8F0" strokeWidth="4" />
                    <path class="animate-dash" d="M50,180 Q150,40 250,160 T350,80" fill="none" stroke="#FF6B35" strokeWidth="4" />
                    
                    {/* Destination Points */}
                    <circle cx="50" cy="180" r="6" fill="#0A1F33" />
                    <text x="35" y="202" fill="#6B7280" fontSize="10" fontWeight="bold">กรุงเทพฯ (คลังสินค้า)</text>
                    
                    <circle cx="250" cy="160" r="4" fill="#6B7280" />
                    
                    <circle cx="350" cy="80" r="8" fill="#10B981" />
                    <circle cx="350" cy="80" r="14" fill="none" stroke="#10B981" strokeWidth="2" className="animate-ping" style={{ transformOrigin: "350px 80px" }} />
                    <text x="310" y="60" fill="#0A1F33" fontSize="10" fontWeight="bold">ชลบุรี (ส่งสำเร็จ)</text>
                    
                    {/* Truck icon moving along path - simplified rendering nested SVG */}
                    <g transform="translate(190, 75)">
                      <rect x="0" y="0" width="36" height="20" rx="3" fill="#0A1F33" />
                      <path d="M30,5 L42,10 L42,20 L30,20 Z" fill="#FF6B35" />
                      <circle cx="10" cy="22" r="4" fill="#475569" />
                      <circle cx="32" cy="22" r="4" fill="#475569" />
                      <text x="5" y="14" fill="white" fontSize="8" fontWeight="bold">Packd</text>
                    </g>
                  </svg>

                  {/* Dashboard Visual Header inside the graphic card */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center space-x-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-emerald-500"></div>
                      <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">GPS MONITORING STATUS</span>
                    </div>
                    <span className="rounded bg-sky-50 px-2 py-0.5 text-[10px] font-bold text-sky-700">TRUCK #04B</span>
                  </div>

                  {/* Dynamic stats row inside the visual card */}
                  <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                    <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-100">
                      <span className="text-slate-400">พิกัดล่าสุด</span>
                      <p className="font-mono font-medium text-[#0A1F33]">13.543, 100.912</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-100">
                      <span className="text-slate-400">เวลาอัปโหลดระบบ</span>
                      <p className="font-mono font-medium text-[#0A1F33]">เรียลไทม์ (1 วินาทีทีแล้ว)</p>
                    </div>
                  </div>
                </div>

                {/* Floating Metrics around the truck design */}
                {floatingCards.map((card, idx) => {
                  const positions = [
                    "-top-6 -right-10",
                    "top-20 -left-12",
                    "bottom-16 -right-14",
                    "-bottom-8 left-8"
                  ];
                  return (
                    <div 
                      key={card.id} 
                      className={`absolute ${positions[idx]} hidden rounded-xl border border-slate-100 p-3 shadow-lg bg-white/95 backdrop-blur-sm sm:flex items-center space-x-3 transition-transform hover:-translate-y-1 duration-300 w-44`}
                    >
                      <div className={`h-2.5 w-2.5 rounded-full ${card.color} ${card.bg} flex items-center justify-center p-2`}>
                        <span className="text-[10px] scale-90">●</span>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{card.label}</p>
                        <p className="font-mono text-sm font-bold text-[#0A1F33]">{card.value}</p>
                      </div>
                    </div>
                  );
                })}

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. STATS BAR ("Numbers That Matter") */}
      <section ref={statsSectionRef} className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <div id="stats-banner" className="relative overflow-hidden rounded-2xl bg-[#0A1F33] px-8 py-10 text-white shadow-xl">
          {/* Subtle design elements in the background */}
          <div className="absolute top-0 right-0 h-full w-1/3 opacity-5 pointer-events-none">
            <svg height="100%" width="100%">
              <line x1="0" y1="0" x2="200" y2="400" stroke="white" strokeWidth="4" />
              <line x1="50" y1="0" x2="250" y2="400" stroke="white" strokeWidth="2" />
            </svg>
          </div>

          <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4 md:gap-4 md:divide-x md:divide-[#1A3A5C]">
            {statsData.map((stat, idx) => {
              const StatIcon = stat.icon;
              return (
                <div key={stat.id} className="flex flex-col items-center px-4">
                  <div className="mb-2 rounded-full bg-[#1A3A5C] p-2 text-[#FF6B35]">
                    <StatIcon className="h-5 w-5" />
                  </div>
                  <p className="font-mono text-3xl font-extrabold text-white md:text-4xl lg:text-5xl">
                    {stat.prefix}
                    {counts[idx]}
                    {stat.suffix}
                  </p>
                  <p className="mt-2 text-xs font-semibold tracking-wide text-slate-300 uppercase md:text-sm">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. SERVICES (3 Cards) */}
      <section id="services" className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-32">
        <div className="text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-[#FF6B35]">Our Services</span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#0A1F33] md:text-5xl">
            บริการของเรา
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-[#6B7280] md:text-lg">
            เลือกประเภทบริการจัดส่งที่ตรงกับความต้องการและโครงสร้างของธุรกิจคุณ เพื่อประสิทธิภาพและต้นทุนทีคุ้มค่าที่สุด
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          
          {/* Card 1: Standard Delivery */}
          <div className="flex flex-col rounded-2xl border border-[#E5E7EB] bg-white p-8 transition-all hover:translate-y-[-4px] hover:border-[#0A1F33]/20 hover:shadow-lg">
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-[#0A1F33]">
              <Package className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-[#0A1F33]">Standard Delivery</h3>
            <span className="text-sm font-bold text-[#FF6B35] mt-1">ขนส่งปกติ</span>
            <p className="mt-4 text-sm text-[#6B7280] leading-relaxed">
              เหมาะสำหรับการขนส่งสินค้าทั่วไปประเภทอาหารแห้ง สินค้าอุตสาหกรรม หรือวัสดก่อสร้างที่ไม่ได้มีเงื่อนไขเรื่องการเปิดเครื่องปรับอุณหภูมิและไม่ได้เร่งด่วนรุนแรง
            </p>
            <ul className="mt-6 flex-1 space-y-3 border-t border-slate-100 pt-6 text-sm text-[#0A1F33]">
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <span>จัดส่งปลายทาง 1-3 วันทำการ</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <span>รับน้ำหนัก 100 - 6,000 กิโลกรัม</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <span>จำลองหรือวิเคราะห์เส้นทางที่ดีที่สุด</span>
              </li>
            </ul>
            <div className="mt-8 border-t border-slate-100 pt-6">
              <p className="text-xs text-[#6B7280]">อัตราค่าบริการทั่วไป</p>
              <p className="text-2xl font-extrabold text-[#0A1F33] font-mono mt-1">
                เริ่ม 8 <span className="text-sm font-normal text-[#6B7280]">บาท/กม.</span>
              </p>
            </div>
            <button 
              onClick={() => setIsQuoteModalOpen(true)}
              className="mt-6 flex items-center justify-center space-x-2 rounded-lg bg-slate-50 py-3 text-sm font-bold text-[#0A1F33] transition-colors hover:bg-slate-100"
            >
              <span>ดูรายละเอียด →</span>
            </button>
          </div>

          {/* Card 2: Express Delivery (HIGHLIGHTED) */}
          <div className="relative flex flex-col rounded-2xl border-2 border-[#FF6B35] bg-white p-8 shadow-md transition-all hover:translate-y-[-4px] hover:shadow-xl">
            <span className="absolute -top-3.5 right-6 inline-flex rounded-full bg-[#FF6B35] px-3.5 py-1 text-xs font-extrabold uppercase tracking-wide text-white">
              ยอดนิยม
            </span>
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#FF6B35]/15 text-[#FF6B35]">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-[#0A1F33]">Express Delivery</h3>
            <span className="text-sm font-bold text-[#FF6B35] mt-1">ขนส่งด่วน Same-Day</span>
            <p className="mt-4 text-sm text-[#6B7280] leading-relaxed">
              การจัดส่งเร่งด่วนการันตีเรื่องกรอบเวลาในการส่งมอบอย่างเคร่งครัด เหมาะสำหรับอุตสาหกรรมชิ้นส่วน การส่งวัตถุดิบเร่งด่วน หรือแพลตฟอร์มที่ต้องส่งมอบในวันเดียวกัน
            </p>
            <ul className="mt-6 flex-1 space-y-3 border-t border-slate-100 pt-6 text-sm text-[#0A1F33]">
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <span className="font-bold">บริการจัดส่งในวันเดียว (Same-Day)</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <span>การันตีเวลาล่าช้าคืนเงินค่าจัดส่ง 100%</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <span>รองรับน้ำหนักได้สูงสุด 3,000 กก.</span>
              </li>
            </ul>
            <div className="mt-8 border-t border-slate-100 pt-6">
              <p className="text-xs text-[#6B7280]">อัตราค่าบริการทั่วไป</p>
              <p className="text-2xl font-extrabold text-[#FF6B35] font-mono mt-1">
                เริ่ม 12 <span className="text-sm font-normal text-[#6B7280]">บาท/กม.</span>
              </p>
            </div>
            <button 
              onClick={() => setIsQuoteModalOpen(true)}
              className="mt-6 flex items-center justify-center space-x-2 rounded-lg bg-[#FF6B35] py-3 text-sm font-bold text-white transition-colors hover:bg-[#E55A2B]"
            >
              <span>จองรอบด่วน →</span>
            </button>
          </div>

          {/* Card 3: Cold Chain Delivery */}
          <div className="flex flex-col rounded-2xl border border-[#E5E7EB] bg-white p-8 transition-all hover:translate-y-[-4px] hover:border-[#0A1F33]/20 hover:shadow-lg">
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
              <Snowflake className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-[#0A1F33]">Cold Chain Delivery</h3>
            <span className="text-sm font-bold text-sky-600 mt-1">ขนส่งควบคุมอุณหภูมิ</span>
            <p className="mt-4 text-sm text-[#6B7280] leading-relaxed">
              สำหรับผลิตภัณฑ์อาหารแช่แข็ง ยา อุปกรณ์ทางการแพทย์ หรือวัตถุดิบเคมีที่ต้องความคุมความเย็น พร้อมบันทึกอุณหภูมิตลอดเที่ยวเพื่อการันตีคุณภาพของสินค้า
            </p>
            <ul className="mt-6 flex-1 space-y-3 border-t border-slate-100 pt-6 text-sm text-[#0A1F33]">
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <span>ควบคุมช่วง -18°C ถึง +25°C ได้นิ่งแม่นยำ</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <span>เซนเซอร์อุณหภูมิอัจฉริยะส่งข้อมูลตรงตลอดเวลา</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <span>รายงาน Cold Chain Report รายเที่ยว</span>
              </li>
            </ul>
            <div className="mt-8 border-t border-slate-100 pt-6">
              <p className="text-xs text-[#6B7280]">อัตราค่าบริการทั่วไป</p>
              <p className="text-2xl font-extrabold text-[#0A1F33] font-mono mt-1">
                เริ่ม 18 <span className="text-sm font-normal text-[#6B7280]">บาท/กม.</span>
              </p>
            </div>
            <button 
              onClick={() => setIsQuoteModalOpen(true)}
              className="mt-6 flex items-center justify-center space-x-2 rounded-lg bg-slate-50 py-3 text-sm font-bold text-[#0A1F33] transition-colors hover:bg-slate-100"
            >
              <span>ดูรายละเอียด →</span>
            </button>
          </div>

        </div>
      </section>

      {/* 5. WHY CHOOSE US (Differentiator) */}
      <section id="why-us" className="bg-slate-50 py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            
            {/* Left Pillar content */}
            <div className="flex flex-col space-y-6">
              <span className="text-sm font-bold uppercase tracking-widest text-[#FF6B35]">The Packd Advantage</span>
              <h2 className="text-3xl font-extrabold tracking-tight text-[#0A1F33] md:text-5xl">
                ทำไมต้องเลือก Packd
              </h2>
              <p className="text-base text-[#6B7280] leading-relaxed md:text-lg">
                เราไม่ใช่แค่บริษัทขนส่งสินค้าแบบดั้งเดิม แต่เราคือพาร์ทเนอร์ด้านข้อมูลโลจิสติกส์ B2B (Data-Driven Logistics) ที่นำเสนอความแม่นยำ ประสิทธิภาพทางพลังงาน และความประหยัดแก่ลูกค้าองค์กรในทุกมิติ
              </p>
              
              <div className="pt-4">
                <div className="rounded-xl border border-slate-200/60 bg-white p-5 flex items-start space-x-4">
                  <div className="rounded-lg bg-[#FF6B35]/15 p-2.5 text-[#FF6B35] shrink-0">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0A1F33]">เน้นลดต้นทุนแอบแฝง</h4>
                    <p className="text-sm text-[#6B7280] mt-1">
                      ด้วยระบบวิเคราะห์ข้อมูล และจัดเส้นทางแบบ Multi-drop ช่วยประหยัดต้นทุนรวมประมวลผลสูงถึง 15-20% ต่อปี
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: 4 feature blocks in 2x2 grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              
              {/* Feature 1 */}
              <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 transition-all hover:bg-white hover:shadow-md">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#FF6B35]/10 text-[#FF6B35]">
                  <Database className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-[#0A1F33]">Business Intelligence</h3>
                <p className="mt-2 text-xs leading-relaxed text-[#6B7280]">
                  เราวิเคราะห์โครงสร้างต้นทุนเฉลี่ยต่อเที่ยวต่อกิโลเมตรและแสดงรายงานเชิงลึกเพื่อการวางเป้าหมายสำหรับทีมการเงินหลัก
                </p>
              </div>

              {/* Feature 2 */}
              <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 transition-all hover:bg-white hover:shadow-md">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#FF6B35]/10 text-[#FF6B35]">
                  <LayoutDashboard className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-[#0A1F33]">Self-Service Dashboard</h3>
                <p className="mt-2 text-xs leading-relaxed text-[#6B7280]">
                  ลูกค้าองค์กรเปิดตรวจสอบสถานะการทำงาน อุณหภูมิ และความคืบหน้าของออเดอร์ได้ทันทีโดยไม่ต้องโทรเช็คเจ้าหน้าที่
                </p>
              </div>

              {/* Feature 3 */}
              <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 transition-all hover:bg-white hover:shadow-md">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#FF6B35]/10 text-[#FF6B35]">
                  <MapPin className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-[#0A1F33]">GPS Tracking 100%</h3>
                <p className="mt-2 text-xs leading-relaxed text-[#6B7280]">
                  ขบวนฟลีทรถทุกคันผ่านการติดตั้งอุปกรณ์อัจจิระ และระบบนำทาง GPS ตรวจสอบตำแหน่งอัปเดตวินาทีต่อวินาที ตลอดเวลา
                </p>
              </div>

              {/* Feature 4 */}
              <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 transition-all hover:bg-white hover:shadow-md">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#FF6B35]/10 text-[#FF6B35]">
                  <Snowflake className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-[#0A1F33]">Cold Chain มาตรฐาน</h3>
                <p className="mt-2 text-xs leading-relaxed text-[#6B7280]">
                  มีระบบบันทึก Temperature Log อย่างแม่นยำ พร้อมส่งรายงานอุณหภูมิสินค้าอย่างโปร่งใสเมื่อมีการส่งสินค้าสิ้นสุดลง
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 6. DASHBOARD PREVIEW (Killer Section) */}
      <section id="dashboard" className="relative py-20 overflow-hidden bg-grid-pattern md:py-32">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          
          <div className="text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-[#FF6B35]">Corporate Customer Tech</span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#0A1F33] md:text-5xl">
              เห็นต้นทุนทุกบาท ในที่เดียว
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-[#6B7280]">
              Self-Service Dashboard สำหรับลูกค้าองค์กร — <span className="font-semibold text-[#0A1F33]">ฟรีเมื่อใช้สะสม 20+ เที่ยว/เดือน</span> ขับเคลื่อนความโปร่งใสแบบ real-time
            </p>
          </div>

          {/* REALISTIC BROWSER MOCKUP */}
          <div className="mt-16 relative mx-auto max-w-5xl rounded-xl border border-[#E5E7EB] bg-white shadow-2xl transition-all duration-500 hover:shadow-orange-100/30 overflow-hidden">
            
            {/* Browser Header Bar */}
            <div className="flex items-center justify-between bg-slate-100 px-4 py-3 border-b border-slate-200">
              <div className="flex items-center space-x-1.5">
                <div className="h-3 w-3 rounded-full bg-rose-400"></div>
                <div className="h-3 w-3 rounded-full bg-amber-400"></div>
                <div className="h-3 w-3 rounded-full bg-emerald-400"></div>
              </div>
              <div className="rounded bg-white px-24 py-1 text-xs font-mono font-medium text-slate-400 border border-slate-200 select-none">
                dashboard.packd.co.th
              </div>
              <div className="w-12"></div> {/* spacer */}
            </div>

            {/* Dashboard Inner App Area */}
            <div className="grid grid-cols-1 md:grid-cols-12 bg-[#F8FAFC]">
              
              {/* Sidebar navigation */}
              <div className="col-span-1 md:col-span-3 border-r border-slate-200 bg-white p-4 hidden md:flex flex-col space-y-6">
                <div>
                  <div className="flex items-center space-x-2 text-base font-bold text-[#0A1F33]">
                    <div className="h-6 w-6 rounded bg-[#FF6B35] flex items-center justify-center text-white text-[10px]">P</div>
                    <span>Packd Panel</span>
                  </div>
                </div>

                <div className="flex flex-col space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-2.5 mb-1.5">ฟังก์ชันหลัก</span>
                  <div className="flex items-center space-x-2.5 rounded-lg bg-[#FF6B35]/15 px-3 py-2 text-sm font-bold text-[#FF6B35]">
                    <LayoutDashboard className="h-4 w-4 text-[#FF6B35]" />
                    <span>แดชบอร์ดหลัก</span>
                  </div>
                  <div className="flex items-center space-x-2.5 rounded-lg px-3 py-2 text-sm text-[#6B7280] hover:bg-slate-50 transition-colors">
                    <Truck className="h-4 w-4" />
                    <span>พิกัดและการเดินทาง</span>
                  </div>
                  <div className="flex items-center space-x-2.5 rounded-lg px-3 py-2 text-sm text-[#6B7280] hover:bg-slate-50 transition-colors">
                    <FileText className="h-4 w-4" />
                    <span>สรุปค่าใช้จ่าย / Invoice</span>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="rounded-lg bg-[#0A1F33] p-3 text-white text-xs">
                    <p className="font-bold">สิทธิ์ลูกค้าองค์กร</p>
                    <p className="text-slate-300 mt-1">ABC Co., Ltd.</p>
                    <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono">
                      <span>เครดิตเทอม: 30 วัน</span>
                      <span className="text-[#FF6B35]">ACTIVE</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main content grid context */}
              <div className="col-span-1 md:col-span-9 p-4 md:p-6 space-y-6">
                
                {/* Header overview content */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-y-3">
                  <div>
                    <h3 className="text-lg font-bold text-[#0A1F33]">ภาพรวมค่าจัดส่งสินค้าสะสมเดือนนี้</h3>
                    <p className="text-xs text-[#6B7280]">สรุปผลลัพธ์การคุมอุณหภูมิและการจัดส่งสินค้า ABC Co., Ltd.</p>
                  </div>
                  <div>
                    <span className="inline-flex rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-[#0A1F33]">
                      📅 พ.ค. 2026 (ล่าสุด)
                    </span>
                  </div>
                </div>

                {/* KPI stats widgets inside mockup */}
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                  <div className="rounded-xl bg-white p-3 border border-slate-200 shadow-sm">
                    <span className="text-[10px] text-[#6B7280]">เที่ยวเดือนนี้</span>
                    <p className="font-mono text-xl font-bold text-[#0A1F33] mt-1">47 เที่ยว</p>
                    <span className="text-[9px] text-[#10B981] font-bold">▲ ยอดโตขึ้น 12%</span>
                  </div>
                  <div className="rounded-xl bg-white p-3 border border-slate-200 shadow-sm">
                    <span className="text-[10px] text-[#6B7280]">ต้นทุนสะสมรวม</span>
                    <p className="font-mono text-xl font-bold text-[#0A1F33] mt-1">฿128,400</p>
                    <span className="text-[9px] text-[#10B981] font-bold">▼ ต่ำกว่าเป้าหมาย 4%</span>
                  </div>
                  <div className="rounded-xl bg-white p-3 border border-slate-200 shadow-sm">
                    <span className="text-[10px] text-[#6B7280]">ต้นทุนเฉลี่ยต่อ กม.</span>
                    <p className="font-mono text-xl font-bold text-[#FF6B35] mt-1">฿9.20/กม.</p>
                    <span className="text-[9px] text-slate-400 font-bold">คงที่ตลอดปี</span>
                  </div>
                  <div className="rounded-xl bg-white p-3 border border-slate-200 shadow-sm">
                    <span className="text-[10px] text-[#6B7280]">อัตรา On-Time</span>
                    <p className="font-mono text-xl font-bold text-emerald-600 mt-1">100.0%</p>
                    <span className="text-[9px] text-emerald-600 font-bold">ไม่มีประเด็นส่งล่าช้า</span>
                  </div>
                </div>

                {/* Two Column Layout: Chart & Table inside mockup */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  
                  {/* CSS-Only Bar Chart */}
                  <div className="lg:col-span-5 rounded-xl bg-white p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-[#0A1F33]">มูลค่าค่าใช้จ่ายเฉลี่ยต่อวัน (7 วันหลังสุด)</h4>
                      <p className="text-[10px] text-slate-400">หน่วย: พันบาท</p>
                    </div>
                    {/* Visual representation of 7 bars with simple heights and colors */}
                    <div className="mt-4 flex items-end justify-between h-24 px-2">
                      <div className="flex flex-col items-center space-y-1.5">
                        <div className="w-4 rounded-t bg-[#FF6B35]/40 h-10"></div>
                        <span className="text-[8px] font-mono text-slate-400">จ.</span>
                      </div>
                      <div className="flex flex-col items-center space-y-1.5">
                        <div className="w-4 rounded-t bg-[#FF6B35]/40 h-14"></div>
                        <span className="text-[8px] font-mono text-slate-400">อ.</span>
                      </div>
                      <div className="flex flex-col items-center space-y-1.5">
                        <div className="w-4 rounded-t bg-[#FF6B35]/60 h-12"></div>
                        <span className="text-[8px] font-mono text-slate-400">พ.</span>
                      </div>
                      <div className="flex flex-col items-center space-y-1.5">
                        <div className="w-4 rounded-t bg-[#FF6B35] h-20"></div>
                        <span className="text-[8px] font-mono text-slate-400">พฤ.</span>
                      </div>
                      <div className="flex flex-col items-center space-y-1.5">
                        <div className="w-4 rounded-t bg-[#FF6B35]/50 h-16"></div>
                        <span className="text-[8px] font-mono text-slate-400">ศ.</span>
                      </div>
                      <div className="flex flex-col items-center space-y-1.5">
                        <div className="w-4 rounded-t bg-[#0A1F33] h-8"></div>
                        <span className="text-[8px] font-mono text-slate-400">ส.</span>
                      </div>
                      <div className="flex flex-col items-center space-y-1.5">
                        <div className="w-4 rounded-t bg-[#FF6B35] h-24"></div>
                        <span className="text-[8px] font-mono text-slate-400">อา.</span>
                      </div>
                    </div>
                  </div>

                  {/* Shipments Data Table Mockup inside browser */}
                  <div className="lg:col-span-7 rounded-xl bg-white p-4 border border-slate-200 shadow-sm overflow-x-auto">
                    <h4 className="text-xs font-bold text-[#0A1F33] mb-3">ขบวนเดินทางล่าสุด</h4>
                    <table className="w-full text-left text-[11px] border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400">
                          <th className="pb-2 font-semibold">Booking ID</th>
                          <th className="pb-2 font-semibold">เส้นทาง</th>
                          <th className="pb-2 font-semibold">สถานะ</th>
                          <th className="pb-2 font-semibold text-right">ต้นทุนเที่ยว</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 font-medium">
                        <tr>
                          <td className="py-2.5 font-mono text-indigo-600">PKD-10255</td>
                          <td className="py-2.5 text-[#0A1F33]">กรุงเทพฯ → ชลบุรี</td>
                          <td className="py-2.5">
                            <span className="inline-flex rounded bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-600">ส่งสำเร็จ</span>
                          </td>
                          <td className="py-2.5 text-right font-mono text-[#0A1F33]">฿2,340</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 font-mono text-indigo-600">PKD-10256</td>
                          <td className="py-2.5 text-[#0A1F33]">สมุทรปราการ → โคราช</td>
                          <td className="py-2.5">
                            <span className="inline-flex rounded bg-amber-50 px-2 py-0.5 text-[9px] font-bold text-amber-600 animate-pulse">กำลังเดินทาง</span>
                          </td>
                          <td className="py-2.5 text-right font-mono text-[#0A1F33]">฿8,900</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 font-mono text-indigo-600">PKD-10257</td>
                          <td className="py-2.5 text-[#0A1F33]">กรุงเทพฯ → ขอนแก่น</td>
                          <td className="py-2.5">
                            <span className="inline-flex rounded bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-600">ส่งสำเร็จ</span>
                          </td>
                          <td className="py-2.5 text-right font-mono text-[#0A1F33]">฿12,400</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 font-mono text-indigo-600">PKD-10258</td>
                          <td className="py-2.5 text-[#0A1F33]">ปทุมธานี → พระนครศรีอยุธยา</td>
                          <td className="py-2.5">
                            <span className="inline-flex rounded bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-600">ส่งสำเร็จ</span>
                          </td>
                          <td className="py-2.5 text-right font-mono text-[#0A1F33]">฿1,800</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                </div>

              </div>
            </div>

          </div>

          <div className="mt-12 text-center">
            <button 
              id="cta-corporate-dashboard-btn"
              onClick={() => setIsQuoteModalOpen(true)}
              className="inline-flex items-center space-x-2 rounded-lg bg-[#0A1F33] px-8 py-3.5 text-base font-bold text-white shadow-md transition-colors hover:bg-slate-800"
            >
              <span>สมัครลูกค้าองค์กรเพื่อรับสิทธิ์ข้อมูลฟรี →</span>
            </button>
          </div>

        </div>
      </section>

      {/* 7. OUR FLEET */}
      <section id="fleet" className="bg-slate-50 py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          
          <div className="text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-[#FF6B35]">Transport Fleets</span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#0A1F33] md:text-5xl">
              ฟลีทรถขนส่ง 4 คัน เลือกใช้ตามขนาดงาน
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-[#6B7280]">
              ยานพหนะจัดส่งของเราติดตั้งกล้อง Dashcam และระบบส่งสัญญาณ GPS ทุกคัน พร้อมกับประกันภัยครอบคลุมสูงสุด 500,000 บาท/เที่ยว
            </p>
          </div>

          {/* Grid of 4 vehicle types */}
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            
            {/* Fleet 1: รถ 6 ล้อ */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 transition-all hover:border-[#FF6B35]/40 hover:shadow-lg">
              <div className="mb-4 bg-slate-50 rounded-lg p-5 flex items-center justify-center h-40">
                {/* Truck SVG */}
                <svg className="h-28 w-44" viewBox="0 0 120 70">
                  <rect x="15" y="10" width="60" height="36" rx="2" fill="#0A1F33" />
                  <path d="M75,18 L95,24 L95,46 L75,46 Z" fill="#6B7280" />
                  <rect x="75" y="24" width="16" height="12" fill="white" />
                  <circle cx="30" cy="50" r="8" fill="#1A3A5C" />
                  <circle cx="50" cy="50" r="8" fill="#1A3A5C" />
                  <circle cx="85" cy="50" r="8" fill="#1A3A5C" />
                  <line x1="10" y1="46" x2="105" y2="46" stroke="#0A1F33" strokeWidth="3" />
                </svg>
              </div>
              <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-[#6B7280] mb-2">
                หนัก 4.5 - 6.5 ตัน
              </span>
              <h3 className="text-lg font-bold text-[#0A1F33]">รถ 6 ล้อตู้ทึบพิเศษ</h3>
              <p className="text-xs text-[#6B7280] mt-1.5 leading-relaxed">
                เหมาะอย่างยิ่งสำหรับการจัดระเบียบขนย้ายสินค้าโรงงาน ขบวนวัตถุดิบก่อสร้าง หรือพาเลทอุตสาหกรรมขนาดใหญ่แบบเต็มตู้
              </p>
              <div className="mt-4 border-t border-slate-100 pt-3">
                <p className="text-xs font-bold text-[#0A1F33]">✓ GPS | ✓ Dashcam | ✓ ประกัน 500K</p>
              </div>
            </div>

            {/* Fleet 2: รถตู้แห้ง (4 ล้อใหญ่) */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 transition-all hover:border-[#FF6B35]/40 hover:shadow-lg">
              <div className="mb-4 bg-slate-50 rounded-lg p-5 flex items-center justify-center h-40">
                {/* Dry Cabin Van SVG */}
                <svg className="h-28 w-44" viewBox="0 0 120 70">
                  <rect x="15" y="15" width="55" height="31" rx="2" fill="#0A1F33" />
                  <path d="M70,22 L88,27 L88,46 L70,46 Z" fill="#FF6B35" />
                  <rect x="70" y="27" width="14" height="10" fill="white" />
                  <circle cx="30" cy="50" r="8" fill="#1A3A5C" />
                  <circle cx="78" cy="50" r="8" fill="#1A3A5C" />
                  <line x1="10" y1="46" x2="95" y2="46" stroke="#0A1F33" strokeWidth="3" />
                </svg>
              </div>
              <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-[#6B7280] mb-2">
                หนัก 1.5 - 2.5 ตัน
              </span>
              <h3 className="text-lg font-bold text-[#0A1F33]">รถตู้แห้งตู้คอนเทนเนอร์</h3>
              <p className="text-xs text-[#6B7280] mt-1.5 leading-relaxed">
                หมดปัญหาเรื่องภัยเปียกฝนด้วยตู้ทึบคอมโพสิต แข็งแกร่ง บรรทุกกล่องพัสดุ สินค้าสำนักงาน และของแห้งได้อย่างอัดแน่นปลอดภัย
              </p>
              <div className="mt-4 border-t border-slate-100 pt-3">
                <p className="text-xs font-bold text-[#0A1F33]">✓ GPS | ✓ Dashcam | ✓ ประกัน 500K</p>
              </div>
            </div>

            {/* Fleet 3: รถตู้เย็นควบคุมอุณหภูมิ */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 transition-all hover:border-sky-300/60 hover:shadow-lg">
              <div className="mb-4 bg-slate-50 rounded-lg p-5 flex items-center justify-center h-40">
                {/* Cold Van SVG */}
                <svg className="h-28 w-44" viewBox="0 0 120 70">
                  <rect x="15" y="15" width="55" height="31" rx="2" fill="#1A3A5C" />
                  <rect x="25" y="8" width="18" height="8" rx="1" fill="#E2E8F0" /> {/* refrigeration Unit */}
                  <path d="M70,22 L88,27 L88,46 L70,46 Z" fill="#4B6584" />
                  <rect x="70" y="27" width="14" height="10" fill="white" />
                  <circle cx="30" cy="50" r="8" fill="#1A3A5C" />
                  <circle cx="78" cy="50" r="8" fill="#1A3A5C" />
                  <line x1="10" y1="46" x2="95" y2="46" stroke="#0A1F33" strokeWidth="3" />
                </svg>
              </div>
              <span className="inline-block rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-600 mb-2">
                ควบคุมอุณหภูมิ (-18°C ถึง +25°C)
              </span>
              <h3 className="text-lg font-bold text-sky-700">รถตู้เย็นควบคุมอุณหภูมิ</h3>
              <p className="text-xs text-[#6B7280] mt-1.5 leading-relaxed">
                ติดตั้งคอมเพรสเซอร์ความเย็นมาตรฐานระดับสากลและแผงเซนเซอร์วัดค่าส่งผ่าน Cloud ตรวจสอบความปลอดภัยสินค้าแช่แข็งตลอดนาที
              </p>
              <div className="mt-4 border-t border-slate-100 pt-3">
                <p className="text-xs font-bold text-[#0A1F33]">✓ GPS | ✓ Dashcam | ✓ ประกัน 500K</p>
              </div>
            </div>

            {/* Fleet 4: รถกระบะตู้ทึบคล่องตัว */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 transition-all hover:border-[#FF6B35]/40 hover:shadow-lg">
              <div className="mb-4 bg-slate-50 rounded-lg p-5 flex items-center justify-center h-40">
                {/* Pickup Truck SVG */}
                <svg className="h-28 w-44" viewBox="0 0 120 70">
                  <path d="M10,24 L45,24 L45,46 L10,46 Z" fill="#0A1F33" /> {/* cabin panel */}
                  <path d="M45,30 L65,30 L78,35 L78,46 L45,46 Z" fill="#FF6B35" />
                  <circle cx="24" cy="50" r="8" fill="#1A3A5C" />
                  <circle cx="68" cy="50" r="8" fill="#1A3A5C" />
                  <line x1="5" y1="46" x2="88" y2="46" stroke="#0A1F33" strokeWidth="3" />
                </svg>
              </div>
              <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-[#6B7280] mb-2">
                น้ำหนักไม่เกิน 1.5 ตัน
              </span>
              <h3 className="text-lg font-bold text-[#0A1F33]">รถกระบะขนส่งตู้ทึบ</h3>
              <p className="text-xs text-[#6B7280] mt-1.5 leading-relaxed">
                ทางเลือกในเมืองใหญ่ที่ต้องการความยืดหยุ่นและเข้าตรอกซอกซอยแคบได้ดีเยี่ยม ส่งพัสดุกล่อง คลังสินค้าอีคอมเมิร์ซปลายทาง รวดเร็ว
              </p>
              <div className="mt-4 border-t border-slate-100 pt-3">
                <p className="text-xs font-bold text-[#0A1F33]">✓ GPS | ✓ Dashcam | ✓ ประกัน 500K</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 8. HOW IT WORKS (6 Steps Timeline) */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-32">
        
        <div className="text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-[#FF6B35]">Process Flow</span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#0A1F33] md:text-5xl">
            ใช้งานสะดวกสไตล์ B2B ใน 6 ขั้นตอน
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-[#6B7280]">
            กระบวนการทำงานที่เป็นระบบ ตรวจสอบง่ายตั้งแต่สัปดาห์แรก ไม่ซับซ้อน มุ่งผลลัพธ์ที่แม่นยำสูง
          </p>
        </div>

        {/* Timeline Desktop Representation (SVG connector layout fallback container for flex row) */}
        <div className="mt-16 relative">
          
          {/* Horizontal line for desktop layout */}
          <div className="absolute top-[41px] left-8 right-8 h-0.5 bg-slate-200 hidden lg:block z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-8 relative z-10">
            
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white border-4 border-[#FF6B35] text-[#0A1F33] shadow font-mono font-black text-2xl mb-4 relative">
                1
                <span className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-[#0A1F33] flex items-center justify-center p-1.5 text-[10px] text-white">✍️</span>
              </div>
              <h3 className="font-bold text-[#0A1F33] text-base">ขอใบเสนอราคา</h3>
              <p className="text-xs text-[#6B7280] mt-1.5 px-3">ระบุจุดประสงค์การจัดส่ง ระยะทาง และประเภทรถผ่านฟลอร์ออนไลน์</p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white border-4 border-amber-400 text-[#0A1F33] shadow font-mono font-black text-2xl mb-4 relative">
                2
                <span className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-[#0A1F33] flex items-center justify-center p-1.5 text-[10px] text-white">💰</span>
              </div>
              <h3 className="font-bold text-[#0A1F33] text-base">ยืนยันยอดเสนอราคา</h3>
              <p className="text-xs text-[#6B7280] mt-1.5 px-3">ทีมงานประเมินและแจ้งราคารวมที่โปร่งใส ไร้ค่าแฝง ภายใน 30 นาที</p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white border-4 border-slate-400 text-[#0A1F33] shadow font-mono font-black text-2xl mb-4 relative">
                3
                <span className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-[#0A1F33] flex items-center justify-center p-1.5 text-[10px] text-white">📅</span>
              </div>
              <h3 className="font-bold text-[#0A1F33] text-base">จองคิวรถขนส่ง</h3>
              <p className="text-xs text-[#6B7280] mt-1.5 px-3">กำหนดวันเวลาสถานที่รับสินค้า พร้อมล็อคประเภทรถที่ต้องการใช้</p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white border-4 border-[#0A1F33] text-[#0A1F33] shadow font-mono font-black text-2xl mb-4 relative">
                4
                <span className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-[#FF6B35] flex items-center justify-center p-1.5 text-[10px] text-white">📦</span>
              </div>
              <h3 className="font-bold text-[#0A1F33] text-base">เข้ารับสินค้าปลอดภัย</h3>
              <p className="text-xs text-[#6B7280] mt-1.5 px-3">พนักงานขับรถพร้อมตู้ทึบเข้านำสินค้าขึ้นรถและจัดวางอย่างประณีต</p>
            </div>

            {/* Step 5 */}
            <div className="flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white border-4 border-[#0A1F33] text-[#0A1F33] shadow font-mono font-black text-2xl mb-4 relative">
                5
                <span className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-[#FF6B35] flex items-center justify-center p-1.5 text-[10px] text-white">📡</span>
              </div>
              <h3 className="font-bold text-[#0A1F33] text-base">ติดตามเรียลไทม์</h3>
              <p className="text-xs text-[#6B7280] mt-1.5 px-3">ส่องดูความคืบหน้า ตำแหน่ง และอุณหภูมิสินค้าผ่านเบราว์เซอร์ได้ 24 ชม.</p>
            </div>

            {/* Step 6 */}
            <div className="flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white border-4 border-emerald-500 text-[#0A1F33] shadow font-mono font-black text-2xl mb-4 relative">
                6
                <span className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-emerald-500 flex items-center justify-center p-1.5 text-[10px] text-white">🏆</span>
              </div>
              <h3 className="font-bold text-[#0A1F33] text-base">ส่งมอบสำเร็จ</h3>
              <p className="text-xs text-[#6B7280] mt-1.5 px-3">ส่งสินค้าถึงเป้าหมายปลอดภัย พร้อมอัปโหลดบิลและเอกสารจัดเก็บลงระบบ</p>
            </div>

          </div>

        </div>
      </section>

      {/* 9. COVERAGE MAP */}
      <section id="coverage" className="bg-slate-900 text-white py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            
            {/* Map Column Left */}
            <div className="flex flex-col items-center justify-center bg-[#071625] rounded-2xl p-6 border border-[#1A3A5C]">
              
              {/* Simplified SVG Map of Thailand */}
              <svg className="h-[450px] w-full max-w-[320px]" viewBox="0 0 300 500">
                <text x="10" y="30" fill="#6B7280" fontSize="11" fontWeight="bold">PACKD ACTIVE AREA MAP</text>
                
                {/* Simplified Path approximation for Northern province region */}
                <path d="M120,40 L160,50 L180,90 L160,140 L110,130 L100,80 Z" fill="#FF6B35" opacity="0.45" stroke="#FF6B35" strokeWidth="1" />
                <text x="125" y="90" fill="white" fontSize="9" fontWeight="bold">ภาคเหนือตอนล่าง</text>
                
                {/* Central Region (Deep orange - Active) */}
                <path d="M110,130 L160,140 L170,180 L180,210 L150,230 L120,220 L100,180 Z" fill="#FF6B35" stroke="white" strokeWidth="1.5" />
                <text x="122" y="175" fill="white" fontSize="10" fontWeight="bold">ภาคกลาง (Active)</text>
                
                {/* Eastern Region (Deep orange - Active) */}
                <path d="M170,180 L200,190 L210,240 L180,240 L150,230 L180,210 Z" fill="#FF6B35" stroke="white" strokeWidth="1.5" />
                <text x="178" y="224" fill="white" fontSize="9" fontWeight="bold">ตะวันออก</text>

                {/* Western Region (Deep orange - Active) */}
                <path d="M100,180 L120,220 L110,250 L85,240 Z" fill="#FF6B35" stroke="white" strokeWidth="1.5" />
                <text x="75" y="220" fill="white" fontSize="9" fontWeight="bold">ตะวันตก</text>

                {/* Northeast Region (Light orange - partner) */}
                <path d="M170,140 L230,130 L260,160 L250,210 L200,210 L170,180 Z" fill="#FF6B35" opacity="0.3" stroke="#FF6B35" strokeWidth="1" strokeDasharray="3" />
                <text x="200" y="170" fill="white" fontSize="10" fontWeight="bold">ภาคอีสาน</text>

                {/* Southern Region */}
                <path d="M110,250 L120,290 L110,350 L125,410 L140,460 L125,470 L100,390 L105,320 Z" fill="#FF6B35" opacity="0.4" stroke="#FF6B35" strokeWidth="1" />
                <text x="85" y="340" fill="white" fontSize="10" fontWeight="bold">ภาคใต้ตอนบน</text>

                {/* Connectors/Pulse Rings on Hub points */}
                <circle cx="140" cy="190" r="4" fill="#FF6B35" />
                <circle cx="140" cy="190" r="10" fill="none" stroke="#FF6B35" strokeWidth="1.5" className="animate-ping" style={{ transformOrigin: "140px 190px" }} />
                
                <circle cx="190" cy="210" r="4" fill="#FF6B35" />
                <circle cx="110" cy="210" r="4" fill="#FF6B35" />
              </svg>

              <div className="mt-4 flex space-x-6 text-xs">
                <span className="flex items-center space-x-1.5">
                  <span className="h-3.5 w-3.5 rounded bg-[#FF6B35]"></span>
                  <span>Active Hub (กรุงเทพฯ/ปริมณฑล)</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="h-3.5 w-3.5 rounded bg-[#FF6B35]/30"></span>
                  <span>เครือข่ายจังหวัดพันธมิตร</span>
                </span>
              </div>
            </div>

            {/* Content Column Right */}
            <div className="flex flex-col space-y-6">
              <span className="text-sm font-bold uppercase tracking-widest text-[#FF6B35]">Active Logistics Network</span>
              <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl">
                ครอบคลุม 30+ จังหวัด ทั่วประเทศ
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed md:text-base">
                ทีมจัดส่งสินค้าของ Packd ให้บริการอย่างเข้มแข็งในภาคกลาง ภาคตะวันออก และภาคตะวันตก โดยเรามีศูนย์กระจายสินค้าหลักอยู่ทีรอบกรุงเทพฯ และมีรถพันธมิตรเชื่อมโยงส่วนภูมิภาคที่เชื่อถือได้
              </p>

              {/* Grid of Regions details */}
              <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-6 text-xs text-slate-300">
                <div>
                  <h4 className="font-bold text-white mb-2 text-sm flex items-center space-x-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#FF6B35]"></span>
                    <span>ภาคกลางและปริมณฑล</span>
                  </h4>
                  <ul className="space-y-1.5 list-disc pl-4">
                    <li>กรุงเทพมหานคร และนนทบุรี</li>
                    <li>สมุทรปราการ และปทุมธานี</li>
                    <li>พระนครศรีอยุธยา และสิงห์บุรี</li>
                    <li>นครปฐม และสมุทรสาคร</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-white mb-2 text-sm flex items-center space-x-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#FF6B35]"></span>
                    <span>ภาคตะวันออก & ใต้ตอนบน</span>
                  </h4>
                  <ul className="space-y-1.5 list-disc pl-4">
                    <li>ชลบุรี และพัทยา (นิคมหลัก)</li>
                    <li>ระยอง และแก่งคอย</li>
                    <li>ฉะเชิงเทรา และปราจีนบุรี</li>
                    <li>เพชรบุรี และหัวหิน (ทราฟฟิกเชื่อม)</li>
                  </ul>
                </div>
              </div>

              <div className="bg-[#05111C] rounded-lg p-4 border border-slate-800 text-xs text-slate-400 mt-4 leading-relaxed">
                📢 <span className="text-white font-bold">ปลายทางไม่อยู่ในรายการด้านบน?</span> ท่านสามารถกรอกข้อมูลขอรายละเอียดหรือสอบถามเจ้าหน้าที่เพื่อวางเส้นทางนำส่งกับพันธมิตรเครือข่ายเพิ่มเติมได้ทันที ตลอดวัน
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 10. INDUSTRIES WE SERVE */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-32">
        <div className="text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-[#FF6B35]">Partnering Profiles</span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#0A1F33] md:text-5xl">
            อุตสาหกรรมที่เราให้บริการ
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-[#6B7280]">
            ความรู้และความเข้าใจเฉพาะอุตสาหกรรมเพื่อยกระดับการจัดการขนสินค้าที่เปี่ยมประสิทธิภาพสูงสุด
          </p>
        </div>

        {/* 5 columns layout in grid */}
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          
          {/* Card 1 */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 text-center flex flex-col justify-between items-center transition-all hover:border-[#FF6B35]/40 hover:shadow-md">
            <span className="text-4xl mb-3 p-3 rounded-full bg-slate-50">🏭</span>
            <div>
              <h3 className="font-bold text-[#0A1F33] text-sm">ผู้ผลิตอุตสาหกรรม</h3>
              <p className="text-[11px] text-[#6B7280] mt-2 leading-relaxed">ส่งชิ้นส่วน วัตถุดิบข้ามโรงงานด้วยพาเลทระบบติดตามและรายงานแม่นยำ</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 text-center flex flex-col justify-between items-center transition-all hover:border-[#FF6B35]/40 hover:shadow-md">
            <span className="text-4xl mb-3 p-3 rounded-full bg-slate-50">🍹</span>
            <div>
              <h3 className="font-bold text-[#0A1F33] text-sm">อาหารและเครื่องดี่ม</h3>
              <p className="text-[11px] text-[#6B7280] mt-2 leading-relaxed">ควบคุมอุณหภูมินิ่งตลอดทางด้วยรถห้องเย็นมาตรฐาน ISO</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 text-center flex flex-col justify-between items-center transition-all hover:border-[#FF6B35]/40 hover:shadow-md">
            <span className="text-4xl mb-3 p-3 rounded-full bg-slate-50">🛍️</span>
            <div>
              <h3 className="font-bold text-[#0A1F33] text-sm">อีคอมเมิร์ซ / ค้าปลีก</h3>
              <p className="text-[11px] text-[#6B7280] mt-2 leading-relaxed">กระจายสินค้าจัดส่ง Same-day จากคลังไปยังหน้าค้าปลีกหรือผู้บริโภค</p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 text-center flex flex-col justify-between items-center transition-all hover:border-[#FF6B35]/40 hover:shadow-md">
            <span className="text-4xl mb-3 p-3 rounded-full bg-slate-50">🧱</span>
            <div>
              <h3 className="font-bold text-[#0A1F33] text-sm">วัสดุก่อสร้าง</h3>
              <p className="text-[11px] text-[#6B7280] mt-2 leading-relaxed">ระบบขนส่งแบบคุ้มค่าด้วยน้ำหนักมากถึง 6 ตัน ปลอดภัย</p>
            </div>
          </div>

          {/* Card 5 */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 text-center flex flex-col justify-between items-center transition-all hover:border-[#FF6B35]/40 hover:shadow-md">
            <span className="text-4xl mb-3 p-3 rounded-full bg-slate-50">💊</span>
            <div>
              <h3 className="font-bold text-[#0A1F33] text-sm">เวชภัณฑ์และเคมี</h3>
              <p className="text-[11px] text-[#6B7280] mt-2 leading-relaxed">บันทึกประวัติรายงานความเย็นตลอดรันเพื่อความน่าเชื่อถือสูง</p>
            </div>
          </div>

        </div>
      </section>

      {/* 11. TESTIMONIALS */}
      <section id="testimonials" className="bg-slate-50 py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          
          <div className="text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-[#FF6B35]">Client Feedback</span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#0A1F33] md:text-5xl">
              ลูกค้าที่ไว้วางใจเรา
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-[#6B7280]">
              ฟังเสียงความรู้สึกและประสบการณ์ที่มีค่ายิ่งจากคู่ค้าธุรกิจจริงของเราทั่วประเทศไทย
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            
            {/* Testimonial 1 */}
            <div className="rounded-2xl border border-slate-200/60 bg-white p-8 shadow-sm transition-all hover:shadow-md">
              <span className="block text-5xl font-serif text-[#FF6B35] leading-none select-none">“</span>
              <p className="text-sm text-[#0A1F33] leading-relaxed mt-2 italic">
                "ใช้ Packd ส่งวัตถุดิบจากโรงงานสมุทรสาครไปคลังโคราชมา 2 ปีแล้ว สิ่งที่ชอบที่สุดคือ Dashboard ที่เห็นต้นทุนต่อเที่ยวชัดเจน ช่วยให้เราวางแผน Logistics Cost ได้แม่นขึ้นมาก"
              </p>
              <div className="mt-6 flex items-center space-x-3 border-t border-slate-100 pt-4">
                <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-[#0A1F33]">WN</div>
                <div>
                  <h4 className="text-xs font-bold text-[#0A1F33]">คุณวรรณา</h4>
                  <p className="text-[11px] text-[#6B7280]">ผู้จัดการ Supply Chain • ชิ้นส่วนยานยนต์</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="rounded-2xl border border-slate-200/60 bg-white p-8 shadow-sm transition-all hover:shadow-md">
              <span className="block text-5xl font-serif text-[#FF6B35] leading-none select-none">“</span>
              <p className="text-sm text-[#0A1F33] leading-relaxed mt-2 italic">
                "เราเป็นแบรนด์อีคอมเมิร์ซขายของสด ต้องการ Cold Chain ที่ไว้ใจได้ Packd ส่งรายงานอุณหภูมิทุกเที่ยว ลูกค้าปลายทางสบายใจ เราก็สบายใจ"
              </p>
              <div className="mt-6 flex items-center space-x-3 border-t border-slate-100 pt-4">
                <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-[#0A1F33]">PT</div>
                <div>
                  <h4 className="text-xs font-bold text-[#0A1F33]">คุณภัทร</h4>
                  <p className="text-[11px] text-[#6B7280]">เจ้าของแบรนด์ • อาหารพร้อมทาน</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="rounded-2xl border border-slate-200/60 bg-white p-8 shadow-sm transition-all hover:shadow-md">
              <span className="block text-5xl font-serif text-[#FF6B35] leading-none select-none">“</span>
              <p className="text-sm text-[#0A1F33] leading-relaxed mt-2 italic">
                "ตอบใบเสนอราคาเร็ว ราคาโปร่งใส ไม่มีค่าใช้จ่ายแอบแฝง เป็นพาร์ทเนอร์ขนส่งที่เราใช้มาตลอด"
              </p>
              <div className="mt-6 flex items-center space-x-3 border-t border-slate-100 pt-4">
                <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-[#0A1F33]">NP</div>
                <div>
                  <h4 className="text-xs font-bold text-[#0A1F33]">คุณนภา</h4>
                  <p className="text-[11px] text-[#6B7280]">ฝ่ายจัดซื้อ • ผู้นำเข้าเครื่องดื่ม</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 12. FAQ (Accordion) */}
      <section id="faq" className="mx-auto max-w-4xl px-4 py-20 md:py-32">
        
        <div className="text-center mb-16">
          <span className="text-sm font-bold uppercase tracking-widest text-[#FF6B35]">FAQ Support</span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#0A1F33] md:text-5xl">
            คำถามที่พบบ่อย
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-[#6B7280]">
            เคลียร์ทุกความสงสัยรวดเร็ว ข้อมูลโปร่งใส เข้าใจง่ายสำหรับทุกการจัดส่งองค์กร
          </p>
        </div>

        {/* 8 Accordion items */}
        <div className="space-y-4">
          
          {/* FAQ 1 */}
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <button 
              onClick={() => setActiveFAQIndex(activeFAQIndex === 0 ? null : 0)}
              className="flex w-full items-center justify-between p-5 text-left text-base font-bold text-[#0A1F33] hover:bg-slate-50"
            >
              <span>1. รับขนส่งสินค้าขั้นต่ำเท่าไหร่?</span>
              <ChevronDown className={`h-5 w-5 text-[#6B7280] transition-transform duration-300 ${activeFAQIndex === 0 ? "rotate-180" : ""}`} />
            </button>
            {activeFAQIndex === 0 && (
              <div className="border-t border-slate-100 p-5 bg-slate-50 text-sm text-[#6B7280] leading-relaxed">
                ขั้นต่ำตามประเภทรถ — รถกระบะรับตั้งแต่ 1 กิโลกรัม ขึ้นไป ส่วนรถ 6 ล้อแนะนำที่น้ำหนักบรรทุก 1,000 กิโลกรัม ขึ้นไปเพื่อความคุ้มค่าสูงสุดของต้นทุนเฉลี่ย
              </div>
            )}
          </div>

          {/* FAQ 2 */}
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <button 
              onClick={() => setActiveFAQIndex(activeFAQIndex === 1 ? null : 1)}
              className="flex w-full items-center justify-between p-5 text-left text-base font-bold text-[#0A1F33] hover:bg-slate-50"
            >
              <span>2. คิดราคาอย่างไร?</span>
              <ChevronDown className={`h-5 w-5 text-[#6B7280] transition-transform duration-300 ${activeFAQIndex === 1 ? "rotate-180" : ""}`} />
            </button>
            {activeFAQIndex === 1 && (
              <div className="border-t border-slate-100 p-5 bg-slate-50 text-sm text-[#6B7280] leading-relaxed">
                ราคาประเมินและคำนวณอย่างตรงไปตรงมาจากระยะทางวิ่งจริง (กม.) + น้ำหนัก/ปริมาตรรวมสาระสำคัญของสินค้า + ประเภทความต้องการการจัดส่ง เราจะแจกแจงโครงสร้างต้นทุนนี้อย่างชัดเจนในรูปใบเสนอราคา
              </div>
            )}
          </div>

          {/* FAQ 3 */}
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <button 
              onClick={() => setActiveFAQIndex(activeFAQIndex === 2 ? null : 2)}
              className="flex w-full items-center justify-between p-5 text-left text-base font-bold text-[#0A1F33] hover:bg-slate-50"
            >
              <span>3. หากสินค้าเสียหายระหว่างการขนส่งจะเป็นอย่างไร?</span>
              <ChevronDown className={`h-5 w-5 text-[#6B7280] transition-transform duration-300 ${activeFAQIndex === 2 ? "rotate-180" : ""}`} />
            </button>
            {activeFAQIndex === 2 && (
              <div className="border-t border-slate-100 p-5 bg-slate-50 text-sm text-[#6B7280] leading-relaxed">
                ทางเรามีประกันภัยขนส่งคุ้มครองความเสียหายสูงสุดถึง 500,000 บาทต่อเที่ยวขนส่ง ตามขอบเขตราคามูลค่าสินค้านำส่งทีแจ้งระบุอย่างเป็นลายลักษณ์อักษรในใบรับสินค้าและจัดส่ง โดยสามารถประสานแจ้งเคลมได้ภายใน 7 วันทำการ
              </div>
            )}
          </div>

          {/* FAQ 4 */}
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <button 
              onClick={() => setActiveFAQIndex(activeFAQIndex === 3 ? null : 3)}
              className="flex w-full items-center justify-between p-5 text-left text-base font-bold text-[#0A1F33] hover:bg-slate-50"
            >
              <span>4. รับจัดส่งงานด่วนทันทีภายในวัน (Same-Day) ได้ไหม?</span>
              <ChevronDown className={`h-5 w-5 text-[#6B7280] transition-transform duration-300 ${activeFAQIndex === 3 ? "rotate-180" : ""}`} />
            </button>
            {activeFAQIndex === 3 && (
              <div className="border-t border-slate-100 p-5 bg-slate-50 text-sm text-[#6B7280] leading-relaxed">
                สามารถเรียกใช้งานด่วน Same-Day ได้ผ่านบริการประเภท Express Delivery โดยแนะนำให้ทำการจองยืนยันระบบและส่งพิกัดรายละเอียดรับสินค้าก่อนช่วงเวลา 10:00 น. สำหรับการเดินทางจัดส่งไปปลายทางในเขตพื้นที่กรุงเทพฯ และปริมณฑลรอบกทม.
              </div>
            )}
          </div>

          {/* FAQ 5 */}
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <button 
              onClick={() => setActiveFAQIndex(activeFAQIndex === 4 ? null : 4)}
              className="flex w-full items-center justify-between p-5 text-left text-base font-bold text-[#0A1F33] hover:bg-slate-50"
            >
              <span>5. หากใช้ Cold Chain มีประวัติและรายงานควบคุมอุณหภูมิส่งมอบให้ด้วยไหม?</span>
              <ChevronDown className={`h-5 w-5 text-[#6B7280] transition-transform duration-300 ${activeFAQIndex === 4 ? "rotate-180" : ""}`} />
            </button>
            {activeFAQIndex === 4 && (
              <div className="border-t border-slate-100 p-5 bg-slate-50 text-sm text-[#6B7280] leading-relaxed">
                มีให้แน่นอนอย่างโปร่งใส ทุกเที่ยววิ่งของรถห้องเย็นควบคุมอุณหภูมิจะมีระบบเซนเซอร์คอยวัดและเก็บสถิติลง Cloud ตลอดเวลา ซึ่งระบบจะบันทึกรวบรวมทำรายงาน Temperature Log ประมวลเอกสารจัดทำไฟล์ประยุกต์ PDF นำส่งทางช่องคอมมูนิตี้ให้ทันทีที่มีการส่งสิ้นสุดลง
              </div>
            )}
          </div>

          {/* FAQ 6 */}
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <button 
              onClick={() => setActiveFAQIndex(activeFAQIndex === 5 ? null : 5)}
              className="flex w-full items-center justify-between p-5 text-left text-base font-bold text-[#0A1F33] hover:bg-slate-50"
            >
              <span>6. หากตกลงเป็นคู่ค้าลูกค้าองค์กรจำเป็นต้องผูกมัดด้วยสัญญาด้วยหรือไม่?</span>
              <ChevronDown className={`h-5 w-5 text-[#6B7280] transition-transform duration-300 ${activeFAQIndex === 5 ? "rotate-180" : ""}`} />
            </button>
            {activeFAQIndex === 5 && (
              <div className="border-t border-slate-100 p-5 bg-slate-50 text-sm text-[#6B7280] leading-relaxed">
                ทางเราไม่ได้บังคับผูกมัดล่วงหน้าตั้งแต่ทำงานครั้งแรก ทว่าแต่อย่างไรก็ตาม สำหรับสมาชิกที่มีสถิติการใช้งานขนส่งร่วมกันสะสมตั้งแต่ 20+ เที่ยวเป็นต้นไปต่อหนึ่งเดือน มีบริการจัดเตรียมสัญญา Service Agreement ข้อตกลงระดับบริการ และเปิดสิทธิ์การวิเคราะห์ข้อมูลเชิงลึก (Dashboard สรุป) พ่วงเครดิตเทอมชำระงวด 15-30 วันให้อย่างเต็มที่โดยไม่ต้องมีค่าใช้จ่ายเสริม
              </div>
            )}
          </div>

          {/* FAQ 7 */}
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <button 
              onClick={() => setActiveFAQIndex(activeFAQIndex === 6 ? null : 6)}
              className="flex w-full items-center justify-between p-5 text-left text-base font-bold text-[#0A1F33] hover:bg-slate-50"
            >
              <span>7. รับขนส่งสินค้าหรือสารอันตรายประเภทสารเคมีพิเศษหรือไม่?</span>
              <ChevronDown className={`h-5 w-5 text-[#6B7280] transition-transform duration-300 ${activeFAQIndex === 6 ? "rotate-180" : ""}`} />
            </button>
            {activeFAQIndex === 6 && (
              <div className="border-t border-slate-100 p-5 bg-slate-50 text-sm text-[#6B7280] leading-relaxed">
                เพื่อมาตรฐานความปลอดภัยสูงสุดและความรับผิดชอบเฉียบขาด ทางบริษัทของดเว้นการรับขนส่งสินค้าจำพวกระเบิดพลีชีพในคลาส 1 (Class 1) วัตถุกัมมันตรังสีคลาส 7 (Class 7) และสารอันตราเคมีที่ต้องควบคุมพิเศษโดยจำเป็นต้องแสดงใบประกาศและใบอนุญาตพ่วงเป็นรายเฉพาะของหน่วยยานพาหนะตามกฎหมาย
              </div>
            )}
          </div>

          {/* FAQ 8 */}
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <button 
              onClick={() => setActiveFAQIndex(activeFAQIndex === 7 ? null : 7)}
              className="flex w-full items-center justify-between p-5 text-left text-base font-bold text-[#0A1F33] hover:bg-slate-50"
            >
              <span>8. รูปแบบการจัดชำระเงินสามารถทำช่องทางใดได้บ้าง?</span>
              <ChevronDown className={`h-5 w-5 text-[#6B7280] transition-transform duration-300 ${activeFAQIndex === 7 ? "rotate-180" : ""}`} />
            </button>
            {activeFAQIndex === 7 && (
              <div className="border-t border-slate-100 p-5 bg-slate-50 text-sm text-[#6B7280] leading-relaxed">
                ท่านสามารถดำเนินการเลือกแอร์พอร์ตโอนชำระโดยตรงผ่านบัญชีสรุปทางการของธนาคาร, ชำระผ่าน QR Code PromptPay, และสำหรับกลุ่มลีดลูกค้าที่พ่วงสัญญาระดับคู่ค้าองค์กรอย่างเป็นทางการ สามารถเพลิดเพลินกับสิทธิ์เครดิตเทอมล่วงหน้ารายรอบ 15 ถึง 30 วันได้ทันที
              </div>
            )}
          </div>

        </div>
      </section>

      {/* 13. FINAL CTA SECTION */}
      <section className="bg-[#0A1F33] text-white py-20 relative overflow-hidden">
        {/* Abstract shape */}
        <div className="absolute top-[-20%] left-[-10%] h-96 w-96 rounded-full bg-[#FF6B35]/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] h-96 w-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"></div>

        <div className="mx-auto max-w-5xl px-4 text-center relative z-10 md:px-8">
          <span className="text-sm font-bold uppercase tracking-widest text-[#FF6B35]">Ready to optimize?</span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white md:text-5xl">
            พร้อมยกระดับการขนส่งของธุรกิจคุณ?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-300 md:text-lg">
            เริ่มต้นวันนี้ — ยินดีตอบข้อสงสัย สรุปราคา แนะนำโครงสร้างเส้นทางที่ดีที่สุดให้กับคุณอย่างใสสะอาด ไร้กังวล ทีมตอบกลับภายใน 30 นาที!
          </p>

          <div className="mt-10 flex flex-col justify-center items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <button 
              id="cta-bottom"
              onClick={() => setIsQuoteModalOpen(true)}
              className="w-full sm:w-auto rounded-lg bg-[#FF6B35] px-8 py-4 text-base font-bold text-white shadow-lg transition-transform hover:scale-[1.01] hover:bg-[#E55A2B]"
            >
              ขอใบเสนอราคาฟรีด่วน
            </button>
            <a 
              href="https://line.me/ti/p/~@packdlogistics"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto flex items-center justify-center space-x-2 rounded-lg border border-slate-700 bg-[#1A3A56]/60 px-8 py-4 text-base font-bold text-white backdrop-blur-sm transition-all hover:bg-[#1A3A56]"
            >
              <MessageCircle className="h-5 w-5 text-[#06C755]" />
              <span>แชท LINE: @packdlogistics</span>
            </a>
            <a 
              href="tel:0812345678"
              className="w-full sm:w-auto flex items-center justify-center space-x-2 rounded-lg border border-slate-700 bg-transparent px-8 py-4 text-base font-bold text-slate-200 transition-all hover:bg-slate-800"
            >
              <Phone className="h-5 w-5" />
              <span>โทร: 081-234-5678</span>
            </a>
          </div>
        </div>
      </section>

      {/* 14. FOOTER */}
      <footer className="border-t border-[#E5E7EB] bg-white pt-16 pb-8 text-xs text-[#6B7280]">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-4 md:gap-8">
            
            {/* Col 1: Brand details */}
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-1.5 text-xl font-bold text-[#0A1F33]">
                <span>Packd</span>
                <span className="h-2 w-2 rounded-full bg-[#FF6B35]"></span>
              </div>
              <p className="text-xs leading-relaxed text-[#6B7280]">
                "ขนส่งแม่นยำ ต้นทุนโปร่งใส ขับเคลื่อนด้วยข้อมูล"<br />
                ผู้ให้บริการระบบเทคโนโลยีโลจิสติกส์บนรถบรรทุก B2B ชั้นนำ ครอบคลุมความปลอดภัยและการตรวจทานเรียลไทม์ ตลอดเส้นทาง
              </p>
              <div className="flex items-center space-x-3.5 pt-2 text-[#0A1F33]">
                <a href="#facebook" className="hover:text-[#FF6B35]">Facebook</a>
                <span className="text-slate-300">|</span>
                <a href="https://line.me/ti/p/~@packdlogistics" target="_blank" rel="noreferrer" className="hover:text-[#FF6B35]">LINE ID</a>
              </div>
            </div>

            {/* Col 2: Services links */}
            <div className="flex flex-col space-y-3.5">
              <h4 className="text-sm font-bold text-[#0A1F33]">บริการของเรา</h4>
              <ul className="space-y-2">
                <li><button onClick={() => scrollToSection("services")} className="hover:text-[#FF6B35] text-left">Standard Delivery (แบบทั่วไป)</button></li>
                <li><button onClick={() => scrollToSection("services")} className="hover:text-[#FF6B35] text-left">Express Delivery (ด่วน Same-Day)</button></li>
                <li><button onClick={() => scrollToSection("services")} className="hover:text-[#FF6B35] text-left">Cold Chain Delivery (ควบคุมความเย็น)</button></li>
                <li><button onClick={() => scrollToSection("coverage")} className="hover:text-[#FF6B35] text-left">ขนส่งข้ามจังหวัด / ภาคอีสาน</button></li>
              </ul>
            </div>

            {/* Col 3: Company details */}
            <div className="flex flex-col space-y-3.5">
              <h4 className="text-sm font-bold text-[#0A1F33]">บริษัท แพ็คดี จำกัด</h4>
              <ul className="space-y-2">
                <li><a href="#about" className="hover:text-[#FF6B35]">เกี่ยวกับเรา</a></li>
                <li><a href="#careers" className="hover:text-[#FF6B35]">ร่วมงานกับเรา (Careers)</a></li>
                <li><a href="#news" className="hover:text-[#FF6B35]">ข่าวสารและบทความ</a></li>
                <li><button onClick={() => scrollToSection("faq")} className="hover:text-[#FF6B35]">ช่วยเหลือการใช้งาน / ถาม-ตอบ</button></li>
              </ul>
            </div>

            {/* Col 4: Address/Contact points */}
            <div className="flex flex-col space-y-3.5">
              <h4 className="text-sm font-bold text-[#0A1F33]">ติดต่อพนักงาน</h4>
              <p className="leading-relaxed">
                📍 เลขที่ 88/12 ถนนเทพารักษ์ ตำบลบางปลา อำเภอบางพลี จังหวัดสมุทรปราการ 10540
              </p>
              <p className="mt-1">
                📞 <span className="font-semibold text-[#0A1F33]">081-234-5678</span> (ฝ่ายบริการลูกค้า)<br />
                ✉️ <span className="font-semibold text-[#0A1F33]">contact@packd.co.th</span>
              </p>
            </div>

          </div>

          <div className="mt-16 flex flex-col justify-between items-center border-t border-slate-100 pt-8 gap-y-4 md:flex-row text-[11px]">
            <p>© 2026 บริษัท แพ็คดี จำกัด (Packd Co., Ltd.) • สงวนลิขสิทธิ์ความปลอดภัยเทคโนโลยี</p>
            <div className="flex space-x-6 text-[#6B7280]">
              <a href="#privacy" className="hover:text-[#0A1F33]">นโยบายความเป็นส่วนตัว (Privacy Policy)</a>
              <a href="#terms" className="hover:text-[#0A1F33]">ข้อกำหนดการใช้งาน (Terms of Service)</a>
            </div>
          </div>
        </div>
      </footer>

      {/* --- EXTRA: HIGH-FIDELITY LIVE ESTIMATOR MODAL FOR CUSTOM QUOTES --- */}
      {isQuoteModalOpen && (
        <div id="quote-modal-backdrop" className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
              <div className="flex items-center space-x-2">
                <Calculator className="h-5 w-5 text-[#FF6B35]" />
                <h3 className="text-lg font-bold text-[#0A1F33]">ขอใบเสนอราคาด่วน & ประเมินอัจฉริยะ (30 วินาที)</h3>
              </div>
              <button 
                id="close-modal-btn"
                onClick={() => {
                  setIsQuoteModalOpen(false);
                  setFormSubmitted(false);
                }} 
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Inner Content */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              
              {!formSubmitted ? (
                <form id="quote-lead-form" onSubmit={submitQuoteRequest} className="space-y-5">
                  
                  {/* Dynamic interactive estimator bar */}
                  <div className="rounded-xl bg-orange-50/50 p-4 border border-orange-100 space-y-4">
                    <h4 className="text-xs font-bold text-[#FF6B35] uppercase tracking-wider">เครื่องประเมินราคาเรียลไทม์</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Distance choice */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">ระยะทางขนส่ง (กม.)</label>
                        <input 
                          type="range" 
                          min="10" 
                          max="1000" 
                          value={quoteDistance} 
                          onChange={(e) => setQuoteDistance(Number(e.target.value))}
                          className="w-full accent-[#FF6B35]" 
                        />
                        <div className="flex justify-between items-center mt-1 text-xs font-mono font-bold text-[#0A1F33]">
                          <span>10 กม.</span>
                          <span className="bg-[#FF6B35]/10 text-[#FF6B35] px-1.5 rounded">{quoteDistance} กม.</span>
                          <span>1000 กม.</span>
                        </div>
                      </div>

                      {/* Weight Choice */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">น้ำหนักสินค้ากิโลกรัม (กก.)</label>
                        <input 
                          type="range" 
                          min="10" 
                          max="6000" 
                          value={quoteWeight} 
                          onChange={(e) => setQuoteWeight(Number(e.target.value))}
                          className="w-full accent-[#FF6B35]" 
                        />
                        <div className="flex justify-between items-center mt-1 text-xs font-mono font-bold text-[#0A1F33]">
                          <span>10 กก.</span>
                          <span className="bg-[#FF6B35]/10 text-[#FF6B35] px-1.5 rounded">{quoteWeight} กก.</span>
                          <span>6000 กก.</span>
                        </div>
                      </div>

                      {/* Service Choice */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">ประเภทริการขนส่ง</label>
                        <select 
                          value={quoteService} 
                          onChange={(e) => setQuoteService(e.target.value)}
                          className="w-full rounded border border-slate-200 bg-white p-1 pb-1.5 text-xs font-bold text-[#0A1F33]"
                        >
                          <option value="standard">Standard (ทั่วไป)</option>
                          <option value="express">Express (ด่วนภายในวัน)</option>
                          <option value="coldchain">Cold Chain (คุมอุณหภูมิ)</option>
                        </select>
                      </div>
                    </div>

                    <div className="border-t border-orange-100/60 pt-3 flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-500">ประมาณการขั้นบันไดเบื้องต้น:</span>
                      <span className="font-mono text-xl font-black text-[#FF6B35]">
                        ฿{estimatedPrice.toLocaleString()}{" "}
                        <span className="text-[10px] font-normal text-slate-400">บาท (ไม่รวม VAT)</span>
                      </span>
                    </div>
                  </div>

                  {/* Standard Lead Collector Fields */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">ข้อมูลผู้ติดต่อองค์กร / SME</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">ชื่อ-นามสกุล ของท่าน *</label>
                        <input 
                          type="text" 
                          required
                          placeholder="เช่น คุณสมศักดิ์ รักดี"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full rounded-lg border border-slate-200 p-2.5 text-sm focus:border-[#FF6B35] focus:outline-none" 
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">เบอร์โทรศัพท์ติดต่อกลับ *</label>
                        <input 
                          type="tel" 
                          required
                          placeholder="เช่น 081-123-4567"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full rounded-lg border border-slate-200 p-2.5 text-sm focus:border-[#FF6B35] focus:outline-none" 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">ชื่อสถานประกอบการ / บริษัท</label>
                        <input 
                          type="text"
                          placeholder="เช่น บริษัท ยานยนต์ จำกัด"
                          value={formData.company}
                          onChange={(e) => setFormData({...formData, company: e.target.value})}
                          className="w-full rounded-lg border border-slate-200 p-2.5 text-sm focus:border-[#FF6B35] focus:outline-none" 
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">จังหวัดต้นทาง</label>
                        <input 
                          type="text"
                          value={formData.origin}
                          onChange={(e) => setFormData({...formData, origin: e.target.value})}
                          className="w-full rounded-lg border border-slate-200 p-2.5 text-sm focus:border-[#FF6B35] focus:outline-none" 
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">จังหวัดปลายทาง</label>
                        <input 
                          type="text"
                          value={formData.destination}
                          onChange={(e) => setFormData({...formData, destination: e.target.value})}
                          className="w-full rounded-lg border border-slate-200 p-2.5 text-sm focus:border-[#FF6B35] focus:outline-none" 
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="terms" 
                        checked={formData.acceptedTerms}
                        onChange={(e) => setFormData({...formData, acceptedTerms: e.target.checked})}
                        className="rounded text-[#FF6B35] focus:ring-[#FF6B35]" 
                      />
                      <label htmlFor="terms" className="text-xs text-slate-400">ยินยอมให้เจ้าหน้าที่ Packd โทรประสานประเมินและแนะนำรายละเอียดเส้นทางเร่งด่วน</label>
                    </div>

                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-100">
                    <button 
                      type="button"
                      onClick={() => setIsQuoteModalOpen(false)}
                      className="px-6 py-2.5 text-sm font-semibold text-slate-500 hover:text-[#0A1F33]"
                    >
                      ยกเลิก
                    </button>
                    <button 
                      type="submit"
                      className="rounded-lg bg-[#FF6B35] px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#E55A2B]"
                    >
                      ส่งข้อมูลคำขอทันที →
                    </button>
                  </div>

                </form>
              ) : (
                <div id="submit-success-indicator" className="text-center py-12 flex flex-col items-center space-y-4">
                  <div className="h-16 w-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center p-4">
                    <CheckCircle className="h-10 w-10 animate-bounce" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0A1F33]">บันทึกข้อมูลสำเร็จเรียบร้อยแล้ว!</h3>
                  <p className="max-w-md text-sm text-[#6B7280]">
                    ขอบพระคุณอย่างยิ่งที่คุณเลือกความใส่ใจของ <span className="font-bold text-[#0A1F33]">Packd</span> เจ้าหน้าที่ด้านโลจิสติกส์กำลังตรวจสอบเส้นทางและจะรีบจัดโทรนำเสนอราคากลับหาท่านภายใน <span className="font-bold text-[#FF6B35]">30 นาที</span>
                  </p>
                  <p className="text-xs text-slate-400">กำลังสลายหรือปิดกล่องอัตโนมัติ...</p>
                </div>
              )}

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
