/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Gamepad2, 
  Terminal, 
  ChevronRight, 
  Monitor, 
  Cpu, 
  Globe, 
  ShieldCheck, 
  Heart, 
  Zap, 
  BookOpen, 
  Leaf, 
  Lock, 
  Menu, 
  X, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Send,
  MessageSquare,
  MapPin,
  Trophy,
  Coffee,
  Users
} from 'lucide-react';

// --- TYPES & CONSTANTS ---
const TARGET_DATE = new Date('March 20, 2026 09:00:00').getTime();

const timelineData = [
  { num: "01 /", date: "FEB 2026", title: "Registrations Open", desc: "Applications go live on Devfolio. Team of 2–3." },
  { num: "02 /", date: "MAR 1, 2026", title: "Application Deadline", desc: "Last chance to submit your application." },
  { num: "03 /", date: "MAR 8, 2026", title: "Online Prelims", desc: "Coding quiz + MCQs. 1,200+ participants compete." },
  { num: "04 /", date: "MAR 10, 2026", title: "Shortlist Announced", desc: "Top 40 teams notified via email and Discord." },
  { num: "05 /", date: "MAR 14, 2026", title: "Finalist Confirmation", desc: "Confirm your spot. Discord onboarding begins." },
  { num: "06 /", date: "MAR 20, 2026", title: "Hackathon Begins T-0", desc: "36-hour clock starts. SMCC Building. 9:00 AM." },
  { num: "07 /", date: "MAR 21, 2026", title: "Submission Deadline", desc: "Final code push + DevPost submission." },
  { num: "08 /", date: "MAR 21, 2026", title: "Demo Day & Closing", desc: "Presentations, judging, awards ceremony." }
];

