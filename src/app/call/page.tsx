'use client';
import { useEffect, useRef, useState } from 'react';
import { VoiceProvider, useVoice } from '@humeai/voice-react';

const MayaLogo = () => (
  <svg viewBox="0 0 110 36" fill="none" xmlns="http://www.w3.org/2000/svg" height="26">
    <path d="M4 28V8l8 12 8-12v20" stroke="var(--clay)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M30 28l7-20 7 20M33.5 20h7" stroke="var(--clay)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M52 8l6 10 6-10M58 18v10" stroke="var(--clay)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M74 28l7-20 7 20M77.5 20h7" stroke="var(--clay)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <circle cx="96" cy="26" r="2.5" fill="var(--clay)"/>
  </svg>
);

const _css = `
        :root{--bg:#ffffff;--bg-2:#f7f6ff;--paper:#ffffff;--ink:#1a1466;--ink-soft:#3a328a;--ink-mute:#7a72b8;--clay:#4838d4;--clay-deep:#2a1f8f;--moss:#16a34a;--cyan:#5eead4;--rule:#e8e6f5;--rule-strong:#d4d0eb;--display:"Manrope",ui-sans-serif,system-ui,sans-serif;--body:"Inter",ui-sans-serif,system-ui,sans-serif;--mono:"JetBrains Mono",ui-monospace,monospace}
        *,*::before,*::after{box-sizing:border-box}
        html,body{margin:0;padding:0}
        body{background:var(--bg-2);color:var(--ink);font-family:var(--body);font-size:16px;line-height:1.55;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;min-height:100vh}
        ::selection{background:var(--clay);color:#fff}
        a{color:inherit;text-decoration:none}
        button{font:inherit;color:inherit;border:0;background:none;cursor:pointer}
        .app-head{background:rgba(255,255,255,0.92);backdrop-filter:saturate(160%) blur(10px);border-bottom:1px solid var(--rule)}
        .app-head-inner{max-width:520px;margin:0 auto;padding:16px 20px;display:flex;align-items:center;justify-content:center}
        .maya-logo svg{display:block}
        main{max-width:520px;margin:0 auto;padding:36px 20px 64px;text-align:center}
        h1.greet{font-family:var(--display);font-weight:700;font-size:clamp(26px,7vw,32px);line-height:1.12;letter-spacing:-0.025em;color:var(--ink);margin:8px auto 16px;max-width:18ch;text-wrap:balance}
        p.lede{font-size:16px;line-height:1.5;color:var(--ink-soft);max-width:40ch;margin:0 auto 22px}
        .ai-pill{display:inline-flex;align-items:center;gap:8px;font-family:var(--mono);font-size:12px;letter-spacing:0.01em;color:var(--clay);background:#ece9ff;border:1px solid #ddd6ff;padding:8px 14px;border-radius:999px;margin-bottom:34px}
        .ai-pill svg{width:14px;height:14px}
        .call-card{background:var(--paper);border:1px solid var(--rule);border-radius:24px;box-shadow:0 1px 0 #1a146611,0 30px 70px -28px #1a146633;padding:44px 28px 30px;max-width:420px;margin:0 auto}
        .avatar-wrap{position:relative;width:108px;height:108px;margin:0 auto 22px;display:flex;align-items:center;justify-content:center}
        .avatar{width:92px;height:92px;border-radius:50%;background:linear-gradient(150deg,var(--clay),#6b50ec);color:#fff;display:flex;align-items:center;justify-content:center;font-family:var(--display);font-weight:700;font-size:38px;letter-spacing:-0.02em;position:relative;z-index:2;box-shadow:0 14px 32px -12px var(--clay)}
        .ring{position:absolute;inset:0;border-radius:50%;border:2px solid var(--clay);opacity:0;z-index:1}
        body.in-call .ring{animation:ring 2.4s ease-out infinite}
        body.in-call .ring.r2{animation-delay:.8s}
        body.in-call .ring.r3{animation-delay:1.6s}
        @keyframes ring{0%{transform:scale(.85);opacity:.5}100%{transform:scale(1.45);opacity:0}}
        .status{font-family:var(--display);font-weight:500;font-size:16px;color:var(--ink-soft);margin-bottom:22px;min-height:1.4em}
        .status .live-dot{display:none;width:8px;height:8px;border-radius:50%;background:var(--moss);margin-right:8px;vertical-align:1px}
        body.in-call .status .live-dot{display:inline-block;animation:blink 1.4s infinite}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.35}}
        .timer{display:none;font-family:var(--mono);font-size:13px;color:var(--ink-mute);margin-bottom:18px;letter-spacing:0.04em}
        body.in-call .timer{display:block}
        .btn{width:100%;background:var(--clay);color:#fff;font-family:var(--display);font-weight:700;font-size:17px;letter-spacing:-0.01em;padding:17px;border-radius:999px;transition:background .2s,transform .12s,box-shadow .2s;box-shadow:0 12px 28px -12px var(--clay);display:inline-flex;align-items:center;justify-content:center;gap:11px}
        .btn svg{width:19px;height:19px}
        .btn:hover{background:var(--clay-deep);transform:translateY(-1px)}.btn:active{transform:translateY(0)}
        .btn:disabled{opacity:0.6;cursor:not-allowed;transform:none}
        .btn-end{width:100%;background:#fff;color:var(--ink);border:1px solid var(--rule-strong);font-family:var(--display);font-weight:600;font-size:16px;padding:16px;border-radius:999px;display:none;align-items:center;justify-content:center;gap:10px;transition:border-color .2s,color .2s,background .2s}
        .btn-end .x{width:18px;height:18px;border-radius:50%;background:#be185d;color:#fff;display:flex;align-items:center;justify-content:center;font-size:11px}
        .btn-end:hover{border-color:#be185d;color:#be185d}
        body.in-call .btn-start{display:none}
        body.in-call .btn-end{display:inline-flex}
        .footnote{font-size:12px;color:var(--ink-mute);margin:18px auto 0;max-width:36ch;line-height:1.4}
        .thank-you{padding:32px 0}
        .thank-you h2{font-family:var(--display);font-weight:700;font-size:24px;color:var(--ink);margin:0 0 12px}
        .thank-you p{font-size:16px;color:var(--ink-soft);margin:0}
        .err-msg{font-size:13px;color:#be185d;margin-top:12px}
        @media(max-width:380px){main,.app-head-inner{padding-left:16px;padding-right:16px}.call-card{padding:36px 20px 26px}}
      `;

