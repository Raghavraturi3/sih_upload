// Main AI Voice Assistant & Admin Copilot Mission-Control Widget
import Chart from 'chart.js/auto';
import { ASSISTANT_STATES, COMMAND_RISK, DATA_BADGES, LANGUAGES, LANGUAGE_LABELS, STATE_LABELS } from '../types.js';
import { SpeechRecognitionService, TextToSpeechService } from '../services/speechService.js';
import { CommandEngine } from '../services/commandEngine.js';

export class AIAssistantWidget {
  constructor(options = {}) {
    this.routerCallback = options.routerCallback || null;
    this.telemetry = options.telemetry || null;

    this.isOpen = false;
    this.state = ASSISTANT_STATES.IDLE;
    this.selectedLanguage = LANGUAGES.AUTO;
    this.activeChartInstance = null;

    // Services
    this.commandEngine = new CommandEngine({ routerCallback: this.routerCallback });
    this.speechService = new SpeechRecognitionService({
      onStart: () => this.handleSpeechStart(),
      onInterimResult: (text) => this.handleInterimSpeech(text),
      onFinalResult: (text) => this.handleFinalSpeech(text),
      onError: (msg, code) => this.handleSpeechError(msg, code),
      onEnd: () => this.handleSpeechEnd()
    });

    this.ttsService = new TextToSpeechService({
      onStart: () => this.setWaveformActive(true),
      onEnd: () => {
        if (this.state !== ASSISTANT_STATES.LISTENING) {
          this.setWaveformActive(false);
        }
      }
    });

    this.initDOM();
    this.initEvents();
    this.renderWelcome();
  }

  initDOM() {
    // 1. Floating Launcher
    this.launcherEl = document.createElement('div');
    this.launcherEl.className = 'ai-copilot-launcher';
    this.launcherEl.id = 'ai-copilot-launcher-btn';
    this.launcherEl.setAttribute('aria-label', 'Open Antarctic AI Mission Copilot');
    this.launcherEl.innerHTML = `
      <div class="ai-copilot-launcher-icon">
        <span class="ai-copilot-launcher-radar"></span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
          <line x1="12" y1="19" x2="12" y2="22"/>
        </svg>
      </div>
      <div class="ai-copilot-launcher-text">
        <span class="ai-copilot-launcher-title">Antarctic Copilot</span>
        <span class="ai-copilot-launcher-subtitle">EN • हिन्दी • Hinglish</span>
      </div>
    `;

    // 2. Expandable Panel Window
    this.panelEl = document.createElement('div');
    this.panelEl.className = 'ai-copilot-panel';
    this.panelEl.id = 'ai-copilot-panel-window';
    this.panelEl.style.display = 'none';

    this.panelEl.innerHTML = `
      <!-- Header -->
      <div class="ai-copilot-header">
        <div class="ai-copilot-header-info">
          <div class="ai-copilot-header-avatar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2"/>
              <polyline points="2 17 12 22 22 17"/>
              <polyline points="2 12 12 17 22 12"/>
            </svg>
          </div>
          <div>
            <div class="ai-copilot-header-title">
              Antarctic AI Copilot
              <span class="ai-copilot-state-badge" id="ai-copilot-state-pill">READY</span>
            </div>
          </div>
        </div>

        <div class="ai-copilot-header-actions">
          <button class="ai-copilot-header-btn" id="ai-btn-mute" title="Toggle Voice Speech Output" aria-label="Toggle Speech">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" id="ai-icon-volume">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
            </svg>
          </button>
          <button class="ai-copilot-header-btn" id="ai-btn-clear" title="Clear Conversation" aria-label="Clear Chat">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </button>
          <button class="ai-copilot-header-btn" id="ai-btn-close" title="Minimize Copilot" aria-label="Close Copilot">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Language Selector Sub-Bar -->
      <div class="ai-copilot-lang-bar">
        <span class="ai-copilot-lang-label">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          Language:
        </span>
        <div class="ai-copilot-lang-pills">
          <button class="ai-copilot-lang-pill active" data-lang="auto">🌐 Auto Detect</button>
          <button class="ai-copilot-lang-pill" data-lang="en">EN</button>
          <button class="ai-copilot-lang-pill" data-lang="hi">हिन्दी</button>
          <button class="ai-copilot-lang-pill" data-lang="hinglish">Hinglish</button>
        </div>
      </div>

      <!-- Waveform Animation Bar -->
      <div class="ai-copilot-waveform" id="ai-copilot-waveform-bar">
        <div class="ai-copilot-wave-bar"></div>
        <div class="ai-copilot-wave-bar"></div>
        <div class="ai-copilot-wave-bar"></div>
        <div class="ai-copilot-wave-bar"></div>
        <div class="ai-copilot-wave-bar"></div>
        <div class="ai-copilot-wave-bar"></div>
        <div class="ai-copilot-wave-bar"></div>
      </div>

      <!-- Messages Content Area -->
      <div class="ai-copilot-messages" id="ai-copilot-messages-container"></div>

      <!-- Footer / Input Controls -->
      <div class="ai-copilot-footer">
        <div class="ai-copilot-input-row">
          <button class="ai-copilot-btn-mic" id="ai-copilot-mic-btn" title="Speak command (Click to toggle voice)" aria-label="Speak command">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" y1="19" x2="12" y2="22"/>
            </svg>
          </button>

          <input
            type="text"
            class="ai-copilot-input"
            id="ai-copilot-text-input"
            placeholder="Speak or type (e.g. 'What needs attention?' / 'क्या समस्या है?')..."
            aria-label="Admin command input"
          />

          <button class="ai-copilot-btn-send" id="ai-copilot-send-btn" title="Send Command" aria-label="Send">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>

        <div class="ai-copilot-footer-status">
          <span id="ai-copilot-status-caption">Mission Control // Multilingual Engine Active</span>
          <span>NCPOR // IND-ANTARCTIC</span>
        </div>
      </div>
    `;

    document.body.appendChild(this.launcherEl);
    document.body.appendChild(this.panelEl);

    // Cache elements
    this.messagesContainer = this.panelEl.querySelector('#ai-copilot-messages-container');
    this.statePill = this.panelEl.querySelector('#ai-copilot-state-pill');
    this.waveformBar = this.panelEl.querySelector('#ai-copilot-waveform-bar');
    this.textInput = this.panelEl.querySelector('#ai-copilot-text-input');
    this.micBtn = this.panelEl.querySelector('#ai-copilot-mic-btn');
    this.sendBtn = this.panelEl.querySelector('#ai-copilot-send-btn');
    this.statusCaption = this.panelEl.querySelector('#ai-copilot-status-caption');
    this.muteBtn = this.panelEl.querySelector('#ai-btn-mute');
  }

