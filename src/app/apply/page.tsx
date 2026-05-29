'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const MayaLogo = () => (
  <svg viewBox="0 0 110 36" fill="none" xmlns="http://www.w3.org/2000/svg" height="26">
    <path d="M4 28V8l8 12 8-12v20" stroke="var(--clay)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M30 28l7-20 7 20M33.5 20h7" stroke="var(--clay)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M52 8l6 10 6-10M58 18v10" stroke="var(--clay)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M74 28l7-20 7 20M77.5 20h7" stroke="var(--clay)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <circle cx="96" cy="26" r="2.5" fill="var(--clay)"/>
  </svg>
);

const ChevronDown = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
    <path d="M6 9l6 6 6-6"/>
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
    <path d="M20 6L9 17l-5-5"/>
  </svg>
);

export default function ApplyPage() {
  const router = useRouter();
  const completedRef = useRef(new Set<number>());

  useEffect(() => {
    const completed = completedRef.current;

    function reached() {
      return (completed.size ? Math.max(...completed) : 0) + 1;
    }

    function updateProgress(openN: number) {
      const segs = document.querySelectorAll<HTMLElement>('.progress-seg');
      segs.forEach((s, i) => {
        s.classList.remove('done', 'active');
        const no = i + 1;
        if (completed.has(no)) s.classList.add('done');
        else if (no === openN) s.classList.add('active');
      });
    }

    function openStep(n: number) {
      [1, 2, 3].forEach(i => {
        const el = document.getElementById(`step-${i}`);
        if (!el) return;
        el.classList.toggle('is-open', i === n);
        el.classList.toggle('done', completed.has(i));
        el.classList.toggle('locked', i > reached());
      });
      updateProgress(n);
    }

    function scrollToEl(el: HTMLElement) {
      const y = el.getBoundingClientRect().top + window.pageYOffset - 88;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }

    // Continue / Submit buttons
    const continueHandlers = new Map<HTMLElement, () => void>();
    document.querySelectorAll<HTMLElement>('.btn[data-continue]').forEach(btn => {
      const handler = () => {
        const n = parseInt(btn.dataset.continue!, 10);
        completed.add(n);
        if (n < 3) {
          openStep(n + 1);
          requestAnimationFrame(() => {
            const el = document.getElementById(`step-${n + 1}`);
            if (el) scrollToEl(el);
          });
        } else {
          const nameInput = document.getElementById('name') as HTMLInputElement;
          const first = (nameInput?.value.trim().split(/\s+/)[0]) || '';
          try { sessionStorage.setItem('maya_first_name', first); } catch (e) { void e; }
          router.push('/call');
        }
      };
      continueHandlers.set(btn, handler);
      btn.addEventListener('click', handler);
    });

    // Step head tap to reopen
    const headHandlers = new Map<HTMLElement, () => void>();
    [1, 2, 3].forEach(i => {
      const head = document.querySelector<HTMLElement>(`#step-${i} .step-head`);
      if (!head) return;
      const handler = () => {
        if (i > reached()) return;
        const el = document.getElementById(`step-${i}`);
        if (el?.classList.contains('is-open')) return;
        openStep(i);
        requestAnimationFrame(() => {
          const stepEl = document.getElementById(`step-${i}`);
          if (stepEl) scrollToEl(stepEl);
        });
      };
      headHandlers.set(head, handler);
      head.addEventListener('click', handler);
    });

    // CV upload
    const dz = document.getElementById('dropzone') as HTMLLabelElement | null;
    const cvInput = document.getElementById('cv') as HTMLInputElement | null;
    const cvName = document.getElementById('cv-name');
    function showFile(name: string) {
      if (cvName) cvName.textContent = name;
      dz?.classList.add('has-file');
    }
    const cvChange = () => { if (cvInput?.files?.[0]) showFile(cvInput.files[0].name); };
    const dragEnter = (e: Event) => { e.preventDefault(); dz?.classList.add('drag'); };
    const dragLeave = (e: Event) => { e.preventDefault(); dz?.classList.remove('drag'); };
    const drop = (e: DragEvent) => {
      e.preventDefault();
      dz?.classList.remove('drag');
      const f = e.dataTransfer?.files[0];
      if (f && cvInput) { try { cvInput.files = e.dataTransfer!.files; } catch { void 0; } showFile(f.name); }
    };
    cvInput?.addEventListener('change', cvChange);
    dz?.addEventListener('dragenter', dragEnter);
    dz?.addEventListener('dragover', dragEnter);
    dz?.addEventListener('dragleave', dragLeave);
    dz?.addEventListener('drop', drop as EventListener);

    // Visa modal
    const immigration = document.getElementById('immigration') as HTMLSelectElement | null;
    const overlay = document.getElementById('visaOverlay');
    const visaOther = document.getElementById('visaOther');
    const visaOtherText = document.getElementById('visaOtherText') as HTMLInputElement | null;
    const visaConfirm = document.getElementById('visaConfirm') as HTMLButtonElement | null;
    const visaChip = document.getElementById('visaChip');
    const visaChipText = document.getElementById('visaChipText');
    let prevImmigration = '';

    function openVisa() { overlay?.classList.add('open'); document.body.style.overflow = 'hidden'; }
    function closeVisa() { overlay?.classList.remove('open'); document.body.style.overflow = ''; }

    const immigrationChange = () => {
      if (immigration?.value === 'visa') { openVisa(); }
      else { prevImmigration = immigration?.value || ''; visaChip?.classList.remove('show'); }
    };
    immigration?.addEventListener('change', immigrationChange);

    function getVisaChoice(): string | null {
      const sel = document.querySelector<HTMLInputElement>('#visaOptions input:checked');
      if (!sel) return null;
      if (sel.value === 'other') {
        const t = visaOtherText?.value.trim() || '';
        return t || null;
      }
      return sel.value;
    }
    function validateVisa() { if (visaConfirm) visaConfirm.disabled = !getVisaChoice(); }

    const visaRadioHandlers = new Map<HTMLElement, () => void>();
    document.querySelectorAll<HTMLInputElement>('#visaOptions input').forEach(r => {
      const handler = () => {
        const isOther = r.value === 'other';
        visaOther?.classList.toggle('show', isOther);
        validateVisa();
        if (isOther) visaOtherText?.focus();
      };
      visaRadioHandlers.set(r, handler);
      r.addEventListener('change', handler);
    });
    visaOtherText?.addEventListener('input', validateVisa);

    const visaConfirmClick = () => {
      const choice = getVisaChoice();
      if (!choice) return;
      if (visaChipText) visaChipText.textContent = 'On a visa · ' + choice;
      visaChip?.classList.add('show');
      prevImmigration = 'visa';
      closeVisa();
    };
    visaConfirm?.addEventListener('click', visaConfirmClick);

    const visaEditBtn = document.getElementById('visaEdit');
    visaEditBtn?.addEventListener('click', openVisa);

    const overlayClick = (e: MouseEvent) => {
      if (e.target === overlay) {
        if (!visaChip?.classList.contains('show') && immigration) { immigration.value = prevImmigration; }
        closeVisa();
      }
    };
    overlay?.addEventListener('click', overlayClick as EventListener);

    return () => {
      continueHandlers.forEach((h, el) => el.removeEventListener('click', h));
      headHandlers.forEach((h, el) => el.removeEventListener('click', h));
      cvInput?.removeEventListener('change', cvChange);
      dz?.removeEventListener('dragenter', dragEnter);
      dz?.removeEventListener('dragover', dragEnter);
      dz?.removeEventListener('dragleave', dragLeave);
      dz?.removeEventListener('drop', drop as EventListener);
      immigration?.removeEventListener('change', immigrationChange);
      visaRadioHandlers.forEach((h, el) => el.removeEventListener('change', h));
      visaOtherText?.removeEventListener('input', validateVisa);
      visaConfirm?.removeEventListener('click', visaConfirmClick);
      visaEditBtn?.removeEventListener('click', openVisa);
      overlay?.removeEventListener('click', overlayClick as EventListener);
    };
  }, [router]);

  return (
    <>
      <style>{`
        :root{--bg:#ffffff;--bg-2:#f7f6ff;--paper:#ffffff;--ink:#1a1466;--ink-soft:#3a328a;--ink-mute:#7a72b8;--clay:#4838d4;--clay-deep:#2a1f8f;--moss:#16a34a;--cyan:#5eead4;--rule:#e8e6f5;--rule-strong:#d4d0eb;--display:"Manrope",ui-sans-serif,system-ui,sans-serif;--body:"Inter",ui-sans-serif,system-ui,sans-serif;--mono:"JetBrains Mono",ui-monospace,monospace}
        *,*::before,*::after{box-sizing:border-box}
        html,body{margin:0;padding:0;scroll-behavior:smooth}
        body{background:var(--bg-2);color:var(--ink);font-family:var(--body);font-size:16px;line-height:1.55;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
        ::selection{background:var(--clay);color:#fff}
        a{color:inherit;text-decoration:none}
        button{font:inherit;color:inherit;border:0;background:none;cursor:pointer}
        .app-head{position:sticky;top:0;z-index:20;background:rgba(255,255,255,0.92);backdrop-filter:saturate(160%) blur(10px);border-bottom:1px solid var(--rule)}
        .app-head-inner{max-width:520px;margin:0 auto;padding:14px 20px;display:flex;align-items:center;justify-content:space-between;gap:12px}
        .back{display:inline-flex;align-items:center;gap:7px;font-size:14px;font-weight:500;color:var(--ink-soft);padding:6px 4px}
        .back svg{width:16px;height:16px}.back:hover{color:var(--clay)}
        .maya-logo svg{display:block}
        .progress{max-width:520px;margin:0 auto;padding:16px 20px 4px;display:flex;gap:8px}
        .progress-seg{flex:1;height:5px;border-radius:999px;background:var(--rule);overflow:hidden;position:relative}
        .progress-seg::after{content:"";position:absolute;inset:0;background:var(--clay);transform:scaleX(0);transform-origin:left;transition:transform .5s cubic-bezier(.4,0,.2,1)}
        .progress-seg.done::after{transform:scaleX(1)}.progress-seg.active::after{transform:scaleX(0.5)}
        main{max-width:520px;margin:0 auto;padding:8px 20px 64px}
        .intro{font-family:var(--display);font-weight:600;font-size:22px;line-height:1.3;letter-spacing:-0.015em;color:var(--ink);margin:22px 0 14px;max-width:24ch}
        @keyframes stepIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
        .step{margin-bottom:0}.step+.step{border-top:1px solid var(--rule)}
        .step-head{width:100%;display:flex;align-items:center;justify-content:space-between;gap:14px;padding:22px 0;text-align:left;cursor:default}
        .step-title{font-family:var(--display);font-weight:700;font-size:26px;letter-spacing:-0.02em;line-height:1.1;margin:0;color:var(--ink);transition:opacity .3s,color .3s;display:flex;align-items:center;gap:12px}
        .step-tick{width:24px;height:24px;border-radius:50%;background:var(--moss);color:#fff;display:none;align-items:center;justify-content:center;flex-shrink:0}
        .step.done .step-tick{display:flex}
        .chev{width:22px;height:22px;flex-shrink:0;color:var(--ink-mute);transition:transform .3s,color .3s,opacity .3s}
        .step.locked .step-title{opacity:.34}.step.locked .chev{opacity:.4}
        .step.done .step-title{opacity:.62}.step.is-open .step-title{opacity:1}
        .step.done .step-head,.step.is-open.done .step-head{cursor:pointer}
        .step.is-open .chev{transform:rotate(180deg);color:var(--clay)}
        .step-body{display:none;padding-bottom:10px}
        .step.is-open .step-body{display:block;animation:stepIn .45s cubic-bezier(.4,0,.2,1) both}
        .field{margin-bottom:22px}
        .field>label{display:block;font-family:var(--display);font-weight:600;font-size:14px;color:var(--ink);margin-bottom:9px}
        .field .opt{color:var(--ink-mute);font-weight:500}
        .input,select.input{width:100%;font-family:var(--body);font-size:16px;color:var(--ink);background:var(--paper);border:1px solid var(--rule-strong);border-radius:12px;padding:15px 16px;transition:border-color .18s,box-shadow .18s;appearance:none;-webkit-appearance:none}
        .input::placeholder{color:var(--ink-mute);opacity:.85}
        .input:focus,select.input:focus{outline:0;border-color:var(--clay);box-shadow:0 0 0 4px #4838d422}
        .select-wrap{position:relative}
        .select-wrap::after{content:"";position:absolute;right:18px;top:50%;width:9px;height:9px;margin-top:-6px;border-right:2px solid var(--ink-mute);border-bottom:2px solid var(--ink-mute);transform:rotate(45deg);pointer-events:none}
        select.input{padding-right:42px;cursor:pointer}
        select.input:invalid{color:var(--ink-mute)}
        .dropzone{border:1.5px dashed var(--rule-strong);border-radius:16px;padding:30px 20px;text-align:center;background:var(--paper);cursor:pointer;transition:border-color .18s,background .18s}
        .dropzone:hover,.dropzone.drag{border-color:var(--clay);background:var(--bg-2)}
        .dz-icon{width:46px;height:46px;border-radius:50%;background:var(--bg-2);border:1px solid var(--rule);display:flex;align-items:center;justify-content:center;margin:0 auto 14px;color:var(--ink-mute)}
        .dropzone:hover .dz-icon,.dropzone.drag .dz-icon{color:var(--clay);border-color:var(--rule-strong)}
        .dz-icon svg{width:20px;height:20px}
        .dz-title{font-family:var(--display);font-weight:600;font-size:16px;color:var(--ink)}
        .dz-sub{font-size:13px;color:var(--ink-mute);margin-top:3px}
        .dz-file{display:none;align-items:center;gap:10px;justify-content:center;font-family:var(--display);font-weight:600;color:var(--clay)}
        .dropzone.has-file .dz-prompt{display:none}.dropzone.has-file .dz-file{display:flex}
        .radio-group{display:flex;flex-direction:column;gap:2px}
        .radio{display:flex;align-items:center;gap:13px;padding:15px 4px;cursor:pointer;border-bottom:1px solid var(--rule);transition:padding-left .15s}
        .radio:last-child{border-bottom:0}.radio:hover{padding-left:8px}
        .radio input{position:absolute;opacity:0;pointer-events:none}
        .radio .dot{width:21px;height:21px;border-radius:50%;border:2px solid var(--rule-strong);flex-shrink:0;position:relative;transition:border-color .15s}
        .radio:hover .dot{border-color:var(--ink-mute)}
        .radio input:checked+.dot{border-color:var(--clay)}
        .radio input:checked+.dot::after{content:"";position:absolute;inset:3px;background:var(--clay);border-radius:50%}
        .radio .rlabel{font-family:var(--display);font-weight:500;font-size:16px;color:var(--ink)}
        .radio input:checked~.rlabel{font-weight:600}
        .btn{width:100%;background:var(--clay);color:#fff;font-family:var(--display);font-weight:700;font-size:16px;letter-spacing:-0.01em;padding:17px;border-radius:999px;margin-top:10px;transition:background .2s,transform .12s,box-shadow .2s;box-shadow:0 10px 26px -12px var(--clay);display:inline-flex;align-items:center;justify-content:center;gap:10px}
        .btn:hover{background:var(--clay-deep);transform:translateY(-1px)}.btn:active{transform:translateY(0)}
        .btn svg{width:18px;height:18px}.btn[disabled]{opacity:.5;cursor:not-allowed;transform:none;box-shadow:none}
        .visa-chip{display:none;align-items:center;gap:8px;margin-top:10px;font-family:var(--mono);font-size:12px;color:var(--clay)}
        .visa-chip.show{display:inline-flex}
        .visa-chip button{font-family:var(--body);font-size:12px;color:var(--ink-mute);text-decoration:underline;text-underline-offset:2px}
        .visa-chip button:hover{color:var(--clay)}
        .overlay{position:fixed;inset:0;z-index:50;background:#1a146655;backdrop-filter:blur(3px);display:none;align-items:flex-end;justify-content:center;padding:0}
        .overlay.open{display:flex;animation:fadeIn .2s ease both}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        .modal{background:var(--paper);width:100%;max-width:520px;border-radius:24px 24px 0 0;padding:8px 22px 26px;animation:sheetUp .32s cubic-bezier(.4,0,.2,1) both;max-height:90vh;overflow-y:auto}
        @keyframes sheetUp{from{transform:translateY(100%)}to{transform:none}}
        .modal-grab{width:40px;height:4px;border-radius:999px;background:var(--rule-strong);margin:8px auto 18px}
        .modal h2{font-family:var(--display);font-weight:700;font-size:22px;letter-spacing:-0.02em;margin:0 0 4px;color:var(--ink)}
        .modal p.sub{font-size:14px;color:var(--ink-mute);margin:0 0 20px}
        .visa-other{display:none;margin-top:6px;margin-bottom:4px;animation:stepIn .35s ease both}
        .visa-other.show{display:block}
        @media(min-width:560px){.overlay{align-items:center;padding:24px}.modal{border-radius:24px}.modal-grab{display:none}}
        @media(max-width:380px){main,.app-head-inner,.progress{padding-left:16px;padding-right:16px}.step-title{font-size:24px}}
      `}</style>

      <header className="app-head">
        <div className="app-head-inner">
          <Link className="back" href="/">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
            Back
          </Link>
          <div className="maya-logo"><MayaLogo /></div>
        </div>
      </header>

      <div className="progress" id="progress" aria-hidden="true">
        <div className="progress-seg active" data-seg="0"></div>
        <div className="progress-seg" data-seg="1"></div>
        <div className="progress-seg" data-seg="2"></div>
      </div>

      <main>
        <p className="intro">We just need a few details so that Maya can place you best!</p>

        {/* STEP 1 */}
        <section className="step is-open" id="step-1" data-step="1">
          <div className="step-head">
            <h1 className="step-title">
              <span className="step-tick"><CheckIcon /></span>
              Your details
            </h1>
            <span className="chev"><ChevronDown /></span>
          </div>
          <div className="step-body">
            <div className="field">
              <label htmlFor="cv">CV <span className="opt">(optional)</span></label>
              <label className="dropzone" id="dropzone" htmlFor="cv">
                <input type="file" id="cv" accept=".pdf,.doc,.docx" hidden />
                <div className="dz-prompt">
                  <div className="dz-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 16V4M7 9l5-5 5 5M5 20h14"/>
                    </svg>
                  </div>
                  <div className="dz-title">Upload your CV</div>
                  <div className="dz-sub">PDF or DOCX · Max 5MB</div>
                </div>
                <div className="dz-file">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                  <span id="cv-name">file.pdf</span>
                </div>
              </label>
            </div>
            <div className="field">
              <label htmlFor="name">Full name</label>
              <input className="input" type="text" id="name" placeholder="John Smith" autoComplete="name" />
            </div>
            <div className="field">
              <label htmlFor="mobile">Mobile number</label>
              <input className="input" type="tel" id="mobile" placeholder="+44 7123 456789" autoComplete="tel" />
            </div>
            <div className="field">
              <label htmlFor="email">Email address</label>
              <input className="input" type="email" id="email" placeholder="john.smith@email.com" autoComplete="email" />
            </div>
            <div className="field">
              <label htmlFor="gender">Gender identity</label>
              <div className="select-wrap">
                <select className="input" id="gender" required defaultValue="">
                  <option value="" disabled>Select your gender identity</option>
                  <option>Female</option>
                  <option>Male</option>
                  <option>Non-binary</option>
                  <option>Prefer to self-describe</option>
                  <option>Prefer not to say</option>
                </select>
              </div>
            </div>
            <button className="btn" data-continue="1">Continue</button>
          </div>
        </section>

        {/* STEP 2 */}
        <section className="step locked" id="step-2" data-step="2">
          <div className="step-head">
            <h1 className="step-title">
              <span className="step-tick"><CheckIcon /></span>
              Right to work &amp; location
            </h1>
            <span className="chev"><ChevronDown /></span>
          </div>
          <div className="step-body">
            <div className="field">
              <label htmlFor="immigration">Immigration status</label>
              <div className="select-wrap">
                <select className="input" id="immigration" required defaultValue="">
                  <option value="" disabled>Select your immigration status</option>
                  <option value="citizen">UK citizen</option>
                  <option value="ilr">Indefinite leave to remain</option>
                  <option value="visa">On a visa</option>
                </select>
              </div>
              <span className="visa-chip" id="visaChip">
                <span id="visaChipText">Visa</span>
                <button type="button" id="visaEdit">Change</button>
              </span>
            </div>
            <div className="field">
              <label htmlFor="postcode">Full UK postcode</label>
              <input className="input" type="text" id="postcode" placeholder="SW1A 1AA" autoComplete="postal-code" style={{textTransform:'uppercase'}} />
            </div>
            <button className="btn" data-continue="2">Continue</button>
          </div>
        </section>

        {/* STEP 3 */}
        <section className="step locked" id="step-3" data-step="3">
          <div className="step-head">
            <h1 className="step-title">
              <span className="step-tick"><CheckIcon /></span>
              Driving licence
            </h1>
            <span className="chev"><ChevronDown /></span>
          </div>
          <div className="step-body">
            <div className="field">
              <div className="radio-group">
                <label className="radio">
                  <input type="radio" name="licence" value="none" />
                  <span className="dot"></span>
                  <span className="rlabel">No Driving Licence</span>
                </label>
                <label className="radio">
                  <input type="radio" name="licence" value="full" />
                  <span className="dot"></span>
                  <span className="rlabel">Full UK Driving Licence</span>
                </label>
                <label className="radio">
                  <input type="radio" name="licence" value="provisional" />
                  <span className="dot"></span>
                  <span className="rlabel">Provisional Licence</span>
                </label>
              </div>
            </div>
            <button className="btn" data-continue="3">
              Submit application
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6"/>
              </svg>
            </button>
          </div>
        </section>
      </main>

      {/* VISA MODAL */}
      <div className="overlay" id="visaOverlay" role="dialog" aria-modal="true" aria-labelledby="visaTitle">
        <div className="modal">
          <div className="modal-grab"></div>
          <h2 id="visaTitle">What visa are you on?</h2>
          <p className="sub">This helps us confirm your right to work for every role.</p>
          <div className="radio-group" id="visaOptions">
            <label className="radio"><input type="radio" name="visa" value="Graduate" /><span className="dot"></span><span className="rlabel">Graduate</span></label>
            <label className="radio"><input type="radio" name="visa" value="Student" /><span className="dot"></span><span className="rlabel">Student</span></label>
            <label className="radio"><input type="radio" name="visa" value="Skilled worker" /><span className="dot"></span><span className="rlabel">Skilled worker</span></label>
            <label className="radio"><input type="radio" name="visa" value="Health and social care" /><span className="dot"></span><span className="rlabel">Health and social care</span></label>
            <label className="radio"><input type="radio" name="visa" value="other" /><span className="dot"></span><span className="rlabel">Other visa type</span></label>
          </div>
          <div className="field visa-other" id="visaOther">
            <label htmlFor="visaOtherText">What&apos;s your visa type?</label>
            <input className="input" type="text" id="visaOtherText" placeholder="Type your visa" />
          </div>
          <button className="btn" id="visaConfirm" disabled>Confirm</button>
        </div>
      </div>
    </>
  );
}
