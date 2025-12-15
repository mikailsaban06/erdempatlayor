import React from 'react';
import { Cpu, Fan, Box, Monitor, Disc, Zap } from 'lucide-react';

const FloatingPart = ({ 
  icon: Icon, 
  className, 
  delay = 0, 
  duration = 10,
  color = "text-indigo-500",
  size = 64
}: any) => (
  <div 
    className={`absolute hidden md:flex items-center justify-center p-6 rounded-3xl bg-zinc-900/30 backdrop-blur-sm border border-white/5 shadow-2xl ${className}`}
    style={{
      animation: `float ${duration}s ease-in-out infinite`,
      animationDelay: `${delay}s`,
    }}
  >
    <Icon size={size} className={color} strokeWidth={1.5} />
    {/* Glow effect behind icon */}
    <div className={`absolute inset-0 opacity-20 blur-xl ${color.replace('text-', 'bg-')}`}></div>
  </div>
);

const HeroBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#07070A] -z-10 select-none">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(3deg); }
        }
      `}</style>
      
      {/* 1. Dotted Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: 'radial-gradient(circle, #52525b 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)'
        }}
      />

      {/* 2. Center Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '6s' }}></div>
      <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[100px]"></div>

      {/* 3. Floating Parts (Specific Positioning) */}
      
      {/* Top Left - Motherboard */}
      <FloatingPart 
        icon={Cpu} 
        className="top-[15%] left-[8%] rotate-[-6deg]" 
        delay={0} 
        duration={14} 
        color="text-emerald-500"
        size={56}
      />

      {/* Top Right - GPU */}
      <FloatingPart 
        icon={Monitor} 
        className="top-[20%] right-[8%] rotate-[12deg]" 
        delay={2} 
        duration={16} 
        color="text-indigo-400"
        size={64}
      />

      {/* Bottom Right - Fan */}
      <FloatingPart 
        icon={Fan} 
        className="bottom-[25%] right-[15%] rotate-[-12deg]" 
        delay={1} 
        duration={12} 
        color="text-cyan-500"
        size={48}
      />

      {/* Bottom Left - Case */}
      <FloatingPart 
        icon={Box} 
        className="bottom-[20%] left-[12%] rotate-[6deg]" 
        delay={3} 
        duration={15} 
        color="text-purple-500"
        size={72}
      />
      
      {/* Extra subtle background elements */}
      <div className="absolute top-[10%] left-[30%] opacity-20 animate-pulse duration-1000">
         <Zap size={24} className="text-zinc-700" />
      </div>
      <div className="absolute bottom-[30%] right-[40%] opacity-20 animate-pulse duration-[3000ms]">
         <Disc size={20} className="text-zinc-700" />
      </div>

    </div>
  );
};

export default HeroBackground;