const trackData = [
  { id: "01", name: "Web3", accent: "#ff2d9f", icon: Globe, desc: "Build decentralized applications using smart contracts and blockchain." },
  { id: "02", name: "Health", accent: "#ff6b6b", icon: Heart, desc: "Revolutionize healthcare through intelligent medical technology." },
  { id: "03", name: "EdTech", accent: "#00f5ff", icon: BookOpen, desc: "Transform learning with tools that bridge educational gaps." },
  { id: "04", name: "Green Tech", accent: "#39ff14", icon: Leaf, desc: "Develop eco-friendly solutions for a sustainable tomorrow." },
  { id: "05", name: "Cyber Security", accent: "#bf00ff", icon: ShieldCheck, desc: "Tackle modern threats with robust security and privacy solutions." },
  { id: "06", name: "IoT", accent: "#00d9ff", icon: Cpu, desc: "Connect the physical world through smart embedded systems." },
  { id: "07", name: "Open Innovation", accent: "#a855f7", icon: Zap, desc: "No boundaries. Any domain, any stack, any idea. Build what you believe in." }
];

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mapView, setMapView] = useState<'cyber' | 'standard'>('cyber');

  // --- INITIALIZATION ---
  useEffect(() => {
    // Use IntersectionObserver for reveals
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.12 });

    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(el => observer.observe(el));

    // Particles
    const sphere = document.createElement('div');
    sphere.id = 'particle-field';
    document.body.appendChild(sphere);

    for (let i = 0; i < 50; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 2 + 1;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.backgroundColor = Math.random() > 0.5 ? '#bf00ff' : '#00f5ff';
      p.style.left = `${Math.random() * 100}%`;
      p.style.setProperty('--dur', `${8 + Math.random() * 14}s`);
      p.style.setProperty('--delay', `${Math.random() * 10}s`);
      p.style.setProperty('--drift', `${(Math.random() - 0.5) * 80}px`);
      sphere.appendChild(p);
    }

    return () => {
      observer.disconnect();
      const sf = document.getElementById('particle-field');
      if (sf) sf.remove();
    };
  }, [showIntro]);

  // --- SCROLL HANDLING ---
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
      
      const sections = ['hero', 'about', 'timeline', 'tracks', 'prizes', 'map', 'sponsors', 'faq'];
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- INTRO CANVAS & TYPEWRITER ---
  // --- NEURAL RUNNER GAME ---
  const IntroOverlay = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    
    // Game State
    const [gameState, setGameState] = useState<'idle' | 'running' | 'gameOver'>('idle');
    const [isAuto, setIsAuto] = useState(false);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [winMessage, setWinMessage] = useState<string | null>(null);

    // Refs for mutable game values (to avoid state closure issues in requestAnimationFrame)
    const gameValues = useRef({
      player: { y: 0, vy: 0, isJumping: false },
      obstacles: [] as { x: number; w: number; h: number; type: 'single' | 'double' }[],
      trail: [] as { y: number; opacity: number }[],
      particles: [] as { x: number; y: number; size: number; color: string; speed: number }[],
      binaryRain: [] as { x: number; y: number; char: string; speed: number }[],
      score: 0,
      lives: 3,
      frameCount: 0,
      invincibility: 0,
      gameSpeed: 4,
      autoModeTime: 0,
      isAuto: false,
      gameState: 'idle' as 'idle' | 'running' | 'gameOver'
    });

    useEffect(() => {
      // Initialize Background Particles & Binary Rain
      const pCount = 30;
      gameValues.current.particles = Array.from({ length: pCount }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        color: Math.random() > 0.5 ? '#bf00ff' : '#00f5ff',
        speed: 0.05 + Math.random() * 0.1
      }));

      gameValues.current.binaryRain = Array.from({ length: 30 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        char: Math.random() > 0.5 ? '0' : '1',
        speed: 0.1 + Math.random() * 0.2
      }));
    }, []);

    const jump = () => {
      if (gameValues.current.gameState !== 'running') return;
      if (gameValues.current.player.isJumping) return;
      
      gameValues.current.player.vy = -11;
      gameValues.current.player.isJumping = true;
    };

    const startGame = (auto: boolean) => {
      gameValues.current.gameState = 'running';
      gameValues.current.isAuto = auto;
      gameValues.current.score = 0;
      gameValues.current.lives = 3;
      gameValues.current.obstacles = [];
      gameValues.current.gameSpeed = 4;
      gameValues.current.autoModeTime = 0;
      gameValues.current.player = { y: 0, vy: 0, isJumping: false };
      
      setIsAuto(auto);
      setGameState('running');
      setScore(0);
      setLives(3);
      setWinMessage(null);
    };

    useEffect(() => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let animationFrameId: number;

      const handleResize = () => {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        gameValues.current.player.y = canvas.height - 60;
      };

      window.addEventListener('resize', handleResize);
      handleResize();

      const update = () => {
        const { current: g } = gameValues;
        const groundY = canvas.height - 60;

        if (g.gameState === 'running') {
          // Update Speed
          g.gameSpeed += 0.0005;
          g.score += 1;
          if (g.score % 60 === 0) setScore(g.score);

          // Update Auto Time
          if (g.isAuto) {
            g.autoModeTime += 1/60;
            if (g.autoModeTime >= 15) {
              setWinMessage("NEURAL LINK ESTABLISHED");
              g.gameState = 'idle';
              setTimeout(() => setShowIntro(false), 2000);
            }
          }

          // Player Physics
          g.player.vy += 0.55;
          g.player.y += g.player.vy;

          if (g.player.y > groundY) {
            g.player.y = groundY;
            g.player.vy = 0;
            g.player.isJumping = false;
          }

          // Trail
          g.trail.push({ y: g.player.y, opacity: 0.6 });
          if (g.trail.length > 12) g.trail.shift();

          // Obstacles
          g.frameCount++;
          const spawnRate = Math.max(60, 140 - Math.floor(g.score / 2000) * 10);
          if (g.frameCount % Math.floor(spawnRate) === 0) {
            const isDouble = g.score > 500 && Math.random() < 0.3;
            g.obstacles.push({
              x: canvas.width,
              w: 18 + Math.random() * 10,
              h: 30 + Math.random() * 50,
              type: isDouble ? 'double' : 'single'
            });
          }

          g.obstacles.forEach((obs, idx) => {
            obs.x -= g.gameSpeed;

            // Auto-jump logic
            if (g.isAuto && !g.player.isJumping && obs.x - 120 < 220 && obs.x - 120 > 0) {
              if (obs.type === 'double' && obs.h < 40) {
                // Stay grounded for double gaps if possible, or jump high? 
                // Simple auto-jump for everything for now
                jump();
              } else {
                jump();
              }
            }

            // Collision
            if (g.invincibility === 0) {
              const playerX = 120;
              const playerSize = 14;
              
              const checkCollision = (ox: number, oy: number, ow: number, oh: number) => {
                return (
                  playerX < ox + ow &&
                  playerX + playerSize > ox &&
                  g.player.y - playerSize < oy + oh &&
                  g.player.y > oy
                );
              };

              let collided = false;
              if (obs.type === 'single') {
                collided = checkCollision(obs.x, groundY - obs.h, obs.w, obs.h);
              } else {
                // Double block: one on ground, one hanging? 
                // User spec: "two blocks stacked with a gap you must jump through"
                collided = checkCollision(obs.x, groundY - obs.h - 100, obs.w, obs.h) || 
                           checkCollision(obs.x, groundY - obs.h, obs.w, obs.h);
              }

              if (collided) {
                g.lives--;
                setLives(g.lives);
                g.invincibility = 60;
                if (g.lives <= 0) {
                  g.gameState = 'gameOver';
                  setGameState('gameOver');
                }
              }
            }
          });

          g.obstacles = g.obstacles.filter(obs => obs.x + obs.w > 0);
          if (g.invincibility > 0) g.invincibility--;
        }

        // Background Particles
        g.particles.forEach(p => {
          p.y -= p.speed;
          if (p.y < -10) p.y = 110;
        });

        // Binary Rain
        g.binaryRain.forEach(b => {
          b.y += b.speed;
          if (b.y > 110) b.y = -10;
        });
      };

      const draw = () => {
        const { current: g } = gameValues;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const groundY = canvas.height - 60;

        // Background Lines (Data Highways)
        ctx.setLineDash([4, 8]);
        ctx.strokeStyle = 'rgba(59, 31, 110, 0.3)';
        [0.3, 0.5, 0.7].forEach(ratio => {
          const y = canvas.height * ratio;
          const offset = (g.frameCount * g.gameSpeed * 0.5) % 12;
          ctx.beginPath();
          ctx.moveTo(-offset, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        });
        ctx.setLineDash([]);

        // Binary Rain
        ctx.font = '10px monospace';
        ctx.fillStyle = '#1a0033';
        g.binaryRain.forEach(b => {
          ctx.fillText(b.char, (b.x / 100) * canvas.width, (b.y / 100) * canvas.height);
        });

        // Trail
        g.trail.forEach((pos, i) => {
          const ratio = (i + 1) / g.trail.length;
          ctx.globalAlpha = ratio * 0.6;
          ctx.fillStyle = '#a855f7';
          const size = 4 * ratio;
          ctx.fillRect(120 - (g.trail.length - i) * 2, pos.y - size/2, size, size);
        });
        ctx.globalAlpha = 1;

        // Ground Line
        ctx.strokeStyle = '#3b1f6e';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, groundY);
        ctx.lineTo(canvas.width, groundY);
        ctx.stroke();
        
        ctx.strokeStyle = 'rgba(124, 58, 237, 0.3)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(0, groundY + 2);
        ctx.lineTo(canvas.width, groundY + 2);
        ctx.stroke();

        // Player
        if (g.gameState !== 'idle' && (g.invincibility === 0 || g.frameCount % 10 < 5)) {
          ctx.save();
          ctx.translate(120, g.player.y - 7);
          ctx.rotate(Math.PI / 4);
          ctx.fillStyle = '#a855f7';
          ctx.strokeStyle = '#bf00ff';
          ctx.lineWidth = 2;
          ctx.shadowBlur = 20;
          ctx.shadowColor = '#bf00ff';
          ctx.fillRect(-7, -7, 14, 14);
          ctx.strokeRect(-7, -7, 14, 14);
          ctx.restore();
        }

        // Obstacles
        g.obstacles.forEach(obs => {
          ctx.shadowBlur = 15;
          ctx.shadowColor = '#ff2d9f';
          ctx.fillStyle = '#ff2d9f';
          ctx.strokeStyle = '#ff2d9f';
          
          if (obs.type === 'single') {
            ctx.fillRect(obs.x, groundY - obs.h, obs.w, obs.h);
            ctx.strokeRect(obs.x, groundY - obs.h, obs.w, obs.h);
          } else {
            // Lower block
            ctx.fillRect(obs.x, groundY - obs.h, obs.w, obs.h);
            ctx.strokeRect(obs.x, groundY - obs.h, obs.w, obs.h);
            // Upper block
            ctx.fillRect(obs.x, groundY - obs.h - 100, obs.w, obs.h);
            ctx.strokeRect(obs.x, groundY - obs.h - 100, obs.w, obs.h);
          }
        });
        ctx.shadowBlur = 0;

        // HUD - Score
        ctx.font = '14px "Orbitron", monospace';
        ctx.fillStyle = '#a855f7';
        ctx.textAlign = 'left';
        ctx.fillText(`// PACKETS: ${g.score.toString().padStart(6, '0')}`, 30, 40);

        // HUD - Lives
        ctx.textAlign = 'right';
        ctx.fillText('SYS INTEGRITY:', canvas.width - 90, 40);
        for (let i = 0; i < 3; i++) {
          ctx.save();
          ctx.translate(canvas.width - 60 + i * 15, 35);
          ctx.rotate(Math.PI / 4);
          ctx.fillStyle = i < g.lives ? '#a855f7' : 'rgba(168, 85, 247, 0.2)';
          ctx.fillRect(-4, -4, 8, 8);
          ctx.restore();
        }

        // HUD - Title
        ctx.textAlign = 'center';
        ctx.font = '16px "Orbitron", monospace';
        ctx.fillStyle = '#bf00ff';
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#bf00ff';
        ctx.fillText('NEURAL RUNNER', canvas.width / 2, 40);
        ctx.shadowBlur = 0;

        // Idle / Game Over Screens
        if (g.gameState === 'idle' && !winMessage) {
          ctx.fillStyle = 'rgba(5, 0, 15, 0.6)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.font = '32px "Orbitron"';
          ctx.fillStyle = '#a855f7';
          ctx.textAlign = 'center';
          ctx.fillText('CONNECTING NEURAL OVERLAY...', canvas.width/2, canvas.height/2);
          ctx.font = '14px "JetBrains Mono"';
          ctx.fillText('PRESS [PLAY] OR [AUTO] TO INITIATE', canvas.width/2, canvas.height/2 + 40);
        }

        if (g.gameState === 'gameOver') {
          const glitch = g.frameCount % 12 < 2 ? (Math.random() - 0.5) * 6 : 0;
          ctx.fillStyle = 'rgba(5, 0, 15, 0.7)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          if (glitch !== 0) {
            ctx.fillStyle = '#00f5ff';
            ctx.font = '32px "Orbitron"';
            ctx.fillText('SYSTEM FAILURE', canvas.width/2 + glitch, canvas.height/2);
          }
          ctx.fillStyle = '#ff2d9f';
          ctx.font = '32px "Orbitron"';
          ctx.shadowBlur = 30;
          ctx.shadowColor = '#ff2d9f';
          ctx.fillText('SYSTEM FAILURE', canvas.width/2, canvas.height/2);
          ctx.shadowBlur = 0;

          ctx.font = '18px "Orbitron"';
          ctx.fillStyle = '#a855f7';
          ctx.font = '12px "JetBrains Mono", monospace';
          ctx.fillStyle = 'rgba(107, 79, 158, 0.7)';
          ctx.fillText('> HackIE3 still needs you', canvas.width/2, canvas.height/2+90);
          
          // Restart Box Logic in click handler
        }

        if (winMessage) {
          ctx.fillStyle = 'rgba(5, 0, 15, 0.8)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.font = 'bold 16px "Orbitron", monospace';
          ctx.fillStyle = 'rgba(168, 85, 247, 0.8)';
          ctx.fillText('HackIE3 AWAITS', canvas.width/2, canvas.height/2+60);
          
          // Explosion particles
          for (let i = 0; i < 40; i++) {
             const angle = (i / 40) * Math.PI * 2;
             const dist = (g.frameCount % 90) * 4;
             ctx.fillStyle = i % 2 === 0 ? '#bf00ff' : '#00f5ff';
             ctx.globalAlpha = Math.max(0, 1 - (g.frameCount % 90) / 90);
             ctx.fillRect(canvas.width/2 + Math.cos(angle) * dist, canvas.height/2 + Math.sin(angle) * dist, 3, 3);
          }
          ctx.globalAlpha = 1;
        }

        animationFrameId = requestAnimationFrame(() => {
          update();
          draw();
        });
      };

      const handleInput = (e: KeyboardEvent | MouseEvent | TouchEvent) => {
        if (e instanceof KeyboardEvent) {
          if (e.code === 'Space') {
            e.preventDefault();
            jump();
          }
          if (e.code === 'Escape') {
            setShowIntro(false);
          }
        } else {
          jump();
        }
      };

      window.addEventListener('keydown', handleInput);
      canvas.addEventListener('mousedown', handleInput);
      canvas.addEventListener('touchstart', handleInput);

      animationFrameId = requestAnimationFrame(draw);

      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('keydown', handleInput);
        window.removeEventListener('resize', handleResize);
        canvas.removeEventListener('mousedown', handleInput);
        canvas.removeEventListener('touchstart', handleInput);
      };
    }, []);

    return (
      <div className="fixed inset-0 bg-[#05000f] z-[9000] pointer-events-auto overflow-hidden">
        {/* Floating Particles Background */}
        <div className="absolute inset-0 z-0 opacity-50 pointer-events-none">
          {gameValues.current.particles.map((p, i) => (
            <div 
              key={i} 
              className="absolute"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                backgroundColor: p.color,
                boxShadow: `0 0 10px ${p.color}`
              }}
            />
          ))}
        </div>

        {/* Perspective Grid */}
        <div 
          className="absolute inset-6 border-2 border-[#a855f7] rounded-[10px] z-10 pointer-events-none"
          style={{
            boxShadow: '0 0 15px #bf00ff, 0 0 40px rgba(191,0,255,0.4), 0 0 80px rgba(191,0,255,0.15), inset 0 0 20px rgba(124,58,237,0.05)',
            backgroundImage: 'linear-gradient(rgba(124,58,237,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.12) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />

        {/* SCANLINE OVERLAY */}
        <div className="absolute inset-6 rounded-[10px] pointer-events-none z-30 opacity-20 bg-[repeating-linear-gradient(0deg,transparent_0px,transparent_2px,rgba(0,0,0,0.4)_2px,rgba(0,0,0,0.4)_4px)]" />

        <div className="absolute inset-6 z-20 flex flex-col p-8">
          <div ref={containerRef} className="flex-1 relative">
             <canvas ref={canvasRef} className="w-full h-full cursor-pointer" />
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="flex flex-col items-start">
              <div className="hackie3-logo-boot flex items-baseline">
                <span className="h3-hack font-orbitron font-black text-2xl tracking-wider">HACK</span>
                <span className="h3-ie font-orbitron font-black text-2xl tracking-wider">IE</span>
                <sup className="h3-sup font-orbitron font-black text-sm ml-0.5">3</sup>
              </div>
              <p style={{ fontFamily: '"Black Ops One", cursive', fontSize: '10px', letterSpacing: '0.25em', color: 'rgba(168,85,247,0.5)', textTransform: 'uppercase', marginTop: '4px' }}>
                AN INNOVATION HACKATHON
              </p>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => startGame(false)}
                className="orbitron text-[11px] font-bold tracking-[0.2em] uppercase px-8 py-3 border border-[#a855f7] text-[#e9d5ff] cursor-pointer bg-[#a855f7]/10 hover:bg-[#a855f7] hover:text-white hover:shadow-[0_0_20px_rgba(168,85,247,0.6)] transition-all duration-300"
                style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }}
              >
                {gameState === 'gameOver' ? '[ RETRY ]' : '[ PLAY ]'}
              </button>
              <button 
                onClick={() => startGame(true)}
                className="orbitron text-[11px] font-bold tracking-[0.2em] uppercase px-8 py-3 border border-[#a855f7] text-[#e9d5ff] cursor-pointer bg-[#a855f7]/10 hover:bg-[#a855f7] hover:text-white hover:shadow-[0_0_20px_rgba(168,85,247,0.6)] transition-all duration-300"
                style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }}
              >
                [ AUTO ]
              </button>
              <button 
                onClick={() => setShowIntro(false)}
                className="orbitron text-[11px] font-bold tracking-[0.2em] uppercase px-8 py-3 border border-[#a855f7]/50 text-[#e9d5ff]/70 cursor-pointer bg-transparent hover:bg-[#a855f7]/20 transition-all duration-300"
                style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }}
              >
                [ SKIP ]
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div id="noise-overlay" />
      <AnimatePresence>
        {showIntro && <IntroOverlay />}
      </AnimatePresence>

      {/* Relaunch Button */}
      {!showIntro && (
        <button 
          onClick={() => setShowIntro(true)}
          className="fixed bottom-6 left-6 w-12 h-12 bg-[#a855f7] rounded-full z-[9999] flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.7)] hover:scale-110 active:scale-95 transition-all cursor-pointer border border-white/20"
        >
          <span className="orbitron text-base font-black text-white tracking-tighter">{">_"}</span>
        </button>
      )}      {/* --- PAGE CONTENT --- */}
      <div className={`transition-opacity duration-700 ${showIntro ? 'opacity-0' : 'opacity-100'}`}>
        
        {/* --- GLOBAL BACKGROUND --- */}
        <div id="aurora-field">
          <div className="aurora aurora-1" />
          <div className="aurora aurora-2" />
          <div className="aurora aurora-3" />
          <div className="aurora aurora-4" />
          <div className="aurora aurora-5" />
        </div>
        <NeuralBackground />

        {/* --- NAVIGATION --- */}
        <nav className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 flex items-center justify-between px-6 lg:px-12 py-4 ${isScrolled ? 'scrolled' : 'bg-transparent'}`}>
          <div className="flex items-center">
            <div className="w-10 h-10 mr-4 flex items-center justify-center border border-[rgba(168,85,247,0.4)] bg-[rgba(124,58,237,0.1)] rounded-md backdrop-blur-md">
               <span className="orbitron text-[11px] font-black text-[#a855f7]">IEEE</span>
            </div>
            <div className="nav-divider h-8 w-[1px] bg-[#a855f7]/20 mx-4" />
            <div className="hackie3-logo-nav flex items-center gap-1">
              <span className="h3-hack-sm text-xl">HACK</span>
              <span className="h3-ie-sm text-xl text-[#00f5ff]">IE</span>
              <sup className="h3-sup-sm text-xs">3</sup>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-10">
            {['About', 'Timeline', 'Tracks', 'Prizes', 'Map', 'Sponsors', 'FAQs'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`}
                className={`nav-link orbitron text-[11px] font-bold tracking-[0.2em] transition-all hover:text-[#a855f7] ${activeSection === item.toLowerCase() ? 'text-[#a855f7] active-nav' : 'text-[#6b4f9e]'}`}
              >
                {item}
              </a>
            ))}
            <button 
              className="ml-4 orbitron text-[10px] font-black tracking-[0.2em] px-5 py-2.5 bg-transparent border border-[#a855f7] text-[#a855f7] hover:bg-[#a855f7] hover:text-white hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all duration-300"
              style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }}
            >
              <a href="#register">REGISTER //</a>
            </button>
          </div>

          <button 
            className="lg:hidden text-[#a855f7] p-2 hover:bg-[#a855f7]/10 rounded-lg transition-colors border border-transparent hover:border-[#a855f7]/30" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-0 bg-[#05000f] z-[999] flex flex-col items-center justify-center gap-8 lg:hidden"
            >
              {['About', 'Timeline', 'Tracks', 'Prizes', 'Map', 'Judges', 'Sponsors', 'FAQs'].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase()}`}
                  className="orbitron text-2xl text-[#6b4f9e] hover:text-[#e9d5ff]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <a href="#register" className="nav-register text-base" onClick={() => setMobileMenuOpen(false)}>Register //</a>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- HERO SECTION --- */}
        <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="hero-grid" />
          <div className="hero-bloom" />
          <div className="hero-scanline" />
          
          <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center px-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="hero-eyebrow mb-8 flex items-center gap-4 backdrop-blur-xl bg-white/[0.03] px-8 py-3 rounded-xl border border-white/10 shadow-[0_0_20px_rgba(168,85,247,0.1)]"
            >
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00f5ff] animate-pulse"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#a855f7] animate-pulse [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#ffb700] animate-pulse [animation-delay:0.4s]"></span>
              </div>
              <span className="orbitron font-black tracking-[0.4em] text-[10px] text-white/70 uppercase">IEEE JUSB PRESENTS</span>
              <div className="h-4 w-[1px] bg-white/20 mx-2" />
              <span className="inter font-bold text-[9px] text-[#a855f7] tracking-[0.2em] uppercase">V3.0 // 2026</span>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
              className="hero-title-glitch-wrap relative mb-8"
            >
              {/* Outer Decorative Rings */}
              <div className="absolute -inset-20 border border-white/[0.02] rounded-full animate-[spin_60s_linear_infinite] pointer-events-none" />
              <div className="absolute -inset-32 border border-white/[0.01] rounded-full animate-[spin_90s_linear_infinite_reverse] pointer-events-none" />
              
              <div className="hackie3-logo-hero text-center" id="main-logo">
                <span className="h3-hack">HACK</span><span className="h3-ie">IE</span><sup className="h3-sup">3</sup>
              </div>
              <div className="hackie3-logo-hero glitch-layer-cyan text-center" aria-hidden="true">
                <span className="h3-hack">HACK</span><span className="h3-ie">IE</span><sup className="h3-sup">3</sup>
              </div>
              <div className="hackie3-logo-hero glitch-layer-pink text-center" aria-hidden="true">
                <span className="h3-hack">HACK</span><span className="h3-ie">IE</span><sup className="h3-sup">3</sup>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col items-center gap-2 mb-12"
            >
              <p className="hackie3-subtitle text-center font-black-ops tracking-[0.6em] text-[#a855f7]/80 text-lg md:text-xl filter drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]">
                AN INNOVATION HACKATHON
              </p>
              <div className="h-[2px] w-48 bg-gradient-to-r from-transparent via-[#a855f7]/50 to-transparent shadow-[0_0_15px_#a855f7]" />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="hero-tagline mb-14 px-6 py-2 border-x border-white/10"
            >
              <p className="orbitron font-black tracking-[0.5em] text-white/50 text-[11px] md:text-xs">
                HACK <span className="text-[#a855f7]">.</span> BUILD <span className="text-[#a855f7]">.</span> EVOLVE <span className="text-[#a855f7]">.</span> DISRUPT
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="hero-terminal mb-16 relative bg-white/[0.02] border border-white/5 p-4 md:p-6 rounded-2xl backdrop-blur-2xl group overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#a855f7]/40 to-transparent group-hover:via-[#a855f7] transition-all duration-500" />
              <div className="flex items-center gap-3 font-mono text-[11px] md:text-sm">
                <span className="text-[#a855f7]/60 group-hover:text-[#a855f7] transition-colors">ROOT@HACKIE3:</span>
                <span className="text-[#00f5ff] font-bold">~ $ </span>
                <HeroTypewriter />
                <span className="cursor w-2 h-4 bg-[#a855f7] animate-[blink_0.9s_step-end_infinite] shadow-[0_0_8px_#a855f7]"></span>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="hero-cta flex flex-wrap gap-8 justify-center"
            >
              <button 
                className="btn-neon-glow orbitron font-black tracking-widest px-10 py-4 bg-[#a855f7] text-white border border-[#a855f7] shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:shadow-[0_0_35px_rgba(168,85,247,0.8)] transition-all duration-300 active:scale-95"
                style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}
              >
                REGISTER NOW
              </button>
              <button 
                className="orbitron font-black tracking-widest px-10 py-4 bg-transparent text-white border border-white/20 hover:border-[#a855f7] hover:text-[#a855f7] transition-all duration-300"
                style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}
              >
                JOIN DISCORD
              </button>
            </motion.div>

            {/* Countdown */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="py-24 reveal flex flex-col items-center w-full"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="h-[1px] w-12 bg-[#a855f7]/30" />
                <span className="orbitron text-[10px] font-black tracking-[0.5em] text-[#a855f7]/80 uppercase">
                  T-MINUS UNTIL INFILTRATION
                </span>
                <div className="h-[1px] w-12 bg-[#a855f7]/30" />
              </div>
              <Countdown />
            </motion.div>

            {/* Stats Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="hero-stats-container py-24 reveal grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-16 w-full max-w-6xl border-t border-b border-white/5 bg-white/[0.01] backdrop-blur-sm"
            >
              <Stat value="1,200+" label="PARTICIPANTS" />
              <Stat value="36H" label="DURATION" />
              <Stat value="₹50K+" label="PRIZE POOL" />
              <Stat value="8" label="TRACKS" />
            </motion.div>
          </div>
        </section>

        <div className="section-divider" />

        {/* --- ABOUT SECTION --- */}
        <section id="about" className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center py-32 px-10">
          <div className="reveal">
            <h2 className="s-title mb-8">About <em className="italic">HackIE3</em></h2>
            <div className="s-line mb-10" />
            
            <div className="space-y-8 mt-12">
              <p className="text-lg leading-relaxed text-white/60">
                HackIE3 is the premier 36-hour offline hackathon organized by IEEE Jadavpur University Student Branch, designed to foster innovation, creativity, and problem-solving at the intersection of technology and real-world impact.
              </p>
              <p className="text-lg leading-relaxed text-white/60">
                In its third iteration, HackIE3 — An Innovation Hackathon — elevates the experience, bringing together 1,200+ tech enthusiasts, developers, designers, and innovators from across India under one roof at the SMCC Building, Jadavpur University Salt Lake Campus.
              </p>
              <p className="orbitron text-[#a855f7] text-sm tracking-[0.4em] uppercase font-black">
                HACK. BUILD. EVOLVE. DISRUPT.
              </p>
            </div>
          </div>

          <div className="reveal flex justify-center">
            <div className="about-terminal w-full max-w-lg shadow-[0_0_50px_rgba(168,85,247,0.15)] rounded-xl overflow-hidden border border-white/5">
              <div className="bg-[#1a1128]/80 backdrop-blur-md px-4 py-3 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#28c941]" />
                  </div>
                </div>
                <span className="orbitron text-[10px] text-white/30 tracking-widest uppercase">SYSTEM_CORE.EXE</span>
              </div>
              <div className="p-8 bg-[#0a0018]/90 backdrop-blur-xl">
                {[
                  { key: "event.name", val: '"HackIE3"' },
                  { key: "event.org", val: '"IEEE JUSB"' },
                  { key: "event.venue", val: '"SMCC BUILDING"' },
                  { key: "event.coords", val: "[22.56N, 88.41E]" },
                  { key: "event.duration", val: '"36 HOURS"' },
                  { key: "event.status", val: "REGISTRATIONS_OPEN", special: true }
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0group">
                    <span className="font-mono text-sm text-[#6b4f9e] group-hover:text-[#a855f7] transition-colors">{">"} {item.key}</span>
                    <span className={`font-mono text-sm ${item.special ? 'text-[#39ff14]/80 shadow-[0_0_10px_rgba(57,255,20,0.2)]' : 'text-[#e9d5ff]/70'}`}>{item.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* --- TIMELINE SECTION --- */}
        <section id="timeline" className="py-32 overflow-hidden">
          <div className="reveal text-center mb-24">
            <h2 className="s-title">Mission Schedule</h2>
            <div className="s-line mx-auto" />
          </div>

          <div className="max-w-6xl mx-auto px-6 relative">
            {/* Snake Spine (Central Line) */}
            <div className="snake-spine hidden md:block" />
            
            {/* Floating Ray */}
            <motion.div 
              className="floating-ray hidden md:block"
              animate={{
                top: ["0%", "100%"],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "linear"
              }}
            />

            <div className="relative space-y-24 md:space-y-32">
              {timelineData.map((item, idx) => {
                const isLeft = idx % 2 === 0;
                return (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className={`relative flex flex-col items-center md:flex-row ${isLeft ? 'md:justify-start' : 'md:justify-end'}`}
                  >
                    {/* Node on central line */}
                    <div className="absolute left-[-5px] md:left-1/2 md:-translate-x-1/2 top-[6px] md:top-1/2 md:-translate-y-1/2 z-20">
                      <motion.div 
                        className="glow-node w-3 h-3 md:w-4 md:h-4 bg-[#0a0018] border-2 border-[#a855f7] rounded-full shadow-[0_0_10px_#a855f7]"
                        animate={{
                          boxShadow: ["0 0 10px #a855f7", "0 0 30px #00f5ff", "0 0 10px #a855f7"],
                          borderColor: ["#a855f7", "#00f5ff", "#a855f7"]
                        }}
                        transition={{
                          duration: 6,
                          repeat: Infinity,
                          delay: (idx / timelineData.length) * 6,
                          times: [0, 0.1, 0.2]
                        }}
                      />
                      
                      {/* Date label closest to line */}
                      <div className={`absolute top-1/2 -translate-y-1/2 hidden md:block ${isLeft ? 'left-8' : 'right-8'} whitespace-nowrap`}>
                        <span className="orbitron text-[#00f5ff] text-[10px] font-black tracking-[0.3em] uppercase opacity-80">
                          {item.date}
                        </span>
                      </div>
                    </div>

                    {/* Content Card */}
                    <div className={`w-full md:w-[42%] ${isLeft ? 'md:pr-12' : 'md:pl-12'}`}>
                      <motion.div 
                        className="bg-white/[0.02] backdrop-blur-xl p-8 md:p-10 rounded-2xl border border-white/5 hover:border-[#a855f7]/30 transition-all group relative overflow-hidden"
                        animate={{
                          borderColor: ["rgba(255,255,255,0.05)", "rgba(0,245,255,0.4)", "rgba(255,255,255,0.05)"],
                          backgroundColor: ["rgba(255,255,255,0.02)", "rgba(0,245,255,0.05)", "rgba(255,255,255,0.02)"]
                        }}
                        transition={{
                          duration: 6,
                          repeat: Infinity,
                          delay: (idx / timelineData.length) * 6,
                          times: [0, 0.1, 0.2]
                        }}
                      >
                        <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                          <Terminal size={80} />
                        </div>
                        
                        {/* Mobile Date */}
                        <div className="md:hidden mb-4">
                          <span className="orbitron text-[#a855f7] text-[10px] font-black tracking-[0.4em] uppercase">
                            {item.date}
                          </span>
                        </div>

                        <h3 className="orbitron text-xl md:text-2xl font-black text-white mb-4 group-hover:text-[#a855f7] transition-all tracking-tight uppercase">
                          {item.title}
                        </h3>
                        <p className="inter text-sm md:text-base text-white/40 leading-relaxed font-medium group-hover:text-white/70 transition-colors">
                          {item.desc}
                        </p>
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* --- TRACKS SECTION --- */}
        <section id="tracks" className="py-32 bg-white/[0.01]">
          <div className="reveal text-center mb-24">
            <h2 className="s-title">Choose Your Arena</h2>
            <div className="s-line mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 px-6 max-w-6xl mx-auto reveal-group">
            {trackData.map((track) => (
              <TrackCard key={track.id} track={track} />
            ))}
          </div>
        </section>

        <div className="section-divider" />

        {/* --- PRIZES SECTION --- */}
        <section id="prizes" className="py-32 relative overflow-hidden">
          <div className="reveal text-center mb-12">
            <h2 className="s-title">Winner's Loot</h2>
            <div className="s-line mx-auto" />
          </div>

          <div className="max-w-6xl mx-auto px-6 relative z-10 pt-16 pb-24">
            {/* Podium Container with extra breathing room */}
            <div className="flex flex-col lg:flex-row items-end justify-center gap-12 lg:gap-8 max-w-5xl mx-auto">
              <PrizeCard 
                tier="1ST RUNNER UP" 
                amount="₹15,000" 
                color="#e2e8f0" 
                borderColor="rgba(226, 232, 240, 0.3)"
                bgColor="rgba(226, 232, 240, 0.1)"
                icon="🥈"
                swags={["Certificates", "Sponsor Goodies", "LinkedIn Spotlight"]}
                order="order-2 lg:order-1"
              />
              <PrizeCard 
                tier="WINNER" 
                amount="₹25,000" 
                color="#ffb700" 
                borderColor="rgba(255, 183, 0, 0.5)"
                bgColor="#ffb700"
                icon="🏆"
                swags={["Trophy + Certificates", "Internship Referrals", "Sponsor Swag Kit"]}
                isWinner
                order="order-1 lg:order-2"
              />
              <PrizeCard 
                tier="2ND RUNNER UP" 
                amount="₹10,000" 
                color="#cd7f32" 
                borderColor="rgba(205, 127, 50, 0.3)"
                bgColor="rgba(205, 127, 50, 0.1)"
                icon="🥉"
                swags={["Certificates", "Swag Kit", "Recognition Badge"]}
                order="order-3 lg:order-3"
              />
            </div>

            {/* Secondary Prizes with substantial gaps */}
            <div className="mt-40 pt-20 border-t border-white/5">
              <div className="text-center mb-16">
                <span className="orbitron text-[#a855f7] text-[10px] font-black tracking-[0.5em] uppercase opacity-60">SPECIAL RECOGNITIONS</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <SpecialPrize name="BEST WEB3 PROJECT" amount="₹5,000" desc="Top blockchain/dApp build" />
                <SpecialPrize name="BEST IOT BUILD" amount="₹5,000" desc="Hardware-software integration" />
                <SpecialPrize name="FIRST TIMERS AWARD" amount="₹3,000" desc="Best first-time team" />
                <SpecialPrize name="PEOPLE'S CHOICE" amount="Swag Kit" desc="Voted by participants" />
              </div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* --- MAP SECTION --- */}
        <section id="map" className="section-full">
          <div className="section-inner reveal">
            <h2 className="s-title">Campus Live Map</h2>
            <div className="s-line" />
            <p className="inter text-sm text-[#6b4f9e] mt-4 mb-12">SMCC BUILDING · JU SALT LAKE · [22.5602°N, 88.4125°E]</p>
          </div>

          <div className="relative h-[650px] border-y border-[rgba(168,85,247,0.25)] reveal overflow-hidden">
            {mapView === 'cyber' ? (
              <CyberMap />
            ) : (
              <div className="w-full h-full relative bg-[#0a0018]">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.28825838426!2d88.41030837530034!3d22.560799979500052!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a027447d049697d%3A0x6420579e27c95e14!2sJadavpur%20University%2C%20Salt%20Lake%20Campus!5e0!3m2!1sen!2sin!4v1711200000000!5m2!1sen!2sin" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(1.1)' }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
                   <div className="marker" style={{ position: 'static' }}></div>
                </div>
                <div className="absolute top-[calc(50%+20px)] left-1/2 -translate-x-1/2 z-20 bg-[rgba(10,0,24,0.9)] border border-[#a855f7] px-4 py-2 rounded-sm jetbrains text-xs text-[#f0e6ff] shadow-[0_0_20px_rgba(168,85,247,0.4)] pointer-events-auto">
                  <a 
                    href="https://www.google.com/maps/search/?api=1&query=Jadavpur+University+Salt+Lake+Campus" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-[#a855f7] transition-colors"
                  >
                    <Globe size={14} /> OPEN IN GOOGLE MAPS
                  </a>
                </div>
              </div>
            )}
            
            <div className="absolute top-8 right-8 z-20">
              <div className="view-toggle flex gap-4 bg-black/40 p-1 border border-white/5 rounded-lg backdrop-blur-md">
                <button 
                  onClick={() => setMapView('cyber')}
                  className={`orbitron text-[10px] font-black tracking-widest px-4 py-2 transition-all ${mapView === 'cyber' ? 'bg-[#a855f7] text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]' : 'text-[#6b4f9e] hover:text-[#a855f7]'}`}
                  style={{ clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))' }}
                >
                  CYBER
                </button>
                <button 
                  onClick={() => setMapView('standard')}
                  className={`orbitron text-[10px] font-black tracking-widest px-4 py-2 transition-all ${mapView === 'standard' ? 'bg-[#a855f7] text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]' : 'text-[#6b4f9e] hover:text-[#a855f7]'}`}
                  style={{ clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))' }}
                >
                  STANDARD
                </button>
              </div>
            </div>

            <div className="absolute top-8 left-8 z-20 hidden md:block">
              <div className="pulse-panel">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#39ff14] animate-pulse" />
                  <span className="orbitron text-[10px] text-[#a855f7] tracking-[0.2em] uppercase">// SMCC_RADAR.05</span>
                </div>
                <div className="space-y-3">
                  <PulseMetric label="Hackers Onsite" value="452" percent={90} />
                  <PulseMetric label="Uptime" value="99.9%" percent={100} />
                  <PulseMetric label="Signal Strength" value="Optimal" percent={85} />
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-14 bg-[rgba(5,0,15,0.92)] border-t border-[rgba(168,85,247,0.25)] flex items-center px-8 z-10">
              <span className="text-[#00f5ff] jetbrains text-xs mr-3 font-bold uppercase">{">"} SYSTEM:</span>
              <LogTicker />
            </div>
          </div>
        </section>

              {/* --- SPONSORS SECTION --- */}
        <section id="sponsors" className="py-32 bg-white/[0.01]">
          <div className="reveal text-center mb-20">
            <h2 className="s-title">Powered By</h2>
            <div className="s-line mx-auto" />
          </div>

          <div className="mt-16 space-y-32 reveal max-w-7xl mx-auto px-6">
            {/* TERA TIER */}
            <div className="flex flex-col items-center">
              <div className="orbitron text-[10px] tracking-[0.6em] text-[#a855f7]/40 uppercase mb-16 px-4 py-1 border border-[#a855f7]/10 rounded-full">
                TERA_TIER.01
              </div>
              <div className="flex flex-wrap justify-center gap-16 md:gap-32 items-center w-full">
                <SponsorItem 
                  name="Polygon" 
                  tagline="BLOCKCHAIN PARTNER" 
                  symbol={
                    <svg viewBox="0 0 100 100" className="w-16 h-16">
                      <path d="M68.3 37.5L50 27L31.7 37.5V58.5L50 69L68.3 58.5V37.5Z" fill="none" stroke="#8247e5" strokeWidth="3"/>
                      <path d="M50 27L68.3 37.5L86.6 27L68.3 16.5L50 27Z" fill="#8247e5" opacity="0.9"/>
                      <path d="M31.7 37.5L50 27L31.7 16.5L13.4 27L31.7 37.5Z" fill="#8247e5" opacity="0.6"/>
                      <path d="M50 69L68.3 58.5L68.3 79.5L50 90L50 69Z" fill="#8247e5" opacity="0.75"/>
                      <circle cx="50" cy="48" r="8" fill="#8247e5"/>
                    </svg>
                  }
                  isTera
                />
                <SponsorItem 
                  name="QuillAudits" 
                  tagline="SECURITY PARTNER" 
                  symbol={
                    <svg viewBox="0 0 100 100" className="w-16 h-16">
                      <path d="M50 8L88 24V52C88 72 70 88 50 94C30 88 12 72 12 52V24L50 8Z" fill="rgba(0,188,212,0.12)" stroke="#00bcd4" strokeWidth="2.5"/>
                      <path d="M35 50L46 62L66 38" stroke="#00bcd4" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  }
                  isTera
                />
              </div>
            </div>

            {/* MEGA TIER */}
            <div className="flex flex-col items-center">
              <div className="orbitron text-[10px] tracking-[0.6em] text-[#a855f7]/40 uppercase mb-12">
                MEGA_TIER.02
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-12 w-full">
                <SponsorItem name="Smolify AI" tagline="AI PARTNER" initials="SA" />
                <SponsorItem name="Algorand Bharat" tagline="BLOCKCHAIN INFRA" initials="AB" />
                <SponsorItem name="FlutterFlow" tagline="APP BUILDER" initials="FF" />
                <SponsorItem name="Devfolio" tagline="PLATFORM PARTNER" initials="DF" />
              </div>
            </div>

            {/* KILO TIER */}
            <div className="flex flex-col items-center">
              <div className="orbitron text-[10px] tracking-[0.6em] text-[#a855f7]/40 uppercase mb-12">
                KILO_TIER.03
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 max-w-5xl mx-auto">
                <SponsorItem 
                  name="Interview Buddy" 
                  tagline="INTERVIEW PREP PARTNER" 
                  symbol={
                    <svg viewBox="0 0 100 100" fill="none">
                      <path d="M20 20H65C70 20 75 25 75 30V55C75 60 70 65 65 65H50L38 80V65H20C15 65 10 60 10 55V30C10 25 15 20 20 20Z" fill="none" stroke="#00BCD4" strokeWidth="3.5" strokeLinejoin="round"/>
                      <circle cx="32" cy="43" r="5" fill="#00BCD4" opacity="0.8"/>
                      <circle cx="50" cy="43" r="5" fill="#00BCD4" opacity="0.8"/>
                    </svg>
                  }
                />
                <SponsorItem 
                  name="featherless.ai" 
                  tagline="INFERENCE PARTNER" 
                  symbol={
                    <svg viewBox="0 0 100 100" fill="none">
                      <path d="M80 15C80 15 40 35 20 85" stroke="#39ff14" strokeWidth="2.5" strokeLinecap="round"/>
                      <path d="M80 15C65 30 50 40 20 85" stroke="#39ff14" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
                      <path d="M80 15C75 45 60 60 20 85" stroke="#39ff14" strokeWidth="1" strokeLinecap="round" opacity="0.3"/>
                      <circle cx="20" cy="85" r="5" fill="#39ff14"/>
                      <circle cx="80" cy="15" r="4" fill="#39ff14" opacity="0.7"/>
                    </svg>
                  }
                />
                <SponsorItem 
                  name="Balsamiq" 
                  tagline="WIREFRAMING PARTNER" 
                  symbol={
                    <svg viewBox="0 0 100 100" fill="none">
                      <rect x="12" y="20" width="76" height="60" rx="4" stroke="#ff4444" strokeWidth="3" fill="none" strokeDasharray="6 3"/>
                      <rect x="20" y="30" width="30" height="6" rx="2" fill="#ff4444" opacity="0.7"/>
                      <rect x="20" y="42" width="50" height="4" rx="2" fill="#ff4444" opacity="0.4"/>
                      <rect x="20" y="64" width="20" height="8" rx="3" fill="#ff4444" opacity="0.8"/>
                    </svg>
                  }
                />
                <SponsorItem 
                  name="Prepverse" 
                  tagline="LEARNING PARTNER" 
                  symbol={
                    <svg viewBox="0 0 100 100" fill="none">
                      <path d="M50 25V80M50 25C50 25 25 20 15 28V80C25 72 50 75 50 75M50 25C50 25 75 20 85 28V80C75 72 50 75 50 75" stroke="#f59e0b" strokeWidth="3" strokeLinejoin="round" fill="none"/>
                      <path d="M62 28L58 45H66L58 60" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  }
                />
                <SponsorItem 
                  name="n8n" 
                  tagline="AUTOMATION PARTNER" 
                  symbol={
                    <svg viewBox="0 0 100 100" fill="none">
                      <circle cx="22" cy="50" r="14" stroke="#EA4B71" strokeWidth="3" fill="none"/>
                      <text x="22" y="56" textAnchor="middle" fontFamily="monospace" fontWeight="900" fontSize="14" fill="#EA4B71">n</text>
                      <circle cx="50" cy="38" r="11" stroke="#EA4B71" strokeWidth="2.5" fill="rgba(234,75,113,0.1)"/>
                      <circle cx="50" cy="62" r="11" stroke="#EA4B71" strokeWidth="2.5" fill="rgba(234,75,113,0.1)"/>
                      <circle cx="78" cy="50" r="14" stroke="#EA4B71" strokeWidth="3" fill="none"/>
                      <text x="78" y="56" textAnchor="middle" fontFamily="monospace" fontWeight="900" fontSize="14" fill="#EA4B71">n</text>
                      <line x1="36" y1="50" x2="39" y2="50" stroke="#EA4B71" strokeWidth="2"/>
                      <line x1="61" y1="50" x2="64" y2="50" stroke="#EA4B71" strokeWidth="2"/>
                    </svg>
                  }
                />
                <SponsorItem 
                  name=".xyz" 
                  tagline="DOMAIN PARTNER" 
                  symbol={
                    <svg viewBox="0 0 100 100" fill="none">
                      <path d="M50 10L65 30H35L50 10Z" fill="#ff4444" opacity="0.85"/>
                      <path d="M30 40L10 70H50L30 40Z" fill="#39ff14" opacity="0.85"/>
                      <path d="M70 40L50 70H90L70 40Z" fill="#4285F4" opacity="0.85"/>
                      <path d="M50 65L35 90H65L50 65Z" fill="#a855f7" opacity="0.7"/>
                    </svg>
                  }
                />
                <SponsorItem 
                  name="appwrite" 
                  tagline="BACKEND PARTNER" 
                  symbol={
                    <svg viewBox="0 0 100 100" fill="none">
                      <path d="M50 12L82 82H66L50 48L34 82H18L50 12Z" fill="none" stroke="#FD366E" strokeWidth="3" strokeLinejoin="round"/>
                      <path d="M30 62H70" stroke="#FD366E" strokeWidth="3.5" strokeLinecap="round"/>
                      <rect x="15" y="79" width="8" height="8" rx="1" fill="#FD366E"/>
                      <rect x="77" y="79" width="8" height="8" rx="1" fill="#FD366E"/>
                    </svg>
                  }
                />
                <SponsorItem 
                  name="ETHIndia" 
                  tagline="WEB3 COMMUNITY PARTNER" 
                  symbol={
                    <svg viewBox="0 0 100 100" fill="none">
                      <path d="M50 8L82 50L50 65L18 50Z" fill="#627EEA" opacity="0.85"/>
                      <path d="M50 8L82 50L50 92L18 50Z" fill="none" stroke="#627EEA" strokeWidth="2"/>
                      <path d="M18 50L50 65L82 50" stroke="#627EEA" strokeWidth="1.5" opacity="0.5"/>
                      <rect x="35" y="85" width="10" height="4" fill="#FF9933"/>
                      <rect x="45" y="85" width="10" height="4" fill="#ffffff"/>
                      <rect x="55" y="85" width="10" height="4" fill="#138808"/>
                    </svg>
                  }
                />
              </div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* --- FAQ SECTION --- */}
        <section id="faqs" className="py-32">
          <div className="reveal text-center mb-20">
            <h2 className="s-title">FREQUENTLY ASKED QUESTIONS</h2>
            <div className="s-line mx-auto" />
          </div>

          <div className="mt-16 max-w-3xl mx-auto px-6 space-y-4">
            {faqData.map((item, idx) => (
              <FaqItem key={idx} question={item.q} answer={item.a} />
            ))}
          </div>
        </section>

        {/* --- FOOTER --- */}
        <footer className="footer-full relative bg-black/40 border-t border-white/5 py-24 overflow-hidden">
          <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
            <div className="hackie3-logo-nav scale-150 mb-12">
              <span className="h3-hack-sm">HACK</span>
              <span className="h3-ie-sm">IE</span>
              <sup className="h3-sup-sm">3</sup>
            </div>
            
            <nav className="flex flex-wrap justify-center gap-x-12 gap-y-6 mb-16 px-4">
              {['About', 'Timeline', 'Tracks', 'Prizes', 'Map', 'Sponsors', 'FAQs'].map(link => (
                <a 
                  key={link} 
                  href={`#${link.toLowerCase()}`} 
                  className="orbitron text-[10px] font-bold tracking-[0.2em] text-[#6b4f9e] hover:text-[#a855f7] transition-all hover:translate-y-[-2px]"
                >
                  {link.toUpperCase()}
                </a>
              ))}
            </nav>

            <div className="flex justify-center gap-8 mb-16">
              {[
                { icon: Instagram, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Linkedin, href: "#" },
                { icon: MessageSquare, href: "#" }
              ].map((social, i) => (
                <a 
                  key={i} 
                  href={social.href}
                  className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-[#a855f7] hover:bg-[#a855f7] hover:text-white hover:shadow-[0_0_15px_rgba(168,85,247,0.6)] transition-all duration-300"
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>

            <div className="pt-12 border-t border-white/5 w-full max-w-2xl text-center">
              <p className="inter text-xs text-white/20 tracking-[0.2em] uppercase mb-4">© 2026 HackIE3 · IEEE JU Student Branch</p>
              <p className="orbitron text-[10px] text-[#a855f7]/40 font-bold tracking-widest uppercase">Designed with cybernetic intent by SMCC & IEEE JUSB</p>
            </div>
          </div>
          
          <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 orbitron text-[20vw] font-black pointer-events-none opacity-[0.02] select-none whitespace-nowrap">
            HACKIE3
          </div>
        </footer>
      </div>
    </>
  );
}

// --- SUB-COMPONENTS ---

function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: { x: number; y: number; vx: number; vy: number; size: number }[] = [];

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    const init = () => {
      particles = [];
      const count = Math.floor((canvas.width * canvas.height) / 15000);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          size: Math.random() * 1.5 + 0.5
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(168, 85, 247, 0.4)";
      ctx.strokeStyle = "rgba(124, 58, 237, 0.08)";
      ctx.lineWidth = 0.8;

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} id="neural-canvas" />;
}

function TrackCard(props: any) {
  const { track } = props;
  const Icon = track.icon;
  return (
    <div 
      className="track-card reveal group flex flex-col items-center text-center p-12" 
      data-id={track.id}
      style={{ '--track-accent': track.accent } as any}
    >
      <div className="track-icon-wrap mb-8 group-hover:scale-110 transition-transform duration-500 bg-white/5 p-6 rounded-2xl border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.02)]">
        <Icon className="track-icon w-10 h-10" />
      </div>
      <h3 className="orbitron text-xl font-black text-white group-hover:text-[#a855f7] transition-colors tracking-[0.2em] uppercase mb-5">{track.name}</h3>
      <p className="inter text-sm text-[#6b4f9e] leading-relaxed px-4 font-medium opacity-70 group-hover:opacity-100 transition-opacity max-w-md">{track.desc}</p>
      
      {/* Decorative corners */}
      <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-[rgba(124,58,237,0.2)] group-hover:border-[#a855f7] transition-colors" />
      <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-[rgba(124,58,237,0.2)] group-hover:border-[#a855f7] transition-colors" />
    </div>
  );
}


const communityPartners = [
  { name: "GDG On Campus JU", initials: "G", tagline: "GDG CAMPUS PARTNER" },
  { name: "Devnest", initials: "D", tagline: "DEVELOPER COMMUNITY PARTNER" },
  { name: "Resourceio", initials: "R", tagline: "LEARNING COMMUNITY PARTNER" },
  { name: "NooBuild", initials: "N", tagline: "NO-CODE COMMUNITY PARTNER" },
  { name: "Students Chapter ECE", initials: "S", tagline: "STUDENT CHAPTER PARTNER" },
  { name: "The Dev Army", initials: "T", tagline: "DEVELOPER OUTREACH PARTNER" },
  { name: "WIE IEEE Kolkata", initials: "W", tagline: "WOMEN IN ENGINEERING PARTNER" }
];

const faqData = [
  { q: "What is HackIE3 and who can participate?", a: "HackIE3 is the premier 36-hour offline hackathon by IEEE JUSB. Any college student from any institution across India can participate. No prior hackathon experience required — we welcome first-timers with open arms." },
  { q: "Is there a registration fee?", a: "Absolutely not. HackIE3 is 100% free to participate in. We provide meals, accommodation for outstation teams, and high-speed internet throughout the event. Just bring your laptop and your best ideas." },
  { q: "What is the team size?", a: "Teams of 2–3 members. Solo registrations are welcome — we'll match you with others during our Discord team formation phase before the finals." },
  { q: "How does the preliminary round work?", a: "The online prelim is a timed assessment with coding problems, MCQs on your chosen track domain, and an aptitude component. Top 40 teams qualify for the offline 36-hour finale at SMCC Building, JU Salt Lake Campus." },
  { q: "What technologies are allowed?", a: "Any and all. Web, mobile, hardware, AI/ML, blockchain — there are no technology restrictions. Use what you know best and build what solves the problem." },
  { q: "Is accommodation provided for outstation teams?", a: "Yes. Qualified teams traveling from outside Kolkata will be provided with accommodation at the venue. All meals during the 36-hour hackathon are fully provided by IEEE JUSB." },
  { q: "How are projects judged?", a: "Projects are evaluated on Innovation & Creativity (30%), Technical Complexity (25%), Feasibility & Impact (25%), and Presentation Quality (20%). Industry expert judges conduct both mid-hackathon checkpoints and final demos." },
  { q: "Can I participate without any prior hackathon experience?", a: "Not only can you participate — we specifically encourage it. We have a First Timers' Award for exactly this reason. Mentors are available 24/7 during the hackathon to guide you." }
];

function HeroTypewriter() {
  const [text, setText] = useState('');
  const phrases = [
    "./register --event=hackie3 --track=web3",
    "git commit -m \"change the world\"",
    "ssh hackathon@smcc.ju.ac.in -p 5000",
    "sudo hack --mode=legendary",
    "./hackie3 --init --duration=36h"
  ];
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[phraseIdx];
    const speed = isDeleting ? 40 : 35;
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (text.length < current.length) {
          setText(current.substring(0, text.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (text.length > 0) {
          setText(text.substring(0, text.length - 1));
        } else {
          setIsDeleting(false);
          setPhraseIdx((phraseIdx + 1) % phrases.length);
        }
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [text, isDeleting, phraseIdx]);

  return <span>{text}</span>;
}

function Dots() {
  const [dots, setDots] = useState('.');
  useEffect(() => {
    const i = setInterval(() => {
      setDots(d => d.length >= 3 ? '.' : d + '.');
    }, 600);
    return () => clearInterval(i);
  }, []);
  return <span>{dots}</span>;
}

function Countdown() {
  const [timeLeft, setTimeLeft] = useState({ dd: '00', hh: '00', mm: '00', ss: '00' });

  useEffect(() => {
    const i = setInterval(() => {
      const now = new Date().getTime();
      const dist = TARGET_DATE - now;

      const dd = Math.floor(dist / (1000 * 60 * 60 * 24));
      const hh = Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mm = Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60));
      const ss = Math.floor((dist % (1000 * 60)) / 1000);

      setTimeLeft({
        dd: String(Math.max(0, dd)).padStart(2, '0'),
        hh: String(Math.max(0, hh)).padStart(2, '0'),
        mm: String(Math.max(0, mm)).padStart(2, '0'),
        ss: String(Math.max(0, ss)).padStart(2, '0')
      });
    }, 1000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="flex items-center justify-center gap-4 md:gap-8">
      <Unit value={timeLeft.dd} label="DAYS" />
      <span className="text-[#a855f7] font-mono text-2xl md:text-4xl opacity-50 font-bold mb-6">:</span>
      <Unit value={timeLeft.hh} label="HRS" />
      <span className="text-[#a855f7] font-mono text-2xl md:text-4xl opacity-50 font-bold mb-6">:</span>
      <Unit value={timeLeft.mm} label="MIN" />
      <span className="text-[#a855f7] font-mono text-2xl md:text-4xl opacity-50 font-bold mb-6">:</span>
      <Unit value={timeLeft.ss} label="SEC" />
    </div>
  );
}

function Unit({ value, label }: { value: string, label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative group">
        <div className="absolute inset-0 bg-[#a855f7]/20 blur-xl group-hover:bg-[#a855f7]/30 transition-all rounded-full" />
        <span className="relative font-mono text-4xl md:text-7xl font-black tracking-tighter text-white tabular-nums drop-shadow-[0_0_15px_#bf00ff]">
          {value}
        </span>
      </div>
      <span className="orbitron text-[9px] md:text-[11px] font-black tracking-[0.3em] text-[#a855f7] mt-3 opacity-60 uppercase">
        {label}
      </span>
    </div>
  );
}

function Stat({ value, label }: { value: string, label: string }) {
  return (
    <div className="flex flex-col items-center group">
      <div className="relative mb-2">
         <span className="font-mono text-2xl md:text-4xl font-black text-white group-hover:text-[#00f5ff] transition-colors duration-300 tracking-tight">
          {value}
        </span>
        <div className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#00f5ff] group-hover:w-full transition-all duration-500" />
      </div>
      <span className="orbitron text-[10px] md:text-[12px] font-black tracking-[0.4em] text-[#6b4f9e] uppercase group-hover:text-[#a855f7] transition-colors">
        {label}
      </span>
    </div>
  );
}

// --- NEW SUB-COMPONENTS ---

function CyberMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const accentColor = "#a855f7";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      if (containerRef.current) {
        canvas.width = containerRef.current.clientWidth;
        canvas.height = containerRef.current.clientHeight;
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    let animationFrameId: number;

    const drawMap = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const dotSpacing = 16;
      const dotSize = 1;

      // Draw Grid
      ctx.strokeStyle = "rgba(168, 85, 247, 0.05)";
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw "Buildings" (Rectangles)
      ctx.fillStyle = "rgba(124, 58, 237, 0.03)";
      const seed = 42;
      for (let i = 0; i < 25; i++) {
        const bx = (Math.sin(i * seed) * 0.5 + 0.5) * canvas.width;
        const by = (Math.cos(i * seed * 1.3) * 0.5 + 0.5) * canvas.height;
        const bw = 30 + (Math.sin(i) * 20);
        const bh = 30 + (Math.cos(i) * 20);
        ctx.fillRect(bx, by, bw, bh);
        ctx.strokeStyle = "rgba(168, 85, 247, 0.1)";
        ctx.strokeRect(bx, by, bw, bh);
      }

      // Dot Mass
      for (let x = 0; x < canvas.width; x += dotSpacing) {
        for (let y = 0; y < canvas.height; y += dotSpacing) {
          const noise = Math.sin(x * 0.01) * Math.cos(y * 0.01) + 
                        Math.sin(x * 0.005 + y * 0.005) * 0.5;
          
          if (noise > -0.3) {
            const flicker = Math.random() * 0.4 + 0.6;
            ctx.globalAlpha = flicker * 0.3;
            ctx.fillStyle = accentColor;
            
            ctx.beginPath();
            ctx.arc(x, y, dotSize, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      
      // Data Stream lines
      ctx.globalAlpha = 0.2;
      ctx.strokeStyle = "#00f5ff";
      ctx.lineWidth = 0.5;
      const time = Date.now() * 0.001;
      for (let i = 0; i < 5; i++) {
        const ly = (canvas.height * (i / 5) + time * 50) % canvas.height;
        ctx.beginPath();
        ctx.moveTo(0, ly);
        ctx.lineTo(canvas.width, ly);
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(drawMap);
    };

    drawMap();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div ref={containerRef} className="map-container">
      <div className="map-overlay"></div>
      <canvas 
        ref={canvasRef} 
        className="w-full h-full block"
        style={{ filter: `drop-shadow(0 0 3px ${accentColor})` }}
      />
      {/* Target Marker at Jadavpur University approx coordinates on the pixel grid */}
      <div 
        className="marker" 
        style={{ top: '55%', left: '72%' }}
      >
        <div className="absolute top-[-30px] left-1/2 -translate-x-1/2 whitespace-nowrap orbitron text-[10px] text-[#00f5ff] tracking-widest bg-[#05000f]/80 px-2 py-1 border border-[#00f5ff]/30">
          SMCC_BUILDING.H3
        </div>
      </div>
    </div>
  );
}

function PulseMetric({ label, value, percent }: { label: string, value: string, percent: number }) {
  const [currentVal, setCurrentVal] = useState(value);
  const [currentPercent, setCurrentPercent] = useState(percent);

  useEffect(() => {
    const i = setInterval(() => {
      if (label === 'Active Hackers') {
        const v = parseInt(value) + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 5);
        setCurrentVal(v.toString());
      } else if (label === 'Server Load') {
        const v = percent + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3);
        setCurrentVal(v.toString() + '%');
        setCurrentPercent(v);
      }
    }, 3000);
    return () => clearInterval(i);
  }, [label, value, percent]);

  return (
    <div>
      <div className="flex justify-between items-center mb-1.5 jetbrains text-xs">
        <span className="text-[#6b4f9e]">{label}</span>
        <span className="text-[#e9d5ff]">{currentVal}</span>
      </div>
      <div className="h-0.5 bg-[#0a0018] w-full">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${currentPercent}%` }}
          className="h-full bg-gradient-to-r from-[#7c3aed] to-[#a855f7] shadow-[0_0_6px_#bf00ff]"
        />
      </div>
    </div>
  );
}

function LogTicker() {
  const logs = [
    "> SYSTEM: Team [CyberGuard] pushed 3 commits to branch 'main'",
    "> SYSTEM: New mentor check-in detected — Blockchain Track, Hall A",
    "> SYSTEM: Build deployed — Team [EtherHack], Health Track",
    "> SYSTEM: Food station ACTIVE — Ground Floor, SMCC Building",
    "> SYSTEM: 847 packets transmitted · 0 lost",
    "> SYSTEM: HackIE3 central server synchronized."
  ];
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState('');

  useEffect(() => {
    let charIdx = 0;
    const t = logs[idx];
    const interval = setInterval(() => {
      setText(t.substring(0, charIdx + 1));
      charIdx++;
      if (charIdx === t.length) {
        clearInterval(interval);
        setTimeout(() => {
          setIdx((idx + 1) % logs.length);
        }, 4000);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [idx]);

  return <span className="jetbrains text-xs text-[#6b4f9e]">{text}</span>;
}


function SponsorItem(props: any) {
  const { name, tagline, initials, symbol, isTera } = props;
  return (
    <div className={`sponsor-item reveal ${isTera ? 'tera' : ''}`}>
      <div className="flex items-center gap-3">
        <div className="sponsor-symbol-wrap">
           {symbol ? symbol : <span className="orbitron text-xl font-black text-[#a855f7]">{initials}</span>}
        </div>
        <div className="flex flex-col">
          <span className="sponsor-name">{name}</span>
          <span className="sponsor-tagline">{tagline}</span>
        </div>
      </div>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string, answer: string, key?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div 
      className={`border border-white/5 rounded-lg overflow-hidden transition-all duration-300 ${isOpen ? 'bg-[#1a1128]/40 border-[#a855f7]/30 shadow-[0_0_30px_rgba(168,85,247,0.1)]' : 'bg-white/[0.02] hover:bg-white/[0.05]'}`}
    >
      <button className="w-full flex items-center justify-between p-6 cursor-pointer text-left group" onClick={() => setIsOpen(!isOpen)}>
        <span className={`orbitron text-sm font-bold tracking-widest transition-colors ${isOpen ? 'text-[#a855f7]' : 'text-white/70 group-hover:text-white'}`}>{question}</span>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${isOpen ? 'bg-[#a855f7] rotate-180' : 'bg-white/5'}`}>
          <ChevronRight size={16} className={isOpen ? 'text-white' : 'text-[#6b4f9e]'} />
        </div>
      </button>
      <motion.div 
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        className="overflow-hidden"
      >
        <div className="p-6 pt-0 inter text-white/50 text-sm leading-loose border-t border-white/5 mt-2">
          {answer}
        </div>
      </motion.div>
    </div>
  );
}

function SocialBtn({ icon: Icon, href }: { icon: any, href: string }) {
  return (
    <a href={href} className="social-btn">
      <Icon size={18} />
    </a>
  );
}

function PrizeCard({ tier, amount, color, borderColor, bgColor, icon, swags, isWinner, order }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`prize-card reveal ${order} flex-1 w-full lg:w-auto relative ${isWinner ? 'lg:scale-[1.1] lg:-translate-y-12 z-20' : 'z-10'}`} 
      style={{ borderColor: color }}
    >
      <CornerBrackets />
      
      {/* Absolute Icon on top */}
      <div className={`absolute left-1/2 -translate-x-1/2 rotate-45 border-[#0a0018] bg-[#0a0018] flex items-center justify-center ${isWinner ? '-top-12 w-20 h-20 border-4 shadow-[0_0_20px_rgba(255,183,0,0.4)]' : '-top-9 w-16 h-16 border-2'}`} style={{ borderColor: color }}>
        <span className="-rotate-45" style={{ fontSize: isWinner ? '30px' : '22px' }}>{icon}</span>
      </div>

      {/* Tier Label */}
      <div 
        className={`orbitron font-bold tracking-[0.25em] py-2 mb-6 text-center`} 
        style={{ 
          clipPath: 'polygon(6px 0,100% 0,calc(100% - 6px) 100%,0 100%)',
          backgroundColor: bgColor,
          color: isWinner ? '#000' : color,
          fontSize: isWinner ? '12px' : '10px'
        }}
      >
        {tier}
      </div>

      {/* Prize Amount - Locked height for alignment */}
      <div className="mb-6">
        <span className="inter text-[9px] tracking-[0.25em] text-[#6b4f9e] uppercase block mb-1">TOTAL PRIZE</span>
        <div className="prize-amount-locked">
          <span className={`orbitron font-black block`} style={{ color, fontSize: isWinner ? '48px' : '36px', textShadow: isWinner ? '0 0 20px rgba(255,183,0,0.5)' : '' }}>{amount}</span>
        </div>
      </div>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-[rgba(168,85,247,0.25)] to-transparent my-5" />
      
      {/* Swag list */}
      <div className="space-y-3 text-left">
        {swags.map((s: string) => <SwagItem key={s} text={s} />)}
      </div>

      <span className="absolute bottom-2 right-2 inter text-[9px] text-[#2d1b4e]">(10)</span>

      {isWinner && (
        <motion.div 
          className="absolute inset-0 border-2 border-[#ffb700] rounded-none pointer-events-none"
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}

function CornerBrackets() {
  return (
    <>
      <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-inherit" />
      <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-inherit" />
      <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-inherit" />
      <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-inherit" />
    </>
  );
}

function SwagItem({ text }: { text: string, key?: any }) {
  return (
    <div className="flex items-center gap-2 jetbrains text-[11px] text-[#6b4f9e]">
      <div className="w-1.5 h-1.5 rounded-full bg-[#a855f7] shadow-[0_0_6px_#bf00ff]" />
      {text}
    </div>
  );
}

function SpecialPrize({ name, amount, desc }: { name: string, amount: string, desc: string }) {
  return (
    <div className="special-card text-left reveal">
      <div className="orbitron text-[10px] tracking-wider text-[#00f5ff] uppercase mb-1.5">{name}</div>
      <div className="orbitron text-xl font-bold text-[#f0e6ff]">{amount}</div>
      <div className="jetbrains text-[10px] text-[#6b4f9e] mt-1 leading-relaxed">{desc}</div>
    </div>
  );
}