  initEvents() {
    // Launcher toggle
    this.launcherEl.addEventListener('click', () => this.togglePanel());

    // Panel actions
    this.panelEl.querySelector('#ai-btn-close').addEventListener('click', () => this.togglePanel(false));
    this.panelEl.querySelector('#ai-btn-clear').addEventListener('click', () => {
      this.messagesContainer.innerHTML = '';
      this.renderWelcome();
    });

    // Language pills
    this.panelEl.querySelectorAll('.ai-copilot-lang-pill').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const lang = e.currentTarget.getAttribute('data-lang');
        this.setLanguage(lang);
      });
    });

    // Mute toggle
    this.muteBtn.addEventListener('click', () => {
      const isMuted = this.ttsService.toggleMute();
      this.updateMuteIcon(isMuted);
    });
    this.updateMuteIcon(this.ttsService.isMuted);

    // Mic click
    this.micBtn.addEventListener('click', () => this.toggleVoice());

    // Send button click
    this.sendBtn.addEventListener('click', () => this.handleTextSubmit());

    // Enter key on input
    this.textInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.handleTextSubmit();
      }
    });
  }

  setLanguage(lang) {
    this.selectedLanguage = lang || LANGUAGES.AUTO;

    this.panelEl.querySelectorAll('.ai-copilot-lang-pill').forEach(btn => {
      if (btn.getAttribute('data-lang') === this.selectedLanguage) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    this.commandEngine.setPreferredLanguage(this.selectedLanguage);
    this.speechService.setLanguage(this.selectedLanguage);

    if (this.selectedLanguage === 'hi') {
      this.statusCaption.innerText = 'मिशन कंट्रोल // हिन्दी वॉयस इंजन सक्रिय';
      this.textInput.placeholder = 'कमांड बोलें या टाइप करें (उदा. "क्या समस्या है?", "भरती स्टेटस")...';
    } else if (this.selectedLanguage === 'hinglish') {
      this.statusCaption.innerText = 'Mission Control // Hinglish Voice Engine Ready';
      this.textInput.placeholder = 'Speak or type (e.g. "Bharati status batao", "Kya problem hai?")...';
    } else {
      this.statusCaption.innerText = 'Mission Control // Multilingual Voice Engine Ready';
      this.textInput.placeholder = 'Speak or type command (e.g. "What needs attention?")...';
    }

    this.setState(this.state);
  }

  togglePanel(forceState = null) {
    this.isOpen = forceState !== null ? forceState : !this.isOpen;
    this.panelEl.style.display = this.isOpen ? 'flex' : 'none';
    if (this.isOpen) {
      this.textInput.focus();
      this.scrollToBottom();
    } else {
      this.speechService.stop();
      this.ttsService.stop();
      this.setState(ASSISTANT_STATES.IDLE);
    }
  }

  open() {
    this.togglePanel(true);
  }

  close() {
    this.togglePanel(false);
  }

  setVisible(visible) {
    if (this.launcherEl) {
      this.launcherEl.style.display = visible ? 'flex' : 'none';
    }
    if (this.panelEl && !visible) {
      this.close();
    }
  }

  updateMuteIcon(isMuted) {
    const iconEl = this.muteBtn.querySelector('svg');
    if (isMuted) {
      this.muteBtn.title = 'Voice Speech is Muted (Click to Unmute)';
      this.muteBtn.style.color = '#ef4444';
      iconEl.innerHTML = `
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
        <line x1="23" y1="9" x2="17" y2="15"/>
        <line x1="17" y1="9" x2="23" y2="15"/>
      `;
    } else {
      this.muteBtn.title = 'Voice Speech Active (Click to Mute)';
      this.muteBtn.style.color = '#00f0ff';
      iconEl.innerHTML = `
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
      `;
    }
  }

  setState(newState) {
    this.state = newState;
    const langKey = this.selectedLanguage === 'auto' ? 'en' : this.selectedLanguage;
    const labels = STATE_LABELS[langKey] || STATE_LABELS.en;

    this.statePill.className = `ai-copilot-state-badge ${newState}`;
    this.statePill.innerText = labels[newState] || newState.toUpperCase();

    if (newState === ASSISTANT_STATES.LISTENING) {
      this.micBtn.classList.add('listening');
      this.setWaveformActive(true);
      if (this.selectedLanguage === 'hi') {
        this.statusCaption.innerText = '● सुन रहा हूँ... अपना कमांड बोलिए';
      } else if (this.selectedLanguage === 'hinglish') {
        this.statusCaption.innerText = '● Listening... Speak command in Hinglish/Hindi/English';
      } else {
        this.statusCaption.innerText = '● Listening... Speak your command';
      }
    } else if (newState === ASSISTANT_STATES.PROCESSING) {
      this.micBtn.classList.remove('listening');
      this.setWaveformActive(false);
      if (this.selectedLanguage === 'hi') {
        this.statusCaption.innerText = '◌ टेलीमेट्री एवं डिजिटल ट्विन विश्लेषण जारी...';
      } else {
        this.statusCaption.innerText = '◌ Analyzing telemetry & digital twin relationships...';
      }
    } else {
      this.micBtn.classList.remove('listening');
      this.setWaveformActive(this.ttsService.isSpeaking);
      if (this.selectedLanguage === 'hi') {
        this.statusCaption.innerText = 'मिशन कंट्रोल // हिन्दी वॉयस इंजन सक्रिय';
      } else {
        this.statusCaption.innerText = 'Mission Control // Multilingual Engine Active';
      }
    }
  }

  setWaveformActive(active) {
    if (active) {
      this.waveformBar.classList.add('active');
    } else {
      this.waveformBar.classList.remove('active');
    }
  }

  async toggleVoice() {
    if (this.state === ASSISTANT_STATES.LISTENING) {
      this.speechService.stop();
      this.setState(ASSISTANT_STATES.IDLE);
    } else {
      this.ttsService.stop();
      this.setState(ASSISTANT_STATES.LISTENING);
      this.statusCaption.innerText = '● Initializing microphone...';
      const started = await this.speechService.start(this.selectedLanguage);
      if (!started && this.state === ASSISTANT_STATES.LISTENING) {
        this.setState(ASSISTANT_STATES.IDLE);
      }
    }
  }

  handleSpeechStart() {
    this.setState(ASSISTANT_STATES.LISTENING);
  }

  handleInterimSpeech(text) {
    this.textInput.value = text;
  }

  handleFinalSpeech(text) {
    this.textInput.value = text;
    this.speechService.stop();
    this.executeCommand(text);
  }

  handleSpeechError(msg, errorCode) {
    this.setState(ASSISTANT_STATES.IDLE);
    this.statusCaption.innerText = msg;

    if (errorCode === 'network' || errorCode === 'unsupported' || errorCode === 'not-allowed' || errorCode === 'audio-capture') {
      const isNetwork = errorCode === 'network';
      this.addUserMessage(isNetwork ? '🎙 [Voice Recognition Network Offline]' : '🎙 [Voice Engine Notice]');
      
      this.renderCommandResult({
        type: 'text_card',
        language: this.selectedLanguage === 'auto' ? 'en' : this.selectedLanguage,
        risk: COMMAND_RISK.LOW,
        spokenText: 'Cloud speech-to-text network is unavailable in your browser. Local mission dictation mode is active. You can type commands or click any voice command below to speak with the copilot in English, Hindi, or Hinglish.',
        badge: DATA_BADGES.AI_INSIGHT,
        title: isNetwork ? 'Local Mission Dictation Mode Active (EN + HI + Hinglish)' : 'Voice Input Interface Notice',
        data: {
          query: 'Speech Network Status',
          response: isNetwork ?
            'Your browser could not reach Google Speech Cloud servers. The assistant has activated <strong>Local Mission Dictation Mode</strong>. All multilingual AI reasoning (English, हिन्दी, Hinglish), Digital Twin dependency analysis, and Text-to-Speech audio work locally! Click any spoken command below:' :
            `${msg} You can type instructions or execute voice commands instantly:`
        },
        followUps: [
          'What needs my attention?',
          'क्या समस्या है? (Hindi)',
          'Bharati mein problem kya hai? (Hinglish)',
          'Why is Bharati at risk?',
          'Compare Maitri and Bharati',
          'Create emergency supply request',
          'Morning briefing / दैनिक रिपोर्ट'
        ]
      });
    }
  }

  handleSpeechEnd() {
    if (this.state === ASSISTANT_STATES.LISTENING) {
      this.setState(ASSISTANT_STATES.IDLE);
    }
  }

  handleTextSubmit() {
    const text = this.textInput.value.trim();
    if (!text) return;
    this.textInput.value = '';
    this.executeCommand(text);
  }

  renderWelcome() {
    const cardEl = document.createElement('div');
    cardEl.className = 'ai-copilot-msg-assistant';
    cardEl.innerHTML = `
      <div class="ai-copilot-card">
        <div class="ai-copilot-card-header">
          <div class="ai-copilot-card-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            Antarctic Mission Control // अंटार्कटिक मिशन कंट्रोल
          </div>
          <span class="ai-copilot-badge" style="background: rgba(0, 240, 255, 0.15); color: #00f0ff;">MULTILINGUAL READY</span>
        </div>
        <div style="font-size: 12px; color: #cbd5e1; line-height: 1.5;">
          Welcome Commander. I am your autonomous AI operations copilot for <strong>Maitri Station</strong> and <strong>Bharati Station</strong>.
          <br><span style="color: #38bdf8;">नमस्ते कमांडर। मैं मैतरी और भरती स्टेशनों के लिए आपका बहुभाषी एआई मिशन कॉपायलट हूँ।</span>
          <br>Speak or type naturally in <strong>English</strong>, <strong>हिन्दी (Hindi)</strong>, or <strong>Hinglish</strong>.
        </div>
        <div style="font-size: 11px; font-weight: 600; color: #94a3b8; margin-top: 4px;">RECOMMENDED COMMANDS // अनुशंसित कमांड:</div>
        <div class="ai-copilot-followups">
          <button class="ai-copilot-pill" data-cmd="What needs my attention?">🚨 What needs attention?</button>
          <button class="ai-copilot-pill" data-cmd="क्या समस्या है?">🚨 क्या समस्या है?</button>
          <button class="ai-copilot-pill" data-cmd="Bharati mein kya problem hai?">🔍 Bharati problem (Hinglish)</button>
          <button class="ai-copilot-pill" data-cmd="Why is Bharati at risk?">🔍 Why is Bharati at risk?</button>
          <button class="ai-copilot-pill" data-cmd="Compare Maitri and Bharati">⚖ Compare both stations</button>
          <button class="ai-copilot-pill" data-cmd="Morning briefing">📋 Morning briefing</button>
          <button class="ai-copilot-pill" data-cmd="दैनिक ब्रीफिंग">📋 दैनिक ब्रीफिंग (Hindi)</button>
          <button class="ai-copilot-pill" data-cmd="Create a chart of fuel consumption">📊 Fuel consumption chart</button>
          <button class="ai-copilot-pill" data-cmd="Create emergency supply request for generator">📝 Supply request</button>
        </div>
      </div>
    `;

    this.messagesContainer.appendChild(cardEl);
    this.bindPills(cardEl);
  }

  addUserMessage(text) {
    const msgEl = document.createElement('div');
    msgEl.className = 'ai-copilot-msg-user';
    msgEl.innerText = text;
    this.messagesContainer.appendChild(msgEl);
    this.scrollToBottom();
  }

  async executeCommand(commandText) {
    this.addUserMessage(commandText);
    this.setState(ASSISTANT_STATES.PROCESSING);

    // Short processing delay for realistic copilot feel
    await new Promise(r => setTimeout(r, 450));

    try {
      const overrideLang = this.selectedLanguage === LANGUAGES.AUTO ? null : this.selectedLanguage;
      const result = await this.commandEngine.processCommand(commandText, overrideLang);
      this.renderCommandResult(result);
      this.setState(ASSISTANT_STATES.SUCCESS);

      // Trigger text-to-speech with proper language voice
      if (result.spokenText) {
        this.ttsService.speak(result.spokenText, { language: result.language || this.selectedLanguage });
      }

      // If action is auto-navigable
      if (result.executeAction && result.risk === COMMAND_RISK.LOW) {
        result.executeAction();
      }
    } catch (err) {
      console.error('Copilot command execution error:', err);
      this.setState(ASSISTANT_STATES.ERROR);
      this.renderTextCard({
        title: 'Command Execution Error',
        badge: DATA_BADGES.SIMULATED,
        data: {
          query: commandText,
          response: `An operational telemetry timeout occurred: ${err.message}. Please try again.`
        }
      });
    }

    setTimeout(() => {
      if (this.state !== ASSISTANT_STATES.LISTENING) {
        this.setState(ASSISTANT_STATES.IDLE);
      }
    }, 1200);
  }

  renderCommandResult(result) {
    const msgEl = document.createElement('div');
    msgEl.className = 'ai-copilot-msg-assistant';

    let cardHTML = '';

    switch (result.type) {
      case 'attention_card':
        cardHTML = this.renderAttentionHTML(result);
        break;
      case 'dependency_card':
        cardHTML = this.renderDependencyHTML(result);
        break;
      case 'comparison_card':
        cardHTML = this.renderComparisonHTML(result);
        break;
      case 'station_card':
        cardHTML = this.renderStationHTML(result);
        break;
      case 'alerts_card':
        cardHTML = this.renderAlertsHTML(result);
        break;
      case 'energy_card':
        cardHTML = this.renderEnergyHTML(result);
        break;
      case 'chart_card':
        cardHTML = this.renderChartHTML(result);
        break;
      case 'logistics_card':
        cardHTML = this.renderLogisticsHTML(result);
        break;
      case 'inventory_card':
        cardHTML = this.renderInventoryHTML(result);
        break;
      case 'infrastructure_card':
        cardHTML = this.renderInfrastructureHTML(result);
        break;
      case 'environment_card':
        cardHTML = this.renderEnvironmentHTML(result);
        break;
      case 'research_card':
        cardHTML = this.renderResearchHTML(result);
        break;
      case 'report_card':
        cardHTML = this.renderReportHTML(result);
        break;
      case 'confirmation_card':
        cardHTML = this.renderConfirmationHTML(result);
        break;
      case 'audit_card':
        cardHTML = this.renderAuditHTML(result);
        break;
      case 'navigation_card':
        cardHTML = this.renderNavigationHTML(result);
        break;
      default:
        cardHTML = this.renderTextHTML(result);
    }

    msgEl.innerHTML = cardHTML;
    this.messagesContainer.appendChild(msgEl);
    this.bindPills(msgEl);
    this.bindCardActions(msgEl, result);

    // If chart card, initialize Chart.js
    if (result.type === 'chart_card') {
      this.initResultChart(msgEl, result);
    }

    this.scrollToBottom();
  }

  // --- CARD RENDERERS ---

  renderAttentionHTML(result) {
    const { topRisks } = result.data;
    const itemsHTML = topRisks.map(r => `
      <div class="ai-copilot-triage-item ${r.severity.toLowerCase()}">
        <div class="ai-copilot-triage-header">
          <span style="font-size: 10px; font-weight: 700; color: ${r.severity === 'CRITICAL' ? '#ef4444' : r.severity === 'HIGH' ? '#f59e0b' : '#38bdf8'}; font-family: 'JetBrains Mono', monospace;">
            #${r.rank} // ${r.severity} // ${r.station}
          </span>
          <span style="font-size: 9px; color: #94a3b8; text-transform: uppercase;">${r.department}</span>
        </div>
        <div class="ai-copilot-triage-title">${r.title}</div>
        <div class="ai-copilot-triage-desc"><strong>Impact:</strong> ${r.impact}</div>
        <div class="ai-copilot-triage-action">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          <strong>Recommended:</strong> ${r.recommendedAction}
        </div>
      </div>
    `).join('');

    return `
      <div class="ai-copilot-card">
        <div class="ai-copilot-card-header">
          <div class="ai-copilot-card-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/></svg>
            ${result.title}
          </div>
          <span class="ai-copilot-badge" style="background: rgba(168, 85, 247, 0.15); color: #c084fc;">AI REASONING</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${itemsHTML}
        </div>
        ${this.renderFollowupsHTML(result.followUps)}
      </div>
    `;
  }

  renderDependencyHTML(result) {
    const { nodes, conclusion } = result.data;
    const nodesHTML = nodes.map((node, i) => `
      <div class="ai-copilot-chain-node">
        <div class="ai-copilot-chain-bullet ${node.level === 'CRITICAL' ? 'critical' : ''}">0${i + 1}</div>
        <div class="ai-copilot-chain-content">
          <div class="ai-copilot-chain-label">${node.department} // ${node.level}</div>
          <div style="font-size: 11px; font-weight: 600; color: #f8fafc;">${node.component}</div>
          <div class="ai-copilot-chain-text">${node.status}</div>
        </div>
      </div>
    `).join('');

    return `
      <div class="ai-copilot-card">
        <div class="ai-copilot-card-header">
          <div class="ai-copilot-card-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            ${result.title}
          </div>
          <span class="ai-copilot-badge" style="background: rgba(0, 240, 255, 0.15); color: #00f0ff;">DIGITAL TWIN CHAIN</span>
        </div>
        <div class="ai-copilot-chain">
          ${nodesHTML}
        </div>
        <div style="font-size: 11px; color: #cbd5e1; background: rgba(0, 240, 255, 0.06); border-left: 3px solid #00f0ff; padding: 8px 10px; border-radius: 4px; line-height: 1.4;">
          <strong>Root Cause Summary:</strong> ${conclusion}
        </div>
        ${this.renderFollowupsHTML(result.followUps)}
      </div>
    `;
  }

  renderComparisonHTML(result) {
    const { comparison, recommendation } = result.data;
    const rows = comparison.map(c => `
      <tr>
        <td style="font-weight: 600; color: #94a3b8;">${c.metric}</td>
        <td style="color: #38bdf8;">${c.maitri}</td>
        <td style="color: #f59e0b;">${c.bharati}</td>
      </tr>
    `).join('');

    return `
      <div class="ai-copilot-card">
        <div class="ai-copilot-card-header">
          <div class="ai-copilot-card-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            ${result.title}
          </div>
          <span class="ai-copilot-badge" style="background: rgba(56, 189, 248, 0.15); color: #38bdf8;">STATION TELEMETRY</span>
        </div>
        <table class="ai-copilot-table">
          <thead>
            <tr>
              <th>Metric</th>
              <th>Maitri Station</th>
              <th>Bharati Station</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
        <div style="font-size: 11px; color: #cbd5e1; background: rgba(255, 255, 255, 0.04); padding: 8px; border-radius: 6px;">
          <strong>Strategic Takeaway:</strong> ${recommendation}
        </div>
        ${this.renderFollowupsHTML(result.followUps)}
      </div>
    `;
  }

  renderStationHTML(result) {
    const st = result.data;
    return `
      <div class="ai-copilot-card">
        <div class="ai-copilot-card-header">
          <div class="ai-copilot-card-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
            ${st.name} [${st.code}]
          </div>
          <span class="ai-copilot-badge" style="background: ${st.healthScore > 80 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)'}; color: ${st.healthScore > 80 ? '#10b981' : '#f59e0b'};">
            HEALTH: ${st.healthScore}%
          </span>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 11px;">
          <div style="background: rgba(255, 255, 255, 0.03); padding: 8px; border-radius: 6px;">
            <div style="color: #94a3b8; font-size: 10px;">REGION & COORDS</div>
            <div style="color: #f8fafc; font-weight: 600;">${st.region}</div>
            <div style="color: #64748b; font-family: monospace;">${st.coordinates}</div>
          </div>
          <div style="background: rgba(255, 255, 255, 0.03); padding: 8px; border-radius: 6px;">
            <div style="color: #94a3b8; font-size: 10px;">MICROGRID POWER</div>
            <div style="color: #38bdf8; font-weight: 600;">${st.currentPowerKw} kW / ${st.powerCapacityKw} kW</div>
            <div style="color: #64748b;">${st.powerSource}</div>
          </div>
          <div style="background: rgba(255, 255, 255, 0.03); padding: 8px; border-radius: 6px;">
            <div style="color: #94a3b8; font-size: 10px;">FUEL RESERVES</div>
            <div style="color: ${st.fuelDaysRemaining < 80 ? '#f59e0b' : '#10b981'}; font-weight: 600;">${st.fuelReserveLiters.toLocaleString()} L</div>
            <div style="color: #64748b;">${st.fuelDaysRemaining} Days Autonomy</div>
          </div>
          <div style="background: rgba(255, 255, 255, 0.03); padding: 8px; border-radius: 6px;">
            <div style="color: #94a3b8; font-size: 10px;">ENVIRONMENT</div>
            <div style="color: #f8fafc; font-weight: 600;">${st.ambientTemp} °C // ${st.windSpeedKnots} kts</div>
            <div style="color: #64748b;">Wind Chill: ${st.windChill} °C</div>
          </div>
        </div>
        ${this.renderFollowupsHTML(result.followUps)}
      </div>
    `;
  }

  renderAlertsHTML(result) {
    const alerts = result.data;
    const items = alerts.map(a => `
      <div style="background: rgba(255, 255, 255, 0.04); border-left: 3px solid ${a.level === 'CRITICAL' ? '#ef4444' : '#f59e0b'}; padding: 8px 10px; border-radius: 6px; font-size: 11px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-weight: 700; color: ${a.level === 'CRITICAL' ? '#ef4444' : '#f59e0b'}; font-family: 'JetBrains Mono', monospace;">${a.id} // ${a.station.toUpperCase()}</span>
          <span style="color: #64748b; font-size: 10px;">${a.timestamp}</span>
        </div>
        <div style="font-weight: 600; color: #f8fafc; margin-top: 2px;">${a.title}</div>
        <div style="color: #94a3b8; margin-top: 2px;">${a.description}</div>
        <div style="color: #38bdf8; margin-top: 4px; font-size: 10px;"><strong>Downstream:</strong> ${a.downstream}</div>
      </div>
    `).join('');

    return `
      <div class="ai-copilot-card">
        <div class="ai-copilot-card-header">
          <div class="ai-copilot-card-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            ${result.title}
          </div>
          <span class="ai-copilot-badge" style="background: rgba(239, 68, 68, 0.2); color: #ef4444;">${alerts.length} ALERTS ACTIVE</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${items}
        </div>
        ${this.renderFollowupsHTML(result.followUps)}
      </div>
    `;
  }

  renderEnergyHTML(result) {
    const { maitri, bharati } = result.data;
    return `
      <div class="ai-copilot-card">
        <div class="ai-copilot-card-header">
          <div class="ai-copilot-card-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            ${result.title}
          </div>
          <span class="ai-copilot-badge" style="background: rgba(245, 158, 11, 0.2); color: #f59e0b;">MICROGRID TELEMETRY</span>
        </div>
        <div style="font-size: 11px; color: #cbd5e1; line-height: 1.5;">
          Combined Antarctic load is <strong>${(maitri.currentPowerKw + bharati.currentPowerKw).toFixed(1)} kW</strong>. Bharati Station is running on degraded microgrid capacity due to Generator #02 bearing strain and secondary burner activation.
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 11px;">
          <div style="background: rgba(255, 255, 255, 0.03); padding: 8px; border-radius: 6px;">
            <div style="color: #38bdf8; font-weight: 700;">MAITRI FUEL</div>
            <div style="font-size: 13px; font-weight: 700; color: #10b981;">${maitri.fuelReserveLiters.toLocaleString()} L</div>
            <div style="color: #94a3b8;">112 Days Autonomy (Nominal)</div>
          </div>
          <div style="background: rgba(255, 255, 255, 0.03); padding: 8px; border-radius: 6px;">
            <div style="color: #f59e0b; font-weight: 700;">BHARATI FUEL</div>
            <div style="font-size: 13px; font-weight: 700; color: #f59e0b;">${bharati.fuelReserveLiters.toLocaleString()} L</div>
            <div style="color: #ef4444;">68 Days (+18% Burn Rate)</div>
          </div>
        </div>
        ${this.renderFollowupsHTML(result.followUps)}
      </div>
    `;
  }

  renderChartHTML(result) {
    const canvasId = `ai-chart-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    return `
      <div class="ai-copilot-card">
        <div class="ai-copilot-card-header">
          <div class="ai-copilot-card-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" stroke-width="2"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
            ${result.title}
          </div>
          <span class="ai-copilot-badge" style="background: rgba(0, 240, 255, 0.15); color: #00f0ff;">INTERACTIVE CHART</span>
        </div>
        <div class="ai-copilot-chart-wrapper">
          <canvas id="${canvasId}"></canvas>
        </div>
        <div style="font-size: 10px; color: #94a3b8; text-align: right; font-family: 'JetBrains Mono', monospace;">
          SIMULATED 30-DAY LOGS // MAITRI & BHARATI
        </div>
        ${this.renderFollowupsHTML(result.followUps)}
      </div>
    `;
  }

  initResultChart(containerEl, result) {
    const canvas = containerEl.querySelector('canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const days = Array.from({ length: 15 }, (_, i) => `Day ${i * 2 + 1}`);

    // Clean data curves
    const maitriFuel = [50000, 49800, 49600, 49450, 49300, 49100, 48950, 48800, 48650, 48500, 48350, 48200, 48050, 47900, 47750];
    const bharatiFuel = [38000, 37500, 36900, 36200, 35400, 34500, 33600, 32700, 32100, 31200, 30300, 29400, 28500, 27600, 26700];

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: days,
        datasets: [
          {
            label: 'Maitri Fuel (L)',
            data: maitriFuel,
            borderColor: '#38bdf8',
            backgroundColor: 'rgba(56, 189, 248, 0.1)',
            tension: 0.3,
            borderWidth: 2,
            pointRadius: 2
          },
          {
            label: 'Bharati Fuel (L - Accelerated Burn)',
            data: bharatiFuel,
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            tension: 0.3,
            borderWidth: 2,
            pointRadius: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: '#cbd5e1', font: { size: 10 } }
          }
        },
        scales: {
          x: {
            ticks: { color: '#64748b', font: { size: 9 } },
            grid: { color: 'rgba(255, 255, 255, 0.05)' }
          },
          y: {
            ticks: { color: '#64748b', font: { size: 9 } },
            grid: { color: 'rgba(255, 255, 255, 0.05)' }
          }
        }
      }
    });
  }

  renderLogisticsHTML(result) {
    const items = result.data.map(l => `
      <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.06); padding: 8px 10px; border-radius: 6px; font-size: 11px;">
        <div style="display: flex; justify-content: space-between;">
          <span style="font-weight: 700; color: #38bdf8;">${l.vessel}</span>
          <span style="color: ${l.delayed ? '#ef4444' : '#10b981'}; font-weight: 600;">${l.delayed ? 'WEATHER DELAY' : 'ON SCHEDULE'}</span>
        </div>
        <div style="color: #cbd5e1; margin-top: 2px;"><strong>Cargo:</strong> ${l.cargo}</div>
        <div style="display: flex; justify-content: space-between; color: #94a3b8; font-size: 10px; margin-top: 4px;">
          <span>Origin: ${l.origin}</span>
          <span>ETA: ${l.eta}</span>
        </div>
      </div>
    `).join('');

    return `
      <div class="ai-copilot-card">
        <div class="ai-copilot-card-header">
          <div class="ai-copilot-card-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
            ${result.title}
          </div>
          <span class="ai-copilot-badge" style="background: rgba(56, 189, 248, 0.15); color: #38bdf8;">LOGISTICS PIPELINE</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${items}
        </div>
        ${this.renderFollowupsHTML(result.followUps)}
      </div>
    `;
  }

  renderInventoryHTML(result) {
    const items = result.data.map(i => `
      <tr>
        <td style="font-weight: 600; color: ${i.critical ? '#ef4444' : '#e2e8f0'};">${i.name}</td>
        <td style="color: #94a3b8;">${i.station.toUpperCase()}</td>
        <td style="font-weight: 700; color: ${i.stockQty === 0 ? '#ef4444' : i.stockQty <= i.minStock ? '#f59e0b' : '#10b981'};">
          ${i.stockQty} ${i.unit} (Min: ${i.minStock})
        </td>
      </tr>
    `).join('');

    return `
      <div class="ai-copilot-card">
        <div class="ai-copilot-card-header">
          <div class="ai-copilot-card-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
            ${result.title}
          </div>
          <span class="ai-copilot-badge" style="background: rgba(16, 185, 129, 0.15); color: #10b981;">INVENTORY AUDIT</span>
        </div>
        <table class="ai-copilot-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Station</th>
              <th>Stock Status</th>
            </tr>
          </thead>
          <tbody>
            ${items}
          </tbody>
        </table>
        ${this.renderFollowupsHTML(result.followUps)}
      </div>
    `;
  }

  renderInfrastructureHTML(result) {
    const { assets, maint } = result.data;
    const assetItems = assets.map(a => `
      <div style="background: rgba(255, 255, 255, 0.03); padding: 8px; border-radius: 6px; font-size: 11px;">
        <div style="display: flex; justify-content: space-between;">
          <span style="font-weight: 600; color: #f8fafc;">${a.name}</span>
          <span style="font-weight: 700; color: ${a.status === 'CRITICAL' ? '#ef4444' : a.status === 'ATTENTION' ? '#f59e0b' : '#10b981'};">${a.status}</span>
        </div>
        <div style="color: #94a3b8; font-size: 10px; margin-top: 2px;">${a.location} // Health: ${a.health}%</div>
        <div style="color: #cbd5e1; font-size: 10px; margin-top: 4px;">${a.notes}</div>
      </div>
    `).join('');

    return `
      <div class="ai-copilot-card">
        <div class="ai-copilot-card-header">
          <div class="ai-copilot-card-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>
            ${result.title}
          </div>
          <span class="ai-copilot-badge" style="background: rgba(56, 189, 248, 0.15); color: #38bdf8;">ASSETS & MAINTENANCE</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 6px;">
          ${assetItems}
        </div>
        ${this.renderFollowupsHTML(result.followUps)}
      </div>
    `;
  }

  renderEnvironmentHTML(result) {
    const { maitri, bharati } = result.data;
    return `
      <div class="ai-copilot-card">
        <div class="ai-copilot-card-header">
          <div class="ai-copilot-card-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>
            ${result.title}
          </div>
          <span class="ai-copilot-badge" style="background: rgba(100, 116, 139, 0.2); color: #94a3b8;">SIMULATED SENSORS</span>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 11px;">
          <div style="background: rgba(255, 255, 255, 0.03); padding: 8px; border-radius: 6px;">
            <div style="color: #38bdf8; font-weight: 700;">MAITRI STATION</div>
            <div style="font-size: 16px; font-weight: 700; color: #f8fafc; margin-top: 4px;">${maitri.ambientTemp} °C</div>
            <div style="color: #94a3b8; font-size: 10px;">Wind: ${maitri.windSpeedKnots} kts // Chill: ${maitri.windChill} °C</div>
            <div style="color: #f59e0b; font-size: 10px; margin-top: 4px;">Catabatic Storm Approaching</div>
          </div>
          <div style="background: rgba(255, 255, 255, 0.03); padding: 8px; border-radius: 6px;">
            <div style="color: #f59e0b; font-weight: 700;">BHARATI STATION</div>
            <div style="font-size: 16px; font-weight: 700; color: #f8fafc; margin-top: 4px;">${bharati.ambientTemp} °C</div>
            <div style="color: #94a3b8; font-size: 10px;">Wind: ${bharati.windSpeedKnots} kts // Chill: ${bharati.windChill} °C</div>
            <div style="color: #10b981; font-size: 10px; margin-top: 4px;">Visibility 8.5 km</div>
          </div>
        </div>
        <div style="font-size: 10px; color: #64748b; font-style: italic;">
          Notice: Antarctic weather values are generated via atmospheric numerical simulation models.
        </div>
        ${this.renderFollowupsHTML(result.followUps)}
      </div>
    `;
  }

  renderResearchHTML(result) {
    const projects = result.data;
    const items = projects.map(p => `
      <div style="background: rgba(255, 255, 255, 0.03); padding: 8px 10px; border-radius: 6px; font-size: 11px;">
        <div style="display: flex; justify-content: space-between;">
          <span style="font-weight: 600; color: #f8fafc;">${p.title}</span>
          <span style="font-weight: 700; color: ${p.status === 'DEGRADED' ? '#f59e0b' : '#10b981'}; font-size: 10px;">${p.status}</span>
        </div>
        <div style="color: #94a3b8; font-size: 10px; margin-top: 2px;">Lead: ${p.lead} // ${p.station.toUpperCase()}</div>
        <div style="color: #cbd5e1; font-size: 10px; margin-top: 4px;">${p.impactReason}</div>
      </div>
    `).join('');

    return `
      <div class="ai-copilot-card">
        <div class="ai-copilot-card-header">
          <div class="ai-copilot-card-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="2"><path d="M10 2v7.31"/><path d="M14 9.3V1.99"/><path d="M8.5 2h7"/><path d="M14 9.3a6.5 6.5 0 1 1-4 0"/><path d="M5.52 16h12.96"/></svg>
            ${result.title}
          </div>
          <span class="ai-copilot-badge" style="background: rgba(168, 85, 247, 0.15); color: #c084fc;">NCPOR SCIENCE</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 6px;">
          ${items}
        </div>
        ${this.renderFollowupsHTML(result.followUps)}
      </div>
    `;
  }

  renderReportHTML(result) {
    const report = result.data;
    const sectionsHTML = report.sections.map(s => `
      <div style="margin-bottom: 8px;">
        <div style="font-weight: 700; font-size: 11px; color: #00f0ff; text-transform: uppercase; margin-bottom: 2px;">${s.heading}</div>
        ${s.text ? `<div style="font-size: 11px; color: #cbd5e1; line-height: 1.4;">${s.text}</div>` : ''}
        ${s.bullets ? `
          <ul style="margin: 4px 0 0 16px; padding: 0; font-size: 11px; color: #cbd5e1; line-height: 1.4;">
            ${s.bullets.map(b => `<li>${b}</li>`).join('')}
          </ul>
        ` : ''}
      </div>
    `).join('');

    return `
      <div class="ai-copilot-card">
        <div class="ai-copilot-card-header">
          <div class="ai-copilot-card-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            ${result.title}
          </div>
          <span class="ai-copilot-badge" style="background: rgba(0, 240, 255, 0.15); color: #00f0ff;">OFFICIAL BRIEFING</span>
        </div>
        <div style="font-size: 10px; color: #94a3b8; font-family: 'JetBrains Mono', monospace; border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 6px;">
          DATE: ${report.date} // COMMANDER: ${report.commander}
        </div>
        <div style="max-height: 240px; overflow-y: auto; padding-right: 4px;">
          ${sectionsHTML}
        </div>
        <div class="ai-copilot-card-actions">
          <button class="ai-copilot-btn-action" data-action="copy" title="Copy Report to Clipboard">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            Copy Briefing
          </button>
          <button class="ai-copilot-btn-action" data-action="export" title="Export as Operations Log">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download Text
          </button>
        </div>
        ${this.renderFollowupsHTML(result.followUps)}
      </div>
    `;
  }

  renderConfirmationHTML(result) {
    const { actionName, station, item, title, impact, riskLevel } = result.data;
    const isHi = result.language === 'hi';
    const isHinglish = result.language === 'hinglish';

    const confirmBtnText = isHi ? 'पुष्टि करें और निष्पादित करें' : isHinglish ? 'Confirm & Execute Action' : 'Authorize & Execute Action';
    const cancelBtnText = isHi ? 'रद्द करें' : 'Cancel';
    const actionLabel = isHi ? 'कार्य / ACTION' : 'ACTION';
    const stationLabel = isHi ? 'स्टेशन / STATION' : 'TARGET STATION';
    const impactLabel = isHi ? 'प्रभाव / DOWNSTREAM IMPACT' : 'DOWNSTREAM IMPACT';
    const classLabel = isHi ? 'वर्गीकरण / RISK LEVEL' : 'CLASSIFICATION';

    return `
      <div class="ai-copilot-confirm-card">
        <div class="ai-copilot-confirm-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          ${result.title}
        </div>
        <div class="ai-copilot-confirm-details">
          <div><strong>${actionLabel}:</strong> ${actionName}</div>
          <div><strong>${stationLabel}:</strong> ${station}</div>
          ${item ? `<div><strong>ITEM / ASSET:</strong> ${item}</div>` : ''}
          ${title ? `<div><strong>TASK:</strong> ${title}</div>` : ''}
          <div style="margin-top: 4px;"><strong>${impactLabel}:</strong> ${impact}</div>
          <div style="margin-top: 4px; color: #fca5a5;"><strong>${classLabel}:</strong> ${riskLevel}</div>
        </div>
        <div class="ai-copilot-confirm-actions">
          <button class="ai-copilot-btn-confirm" data-confirm="true">
            ${confirmBtnText}
          </button>
          <button class="ai-copilot-btn-cancel" data-cancel="true">
            ${cancelBtnText}
          </button>
        </div>
      </div>
    `;
  }

  renderAuditHTML(result) {
    const logs = result.data;
    const items = logs.map(l => `
      <div style="background: rgba(255, 255, 255, 0.03); padding: 6px 8px; border-radius: 4px; font-size: 10px;">
        <div style="display: flex; justify-content: space-between; font-family: 'JetBrains Mono', monospace;">
          <span style="color: #00f0ff;">${l.id}</span>
          <span style="color: #64748b;">${l.timestamp}</span>
        </div>
        <div style="color: #f8fafc; font-weight: 600; margin-top: 2px;">${l.command}</div>
        <div style="color: #94a3b8; font-size: 9px;">User: ${l.user} // Risk: ${l.risk} // Result: ${l.result}</div>
      </div>
    `).join('');

    return `
      <div class="ai-copilot-card">
        <div class="ai-copilot-card-header">
          <div class="ai-copilot-card-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            ${result.title}
          </div>
          <span class="ai-copilot-badge" style="background: rgba(16, 185, 129, 0.15); color: #10b981;">SECURITY AUDIT</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 6px; max-height: 200px; overflow-y: auto;">
          ${items}
        </div>
        ${this.renderFollowupsHTML(result.followUps)}
      </div>
    `;
  }

  renderNavigationHTML(result) {
    const nav = result.data;
    return `
      <div class="ai-copilot-card">
        <div class="ai-copilot-card-header">
          <div class="ai-copilot-card-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" stroke-width="2"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
            ${result.title}
          </div>
          <span class="ai-copilot-badge" style="background: rgba(0, 240, 255, 0.15); color: #00f0ff;">ROUTED</span>
        </div>
        <div style="font-size: 12px; color: #cbd5e1;">
          Switching active view to <strong>${nav.title}</strong>...
        </div>
      </div>
    `;
  }

  renderTextHTML(result) {
    return `
      <div class="ai-copilot-card">
        <div class="ai-copilot-card-header">
          <div class="ai-copilot-card-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            ${result.title}
          </div>
          <span class="ai-copilot-badge" style="background: rgba(0, 240, 255, 0.15); color: #00f0ff;">COPILOT</span>
        </div>
        <div style="font-size: 12px; color: #cbd5e1; line-height: 1.5;">
          ${result.data.response}
        </div>
        ${this.renderFollowupsHTML(result.followUps)}
      </div>
    `;
  }

  renderFollowupsHTML(followUps) {
    if (!followUps || !followUps.length) return '';
    const pills = followUps.map(f => `
      <button class="ai-copilot-pill" data-cmd="${f}">${f}</button>
    `).join('');
    return `
      <div style="margin-top: 4px; padding-top: 6px; border-top: 1px solid rgba(255, 255, 255, 0.06);">
        <div style="font-size: 10px; color: #64748b; margin-bottom: 4px; font-family: 'JetBrains Mono', monospace;">SUGGESTED FOLLOW-UPS:</div>
        <div class="ai-copilot-followups">${pills}</div>
      </div>
    `;
  }

  bindPills(parentEl) {
    parentEl.querySelectorAll('.ai-copilot-pill').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const cmd = e.currentTarget.getAttribute('data-cmd');
        if (cmd) {
          this.executeCommand(cmd);
        }
      });
    });
  }

  bindCardActions(cardEl, result) {
    // Copy button
    const copyBtn = cardEl.querySelector('[data-action="copy"]');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const text = result.data.sections ?
          result.data.sections.map(s => `${s.heading}\n${s.text || ''}\n${(s.bullets || []).join('\n')}`).join('\n\n') :
          JSON.stringify(result.data, null, 2);
        navigator.clipboard.writeText(text);
        copyBtn.innerText = 'Copied to Clipboard!';
        setTimeout(() => copyBtn.innerText = 'Copy Briefing', 2000);
      });
    }

    // Export button
    const exportBtn = cardEl.querySelector('[data-action="export"]');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        const text = result.data.sections ?
          `${result.data.title}\nDate: ${result.data.date}\nCommander: ${result.data.commander}\n\n` +
          result.data.sections.map(s => `[${s.heading}]\n${s.text || ''}\n${(s.bullets || []).join('\n')}`).join('\n\n') :
          JSON.stringify(result.data, null, 2);
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Antarctic_Briefing_${new Date().toISOString().substring(0, 10)}.txt`;
        a.click();
        URL.revokeObjectURL(url);
      });
    }

    // Confirmation dialog actions
    const confirmBtn = cardEl.querySelector('[data-confirm="true"]');
    const cancelBtn = cardEl.querySelector('[data-cancel="true"]');

    if (confirmBtn && cancelBtn && result.data && result.data.onConfirm) {
      const isHi = result.language === 'hi';
      const isHinglish = result.language === 'hinglish';

      confirmBtn.addEventListener('click', () => {
        confirmBtn.disabled = true;
        cancelBtn.disabled = true;
        confirmBtn.innerText = isHi ? 'निष्पादित किया जा रहा है...' : 'Executing Authorized Tool...';

        const actionResult = result.data.onConfirm();

        setTimeout(() => {
          const successTitle = isHi ? 'कार्य सफलतापूर्वक अधिकृत एवं पूरा हुआ' : isHinglish ? 'Action Authorized & Created' : 'Action Authorized & Executed';
          const successDesc = isHi ?
            `✓ <strong>${result.data.actionName}</strong> सफलतापूर्वक दर्ज किया गया।<br>रेफरेंस आईडी: <strong style="color: #00f0ff; font-family: monospace;">${actionResult.id}</strong><br>स्थिति: <span style="color: #f59e0b;">${actionResult.status}</span><br>सुरक्षा ऑडिट ट्रेल में लॉग किया गया।` :
            `✓ <strong>${result.data.actionName}</strong> successfully committed.<br>Reference ID: <strong style="color: #00f0ff; font-family: monospace;">${actionResult.id}</strong><br>Status: <span style="color: #f59e0b;">${actionResult.status}</span><br>Logged to Immutable Security Audit Trail.`;

          cardEl.innerHTML = `
            <div class="ai-copilot-card" style="border-color: #10b981;">
              <div class="ai-copilot-card-header">
                <div class="ai-copilot-card-title" style="color: #10b981;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                  ${successTitle}
                </div>
                <span class="ai-copilot-badge" style="background: rgba(16, 185, 129, 0.2); color: #10b981;">CONFIRMED</span>
              </div>
              <div style="font-size: 11px; color: #f1f5f9; line-height: 1.5;">
                ${successDesc}
              </div>
            </div>
          `;

          const spokenConfirmed = isHi ?
            `आपातकालीन आपूर्ति अनुरोध सफलतापूर्वक बनाया गया है। संदर्भ संख्या ${actionResult.id} है।` :
            isHinglish ?
            `Emergency supply request create kar diya gaya hai. Reference ID ${actionResult.id} hai.` :
            `Action authorized and completed. Reference ID is ${actionResult.id}.`;

          this.ttsService.speak(spokenConfirmed, { language: isHi ? 'hi' : isHinglish ? 'hinglish' : 'en' });
        }, 500);
      });

      cancelBtn.addEventListener('click', () => {
        const cancelMsg = isHi ?
          'प्रशासक द्वारा कार्य रद्द कर दिया गया। कोई बदलाव नहीं किया गया।' :
          isHinglish ?
          'Action administrator dwara cancel kar diya gaya. No modifications made.' :
          'Action cancelled by administrator. No modifications made.';

        cardEl.innerHTML = `
          <div class="ai-copilot-card" style="border-color: #64748b;">
            <div style="font-size: 11px; color: #94a3b8;">
              ${cancelMsg}
            </div>
          </div>
        `;
      });
    }
  }

  scrollToBottom() {
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }
}