// Outer shell: provides VoiceProvider context
export default function CallPage() {
  return (
    <>
      <style>{_css}</style>
      <header className="app-head">
        <div className="app-head-inner">
          <div className="maya-logo"><MayaLogo /></div>
        </div>
      </header>
      <VoiceProvider
        clearMessagesOnDisconnect={false}
        onError={(err) => console.error('[Hume]', err.type, err.reason ?? err.message)}
      >
        <CallContent />
      </VoiceProvider>
    </>
  );
}

// Inner shell: consumes useVoice() and owns all call logic
function CallContent() {
  const { status, connect, disconnect, messages, sendUserInput, pauseAssistant, resumeAssistant, error: humeError } = useVoice();

  const [firstName, setFirstName] = useState('');
  const [appId, setAppId]         = useState<string | null>(null);
  const [callDone, setCallDone]   = useState(false);
  const [callError, setCallError] = useState<string | null>(null);
  const [timerDisplay, setTimerDisplay] = useState('00:00');

  const timerRef       = useRef<ReturnType<typeof setInterval> | null>(null);
  const tRef           = useRef(0);
  const contextSentRef = useRef(false);
  const contextBlockRef = useRef<string | null>(null);

  // Read sessionStorage on mount (safe: client only)
  useEffect(() => {
    try {
      const n  = (sessionStorage.getItem('maya_first_name') ?? '').trim();
      const id = sessionStorage.getItem('maya_app_id') ?? null;
      setFirstName(n);
      setAppId(id);
    } catch { void 0; }
  }, []);

  const isConnected  = status.value === 'connected';
  const isConnecting = status.value === 'connecting';
  const isError      = status.value === 'error';

  // Surface async Hume errors (mic denied, socket failures, etc.) into UI
  useEffect(() => {
    if (humeError) {
      if (humeError.type === 'mic_error') {
        setCallError('Microphone access was denied. Please allow microphone access and try again.');
      } else if (humeError.type === 'socket_error') {
        setCallError('Connection to Maya failed. Please check your internet and try again.');
      } else {
        setCallError('Something went wrong. Please try again.');
      }
    }
  }, [humeError]);

  // Sync body.in-call class — drives all CSS-based UI toggles
  useEffect(() => {
    document.body.classList.toggle('in-call', isConnected);
  }, [isConnected]);

  // Timer — starts when connected, stops otherwise
  useEffect(() => {
    if (isConnected) {
      tRef.current = 0;
      setTimerDisplay('00:00');
      timerRef.current = setInterval(() => {
        tRef.current++;
        const m  = String(Math.floor(tRef.current / 60)).padStart(2, '0');
        const ss = String(tRef.current % 60).padStart(2, '0');
        setTimerDisplay(`${m}:${ss}`);
      }, 1000);
    } else {
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isConnected]);

  // Send candidate context once — exactly once — when connection opens
  useEffect(() => {
    if (status.value === 'connected' && !contextSentRef.current && contextBlockRef.current) {
      contextSentRef.current = true;
      pauseAssistant();
      sendUserInput(contextBlockRef.current);
      setTimeout(() => resumeAssistant(), 1500);
    }
    if (status.value === 'disconnected') {
      contextSentRef.current = false;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status.value]);

  // Cleanup on unmount
  useEffect(() => {
    return () => { document.body.classList.remove('in-call'); };
  }, []);

  const startCall = async () => {
    setCallError(null);
    contextSentRef.current = false;
    try {
      // 1. Get Hume access token (server exchanges client credentials)
      const tokenRes = await fetch('/api/hume-token');
      if (!tokenRes.ok) throw new Error('Could not get access token');
      const { accessToken } = await tokenRes.json() as { accessToken: string };

      // 2. Fetch candidate context (session-cookie gated)
      if (appId) {
        const ctxRes = await fetch(`/api/candidate-context?appId=${encodeURIComponent(appId)}`);
        if (ctxRes.ok) {
          const { contextBlock } = await ctxRes.json() as { contextBlock: string };
          contextBlockRef.current = contextBlock;
        }
      }

      // 3. Open Hume EVI WebSocket
      const configId = process.env.NEXT_PUBLIC_HUME_CONFIG_ID ?? '';
      await connect({
        auth: { type: 'accessToken', value: accessToken },
        ...(configId ? { configId } : {}),
      });
    } catch (err) {
      console.error('Start call error:', err);
      setCallError('Could not connect — check microphone permissions and try again.');
    }
  };

  const endCall = () => {
    // Extract conversation transcript (filter out the injected context block)
    const transcript = messages
      .filter(m => m.type === 'user_message' || m.type === 'assistant_message')
      .map(m => {
        const msg = m as { type: string; message: { role: string; content: string } };
        return { role: msg.message.role, content: msg.message.content };
      })
      .filter(m => !m.content.startsWith('CANDIDATE CONTEXT'));

    disconnect();
    setCallDone(true);

    // Fire-and-forget assessment — non-blocking so the thank-you screen shows immediately
    if (appId && transcript.length > 0) {
      fetch('/api/save-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId: appId, transcript }),
      }).catch(err => console.error('save-assessment error:', err));
    }
  };

  const cap = firstName
    ? firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase()
    : '';
  const greetText = cap
    ? `Great, ${cap}! It's really nice to meet you.`
    : "Great, it's really nice to meet you.";

  const statusText = isConnecting
    ? 'Connecting to Maya…'
    : isConnected
      ? 'Connected · Maya is listening'
      : isError
        ? 'Connection error — please try again'
        : callDone
          ? 'Call ended — thanks for chatting with Maya'
          : 'Maya is ready when you are';

  return (
    <main>
      <h1 className="greet">{greetText}</h1>
      <p className="lede">A quick, informal chat about your experience — no right or wrong answers, just be yourself.</p>

      <div className="ai-pill">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.5v.5"/>
        </svg>
        Maya is an AI screening assistant, not a human
      </div>

      <div className="call-card">
        {callDone ? (
          <div className="thank-you">
            <h2>Thanks{cap ? `, ${cap}` : ''}!</h2>
            <p>We&apos;ll be in touch within 2 working days.</p>
          </div>
        ) : (
          <>
            <div className="avatar-wrap">
              <span className="ring r1"></span>
              <span className="ring r2"></span>
              <span className="ring r3"></span>
              <div className="avatar">M</div>
            </div>

            <div className="status">
              {(isConnecting || isConnected) && <span className="live-dot"></span>}
              {statusText}
            </div>
            <div className="timer">{timerDisplay}</div>

            <button
              className="btn btn-start"
              onClick={startCall}
              disabled={isConnecting}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="3" width="6" height="12" rx="3"/>
                <path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>
              </svg>
              {isConnecting ? 'Connecting…' : 'Start Call with Maya'}
            </button>

            <button className="btn-end" onClick={endCall}>
              <span className="x">✕</span>
              End call
            </button>

            {callError && <p className="err-msg">{callError}</p>}

            <p className="footnote">This call may be recorded for quality and compliance purposes.</p>
          </>
        )}
      </div>
    </main>
  );
}
