// Multilingual Natural Language Understanding, Intent Routing, Tool Execution & Safety Engine
// Supports English, Hindi (Devanagari), and Hinglish (Latin transliteration) + Dynamic Code-Switching
import { COMMAND_RISK, DATA_BADGES, LANGUAGES } from '../types.js';
import { stationData } from './stationDataService.js';
import { dependencyEngine } from './dependencyEngine.js';

export class CommandEngine {
  constructor(options = {}) {
    this.dataService = stationData;
    this.depEngine = dependencyEngine;
    this.routerCallback = options.routerCallback || null;
    this.preferredLanguage = LANGUAGES.AUTO; // 'auto', 'en', 'hi', 'hinglish'

    this.currentUser = {
      name: 'Dr. Kashish Sharma',
      role: 'Base Commander & Administrator',
      permissions: ['read', 'write', 'execute', 'audit', 'navigate', 'request_supplies', 'schedule_maintenance']
    };

    // Conversational session memory
    this.context = {
      activeStation: 'bharati',
      lastTopic: 'overview',
      lastLanguage: 'en',
      lastGeneratedCard: null,
      lastConfirmationAction: null
    };
  }

  setRouterCallback(cb) {
    this.routerCallback = cb;
  }

  setPreferredLanguage(lang) {
    this.preferredLanguage = lang;
  }

