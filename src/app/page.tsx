'use client';
import { useEffect } from 'react';
import Link from 'next/link';

const MayaLogo = ({ height = 32 }: { height?: number }) => (
  <svg viewBox="0 0 110 36" fill="none" xmlns="http://www.w3.org/2000/svg" height={height}>
    <path d="M4 28V8l8 12 8-12v20" stroke="var(--clay)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M30 28l7-20 7 20M33.5 20h7" stroke="var(--clay)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M52 8l6 10 6-10M58 18v10" stroke="var(--clay)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M74 28l7-20 7 20M77.5 20h7" stroke="var(--clay)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <circle cx="96" cy="26" r="2.5" fill="var(--clay)"/>
  </svg>
);

const MicIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={18} height={18}>
    <rect x="9" y="3" width="6" height="12" rx="3"/>
    <path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>
  </svg>
);

export default function Home() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => (e.target as HTMLElement).classList.add('in'), i * 60);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(el => io.observe(el));

    const tabs = document.querySelectorAll<HTMLElement>('.ac-tab');
    const panels = document.querySelectorAll<HTMLElement>('.ac-persona');
    const handlers = new Map<HTMLElement, () => void>();
    tabs.forEach(tab => {
      const handler = () => {
        const target = tab.dataset.persona;
        tabs.forEach(t => {
          const on = t.dataset.persona === target;
          t.classList.toggle('is-active', on);
          t.setAttribute('aria-selected', on ? 'true' : 'false');
        });
        panels.forEach(p => p.classList.toggle('is-active', p.dataset.persona === target));
        const active = document.querySelector<HTMLElement>(`.ac-persona[data-persona="${target}"]`);
        if (active) {
          active.querySelectorAll<HTMLElement>('.ac-msg, .p-row').forEach(el => {
            el.style.animation = 'none';
            void el.offsetHeight;
            el.style.animation = '';
          });
        }
      };
      handlers.set(tab, handler);
      tab.addEventListener('click', handler);
    });
    return () => {
      io.disconnect();
      handlers.forEach((h, t) => t.removeEventListener('click', h));
    };
  }, []);

  return (
    <>
      <style>{`
        :root{--bg:#ffffff;--bg-2:#f7f6ff;--paper:#ffffff;--ink:#1a1466;--ink-soft:#3a328a;--ink-mute:#7a72b8;--clay:#4838d4;--clay-deep:#2a1f8f;--moss:#16a34a;--cyan:#5eead4;--rule:#e8e6f5;--rule-strong:#d4d0eb;--shadow:0 1px 0 #1a146608,0 24px 60px -28px #1a146633;--display:"Manrope",ui-sans-serif,system-ui,sans-serif;--body:"Inter",ui-sans-serif,system-ui,sans-serif;--mono:"JetBrains Mono",ui-monospace,monospace}
        html{scroll-behavior:smooth}
        body{background:var(--bg);color:var(--ink);font-family:var(--body);font-size:17px;line-height:1.55;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;overflow-x:hidden}
        ::selection{background:var(--clay);color:var(--bg-2)}
        a{color:inherit;text-decoration:none}
        button{font:inherit;color:inherit;border:0;background:none;cursor:pointer}
        .wrap{max-width:1240px;margin:0 auto;padding:0 28px;position:relative;z-index:2}
        @media(max-width:720px){.wrap{padding:0 20px}body{font-size:16px}}
        nav.top{display:flex;align-items:center;justify-content:space-between;padding:22px 0 0}
        .maya-logo{display:flex;align-items:center;flex-shrink:0}
        .nav-right{display:flex;align-items:center;gap:24px}
        .nav-right a{font-size:14px;color:var(--ink-soft);font-weight:500}
        .nav-right a:hover{color:var(--clay)}
        .nav-right a.signin{background:var(--clay);color:#ffffff !important;padding:10px 20px;border-radius:999px;font-size:14px;font-weight:600;transition:all .2s;display:inline-flex;align-items:center;gap:8px}
        .nav-right a.signin:hover{background:var(--clay-deep) !important;color:#ffffff !important}
        @media(max-width:720px){.nav-links{display:none}}
        header.hero{padding:64px 0 80px;position:relative}
        .eyebrow{font-family:var(--mono);font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:var(--ink-mute);display:flex;align-items:center;gap:10px;margin-bottom:28px}
        .eyebrow::before{content:"";width:24px;height:1px;background:var(--ink-mute)}
        h1.headline{font-family:var(--display);font-weight:700;font-size:clamp(44px,7.5vw,104px);line-height:0.98;letter-spacing:-0.035em;margin:0 0 28px;max-width:14ch}
        h1.headline em{font-style:normal;font-weight:700;color:var(--clay)}
        h1.headline .underline{position:relative;display:inline-block}
        h1.headline .underline::after{content:"";position:absolute;left:-2%;right:-2%;bottom:6px;height:14px;background:var(--cyan);opacity:0.55;z-index:-1;transform:rotate(-0.5deg)}
        .sub-bridge{font-family:var(--display);font-size:clamp(18px,1.8vw,23px);font-weight:600;line-height:1.3;letter-spacing:-0.015em;color:var(--clay);margin:0 0 18px;max-width:32ch}
        .sub{font-size:clamp(17px,1.6vw,21px);line-height:1.5;max-width:46ch;color:var(--ink-soft);margin:0 0 40px}
        .cta-row{display:flex;gap:14px;flex-wrap:wrap;align-items:center}
        .btn-primary{background:var(--clay);color:#ffffff;padding:18px 28px;border-radius:999px;font-weight:600;font-size:16px;display:inline-flex;align-items:center;gap:12px;transition:transform .15s,background .2s,box-shadow .2s;box-shadow:0 8px 24px -10px var(--clay)}
        .btn-primary:hover{background:var(--clay-deep);transform:translateY(-1px);box-shadow:0 12px 32px -8px var(--clay)}
        .btn-secondary{padding:18px 24px;border-radius:999px;font-weight:500;font-size:16px;border:1px solid var(--rule-strong);color:var(--ink);display:inline-flex;align-items:center;gap:10px;transition:all .2s}
        .btn-secondary:hover{border-color:var(--clay);color:var(--clay)}
        .hero-grid{display:grid;grid-template-columns:0.85fr 1fr;gap:64px;align-items:start}
        @media(max-width:960px){.hero-grid{grid-template-columns:1fr;gap:48px}}
        .artifact-card{background:#ffffff;border-radius:24px;border:1px solid var(--rule);box-shadow:0 1px 0 #1a146611,0 30px 80px -20px #1a146644;position:relative;overflow:hidden;color:var(--ink)}
        .artifact-card::before{content:"";position:absolute;top:-100px;right:-100px;width:280px;height:280px;background:radial-gradient(circle,#a855f7 0%,transparent 70%);opacity:0.08;border-radius:50%;pointer-events:none}
        .ac-tabs{display:flex;gap:4px;padding:14px 14px 0;background:#ffffff;border-bottom:1px solid var(--rule)}
        .ac-tab{flex:1;padding:11px 16px;font-family:var(--body);font-size:13px;font-weight:600;color:var(--ink-mute);background:transparent;border:0;border-bottom:2px solid transparent;cursor:pointer;transition:color .15s,border-color .15s;letter-spacing:-0.005em}
        .ac-tab:hover{color:var(--ink-soft)}
        .ac-tab.is-active{color:var(--clay);border-bottom-color:var(--clay)}
        .ac-persona{display:none}.ac-persona.is-active{display:block}
        .ac-chat{padding:24px 28px 26px;border-bottom:1px solid #e8e6f5}
        .ac-chat-label{font-family:var(--mono);font-size:10px;letter-spacing:0.2em;color:#a855f7;margin-bottom:18px}
        .ac-msg{display:flex;margin-bottom:8px;opacity:0;transform:translateY(4px);animation:msgIn .45s ease forwards}
        .ac-msg:last-child{margin-bottom:0}
        @keyframes msgIn{to{opacity:1;transform:none}}
        .m1{animation-delay:.4s}.m2{animation-delay:1.5s}.m3{animation-delay:2.7s}.m4{animation-delay:3.8s}
        .ac-msg p{margin:0;font-size:15px;line-height:1.4;padding:11px 16px;border-radius:20px;max-width:82%;word-wrap:break-word}
        .ac-msg-l{justify-content:flex-start}
        .ac-msg-l p{background:#f1f0fa;color:#1a1466;border-bottom-left-radius:6px;font-family:var(--display);font-weight:500;letter-spacing:-0.005em}
        .ac-msg-y{justify-content:flex-end}
        .ac-msg-y p{background:#4838d4;color:#ffffff;border-bottom-right-radius:6px;font-weight:500}
        .ac-section{padding:24px 28px}.ac-section+.ac-section{border-top:1px solid var(--rule)}
        .ac-label{font-family:var(--mono);font-size:10px;letter-spacing:0.2em;color:#a855f7;margin-bottom:18px;display:flex;justify-content:space-between;align-items:center;gap:12px}
        .ac-building{color:#16a34a;letter-spacing:0.06em;text-transform:uppercase;font-size:9px;display:flex;align-items:center;gap:6px}
        .ac-building-dot{width:6px;height:6px;border-radius:50%;background:#7dc97d;animation:pulseGreen 2s infinite}
        @keyframes pulseGreen{0%{box-shadow:0 0 0 0 #7dc97d99}70%{box-shadow:0 0 0 6px #7dc97d00}100%{box-shadow:0 0 0 0 #7dc97d00}}
        .p-row{opacity:0;transform:translateX(-4px);animation:profileRowIn .5s ease forwards}
        @keyframes profileRowIn{to{opacity:1;transform:none}}
        .pr1{animation-delay:2.0s}.pr2{animation-delay:2.3s}.pr3{animation-delay:4.3s}.pr4{animation-delay:4.8s}.pr5{animation-delay:5.0s}.pr6{animation-delay:5.2s}
        .ac-applied{padding:22px 28px}.ac-applied .ac-label{margin-bottom:14px}
        .ac-applied-count{color:var(--clay);letter-spacing:0;text-transform:none;font-size:11px;font-weight:600}
        .ac-applied-row{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--rule)}.ac-applied-row:last-of-type{border-bottom:0}
        .ac-applied-tick{width:22px;height:22px;border-radius:50%;background:var(--moss);color:#fff;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0}
        .ac-applied-info{flex:1;min-width:0}
        .ac-applied-name{font-family:var(--display);font-weight:600;font-size:15px;color:var(--ink);letter-spacing:-0.01em;line-height:1.1}
        .ac-applied-meta{font-family:var(--mono);font-size:11px;color:var(--ink-mute);margin-top:2px;letter-spacing:0.02em}
        .ac-applied-when{font-family:var(--mono);font-size:10px;color:var(--ink-mute);flex-shrink:0;letter-spacing:0.04em}
        .ac-applied-more{margin-top:12px;font-size:12px;color:var(--ink-mute);text-align:center;font-style:italic}
        .ac-compliance{background:#f7f6ff}
        .ac-creds-inline{display:flex;flex-wrap:wrap;gap:6px}
        .ac-cred-chip{font-family:var(--mono);font-size:11px;letter-spacing:0.02em;padding:5px 10px;background:#ecfdf5;color:#15803d;border:1px solid #bbf7d0;border-radius:999px;font-weight:600;white-space:nowrap}
        .ac-cred-note{font-family:var(--display);font-style:italic;font-size:14px;color:var(--ink-soft);text-align:center;padding-top:6px}
        .ac-footer{background:#1a1466;color:#fff;padding:16px 28px;display:flex;align-items:center;justify-content:space-between;gap:12px}
        .ac-footer-left{display:flex;align-items:center;gap:10px;font-size:14px}
        .ac-footer-left strong{font-family:var(--display);font-weight:700;color:var(--cyan);font-size:16px;margin:0 2px}
        .ac-footer-tick{width:18px;height:18px;border-radius:50%;background:var(--cyan);color:#1a1466;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0}
        .ac-footer-tick::after{content:"✓";color:#1a1466}
        .ac-footer-right{font-family:var(--mono);font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#9b94d6}
        .ac-questions{display:grid;grid-template-columns:1fr 1fr;gap:8px}
        @media(max-width:480px){.ac-questions{grid-template-columns:1fr}}
        .ac-question{text-align:left;background:#f7f6ff;border:1px solid var(--rule);border-radius:10px;padding:13px 16px;font-family:var(--display);font-size:14px;font-weight:500;color:var(--ink);cursor:pointer;transition:background .15s,border-color .15s,transform .15s;letter-spacing:-0.005em;line-height:1.3}
        .ac-question::before{content:"?";display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;background:#a855f7;color:#fff;border-radius:50%;font-size:10px;font-weight:700;margin-right:8px;vertical-align:1px}
        .ac-question:hover{background:#fff;border-color:var(--clay);transform:translateY(-1px)}
        .ac-step-list{display:flex;flex-direction:column;gap:10px;margin-bottom:14px}
        .ac-step-row{display:flex;align-items:center;gap:12px;background:#fff;border:1px solid var(--rule);border-radius:10px;padding:12px 14px}
        .ac-step-num{width:24px;height:24px;border-radius:50%;background:var(--clay);color:#fff;display:flex;align-items:center;justify-content:center;font-family:var(--display);font-size:13px;font-weight:700;flex-shrink:0}
        .ac-step-name{font-family:var(--display);font-weight:600;font-size:14px;line-height:1.2;color:var(--ink)}
        .ac-step-meta{font-family:var(--mono);font-size:10px;color:var(--ink-mute);margin-top:3px;letter-spacing:0.03em}
        @media(max-width:520px){.ac-chat{padding:22px 22px 18px}.ac-section{padding:22px}.ac-footer{padding:14px 22px}}
        .three-up{margin-top:96px;display:grid;grid-template-columns:repeat(3,1fr);gap:0;border-top:1px solid var(--rule);border-bottom:1px solid var(--rule)}
        @media(max-width:880px){.three-up{grid-template-columns:1fr;margin-top:72px}}
        .tu-item{padding:40px 36px 44px;border-right:1px solid var(--rule);display:flex;flex-direction:column}.tu-item:last-child{border-right:0}
        @media(max-width:880px){.tu-item{border-right:0;border-bottom:1px solid var(--rule);padding:32px 4px}.tu-item:last-child{border-bottom:0}}
        .tu-num{font-family:var(--mono);font-size:11px;letter-spacing:0.18em;color:var(--clay);margin-bottom:24px}
        .tu-item h3{font-family:var(--display);font-weight:700;font-size:24px;line-height:1.15;letter-spacing:-0.02em;margin:0 0 12px;color:var(--ink)}
        .tu-item p{margin:0;color:var(--ink-soft);font-size:15px;line-height:1.5}
        .trust{padding:24px 0;border-bottom:1px solid var(--rule);display:flex;align-items:center;justify-content:space-between;gap:32px;flex-wrap:wrap}
        .trust-label{font-family:var(--mono);font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:var(--ink-mute)}
        .trust-stats{display:flex;gap:48px;flex-wrap:wrap}.trust-stats div{display:flex;flex-direction:column;gap:2px}
        .trust-stats strong{font-family:var(--display);font-size:24px;font-weight:700;color:var(--clay);letter-spacing:-0.02em}
        .trust-stats span{font-size:12px;color:var(--ink-mute);font-family:var(--mono);letter-spacing:0.04em}
        section{padding:120px 0;position:relative}
        @media(max-width:720px){section{padding:80px 0}}
        .sec-eyebrow{font-family:var(--mono);font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:var(--clay);margin-bottom:24px;display:flex;align-items:center;gap:10px}
        .sec-eyebrow::before{content:"";width:24px;height:1px;background:var(--clay)}
        h2.sec-h{font-family:var(--display);font-weight:700;font-size:clamp(36px,5vw,64px);line-height:1.02;letter-spacing:-0.03em;margin:0 0 24px;max-width:18ch}
        h2.sec-h em{font-style:normal;color:var(--clay);font-weight:700}
        .sec-sub{font-size:18px;color:var(--ink-soft);max-width:54ch;margin:0 0 64px}
        .features{display:grid;grid-template-columns:repeat(12,1fr);gap:24px}
        .feature{background:#fff;border:1px solid var(--rule);border-radius:20px;padding:36px;display:flex;flex-direction:column;position:relative;overflow:hidden;transition:transform .3s ease,box-shadow .3s ease,border-color .3s ease}
        .feature:hover{transform:translateY(-4px);box-shadow:var(--shadow);border-color:var(--rule-strong)}
        .feature .num{font-family:var(--mono);font-size:11px;letter-spacing:0.16em;color:var(--clay);margin-bottom:auto}
        .feature h3{font-family:var(--display);font-weight:700;font-size:30px;line-height:1.1;letter-spacing:-0.015em;margin:48px 0 14px}
        .feature p{margin:0;color:var(--ink-soft);font-size:16px;line-height:1.55}
        .feature.big{grid-column:span 7}.feature.small{grid-column:span 5}.feature.half{grid-column:span 6}
        @media(max-width:960px){.feature.big,.feature.small,.feature.half{grid-column:span 12}}
        .vis-prompts{margin-top:32px;display:flex;flex-wrap:wrap;gap:10px}
        .prompt-chip{font-family:var(--display);font-style:italic;font-size:16px;line-height:1.3;padding:10px 16px;border-radius:999px;background:var(--bg-2);border:1px solid var(--rule);color:var(--ink-soft);transition:transform .2s,border-color .2s,color .2s}
        .prompt-chip:hover{transform:translateY(-2px);border-color:var(--clay);color:var(--clay)}
        .vis-real{margin-top:28px;display:flex;flex-direction:column;gap:10px}
        .real-row{display:flex;align-items:center;gap:12px;padding:12px 14px;background:var(--bg-2);border:1px solid var(--rule);border-radius:10px}
        .real-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}.real-dot.good{background:var(--moss);box-shadow:0 0 0 3px #16a34a22}
        .real-text{font-size:13px;color:var(--ink);font-weight:500}
        .vis-feedback{margin-top:32px;display:flex;flex-direction:column;gap:10px}
        .fb{display:flex;align-items:center;gap:12px;padding:14px 16px;border-radius:12px;background:var(--bg-2);border:1px solid var(--rule);font-size:14px}
        .fb-icon{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0}
        .fb.yes .fb-icon{background:var(--moss);color:#fff;font-weight:700}.fb.no .fb-icon{background:#fde2e8;color:#be185d;font-weight:700}
        .fb strong{font-weight:500}.fb span{color:var(--ink-mute);margin-left:auto;font-family:var(--mono);font-size:11px}
        .career-grid{display:grid;grid-template-columns:1.15fr 1fr;gap:24px;align-items:start}
        @media(max-width:960px){.career-grid{grid-template-columns:1fr}}
        .ladder{background:var(--paper);border:1px solid var(--rule);border-radius:24px;padding:40px;position:relative}
        .ladder-head{margin-bottom:36px}.ladder-head .num{font-family:var(--mono);font-size:11px;letter-spacing:0.16em;color:var(--ink-mute);display:block;margin-bottom:14px}
        .ladder-head h3{font-family:var(--display);font-weight:500;font-size:30px;line-height:1.1;letter-spacing:-0.015em;margin:0 0 10px}
        .ladder-head p{margin:0;color:var(--ink-soft);font-size:15px}
        .rungs{position:relative;padding-left:8px}
        .rungs::before{content:"";position:absolute;left:13px;top:14px;bottom:14px;width:2px;background:linear-gradient(to bottom,var(--moss) 0%,var(--moss) 14%,var(--clay) 14%,var(--clay) 32%,var(--rule-strong) 32%,var(--rule-strong) 100%)}
        .rung{position:relative;padding:14px 0 14px 38px;display:flex;align-items:center;gap:12px}
        .rung-dot{position:absolute;left:6px;top:50%;transform:translateY(-50%);width:16px;height:16px;border-radius:50%;background:var(--bg);border:2px solid var(--rule-strong);z-index:2}
        .rung.done .rung-dot{background:var(--moss);border-color:var(--moss)}
        .rung.done .rung-dot::after{content:"";position:absolute;left:3px;top:5px;width:5px;height:2.5px;border-left:1.5px solid var(--paper);border-bottom:1.5px solid var(--paper);transform:rotate(-45deg)}
        .rung.next .rung-dot{background:var(--clay);border-color:var(--clay);animation:pulse 2s infinite}
        @keyframes pulse{0%{box-shadow:0 0 0 0 #4838d499}70%{box-shadow:0 0 0 8px #4838d400}100%{box-shadow:0 0 0 0 #4838d400}}
        .rung-content{flex:1}.rung-role{font-family:var(--display);font-weight:500;font-size:19px;letter-spacing:-0.01em;color:var(--ink);line-height:1.2}
        .rung:not(.done):not(.next) .rung-role{color:var(--ink-mute)}
        .rung-meta{font-family:var(--mono);font-size:11px;color:var(--ink-mute);letter-spacing:0.04em;margin-top:3px}
        .rung-tag{font-family:var(--mono);font-size:10px;letter-spacing:0.1em;text-transform:uppercase;padding:5px 10px;border-radius:999px;background:var(--bg-2);color:var(--ink-mute);white-space:nowrap}
        .rung-tag.live{background:var(--clay);color:var(--paper)}
        .career-side{display:flex;flex-direction:column;gap:24px}
        .career-card{background:var(--paper);border:1px solid var(--rule);border-radius:24px;padding:32px}
        .career-card .num{font-family:var(--mono);font-size:11px;letter-spacing:0.16em;color:var(--ink-mute);display:block;margin-bottom:14px}
        .career-card h3{font-family:var(--display);font-weight:500;font-size:24px;line-height:1.15;letter-spacing:-0.015em;margin:0 0 10px}
        .career-card>p{color:var(--ink-soft);font-size:14px;margin:0 0 22px}
        .skill-list{display:flex;flex-direction:column;gap:18px}.skill-item{display:flex;flex-direction:column;gap:8px}
        .skill-info{display:flex;justify-content:space-between;align-items:baseline;gap:12px}
        .skill-info strong{font-weight:500;font-size:14px}.skill-info span{font-family:var(--mono);font-size:11px;color:var(--ink-mute);text-align:right}
        .skill-bar{height:5px;background:var(--bg-2);border-radius:999px;overflow:hidden}
        .skill-fill{height:100%;background:linear-gradient(to right,#ff6ec4,var(--clay));border-radius:999px;transform-origin:left;animation:fillIn 1.2s cubic-bezier(.4,0,.2,1) both}
        @keyframes fillIn{from{transform:scaleX(0)}to{transform:scaleX(1)}}
        .how{background:linear-gradient(135deg,#4838d4 0%,#6b50ec 100%);color:#fff;border-radius:32px;margin:0 28px;padding:96px 0;position:relative;overflow:hidden}
        @media(max-width:720px){.how{margin:0 16px;padding:64px 0;border-radius:24px}}
        .how::before{content:"";position:absolute;top:-200px;left:-200px;width:500px;height:500px;background:radial-gradient(circle,var(--cyan) 0%,transparent 60%);opacity:0.25}
        .how .wrap{position:relative}.how .sec-eyebrow{color:var(--cyan)}.how .sec-eyebrow::before{background:var(--cyan)}
        .how h2.sec-h{color:#fff;max-width:20ch}.how h2.sec-h em{color:var(--cyan)}
        .steps{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:64px;border-top:1px solid #ffffff2f}
        @media(max-width:720px){.steps{grid-template-columns:1fr}}
        .how-step{padding:40px 32px 40px 0;border-right:1px solid #ffffff2f}.how-step:last-child{border-right:0}
        @media(max-width:720px){.how-step{border-right:0;border-bottom:1px solid #ffffff2f;padding:32px 0}.how-step:last-child{border-bottom:0}}
        .step-num{font-family:var(--mono);font-size:12px;color:var(--cyan);letter-spacing:0.14em;margin-bottom:24px}
        .how-step h4{font-family:var(--display);font-weight:600;font-size:26px;line-height:1.15;letter-spacing:-0.015em;margin:0 0 12px;color:#fff}
        .how-step p{color:#d9d4ff;font-size:15px;margin:0;line-height:1.55}
        .testimonial{text-align:center;padding:120px 0}
        .testimonial blockquote{font-family:var(--display);font-style:normal;font-weight:600;font-size:clamp(28px,4.5vw,56px);line-height:1.1;letter-spacing:-0.035em;margin:0 auto 40px;max-width:22ch;color:var(--ink)}
        .testimonial blockquote::before{content:"\201C";display:block;font-size:120px;line-height:0.6;color:var(--clay);margin-bottom:24px;font-style:normal}
        .testi-name{font-family:var(--mono);font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:var(--ink-mute)}
        .testi-name strong{color:var(--ink);font-weight:500;margin-right:10px}
        .final{background:linear-gradient(135deg,#ff6ec4 0%,#a855f7 50%,#5eead4 100%);color:#1a1466;border-radius:32px;margin:0 28px 80px;padding:96px 48px;text-align:center;position:relative;overflow:hidden}
        @media(max-width:720px){.final{margin:0 16px 64px;padding:64px 24px;border-radius:24px}}
        .final::before,.final::after{content:"";position:absolute;border-radius:50%;border:1px solid #ffffff66}
        .final::before{width:400px;height:400px;top:-200px;left:-100px}.final::after{width:300px;height:300px;bottom:-150px;right:-50px}
        .final h2{font-family:var(--display);font-weight:800;font-size:clamp(40px,6vw,80px);line-height:1;letter-spacing:-0.035em;margin:0 auto 24px;max-width:18ch;position:relative;color:#1a1466}
        .final p{font-size:18px;margin:0 auto 40px;opacity:0.85;max-width:46ch;position:relative;color:#1a1466}
        .final .btn-primary{background:#1a1466;color:#fff !important;position:relative;box-shadow:0 0 24px -8px #00000044}
        .final .btn-primary:hover{background:#0f0a4d !important;color:var(--cyan) !important}
        footer{padding:48px 0 64px;border-top:1px solid var(--rule);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:24px;font-size:13px;color:var(--ink-mute)}
        footer nav{display:flex;gap:24px}footer nav a:hover{color:var(--clay)}
        .reveal{opacity:0;transform:translateY(20px);transition:opacity .8s ease,transform .8s ease}.reveal.in{opacity:1;transform:none}
        @media(max-width:600px){
          html,body{overflow-x:hidden;max-width:100%}body{font-size:16px}
          nav.top{padding:16px 0 0}.nav-right{gap:0}.nav-right a.signin{padding:11px 18px;font-size:14px}
          header.hero{padding:36px 0 52px}.hero-grid{gap:36px}.eyebrow{margin-bottom:18px}
          h1.headline{font-size:clamp(40px,12vw,56px);line-height:1.0;max-width:100%;margin-bottom:20px}
          .sub-bridge{font-size:19px;max-width:100%;margin-bottom:14px}.sub{font-size:17px;max-width:100%;margin-bottom:28px}
          .cta-row{flex-direction:column;align-items:stretch;gap:12px}
          .cta-row .btn-primary,.cta-row .btn-secondary{width:100%;justify-content:center;padding:16px 22px;font-size:16px}
          .artifact-card{border-radius:20px}.three-up{margin-top:48px}.tu-item{padding:28px 2px}.tu-item h3{font-size:22px}
          .trust{flex-direction:column;align-items:flex-start;gap:20px;padding:24px 0}.trust-stats{gap:22px 32px}.trust-stats strong{font-size:22px}
          section{padding:60px 0}h2.sec-h{font-size:clamp(32px,9vw,40px);max-width:100%;margin-bottom:18px}.sec-sub{font-size:16px;max-width:100%;margin-bottom:40px}
          .features{gap:16px}.feature{padding:26px;border-radius:18px}.feature h3{font-size:25px;margin:36px 0 12px}
          .ladder{padding:28px;border-radius:20px}.ladder-head h3{font-size:26px}.rung-role{font-size:17px}.career-card{padding:26px;border-radius:20px}
          .how{margin:0 14px;padding:56px 0;border-radius:22px}.steps{margin-top:44px}.how-step{padding:28px 0}.how-step h4{font-size:23px}
          .testimonial{padding:64px 0}.testimonial blockquote::before{font-size:88px;margin-bottom:16px}
          .final{margin:0 14px 56px;padding:56px 22px;border-radius:22px}.final h2{font-size:clamp(34px,9vw,44px);max-width:100%}.final p{font-size:16px;max-width:100%}.final .btn-primary{width:100%;justify-content:center}
          footer{flex-direction:column;align-items:center;text-align:center;gap:20px;padding:40px 0 56px}footer nav{flex-wrap:wrap;justify-content:center;gap:18px 22px}
        }
        @media(max-width:380px){.wrap{padding:0 16px}h1.headline{font-size:38px}}
      `}</style>

      <div className="wrap">
        <nav className="top">
          <div className="maya-logo"><MayaLogo height={32} /></div>
          <div className="nav-right">
            <div className="nav-links" style={{display:'flex',gap:'28px'}}>
              <a href="#features">What you get</a>
              <a href="#career">Your career</a>
              <a href="#how">How it works</a>
            </div>
            <Link className="signin" href="/apply">Talk to Maya <MicIcon /></Link>
          </div>
        </nav>

        <header className="hero">
          <div className="hero-grid">
            <div>
              <div className="eyebrow reveal">For care workers</div>
              <h1 className="headline reveal">
                Build your <em>career</em><br />
                in care.<br />
                <span className="underline">Talk to Maya.</span>
              </h1>
              <p className="sub-bridge reveal">Whether you&apos;re starting out, moving on, or moving up.</p>
              <p className="sub reveal">
                Talk to Maya. Tell us what you&apos;re looking for — we find the right care jobs, answer every question you have about them, and apply on your behalf. Once. For every job. You never redo it.
              </p>
              <div className="cta-row reveal">
                <Link className="btn-primary" href="/apply">Talk to Maya <MicIcon /></Link>
                <a className="btn-secondary" href="#features">How it works</a>
              </div>
            </div>

            <div className="artifact-card reveal">
              <div className="ac-tabs" role="tablist">
                <button className="ac-tab is-active" data-persona="exp" role="tab" aria-selected="true">I work in care</button>
                <button className="ac-tab" data-persona="new" role="tab" aria-selected="false">I&apos;m new to care</button>
              </div>

              <div className="ac-persona is-active" data-persona="exp">
                <div className="ac-chat">
                  <div className="ac-chat-label">— ONE CONVERSATION WITH MAYA</div>
                  <div className="ac-msg ac-msg-l m1"><p>What kind of care work are you looking for?</p></div>
                  <div className="ac-msg ac-msg-y m2"><p>Care home, mornings only. Ideally dementia care.</p></div>
                  <div className="ac-msg ac-msg-l m3"><p>I&apos;ve found 3 roles that fit. Want to know more about any of them before I apply?</p></div>
                  <div className="ac-msg ac-msg-y m4"><p>Yes — what&apos;s Sunrise Care like day to day?</p></div>
                </div>
                <div className="ac-section ac-applied">
                  <div className="ac-label"><span>— MAYA APPLIED FOR YOU</span><span className="ac-applied-count">7 jobs</span></div>
                  <div className="ac-applied-row p-row pr1">
                    <div className="ac-applied-tick">✓</div>
                    <div className="ac-applied-info"><div className="ac-applied-name">Bluebell House</div><div className="ac-applied-meta">0.8 mi · £13.50/hr</div></div>
                    <div className="ac-applied-when">11 min ago</div>
                  </div>
                  <div className="ac-applied-row p-row pr2">
                    <div className="ac-applied-tick">✓</div>
                    <div className="ac-applied-info"><div className="ac-applied-name">Maple Court</div><div className="ac-applied-meta">1.4 mi · £13.25/hr</div></div>
                    <div className="ac-applied-when">11 min ago</div>
                  </div>
                  <div className="ac-applied-row p-row pr3">
                    <div className="ac-applied-tick">✓</div>
                    <div className="ac-applied-info"><div className="ac-applied-name">Sunrise Care</div><div className="ac-applied-meta">1.9 mi · £13.80/hr</div></div>
                    <div className="ac-applied-when">11 min ago</div>
                  </div>
                  <div className="ac-applied-more">+ 4 more · all matched to your preferences</div>
                </div>
                <div className="ac-section ac-compliance">
                  <div className="ac-label">— TRAVELS WITH YOU TO EVERY JOB</div>
                  <div className="ac-creds-inline">
                    <span className="ac-cred-chip">✓ DBS Enhanced</span><span className="ac-cred-chip">✓ Right to Work</span>
                    <span className="ac-cred-chip">✓ NVQ Level 3</span><span className="ac-cred-chip">✓ Care Certificate</span>
                    <span className="ac-cred-chip">✓ Medication</span><span className="ac-cred-chip">✓ Moving &amp; handling</span>
                    <span className="ac-cred-chip">✓ 5 references</span>
                  </div>
                  <div className="ac-cred-note">In your profile. Verified once, shared automatically. You never re-do this for any employer.</div>
                </div>
                <div className="ac-footer">
                  <div className="ac-footer-left"><span className="ac-footer-tick"></span><strong>3 jobs</strong> applied for</div>
                  <div className="ac-footer-right">Done. Never do this again.</div>
                </div>
              </div>

              <div className="ac-persona" data-persona="new">
                <div className="ac-chat">
                  <div className="ac-chat-label">— ASK MAYA ANYTHING</div>
                  <div className="ac-msg ac-msg-y m1"><p>I&apos;ve never worked in care. Can I actually do this?</p></div>
                  <div className="ac-msg ac-msg-l m2"><p>Yes — most care employers train you from scratch, paid from day one. What drew you to it?</p></div>
                  <div className="ac-msg ac-msg-y m3"><p>I looked after my dad. What would I earn? What would the job actually involve?</p></div>
                  <div className="ac-msg ac-msg-l m4"><p>£11.80–£13.50/hr to start near you. I can show you real roles and tell you exactly what each one involves — then apply for the ones you like.</p></div>
                </div>
                <div className="ac-section ac-profile">
                  <div className="ac-label"><span>— ASK MAYA ANYTHING</span><span className="ac-building"><span className="ac-building-dot"></span>No question&apos;s too basic</span></div>
                  <div className="ac-questions">
                    <button className="ac-question p-row pr1">What is &quot;personal care&quot;?</button>
                    <button className="ac-question p-row pr2">What&apos;s the career path like?</button>
                    <button className="ac-question p-row pr3">Do I need to drive?</button>
                    <button className="ac-question p-row pr4">Will I have to do nights?</button>
                    <button className="ac-question p-row pr5">What qualifications would I need?</button>
                    <button className="ac-question p-row pr6">Is it physically hard work?</button>
                  </div>
                </div>
                <div className="ac-section ac-compliance">
                  <div className="ac-label">— WHAT HAPPENS NEXT</div>
                  <div className="ac-step-list">
                    <div className="ac-step-row"><div className="ac-step-num">1</div><div><div className="ac-step-name">Tell us a bit about you</div><div className="ac-step-meta">5 minutes. CV optional.</div></div></div>
                    <div className="ac-step-row"><div className="ac-step-num">2</div><div><div className="ac-step-name">See entry-level roles near you</div><div className="ac-step-meta">Sorted by pay, distance, type of care.</div></div></div>
                    <div className="ac-step-row"><div className="ac-step-num">3</div><div><div className="ac-step-name">Apply. We handle DBS and training.</div><div className="ac-step-meta">Most employers cover both for new starters.</div></div></div>
                  </div>
                  <div className="ac-cred-note">Free to use. Always will be.</div>
                </div>
                <div className="ac-footer">
                  <div className="ac-footer-left"><span className="ac-footer-tick"></span><strong>14 roles</strong> your profile can apply to right now</div>
                  <div className="ac-footer-right">Done. Never do this again.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="three-up reveal">
            <div className="tu-item"><div className="tu-num">01</div><h3>Talk to Maya.</h3><p>Tell us what you&apos;re looking for. We find the right roles, tell you everything about them, and answer every question you have — before anything happens.</p></div>
            <div className="tu-item"><div className="tu-num">02</div><h3>We apply for you.</h3><p>Once you&apos;re happy with a role, Lifted applies on your behalf. Your profile, your compliance, everything the employer needs — sent automatically. No forms.</p></div>
            <div className="tu-item"><div className="tu-num">03</div><h3>Never do it again.</h3><p>Same profile. Every care job. Forever. Change roles, move area, get promoted — Lifted already knows what you need. You never start over.</p></div>
          </div>

          <div className="trust reveal">
            <div className="trust-label">Trusted across UK adult social care</div>
            <div className="trust-stats">
              <div><strong>500+</strong><span>providers on Lifted</span></div>
              <div><strong>1 tap</strong><span>to apply for any job</span></div>
              <div><strong>17</strong><span>languages supported</span></div>
            </div>
          </div>
        </header>

        <section id="features">
          <div className="sec-eyebrow">Why Maya</div>
          <h2 className="sec-h reveal">One conversation. <em>Every care job.</em></h2>
          <div className="features">
            <article className="feature big reveal">
              <div className="num">— 01 / The conversation</div>
              <h3>Tell us what you want. We find it.</h3>
              <p>Tell Maya what you&apos;re looking for — hours, location, type of care. She matches you to the right roles across 500+ UK providers and tells you everything about them.</p>
              <div className="vis-prompts">
                <div className="prompt-chip">&quot;Mornings only, around the school run&quot;</div>
                <div className="prompt-chip">&quot;Walking distance from Forest Gate&quot;</div>
                <div className="prompt-chip">&quot;No nights, my back can&apos;t take it&quot;</div>
                <div className="prompt-chip">&quot;Dementia care, on the bus route&quot;</div>
                <div className="prompt-chip">&quot;Live-in work, start January&quot;</div>
              </div>
            </article>
            <article className="feature small reveal">
              <div className="num">— 02 / We apply for you</div>
              <h3>Happy with a role? We apply.</h3>
              <p>Once you&apos;re ready, Maya applies on your behalf — your profile, your DBS, your training, everything the employer needs. You never fill in a form.</p>
              <div className="vis-real">
                <div className="real-row"><span className="real-dot good"></span><span className="real-text">Skills, experience and languages</span></div>
                <div className="real-row"><span className="real-dot good"></span><span className="real-text">Availability and how far you&apos;ll travel</span></div>
                <div className="real-row"><span className="real-dot good"></span><span className="real-text">References from past managers</span></div>
                <div className="real-row"><span className="real-dot good"></span><span className="real-text">What you&apos;re good at, in your own words</span></div>
              </div>
            </article>
            <article className="feature half reveal">
              <div className="num">— 03 / Hear back fast</div>
              <h3>Same day. No silence.</h3>
              <p>Employers come back to you the same day. A yes means a booked interview. A no comes with a reason and what to try next.</p>
              <div className="vis-feedback">
                <div className="fb yes"><div className="fb-icon">✓</div><div><strong>Sunrise Care, Walthamstow</strong><br /><span style={{fontSize:'12px',color:'var(--ink-mute)'}}>Interview Thursday 2pm. Tap to confirm.</span></div><span>11 min</span></div>
                <div className="fb yes"><div className="fb-icon">✓</div><div><strong>Bluebell House, Leyton</strong><br /><span style={{fontSize:'12px',color:'var(--ink-mute)'}}>They&apos;d like to meet you</span></div><span>2 hr</span></div>
                <div className="fb no"><div className="fb-icon">→</div><div><strong>Elmwood Lodge</strong><br /><span style={{fontSize:'12px',color:'var(--ink-mute)'}}>Already filled. Three similar roles nearby.</span></div><span>1 hr</span></div>
              </div>
            </article>
          </div>
        </section>

        <section id="career">
          <div className="sec-eyebrow">Your career</div>
          <h2 className="sec-h reveal">Care is a career. <em>We treat it like one.</em></h2>
          <p className="sec-sub reveal">Your profile stores every role, every certificate, every step forward. So you can always see where you are — and what comes next.</p>
          <div className="career-grid">
            <div className="ladder reveal">
              <div className="ladder-head">
                <div className="num">— Where you could go</div>
                <h3>A path you can see.</h3>
                <p>No more guessing what the next step looks like. Lifted shows you the route — and what unlocks it.</p>
              </div>
              <div className="rungs">
                <div className="rung done"><div className="rung-dot"></div><div className="rung-content"><div className="rung-role">Care Worker</div><div className="rung-meta">Care Certificate · 6 months</div></div><div className="rung-tag">You are here</div></div>
                <div className="rung next"><div className="rung-dot"></div><div className="rung-content"><div className="rung-role">Senior Carer</div><div className="rung-meta">NVQ Level 3 · ~£2,400/yr more</div></div><div className="rung-tag live">2 modules to go</div></div>
                <div className="rung"><div className="rung-dot"></div><div className="rung-content"><div className="rung-role">Team Leader / Lead Carer</div><div className="rung-meta">Leadership module · 1–2 yrs experience</div></div></div>
                <div className="rung"><div className="rung-dot"></div><div className="rung-content"><div className="rung-role">Deputy Manager</div><div className="rung-meta">Level 5 Diploma · ~£8,000/yr more</div></div></div>
                <div className="rung"><div className="rung-dot"></div><div className="rung-content"><div className="rung-role">Registered Manager</div><div className="rung-meta">CQC registered · runs the home</div></div></div>
              </div>
            </div>
            <div className="career-side">
              <div className="career-card reveal">
                <div className="num">— What you&apos;ve earned</div>
                <h3>Your training, always ready.</h3>
                <p>Every certificate goes into your profile — dated, verified, ready to share with any employer automatically.</p>
                <div className="skill-list">
                  <div className="skill-item"><div className="skill-info"><strong>Care Certificate</strong><span>Completed Aug 2020</span></div><div className="skill-bar"><div className="skill-fill" style={{width:'100%'}}></div></div></div>
                  <div className="skill-item"><div className="skill-info"><strong>Medication training</strong><span>Renewed Jan 2026 · next due 2027</span></div><div className="skill-bar"><div className="skill-fill" style={{width:'88%'}}></div></div></div>
                  <div className="skill-item"><div className="skill-info"><strong>Moving &amp; handling</strong><span>Renewed Jan 2026 · next due 2027</span></div><div className="skill-bar"><div className="skill-fill" style={{width:'88%'}}></div></div></div>
                  <div className="skill-item"><div className="skill-info"><strong>Dementia awareness</strong><span>Completed Mar 2024</span></div><div className="skill-bar"><div className="skill-fill" style={{width:'76%'}}></div></div></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section id="how" className="how">
        <div className="wrap">
          <div className="sec-eyebrow">How Maya works</div>
          <h2 className="sec-h">One conversation. <em>We do the rest.</em></h2>
          <div className="steps">
            <div className="how-step"><div className="step-num">— STEP 01</div><h4>Talk to Maya</h4><p>Tell Maya what you&apos;re looking for. She finds the right roles, tells you everything about them and answers every question. Your profile and compliance are stored — once, forever.</p></div>
            <div className="how-step"><div className="step-num">— STEP 02</div><h4>We apply for you</h4><p>Happy with a role? We apply on your behalf — your profile, DBS, training, everything. No forms. No repeating yourself. For this job and every job after it.</p></div>
            <div className="how-step"><div className="step-num">— STEP 03</div><h4>Hear back instantly</h4><p>Same day responses from real care employers. A yes means an interview, a no comes with a reason. No silence, no waiting.</p></div>
          </div>
        </div>
      </section>

      <div className="wrap">
        <section id="voices" className="testimonial">
          <div className="reveal">
            <blockquote>I had one conversation with Maya. Told them what I wanted, asked everything about the roles, they applied for me. Three jobs later I&apos;ve never filled in a single application form.</blockquote>
            <div className="testi-name"><strong>Grace M.</strong> Senior carer · Birmingham · on Lifted since Feb &apos;25</div>
          </div>
        </section>
      </div>

      <section className="final">
        <h2>You change lives for a living. It&apos;s time someone made yours easier.</h2>
        <p>One conversation with Maya. Tell us what you&apos;re looking for, ask everything about the roles, and we apply on your behalf. Starting out, moving on, or moving up — you never do this again.</p>
        <Link className="btn-primary" href="/apply">Talk to Maya <MicIcon /></Link>
      </section>

      <div className="wrap">
        <footer>
          <div className="maya-logo"><MayaLogo height={32} /></div>
          <nav>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Help</a>
            <a href="#">For providers</a>
          </nav>
          <div>© 2026 Maya · Built with care workers, in the UK</div>
        </footer>
      </div>
    </>
  );
}
