// Modular Multilingual Speech Recognition and Text-to-Speech Service for Mission-Control Voice Assistant

export class SpeechRecognitionService {
  constructor(options = {}) {
    this.recognition = null;
    this.isListening = false;
    this.activeLanguage = 'auto';
    this.SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition || null;
    this.isSupported = !!this.SpeechRecognitionClass;

    this.onStart = options.onStart || (() => {});
    this.onInterimResult = options.onInterimResult || (() => {});
    this.onFinalResult = options.onFinalResult || (() => {});
    this.onError = options.onError || (() => {});
    this.onEnd = options.onEnd || (() => {});
  }

  setLanguage(lang = 'auto') {
    this.activeLanguage = lang;
  }

  getLocaleForLanguage(lang) {
    if (lang === 'hi') return 'hi-IN';
    if (lang === 'hinglish') return 'hi-IN';
    if (lang === 'en') return 'en-IN';
    return 'hi-IN'; // 'auto' uses hi-IN which parses both Hindi and English/Hinglish in Chromium
  }

  createRecognition(language = this.activeLanguage) {
    if (!this.SpeechRecognitionClass) return null;

    try {
      const rec = new this.SpeechRecognitionClass();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = this.getLocaleForLanguage(language);
      rec.maxAlternatives = 1;

      rec.onstart = () => {
        this.isListening = true;
        this.onStart();
      };

      rec.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (interimTranscript) {
          this.onInterimResult(interimTranscript);
        }
        if (finalTranscript) {
          this.onFinalResult(finalTranscript.trim());
        }
      };

      rec.onerror = (event) => {
        this.isListening = false;
        let errorMessage = 'Speech recognition error';
        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          errorMessage = 'Microphone access denied. Please click the lock icon in your browser address bar to allow microphone access.';
        } else if (event.error === 'no-speech') {
          errorMessage = 'No speech detected. Please speak closer to the microphone and try again.';
        } else if (event.error === 'audio-capture') {
          errorMessage = 'No microphone hardware found or mic is in use by another app.';
        } else if (event.error === 'network') {
          errorMessage = 'Voice recognition network service unavailable. Local Mission Dictation Mode is active.';
        } else {
          errorMessage = `Voice engine notice: ${event.error || 'Check microphone'}`;
        }
        this.onError(errorMessage, event.error);
      };

      rec.onend = () => {
        this.isListening = false;
        this.onEnd();
      };

      return rec;
    } catch (err) {
      console.warn('[SpeechService] Error creating recognition instance:', err);
      return null;
    }
  }

  async start(language = this.activeLanguage) {
    if (!this.isSupported) {
      this.onError('Web Speech Recognition API is not supported in this browser engine. You can type instructions or click recommended commands below.', 'unsupported');
      return false;
    }

    if (this.isListening) {
      this.stop();
      return false;
    }

    // Request mic access explicitly if mediaDevices is available
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
      } catch (err) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          this.onError('Microphone permission blocked. Please allow mic permissions in your browser bar.', 'not-allowed');
          return false;
        }
      }
    }

    try {
      this.stop();
      this.recognition = this.createRecognition(language);
      if (!this.recognition) {
        this.onError('Unable to create speech recognition engine.', 'error');
        return false;
      }

      this.recognition.start();
      return true;
    } catch (err) {
      console.warn('[SpeechService] start error:', err);
      this.onError('Could not start listening: ' + err.message, err.name);
      return false;
    }
  }

  stop() {
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch (err) {
        // ignore
      }
      this.recognition = null;
    }
    this.isListening = false;
  }
}

export class TextToSpeechService {
  constructor(options = {}) {
    this.synth = window.speechSynthesis || null;
    this.isMuted = localStorage.getItem('ai_assistant_tts_muted') === 'true';
    this.isSpeaking = false;
    this.enVoice = null;
    this.hiVoice = null;
    this.onStart = options.onStart || (() => {});
    this.onEnd = options.onEnd || (() => {});

    this.initVoices();
  }

  initVoices() {
    if (!this.synth) return;
    const setVoices = () => {
      const voices = this.synth.getVoices();
      if (!voices || !voices.length) return;

      // Find Hindi voice
      this.hiVoice = voices.find(v => v.lang.startsWith('hi') || v.name.includes('Hindi') || v.name.includes('Swara') || v.name.includes('Kalpana') || v.name.includes('Hemant') || v.name.includes('Madhur') || v.name.includes('Neerja')) ||
                     voices.find(v => v.lang === 'en-IN') ||
                     voices.find(v => v.lang.startsWith('hi'));

      // Find English / Indian-English voice
      this.enVoice = voices.find(v => v.lang === 'en-IN' || (v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel') || v.name.includes('David')))) ||
                     voices.find(v => v.lang.startsWith('en')) ||
                     voices[0];
    };

    setVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = setVoices;
    }
  }

  speak(text, { language = 'en', onStart, onEnd } = {}) {
    if (!this.synth || this.isMuted || !text) return;

    this.stop(); // Stop any ongoing speech

    // Clean markdown/bullet points for spoken audio
    const cleanText = text
      .replace(/[*#`_~[\]]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/[-•]\s*/g, '. ')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Select suitable voice
    if (language === 'hi' || language === 'hinglish') {
      utterance.voice = this.hiVoice || this.enVoice;
      utterance.lang = this.hiVoice ? 'hi-IN' : 'en-IN';
    } else {
      utterance.voice = this.enVoice;
      utterance.lang = 'en-US';
    }

    utterance.rate = language === 'hi' ? 0.98 : 1.05; // Natural authoritative pace
    utterance.pitch = 0.98;

    utterance.onstart = () => {
      this.isSpeaking = true;
      if (onStart) onStart();
      this.onStart();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      if (onEnd) onEnd();
      this.onEnd();
    };

    utterance.onerror = (e) => {
      this.isSpeaking = false;
      if (onEnd) onEnd();
      this.onEnd();
    };

    try {
      this.synth.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis error:', err);
    }
  }

  stop() {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (err) {
        console.warn('Speech cancel error:', err);
      }
      this.isSpeaking = false;
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem('ai_assistant_tts_muted', this.isMuted ? 'true' : 'false');
    if (this.isMuted) {
      this.stop();
    }
    return this.isMuted;
  }
}