  // Detect language from text (Devanagari, Hinglish keywords, or explicit switch)
  detectLanguage(text) {
    const lower = text.toLowerCase();

    // Check for Devanagari script (Unicode range: \u0900-\u097F)
    if (/[\u0900-\u097F]/.test(text)) {
      return 'hi';
    }

    // Check for explicit language switch requests
    if (lower.includes('hindi mein') || lower.includes('hindi me') || lower.includes('हिंदी में') || lower.includes('speak in hindi') || lower.includes('in hindi')) {
      return 'hi';
    }
    if (lower.includes('english mein') || lower.includes('english me') || lower.includes('अंग्रेजी में') || lower.includes('speak in english') || lower.includes('in english')) {
      return 'en';
    }
    if (lower.includes('hinglish mein') || lower.includes('hinglish me')) {
      return 'hinglish';
    }

    // Check for Hinglish phrases and markers
    const hinglishPhrases = [
      'bana do', 'kar do', 'bata do', 'dikhao', 'kya hai', 'kya problem', 'kya issue',
      'kitne hain', 'kitna hai', 'ka status', 'ki report', 'ka graph', 'chal raha',
      'bataiye', 'dijiye', 'kripya', 'shuru karo', 'open karo'
    ];

    for (const phrase of hinglishPhrases) {
      if (lower.includes(phrase)) {
        return 'hinglish';
      }
    }

    const hinglishWords = [
      'kya', 'hai', 'hain', 'dikhao', 'batao', 'kaunsa', 'kaunse', 'kitne', 'kitna', 'mein', 'me',
      'aur', 'ka', 'ki', 'ke', 'ko', 'karo', 'chahiye', 'kyun', 'kyon', 'kyu', 'sabse', 'achha', 'accha',
      'namaste', 'samasya', 'bhi', 'nahi', 'nahin', 'karen', 'hoga', 'zyada', 'kam', 'madad',
      'pehle', 'abhi', 'aaj', 'ek', 'do', 'teen', 'chaar', 'paanch', 'chhe', 'saat', 'aath', 'nau', 'das'
    ];

    const cleanTokens = lower.replace(/[.,/#!$%^&*;:{}=\-_`~()?"।]/g, ' ').split(/\s+/).filter(Boolean);
    let matchCount = 0;
    for (const token of cleanTokens) {
      if (hinglishWords.includes(token)) {
        matchCount++;
      }
    }

    if (matchCount >= 1) {
      return 'hinglish';
    }

    return 'en';
  }

  // Main natural language query processor
  async processCommand(rawInput, manualLangOverride = null) {
    const text = rawInput.trim();
    const lower = text.toLowerCase();

    const lang = manualLangOverride || this.detectLanguage(text);
    this.context.lastLanguage = lang;
    const isHi = lang === 'hi';
    const isHinglish = lang === 'hinglish';

    console.log(`[AI Copilot] Language: ${lang} | Command: "${text}"`);

    // Context pronoun & station resolution
    if (lower.includes('bharati') || lower.includes('भरती') || lower.includes('भारती')) {
      this.context.activeStation = 'bharati';
    }
    if (lower.includes('maitri') || lower.includes('मैतरी') || lower.includes('मैत्री')) {
      this.context.activeStation = 'maitri';
    }

    // -------------------------------------------------------------
    // INTENT 0: EXPLICIT LANGUAGE SWITCHING
    // -------------------------------------------------------------
    if (
      lower.includes('hindi mein samjhao') || lower.includes('ab hindi mein') || lower.includes('hindi mein batao') || lower.includes('हिंदी में समझाओ') || lower.includes('हिंदी में बताओ')
    ) {
      this.setPreferredLanguage(LANGUAGES.HI);
      return {
        type: 'text_card',
        language: 'hi',
        risk: COMMAND_RISK.LOW,
        spokenText: 'हाँ कमांडर, अब मैं हिन्दी में जानकारी प्रदान करूँगा। भरती स्टेशन में इस समय जनरेटर 02 की समस्या और स्पेयर पार्ट की कमी सबसे गंभीर मुद्दा है।',
        badge: DATA_BADGES.AI_INSIGHT,
        title: 'भाषा बदली गई: हिन्दी (Hindi)',
        data: {
          query: text,
          response: 'भाषा को सफलतापूर्वक <strong>हिन्दी (Hindi)</strong> में बदल दिया गया है। आप कोई भी सवाल हिन्दी या हिंग्लिश में पूछ सकते हैं।'
        },
        followUps: [
          'क्या समस्या है?',
          'भरती का जोखिम क्यों बढ़ा?',
          'दोनों स्टेशनों की तुलना करो',
          'दैनिक मिशन ब्रीफिंग'
        ]
      };
    }

    if (
      lower.includes('english mein samjhao') || lower.includes('ab english mein') || lower.includes('speak english') || lower.includes('अंग्रेजी में बताओ')
    ) {
      this.setPreferredLanguage(LANGUAGES.EN);
      return {
        type: 'text_card',
        language: 'en',
        risk: COMMAND_RISK.LOW,
        spokenText: 'Switched to English. Bharati Station currently has critical attention-level issues regarding Generator 02 and zero bearing stock on site.',
        badge: DATA_BADGES.AI_INSIGHT,
        title: 'Language Switched: English',
        data: {
          query: text,
          response: 'Switched active communication channel to <strong>English</strong>. You can speak or type any mission command.'
        },
        followUps: [
          'What needs my attention?',
          'Why is Bharati at risk?',
          'Compare Maitri and Bharati',
          'Morning briefing'
        ]
      };
    }

    // -------------------------------------------------------------
    // INTENT 1: FLAGSHIP "WHAT NEEDS ATTENTION?" / TRIAGE
    // -------------------------------------------------------------
    if (
      lower.includes('attention') ||
      lower.includes('urgent') ||
      lower.includes('important') ||
      lower.includes('highest risk') ||
      lower.includes('going wrong') ||
      lower.includes('problem') ||
      lower.includes('issue') ||
      lower.includes('ध्यान') ||
      lower.includes('समस्या') ||
      lower.includes('मुद्दे') ||
      lower.includes('गड़बड़') ||
      lower.includes('kya problem') ||
      lower.includes('kya chal raha') ||
      lower.includes('kya urgent') ||
      lower.includes('kya issue') ||
      lower.includes('sabse bada issue') ||
      lower.includes('kya galat')
    ) {
      this.context.lastTopic = 'attention';
      const summary = this.depEngine.getAttentionSummary(lang);
      return {
        type: 'attention_card',
        language: lang,
        risk: COMMAND_RISK.LOW,
        spokenText: summary.summaryText,
        badge: DATA_BADGES.AI_INSIGHT,
        title: isHi ? 'प्राथमिकता ध्यान ट्राइएज — अंटार्कटिक स्टेशन' :
               isHinglish ? 'Priority Attention Triage — Antarctic Stations' :
               'Priority Attention Triage — Antarctic Stations',
        data: summary,
        followUps: isHi ? [
          'भरती का जोखिम क्यों बढ़ा?',
          'जनरेटर के लिए आपातकालीन आपूर्ति अनुरोध बनाओ',
          'दोनों स्टेशनों की तुलना करो'
        ] : isHinglish ? [
          'Why is Bharati at risk?',
          'Create emergency supply request for generator',
          'Compare Maitri and Bharati'
        ] : [
          'Why is Bharati at risk?',
          'Create emergency supply request for generator',
          'Compare Maitri and Bharati'
        ]
      };
    }

    // -------------------------------------------------------------
    // INTENT 2: CAUSALITY & DEPENDENCY CHAIN ("Why?", "Explain risk")
    // -------------------------------------------------------------
    if (
      lower === 'why' ||
      lower === 'why?' ||
      lower === 'क्यों' ||
      lower === 'क्यों?' ||
      lower.includes('why is') ||
      lower.includes('kyun') ||
      lower.includes('kyon') ||
      lower.includes('kyu') ||
      lower.includes('reason') ||
      lower.includes('dependency') ||
      lower.includes('downstream') ||
      lower.includes('cascade') ||
      lower.includes('chain') ||
      lower.includes('प्रभाव') ||
      lower.includes('कारण') ||
      (lower.includes('explain') && (lower.includes('risk') || lower.includes('generator'))) ||
      (lower.includes('samjhao') && (lower.includes('risk') || lower.includes('generator')))
    ) {
      this.context.lastTopic = 'dependency_chain';
      const chain = this.depEngine.getBharatiRiskChain(lang);
      
      let spokenText = '';
      if (isHi) {
        spokenText = 'डिजिटल ट्विन निर्भरता श्रृंखला: जनरेटर 02 बेयरिंग की खराबी ने बिजली उत्पादन क्षमता 34% घटा दी है, जिससे सहायक हीटिंग चलानी पड़ रही है और दैनिक ईंधन खपत 18% बढ़ गई है। स्पेयर पार्ट उपलब्ध न होने और आपूर्ति उड़ान में देरी के कारण आइस कोर रिसर्च लैब धीमी गति से चल रही है।';
      } else if (isHinglish) {
        spokenText = 'Digital Twin dependency chain ye hai: Generator 02 failure se power capacity 34% kam hui, auxiliary heating start hui aur fuel burn rate 18% badh gaya. Spares out of stock hone ki wajah se research lab degraded mode mein chal rahi hai.';
      } else {
        spokenText = 'Here is the Digital Twin dependency chain: Generator 02 bearing failure has reduced power capacity by 34%, forcing auxiliary diesel heating and increasing daily fuel consumption by 18%. Because spare parts are out of stock and the supply flight is delayed, the ice core research lab is operating in degraded mode.';
      }

      return {
        type: 'dependency_card',
        language: lang,
        risk: COMMAND_RISK.LOW,
        spokenText,
        badge: DATA_BADGES.AI_INSIGHT,
        title: isHi ? 'डिजिटल ट्विन निर्भरता ग्राफ: भरती कैस्केड प्रभाव' : 'Digital Twin Dependency Graph: Bharati Cascade Impact',
        data: chain,
        followUps: isHi ? [
          'जनरेटर स्पेयर पार्ट के लिए आपातकालीन आपूर्ति अनुरोध बनाओ',
          'ईंधन भंडार दिखाओ',
          'ऊर्जा प्रबंधन खोलो'
        ] : isHinglish ? [
          'Create emergency supply request for generator spare part',
          'Show fuel inventory',
          'Open energy management'
        ] : [
          'Create an emergency supply request for generator spare part',
          'Show fuel inventory',
          'Open energy management'
        ]
      };
    }

    // -------------------------------------------------------------
    // INTENT 3: STATION STATUS & COMPARISON
    // -------------------------------------------------------------
    if (
      lower.includes('compare') ||
      lower.includes('तुलना') ||
      (lower.includes('both') && lower.includes('station')) ||
      (lower.includes('dono') && lower.includes('station')) ||
      lower.includes('kaunsa station')
    ) {
      this.context.lastTopic = 'comparison';
      const comp = this.depEngine.compareStations(lang);

      let spokenText = '';
      if (isHi) {
        spokenText = 'तुलना पूर्ण हुई। भरती स्टेशन 74% स्वास्थ्य पर है और जनरेटर समस्याओं के कारण ध्यान की मांग कर रहा है। मैतरी स्टेशन 88% स्वास्थ्य एवं 112 दिन के ईंधन भंडार के साथ सामान्य है।';
      } else if (isHinglish) {
        spokenText = 'Comparison ready hai. Bharati Station 74% health par hai aur generator issue ki wajah se attention chahiye. Maitri Station 88% health aur 112 days fuel reserve ke sath fully nominal hai.';
      } else {
        spokenText = 'Comparison complete. Bharati Station is at 74% health and requires attention due to generator bearing stress. Maitri Station is nominal at 88% health with 112 days of fuel reserves.';
      }

      return {
        type: 'comparison_card',
        language: lang,
        risk: COMMAND_RISK.LOW,
        spokenText,
        badge: DATA_BADGES.CALCULATED,
        title: isHi ? 'तुलनात्मक परिचालन विश्लेषण: मैतरी बनाम भरती' : 'Comparative Operational Analysis: Maitri vs Bharati',
        data: comp,
        followUps: isHi ? ['महत्वपूर्ण अलर्ट दिखाओ', 'क्या समस्या है?', 'ईंधन खपत का चार्ट बनाओ'] : ['Show critical alerts', 'What needs attention?', 'Create a chart of fuel consumption']
      };
    }

    if (
      (lower.includes('maitri') || lower.includes('मैतरी') || lower.includes('मैत्री')) &&
      (lower.includes('status') || lower.includes('health') || lower.includes('how is') || lower.includes('kaisa') || lower.includes('स्थिति') || lower.includes('दिखाओ') || lower.includes('show'))
    ) {
      this.context.activeStation = 'maitri';
      const st = this.dataService.getStation('maitri');

      let spokenText = isHi ?
        `मैतरी स्टेशन सामान्य रूप से कार्यरत है और इसका स्वास्थ्य सूचकांक ${st.healthScore}% है। 25 कर्मी उपस्थित हैं और ईंधन भंडार 112 दिनों के लिए पर्याप्त है।` :
        isHinglish ?
        `Maitri Station normal chal raha hai with overall health score of ${st.healthScore}%. 25 personnel on-site hain aur 112 days ka fuel backup available hai.` :
        `Maitri Station is operating normally with an overall health score of ${st.healthScore}%. 25 personnel are on site and fuel reserves are adequate for 112 days.`;

      return {
        type: 'station_card',
        language: lang,
        risk: COMMAND_RISK.LOW,
        spokenText,
        badge: DATA_BADGES.SIMULATED,
        title: `${st.name} Telemetry Summary`,
        data: st,
        followUps: isHi ? ['भरती से तुलना करो', 'मैतरी का मौसम दिखाओ', 'अलर्ट दिखाओ'] : ['Compare with Bharati', 'Show Maitri weather', 'Show alerts']
      };
    }

    if (
      (lower.includes('bharati') || lower.includes('भरती') || lower.includes('भारती')) &&
      (lower.includes('status') || lower.includes('health') || lower.includes('how is') || lower.includes('kaisa') || lower.includes('स्थिति') || lower.includes('दिखाओ') || lower.includes('show'))
    ) {
      this.context.activeStation = 'bharati';
      const st = this.dataService.getStation('bharati');

      let spokenText = isHi ?
        `भरती स्टेशन का स्वास्थ्य वर्तमान में ${st.healthScore}% है और स्थिति चेतावनी स्तर पर है। सीएचपी जनरेटर 02 में अत्यधिक कंपन है और साइट पर स्पेयर पार्ट्स समाप्त हो चुके हैं।` :
        isHinglish ?
        `Bharati Station health abhi ${st.healthScore}% hai with attention status. Generator 02 mein high vibration hai aur turbo bearing spares site par 0 hain.` :
        `Bharati Station health is currently at ${st.healthScore}% with attention status. Combined Heat & Power Generator 02 has abnormal vibration and spare parts are depleted on site.`;

      return {
        type: 'station_card',
        language: lang,
        risk: COMMAND_RISK.LOW,
        spokenText,
        badge: DATA_BADGES.SIMULATED,
        title: `${st.name} Telemetry Summary`,
        data: st,
        followUps: isHi ? ['भरती का जोखिम क्यों बढ़ा?', 'आपातकालीन आपूर्ति अनुरोध बनाओ', 'लॉजिस्टिक्स डैशबोर्ड खोलो'] : ['Why is Bharati at risk?', 'Create an emergency supply request', 'Open logistics dashboard']
      };
    }

    // -------------------------------------------------------------
    // INTENT 4: CRITICAL ALERTS & INCIDENTS
    // -------------------------------------------------------------
    if (
      lower.includes('alert') ||
      lower.includes('incident') ||
      lower.includes('warning') ||
      lower.includes('अलर्ट') ||
      lower.includes('चेतावनी') ||
      lower.includes('critical alerts kitne')
    ) {
      const alerts = lower.includes('critical') || lower.includes('महत्वपूर्ण') ? this.dataService.getCriticalAlerts() : this.dataService.getAlerts();

      let spokenText = isHi ?
        `दोनों स्टेशनों में कुल ${alerts.length} अलर्ट सक्रिय हैं। भरती में जनरेटर 02 और स्पेयर पार्ट्स की कमी को लेकर 2 गंभीर अलर्ट हैं। मैतरी में 1 मौसम चेतावनी सक्रिय है।` :
        isHinglish ?
        `Total ${alerts.length} active alerts hain. Bharati mein Generator 02 aur zero spare parts ke 2 critical alerts hain, aur Maitri mein 1 weather advisory active hai.` :
        `There are ${alerts.length} active alerts across the stations. Two critical alerts are at Bharati regarding Generator 02 and zero bearing stock. One weather warning is active at Maitri.`;

      return {
        type: 'alerts_card',
        language: lang,
        risk: COMMAND_RISK.LOW,
        spokenText,
        badge: DATA_BADGES.SIMULATED,
        title: isHi ? 'सक्रिय अंटार्कटिक परिचालन अलर्ट' : 'Active Antarctic Operational Alerts',
        data: alerts,
        followUps: isHi ? ['भरती का जोखिम क्यों बढ़ा?', 'क्या समस्या है?', 'अलर्ट्स पेज खोलो'] : ['Why is Bharati at risk?', 'What needs attention?', 'Open alerts']
      };
    }

    // -------------------------------------------------------------
    // INTENT 5: ENERGY & FUEL CONSUMPTION
    // -------------------------------------------------------------
    if (
      lower.includes('energy') ||
      lower.includes('power') ||
      lower.includes('fuel') ||
      lower.includes('generator') ||
      lower.includes('ऊर्जा') ||
      lower.includes('ईंधन') ||
      lower.includes('बिजली') ||
      lower.includes('जनरेटर') ||
      lower.includes('khapat') ||
      lower.includes('bijli')
    ) {
      this.context.lastTopic = 'energy';
      const maitri = this.dataService.getStation('maitri');
      const bharati = this.dataService.getStation('bharati');

      if (lower.includes('chart') || lower.includes('graph') || lower.includes('ग्राफ') || lower.includes('चार्ट') || lower.includes('trend')) {
        return {
          type: 'chart_card',
          language: lang,
          risk: COMMAND_RISK.LOW,
          chartType: 'energy_fuel',
          spokenText: isHi ?
            'मैतरी और भरती स्टेशनों के लिए 30-दिवसीय ईंधन एवं विद्युत खपत प्रवृत्ति विश्लेषण उत्पन्न किया जा रहा है।' :
            isHinglish ?
            'Maitri aur Bharati ke liye 30-day fuel aur power consumption trend chart generate ho raha hai.' :
            'Generating 30-day fuel and power consumption trend analysis for Maitri and Bharati stations.',
          badge: DATA_BADGES.SIMULATED,
          title: isHi ? 'ऊर्जा खपत एवं ईंधन क्षय विश्लेषण (30 दिन)' : '30-Day Energy Load & Fuel Depletion Trends',
          followUps: isHi ? ['भरती अधिक ईंधन क्यों जला रहा है?', 'इन्वेंट्री जांचें', 'ऊर्जा प्रबंधन केंद्र खोलो'] : ['Why is Bharati consuming more fuel?', 'Check inventory', 'Open Energy Management']
        };
      }

      let spokenText = isHi ?
        `कुल विद्युत मांग ${(maitri.currentPowerKw + bharati.currentPowerKw).toFixed(1)} kW है। मैतरी में 112 दिन का ईंधन शेष है, जबकि भरती में हीटिंग बर्नर के कारण 18% अधिक जलने की दर से 68 दिन का ईंधन बचा है।` :
        isHinglish ?
        `Total power demand ${(maitri.currentPowerKw + bharati.currentPowerKw).toFixed(1)} kW hai. Maitri ke paas 112 days ka fuel hai, jabki Bharati ke paas 18% accelerated burn rate ke sath 68 days bacha hai.` :
        `Total power demand is ${(maitri.currentPowerKw + bharati.currentPowerKw).toFixed(1)} kW. Maitri has ${maitri.fuelDaysRemaining} days of fuel remaining, while Bharati has ${bharati.fuelDaysRemaining} days with an accelerated 18% burn rate due to auxiliary heating.`;

      return {
        type: 'energy_card',
        language: lang,
        risk: COMMAND_RISK.LOW,
        spokenText,
        badge: DATA_BADGES.SIMULATED,
        title: isHi ? 'स्टेशन ऊर्जा एवं ईंधन भंडार' : 'Station Energy & Fuel Reserves',
        data: { maitri, bharati },
        followUps: isHi ? ['ईंधन खपत का चार्ट बनाओ', 'महत्वपूर्ण उपकरण दिखाओ', 'ऊर्जा केंद्र खोलो'] : ['Create a chart of fuel consumption', 'Show critical infrastructure', 'Open energy']
      };
    }

    // -------------------------------------------------------------
    // INTENT 6: LOGISTICS & SHIPMENTS
    // -------------------------------------------------------------
    if (
      lower.includes('logistics') ||
      lower.includes('ship') ||
      lower.includes('vessel') ||
      lower.includes('shipment') ||
      lower.includes('cargo') ||
      lower.includes('flight') ||
      lower.includes('लॉजिस्टिक्स') ||
      lower.includes('जहाज') ||
      lower.includes('आपूर्ति') ||
      lower.includes('सप्लाई') ||
      lower.includes('jahaz')
    ) {
      const logistics = this.dataService.getLogistics();

      let spokenText = isHi ?
        'लॉजिस्टिक्स पाइपलाइन: आइसब्रेकर आर/वी भरती 8 दिनों के ईटीए के साथ यात्रा में है। पोलर एयर कार्गो उड़ान IA-884 नोवो एयरबेस पर 48 घंटे के मौसम विलंब से रुकी है।' :
        isHinglish ?
        'Logistics update: Icebreaker R/V Bharati on-schedule hai ETA 8 days. Polar Air Cargo Flight IA-884 Novo Airbase par 48 hours weather delay par hai.' :
        'Displaying logistics pipeline. Icebreaker R/V Bharati is en route with ETA 8 days. Polar Air Cargo Flight IA-884 is currently weather-delayed by 48 hours at Novo Airbase.';

      return {
        type: 'logistics_card',
        language: lang,
        risk: COMMAND_RISK.LOW,
        spokenText,
        badge: DATA_BADGES.SIMULATED,
        title: isHi ? 'अंटार्कटिक लॉजिस्टिक्स एवं कार्गो पाइपलाइन' : 'Antarctic Logistics & Cargo Pipeline',
        data: logistics,
        followUps: isHi ? ['आपातकालीन आपूर्ति अनुरोध बनाओ', 'लॉजिस्टिक्स डैशबोर्ड खोलो', 'इन्वेंट्री दिखाओ'] : ['Create emergency supply request', 'Open logistics dashboard', 'Show inventory']
      };
    }

    // -------------------------------------------------------------
    // INTENT 7: INVENTORY & LOW STOCK
    // -------------------------------------------------------------
    if (
      lower.includes('inventory') ||
      lower.includes('stock') ||
      lower.includes('spare') ||
      lower.includes('supplies') ||
      lower.includes('इन्वेंट्री') ||
      lower.includes('स्टॉक') ||
      lower.includes('भंडार') ||
      lower.includes('स्पेयर') ||
      lower.includes('kya low')
    ) {
      const items = lower.includes('low') || lower.includes('कम') || lower.includes('critical') ?
        this.dataService.getLowStockItems() : this.dataService.inventoryItems;

      let spokenText = isHi ?
        'इन्वेंट्री रिपोर्ट: भरती पर जनरेटर 02 टर्बो बेयरिंग पूरी तरह समाप्त (स्टॉक 0) हैं, और मैतरी पर विंड टरबाइन डी-आइसिंग द्रव न्यूनतम सीमा से नीचे है।' :
        isHinglish ?
        'Inventory audit: Generator 02 Turbo Bearings Bharati par completely out of stock (qty 0) hain, aur Maitri par de-icing fluid minimum se low hai.' :
        'Retrieved inventory. Noticeably, Generator 02 High-Temp Turbo Bearings are completely out of stock at Bharati, and Maitri is below minimum on wind turbine de-icing fluid.';

      return {
        type: 'inventory_card',
        language: lang,
        risk: COMMAND_RISK.LOW,
        spokenText,
        badge: DATA_BADGES.SIMULATED,
        title: isHi ? 'इन्वेंट्री एवं महत्वपूर्ण स्पेयर पार्ट्स स्थिति' : 'Inventory & Critical Spares Status',
        data: items,
        followUps: isHi ? ['आपातकालीन आपूर्ति अनुरोध बनाओ', 'क्या समस्या है?', 'इन्वेंट्री पेज खोलो'] : ['Create an emergency supply request', 'What needs attention?', 'Open inventory']
      };
    }

    // -------------------------------------------------------------
    // INTENT 8: INFRASTRUCTURE & MAINTENANCE
    // -------------------------------------------------------------
    if (
      lower.includes('infrastructure') ||
      lower.includes('asset') ||
      lower.includes('equipment') ||
      lower.includes('maintenance') ||
      lower.includes('इन्फ्रास्ट्रक्चर') ||
      lower.includes('उपकरण') ||
      lower.includes('रखरखाव') ||
      lower.includes('मेंटेनेंस')
    ) {
      const assets = this.dataService.getAssets();
      const maint = this.dataService.getMaintenanceTasks();

      let spokenText = isHi ?
        'भरती जनरेटर 02 टर्बो ओवरहाल स्पेयर पार्ट्स न होने के कारण 4 दिन से लंबित है। मैतरी विंड टरबाइन रखरखाव कल के लिए निर्धारित है।' :
        isHinglish ?
        'Bharati Generator 02 turbo overhaul missing spare parts ki wajah se 4 days overdue hai. Maitri wind turbine maintenance kal scheduled hai.' :
        'Bharati Generator 02 turbo overhaul is 4 days overdue due to missing spare parts. Maitri wind turbine nacelle maintenance is scheduled for tomorrow.';

      return {
        type: 'infrastructure_card',
        language: lang,
        risk: COMMAND_RISK.LOW,
        spokenText,
        badge: DATA_BADGES.SIMULATED,
        title: isHi ? 'महत्वपूर्ण इन्फ्रास्ट्रक्चर एवं रखरखाव कार्य आदेश' : 'Critical Infrastructure & Maintenance Work Orders',
        data: { assets, maint },
        followUps: isHi ? ['जनरेटर 02 क्यों लंबित है?', 'इन्फ्रास्ट्रक्चर केंद्र खोलो', 'सप्लाई अनुरोध बनाओ'] : ['Why is Generator 02 overdue?', 'Open Infrastructure Management', 'Create emergency supply request']
      };
    }

    // -------------------------------------------------------------
    // INTENT 9: ENVIRONMENTAL & WEATHER
    // -------------------------------------------------------------
    if (
      lower.includes('environment') ||
      lower.includes('weather') ||
      lower.includes('temperature') ||
      lower.includes('temp') ||
      lower.includes('wind') ||
      lower.includes('blizzard') ||
      lower.includes('मौसम') ||
      lower.includes('तापमान') ||
      lower.includes('हवा') ||
      lower.includes('तूफान') ||
      lower.includes('mausam')
    ) {
      const maitri = this.dataService.getStation('maitri');
      const bharati = this.dataService.getStation('bharati');

      let spokenText = isHi ?
        `सिम्युलेटेड मौसम: मैतरी में तापमान -24.6°C और हवा की गति 28 नॉट्स है (तूफान की संभावना)। भरती में तापमान -29.8°C और विंड चिल -44.5°C है।` :
        isHinglish ?
        `Simulated weather: Maitri is -24.6°C with 28 knot winds (storm warning active). Bharati is -29.8°C with wind chill of -44.5°C.` :
        `Simulated weather data: Maitri is -24.6°C with wind gusts of 28 knots, rising ahead of a catabatic storm. Bharati is -29.8°C with wind chill of -44.5°C.`;

      return {
        type: 'environment_card',
        language: lang,
        risk: COMMAND_RISK.LOW,
        spokenText,
        badge: DATA_BADGES.SIMULATED,
        title: isHi ? 'सिम्युलेटेड अंटार्कटिक पर्यावरण टेलीमेट्री' : 'Simulated Antarctic Environmental Telemetry',
        data: { maitri, bharati },
        followUps: isHi ? ['क्या मौसम शोध को प्रभावित कर रहा है?', 'दोनों स्टेशनों की तुलना करो', 'अलर्ट दिखाओ'] : ['Is weather affecting field operations?', 'Compare stations', 'Show critical alerts']
      };
    }

    // -------------------------------------------------------------
    // INTENT 10: RESEARCH ACTIVITIES
    // -------------------------------------------------------------
    if (
      lower.includes('research') ||
      lower.includes('project') ||
      lower.includes('science') ||
      lower.includes('lab') ||
      lower.includes('शोध') ||
      lower.includes('रिसर्च') ||
      lower.includes('वैज्ञानिक')
    ) {
      const res = this.dataService.getResearchProjects();

      let spokenText = isHi ?
        'भरती पर डीप आइस कोर पेलियोक्लाइमेट शोध क्रायो-चिलर पावर थ्रॉटलिंग के कारण धीमी गति से चल रहा है। मैग्नेटोस्फेरिक और ओजोन निगरानी पूरी तरह सक्रिय हैं।' :
        isHinglish ?
        'Deep Ice Core Paleoclimate Analysis Bharati par degraded status mein chal raha hai cryo-chiller power throttling ki wajah se. Baaki 3 projects active hain.' :
        'Deep Ice Core Paleoclimate Analysis at Bharati is running in degraded status due to cryo-chiller power throttling. Magnetospheric and ozone monitoring remain fully operational.';

      return {
        type: 'research_card',
        language: lang,
        risk: COMMAND_RISK.LOW,
        spokenText,
        badge: DATA_BADGES.SIMULATED,
        title: isHi ? 'वैज्ञानिक अनुसंधान कार्यक्रम स्थिति' : 'Scientific Research Programs Status',
        data: res,
        followUps: isHi ? ['भरती शोध क्यों धीमा है?', 'शोध केंद्र खोलो', 'क्या समस्या है?'] : ['Why is Bharati research degraded?', 'Open research', 'What needs attention?']
      };
    }

    // -------------------------------------------------------------
    // INTENT 11: NAVIGATION COMMANDS
    // -------------------------------------------------------------
    const navMatch = this.checkNavigation(lower);
    if (navMatch) {
      let spokenText = isHi ?
        `${navMatch.title} पर नेविगेट किया जा रहा है।` :
        isHinglish ?
        `${navMatch.title} open kar raha hoon.` :
        `Navigating to ${navMatch.title}.`;

      return {
        type: 'navigation_card',
        language: lang,
        risk: COMMAND_RISK.LOW,
        spokenText,
        badge: DATA_BADGES.USER_ACTION,
        title: `Dashboard Navigation: ${navMatch.title}`,
        data: navMatch,
        executeAction: () => {
          if (navMatch.isExternal) {
            window.location.href = navMatch.url;
          } else if (this.routerCallback) {
            this.routerCallback(navMatch.routeId);
          } else {
            window.location.hash = navMatch.routeId;
          }
        }
      };
    }

    // -------------------------------------------------------------
    // INTENT 12: DYNAMIC CHART GENERATION
    // -------------------------------------------------------------
    if (
      lower.includes('chart') ||
      lower.includes('graph') ||
      lower.includes('plot') ||
      lower.includes('चार्ट') ||
      lower.includes('ग्राफ')
    ) {
      let spokenText = isHi ?
        'स्टेशन लॉग के आधार पर गतिशील परिचालन टेलीमेट्री चार्ट तैयार किया जा रहा है।' :
        isHinglish ?
        'Station logs ke basis par dynamic telemetry chart generate ho raha hai.' :
        'Generating dynamic operational telemetry chart based on station logs.';

      return {
        type: 'chart_card',
        language: lang,
        risk: COMMAND_RISK.LOW,
        chartType: lower.includes('fuel') || lower.includes('ईंधन') ? 'fuel' : lower.includes('power') || lower.includes('बिजली') ? 'power' : 'comparison',
        spokenText,
        badge: DATA_BADGES.SIMULATED,
        title: isHi ? 'गतिशील परिचालन विज़ुअलाइज़ेशन' : 'Dynamic Operational Visualization',
        followUps: isHi ? ['स्टेशनों की तुलना करो', 'ईंधन भंडार दिखाओ', 'दैनिक ब्रीफिंग'] : ['Compare stations', 'Show fuel inventory', 'Morning briefing']
      };
    }

    // -------------------------------------------------------------
    // INTENT 13: REPORT & MORNING BRIEFING
    // -------------------------------------------------------------
    if (
      lower.includes('briefing') ||
      lower.includes('report') ||
      lower.includes('summary') ||
      lower.includes('morning') ||
      lower.includes('ब्रीफिंग') ||
      lower.includes('रिपोर्ट') ||
      lower.includes('सुप्रभात') ||
      lower.includes('namaste')
    ) {
      const briefing = this.depEngine.generateMorningBriefing(this.currentUser.name, lang);

      let spokenText = isHi ?
        'नमस्ते कमांडर। दैनिक मिशन ब्रीफिंग तैयार है। सभी 48 कर्मी उपस्थित हैं। भरती स्टेशन पर विलंबित जनरेटर स्पेयर पार्ट्स के कारण आपका ध्यान आवश्यक है।' :
        isHinglish ?
        'Namaste Commander. Daily briefing ready hai. Sabhi 48 personnel safe hain. Bharati Station par delayed generator spares ke liye attention chahiye.' :
        'Good morning, Commander. Daily briefing generated. All 48 personnel are accounted for. Bharati Station requires your attention due to the delayed generator spare parts shipment.';

      return {
        type: 'report_card',
        language: lang,
        risk: COMMAND_RISK.LOW,
        spokenText,
        badge: DATA_BADGES.AI_INSIGHT,
        title: briefing.title,
        data: briefing,
        followUps: isHi ? ['क्या समस्या है?', 'भरती का जोखिम क्यों बढ़ा?', 'आपातकालीन आपूर्ति अनुरोध बनाओ'] : ['What needs attention?', 'Why is Bharati at risk?', 'Create emergency supply request']
      };
    }

    // -------------------------------------------------------------
    // INTENT 14: AUTHORIZED ACTIONS (CONFIRMATION REQUIRED)
    // -------------------------------------------------------------
    if (
      lower.includes('supply request') ||
      lower.includes('order spare') ||
      lower.includes('request part') ||
      lower.includes('emergency supply') ||
      lower.includes('आपूर्ति अनुरोध') ||
      lower.includes('सप्लाई अनुरोध') ||
      lower.includes('spare part order') ||
      lower.includes('request bana')
    ) {
      const targetStation = lower.includes('maitri') || lower.includes('मैतरी') ? 'Maitri' : 'Bharati';
      const item = 'Generator #02 High-Temp Turbo Bearings & Seal Kit';

      let spokenText = isHi ?
        `पुष्टि आवश्यक है। आप ${targetStation} स्टेशन के लिए ${item} का आपातकालीन आपूर्ति अनुरोध बनाने वाले हैं। क्या आप आगे बढ़ना चाहते हैं?` :
        isHinglish ?
        `Confirmation required. Aap ${targetStation} ke liye emergency supply request create karne wale hain. Kya aap proceed karna chahte hain?` :
        `Confirmation required. You are about to initiate an Emergency Logistics Supply Request for ${item} at ${targetStation} Station. Do you want to proceed?`;

      return {
        type: 'confirmation_card',
        language: lang,
        risk: COMMAND_RISK.HIGH,
        spokenText,
        badge: DATA_BADGES.USER_ACTION,
        title: isHi ? 'पुष्टि आवश्यक है: आपातकालीन आपूर्ति अनुरोध' : isHinglish ? 'Confirmation Required: Emergency Supply Request' : 'Confirmation Required: Emergency Supply Request',
        data: {
          actionName: isHi ? 'आपातकालीन आपूर्ति अनुरोध' : 'CREATE_EMERGENCY_SUPPLY_REQUEST',
          station: targetStation,
          item,
          priority: 'CRITICAL',
          impact: isHi ? 'एनसीपीओआर लॉजिस्टिक्स कमांड को प्राथमिकता मैनिफेस्ट भेजता है और एयर कार्गो स्लॉट बुक करता है।' : 'Submits priority manifest to NCPOR Logistics Command & initiates cargo flight slot booking.',
          riskLevel: isHi ? 'उच्च जोखिम (लॉजिस्टिक्स खरीद)' : 'HIGH RISK (LOGISTICS PROCUREMENT)',
          language: lang,
          onConfirm: () => {
            return this.dataService.createEmergencySupplyRequest({
              station: targetStation,
              item,
              qty: '2 Kits',
              priority: 'CRITICAL',
              user: this.currentUser.name
            });
          }
        }
      };
    }

    if (
      lower.includes('schedule maintenance') ||
      lower.includes('create maintenance') ||
      lower.includes('रखरखाव शेड्यूल') ||
      lower.includes('maintenance schedule')
    ) {
      let spokenText = isHi ?
        'पुष्टि आवश्यक है। आप जनरेटर 02 के लिए आपातकालीन निरीक्षण कार्य शेड्यूल करने वाले हैं। क्या आप आगे बढ़ना चाहते हैं?' :
        isHinglish ?
        'Confirmation required. Aap Generator 02 ke liye immediate maintenance schedule karne wale hain. Continue karein?' :
        'Confirmation required. You are about to schedule an immediate emergency inspection task for Generator 02. Do you want to proceed?';

      return {
        type: 'confirmation_card',
        language: lang,
        risk: COMMAND_RISK.MEDIUM,
        spokenText,
        badge: DATA_BADGES.USER_ACTION,
        title: isHi ? 'पुष्टि आवश्यक है: रखरखाव कार्य शेड्यूल करें' : 'Confirmation Required: Schedule Maintenance Task',
        data: {
          actionName: isHi ? 'रखरखाव कार्य शेड्यूलिंग' : 'SCHEDULE_MAINTENANCE_TASK',
          station: 'Bharati',
          assetId: 'ASSET-BH-GEN02',
          title: 'Emergency Generator Overhaul Inspection',
          impact: isHi ? 'पावर प्लांट बे बी में रैपिड इंजीनियरिंग टीम तैनात करता है।' : 'Dispatches rapid engineering team to Power Plant Bay B.',
          riskLevel: isHi ? 'मध्यम जोखिम' : 'MEDIUM RISK',
          language: lang,
          onConfirm: () => {
            return this.dataService.scheduleMaintenanceTask({
              station: 'bharati',
              assetId: 'ASSET-BH-GEN02',
              title: 'Emergency Generator Overhaul Inspection',
              priority: 'HIGH',
              user: this.currentUser.name
            });
          }
        }
      };
    }

    // -------------------------------------------------------------
    // INTENT 15: AUDIT LOG
    // -------------------------------------------------------------
    if (
      lower.includes('audit') ||
      lower.includes('log') ||
      lower.includes('history') ||
      lower.includes('ऑडिट') ||
      lower.includes('इतिहास')
    ) {
      const logs = this.dataService.getAuditLog();

      let spokenText = isHi ?
        `एआई कॉपायलट ऑडिट लॉग प्रदर्शित कर रहा हूँ। ${logs.length} प्रशासनिक घटनाएँ दर्ज हैं।` :
        isHinglish ?
        `AI Copilot audit logs display ho rahe hain. ${logs.length} administrative events recorded hain.` :
        `Displaying AI Copilot audit logs. ${logs.length} administrative events recorded.`;

      return {
        type: 'audit_card',
        language: lang,
        risk: COMMAND_RISK.LOW,
        spokenText,
        badge: DATA_BADGES.LIVE,
        title: isHi ? 'प्रशासनिक एआई सुरक्षा ऑडिट ट्रेल' : 'Admin AI Action Audit Trail',
        data: logs,
        followUps: isHi ? ['क्या समस्या है?', 'स्टेशनों की तुलना करो', 'दैनिक ब्रीफिंग'] : ['What needs attention?', 'Compare stations', 'Morning briefing']
      };
    }

    // Default fallback
    let spokenText = isHi ?
      `कमांड प्राप्त हुई: "${text}"। मैंने अंटार्कटिक डेटाबेस की जाँच की है। क्या आप वर्तमान समस्याएँ देखना चाहते हैं या भरती का जनरेटर अलर्ट जाँचना चाहते हैं?` :
      isHinglish ?
      `Command received: "${text}". Digital twin database check ho gaya hai. Aap 'kya problem hai' ya 'Bharati status' bol sakte hain.` :
      `Understood command: "${text}". I have cross-referenced the Antarctic operational database. Would you like to check what needs attention, inspect Bharati's generator alert, or compare station health?`;

    return {
      type: 'text_card',
      language: lang,
      risk: COMMAND_RISK.LOW,
      spokenText,
      badge: DATA_BADGES.AI_INSIGHT,
      title: isHi ? 'परिचालन क्वेरी परिणाम' : 'Operational Query Result',
      data: {
        query: text,
        response: isHi ?
          `मैंने "${text}" के लिए डिजिटल ट्विन डेटाबेस खोजा है। आप नीचे दिए गए अनुशंसित मिशन कमांड आज़मा सकते हैं:` :
          isHinglish ?
          `"${text}" ke liye digital twin database check kiya. Niche diye gaye recommended commands try karein:` :
          `I searched the digital twin database for "${text}". Try one of the high-priority mission commands below:`
      },
      followUps: isHi ? [
        'क्या समस्या है?',
        'भरती का जोखिम क्यों बढ़ा?',
        'दोनों स्टेशनों की तुलना करो',
        'महत्वपूर्ण अलर्ट दिखाओ',
        'दैनिक ब्रीफिंग'
      ] : isHinglish ? [
        'What needs my attention?',
        'Why is Bharati at risk?',
        'Compare Maitri and Bharati',
        'Show critical alerts',
        'Morning briefing'
      ] : [
        'What needs my attention?',
        'Why is Bharati at risk?',
        'Compare Maitri and Bharati',
        'Show critical alerts',
        'Morning briefing'
      ]
    };
  }

  // Safe router navigation mapping
  checkNavigation(lower) {
    if (lower.includes('infrastructure') || lower.includes('इन्फ्रास्ट्रक्चर')) {
      if (lower.includes('center') || lower.includes('page') || lower.includes('operations') || lower.includes('केंद्र')) {
        return { routeId: 'infrastructure', title: 'Infrastructure Management Center', isExternal: true, url: '/infrastructure-management.html' };
      }
      return { routeId: 'infrastructure', title: 'Infrastructure Overview', isExternal: false };
    }
    if (lower.includes('energy') || lower.includes('ऊर्जा')) {
      if (lower.includes('center') || lower.includes('page') || lower.includes('operations') || lower.includes('केंद्र')) {
        return { routeId: 'energy', title: 'Energy Management Operations Center', isExternal: true, url: '/energy-management.html' };
      }
      return { routeId: 'energy', title: 'Energy Microgrid Overview', isExternal: false };
    }
    if (lower.includes('ship') || lower.includes('vessel') || lower.includes('flight') || lower.includes('air cargo') || lower.includes('command center') || lower.includes('live tracking') || lower.includes('जहाज़')) {
      return { routeId: 'logisticsCommand', title: 'Antarctic Logistics Command Center', isExternal: false };
    }
    if (lower.includes('logistics') || lower.includes('लॉजिस्टिक्स')) {
      if (lower.includes('tracking') || lower.includes('live') || lower.includes('command')) {
        return { routeId: 'logisticsCommand', title: 'Antarctic Logistics Command Center', isExternal: false };
      }
      if (lower.includes('center') || lower.includes('page') || lower.includes('operations') || lower.includes('केंद्र')) {
        return { routeId: 'logistics', title: 'Logistics & Supply Operations Center', isExternal: false };
      }
      return { routeId: 'logistics', title: 'Logistics & Vessel Tracking', isExternal: false };
    }
    if (lower.includes('digital twin') || lower.includes('twin') || lower.includes('ट्विन')) return { routeId: 'digitalTwin', title: 'Antarctic Digital Twin 3D View', isExternal: false };
    if (lower.includes('alert') || lower.includes('incident') || lower.includes('अलर्ट')) return { routeId: 'alerts', title: 'Alerts & Incidents', isExternal: false };
    if (lower.includes('environment') || lower.includes('weather') || lower.includes('मौसम') || lower.includes('पर्यावरण')) {
      if (lower.includes('center') || lower.includes('page') || lower.includes('operations') || lower.includes('monitoring') || lower.includes('केंद्र') || lower.includes('निगरानी')) {
        return { routeId: 'envMonitoring', title: 'Environmental Operations Center', isExternal: false };
      }
      return { routeId: 'environment', title: 'Environmental Telemetry', isExternal: false };
    }
    if (lower.includes('inventory') || lower.includes('stock') || lower.includes('इन्वेंट्री')) return { routeId: 'inventory', title: 'Inventory & Spares', isExternal: false };
    if (lower.includes('research') || lower.includes('शोध')) return { routeId: 'research', title: 'Research Activities', isExternal: false };
    if (lower.includes('maintenance') || lower.includes('रखरखाव')) return { routeId: 'maintenance', title: 'Maintenance Bay', isExternal: false };
    if (lower.includes('personnel') || lower.includes('crew') || lower.includes('कर्मचारी')) return { routeId: 'personnel', title: 'Personnel On-Site', isExternal: false };
    if (lower.includes('report') || lower.includes('analytics') || lower.includes('रिपोर्ट')) return { routeId: 'reports', title: 'Reports & Analytics', isExternal: false };
    if (lower.includes('dashboard') || lower.includes('overview') || lower.includes('home') || lower.includes('डैशबोर्ड')) return { routeId: 'dashboard', title: 'Admin Overview Dashboard', isExternal: false };

    return null;
  }
}

