// Digital Twin Cross-Department Dependency & Causality Reasoning Engine (Multilingual: EN, HI, Hinglish)
import { stationData } from './stationDataService.js';

export class DependencyEngine {
  constructor() {
    this.dataService = stationData;
  }

  // Flagship analysis: "What needs my attention?" / "क्या समस्या है?" / "Kya problem hai?"
  getAttentionSummary(language = 'en') {
    const isHi = language === 'hi';
    const isHinglish = language === 'hinglish';

    const issues = [
      {
        rank: 1,
        severity: 'CRITICAL',
        station: isHi ? 'भरती स्टेशन (Bharati)' : 'Bharati Station',
        department: isHi ? 'ऊर्जा एवं इन्फ्रास्ट्रक्चर' : isHinglish ? 'Energy & Infrastructure' : 'ENERGY & INFRASTRUCTURE',
        title: isHi ? 'सीएचपी जनरेटर #02 टर्बो बेयरिंग विफलता एवं शून्य स्पेयर स्टॉक' :
               isHinglish ? 'CHP Generator #02 Turbo Bearing Failure & Zero Spare Stock' :
               'CHP Generator #02 Turbo Bearing Failure & Zero Spare Stock',
        impact: isHi ? 'आवास हीटिंग में भारी जोखिम, +18% अतिरिक्त ईंधन खपत, और क्रायो-शोध आइस कोर स्थिरता पर प्रभाव।' :
                isHinglish ? 'Habitat heating par high downstream risk, +18% daily fuel burn rate, aur cryo-research ice core stability par effect.' :
                'High downstream risk to habitat heating, +18% fuel burn rate, and cryo-research ice core stability.',
        recommendedAction: isHi ? 'टर्बो बेयरिंग किट के लिए आपातकालीन आपूर्ति अनुरोध स्वीकृत करें एवं मौसम खिड़की मिलते ही एयर कार्गो रवाना करें।' :
                           isHinglish ? 'Turbo bearing kit ke liye Emergency Supply Request approve karein aur weather window milte hi air cargo dispatch karein.' :
                           'Approve Emergency Supply Request for turbo bearing kit & dispatch air cargo on first weather window.'
      },
      {
        rank: 2,
        severity: 'HIGH',
        station: isHi ? 'भरती स्टेशन (Bharati)' : 'Bharati Station',
        department: isHi ? 'लॉजिस्टिक्स एवं आपूर्ति' : isHinglish ? 'Logistics & Supply' : 'LOGISTICS',
        title: isHi ? 'ध्रुवीय एयर कार्गो उड़ान IA-884 बर्फीले तूफान के कारण विलंबित' :
               isHinglish ? 'Polar Air Cargo Flight IA-884 Blizzard ki wajah se delayed' :
               'Polar Air Cargo Flight IA-884 Delayed by Blizzard',
        impact: isHi ? 'महत्वपूर्ण स्पेयर पार्ट्स की डिलीवरी 48 घंटे टली; रिज़र्व बफर में कमी।' :
                isHinglish ? 'Critical spares delivery 48 hours push back ho gayi hai; buffer stock reduce ho gaya hai.' :
                'Critical spares delivery pushed back 48 hours; reserves buffer reduced.',
        recommendedAction: isHi ? 'यदि मौसम की देरी 72 घंटे से अधिक होती है तो केप टाउन समुद्री काफिले के माध्यम से द्वितीयक आपूर्ति रूट करें।' :
                           isHinglish ? 'Agar weather delay 72 hours se zyada ho to Cape Town maritime convoy ke through backup supply reroute karein.' :
                           'Reroute secondary supply telemetry via Cape Town maritime convoy if weather delays exceed 72 hours.'
      },
      {
        rank: 3,
        severity: 'MEDIUM',
        station: isHi ? 'मैतरी स्टेशन (Maitri)' : 'Maitri Station',
        department: isHi ? 'पर्यावरण एवं सुरक्षा' : isHinglish ? 'Environment & Safety' : 'ENVIRONMENT & SAFETY',
        title: isHi ? 'कैटैबैटिक हवाओं का अलर्ट (55 समुद्री मील)' :
               isHinglish ? 'Catabatic Wind Surge Warning (55 kts)' :
               'Catabatic Wind Surge Warning (55 kts)',
        impact: isHi ? 'विंड टरबाइन #02 नैकेल पर बर्फ जमने की संभावना; बाहरी शोध कार्य अस्थायी रूप से निलंबित।' :
                isHinglish ? 'Wind Turbine #02 par ice accumulation ka risk; outdoor field research suspended.' :
                'Potential ice accumulation on Wind Turbine #02 nacelle; outdoor field research suspended.',
        recommendedAction: isHi ? 'टरबाइन स्टॉर्म मोड सक्रिय करें और बाहरी एयरलॉक बंद रखें।' :
                           isHinglish ? 'Turbine storm-feathering mode engage karein aur external station airlocks lock karein.' :
                           'Engage turbine storm-feathering mode and lock external station airlocks.'
      }
    ];

    let summaryText = '';
    if (isHi) {
      summaryText = `वर्तमान में 3 परिचालन मुद्दे आपके ध्यान की मांग कर रहे हैं। सबसे गंभीर जोखिम भरती स्टेशन पर है: जनरेटर 02 बेयरिंग की खराबी और साइट पर शून्य स्पेयर पार्ट्स, जिसके कारण हीटिंग लूप प्रभावित हो रहे हैं और दैनिक ईंधन खपत 18% बढ़ गई है।`;
    } else if (isHinglish) {
      summaryText = `Total 3 operational issues hain jinpe immediate attention chahiye. Sabse bada risk Bharati Station par hai: Generator 02 bearing issue aur zero spare stock on site, jiski wajah se heating loops affect ho rahe hain aur daily fuel consumption 18% increase ho gaya hai.`;
    } else {
      summaryText = `There are ${issues.length} operational issues requiring immediate administrator attention. The highest operational risk is at Bharati Station: Generator #02 bearing degradation combined with zero spare parts on site, which threatens heating loops and increases fuel consumption by 18%.`;
    }

    return {
      totalUrgentItems: issues.length,
      topRisks: issues,
      summaryText
    };
  }

  // Cross-department dependency chain for Bharati
  getBharatiRiskChain(language = 'en') {
    const isHi = language === 'hi';
    const isHinglish = language === 'hinglish';

    const nodes = [
      {
        department: isHi ? 'इन्फ्रास्ट्रक्चर / ऊर्जा' : isHinglish ? 'Infrastructure / Energy' : 'INFRASTRUCTURE / ENERGY',
        component: isHi ? 'सीएचपी जनरेटर #02' : 'Combined Heat & Power Gen #02',
        status: isHi ? 'कंपन एवं अत्यधिक तापमान (490°C)' : isHinglish ? 'Vibration aur Thermal Spike (490°C)' : 'Vibration & Thermal Spike (490°C)',
        level: 'CRITICAL',
        icon: 'cpu'
      },
      {
        department: isHi ? 'पावर एवं माइक्रोग्रिड' : isHinglish ? 'Power & Microgrid' : 'POWER & MICROGRID',
        component: isHi ? 'कुल विद्युत उत्पादन क्षमता' : 'Total Power Generation Capacity',
        status: isHi ? 'क्षमता 140 kW से घटकर 92 kW (-34%)' : isHinglish ? 'Power capacity 140 kW se girkar 92 kW (-34%) ho gayi' : 'Capacity reduced from 140 kW to 92 kW (-34%)',
        level: 'WARNING',
        icon: 'zap'
      },
      {
        department: isHi ? 'जीवन रक्षा एवं हीटिंग' : isHinglish ? 'Life Support & Heating' : 'LIFE SUPPORT & HEATING',
        component: isHi ? 'आवास हाइड्रोनिक हीटिंग लूप #04' : 'Habitat Hydronic Heating Loop #04',
        status: isHi ? 'अपशिष्ट ऊष्मा की हानि; सहायक डीजल बर्नर चालू' : isHinglish ? 'Waste-heat recapture loss; auxiliary diesel burners fired' : 'Waste-heat recapture lost; auxiliary diesel burners fired',
        level: 'ATTENTION',
        icon: 'thermometer'
      },
      {
        department: isHi ? 'ईंधन एवं भंडार' : isHinglish ? 'Inventory & Fuel' : 'INVENTORY & FUEL',
        component: isHi ? 'पोलर जेट-A1 ईंधन खपत दर' : 'Polar Jet-A1 Fuel Burn Rate',
        status: isHi ? 'दैनिक खपत +18% बढ़ी (68 दिनों का रिज़र्व शेष)' : isHinglish ? 'Daily consumption +18% badh gaya (68 days reserve bacha hai)' : 'Daily consumption increased by +18% (68 days reserve remaining)',
        level: 'WARNING',
        icon: 'fuel'
      },
      {
        department: isHi ? 'आपूर्ति एवं लॉजिस्टिक्स' : isHinglish ? 'Supply & Logistics' : 'SUPPLY & LOGISTICS',
        component: isHi ? 'रिप्लेसमेंट टर्बो बेयरिंग (INV-SP-042)' : 'Replacement Bearing Spares (INV-SP-042)',
        status: isHi ? 'स्टॉक = 0; फ्लाइट IA-884 48 घंटे विलंबित' : isHinglish ? 'Site inventory = 0; Flight IA-884 48h delayed' : 'Site inventory = 0; Flight IA-884 delayed 48h',
        level: 'CRITICAL',
        icon: 'package'
      },
      {
        department: isHi ? 'वैज्ञानिक अनुसंधान' : isHinglish ? 'Research & Science' : 'RESEARCH & SCIENCE',
        component: isHi ? 'डीप आइस कोर पेलियोक्लाइमेट लैब' : 'Deep Ice Core Paleoclimate Lab (RES-BH-01)',
        status: isHi ? 'माइक्रोग्रिड ऊर्जा बचत हेतु क्रायो-चिलर थ्रॉटल' : isHinglish ? 'Microgrid power save karne ke liye cryo-chillers throttled' : 'Cryo-vault chiller throttled to conserve microgrid power',
        level: 'DEGRADED',
        icon: 'flask-conical'
      }
    ];

    const conclusion = isHi ?
      'जनरेटर #02 में एकल हार्डवेयर विफलता 5 परिचालन विभागों में फैल रही है। सामान्य स्टेशन स्वास्थ्य बहाल करने का एकमात्र महत्वपूर्ण मार्ग स्पेयर पार्ट आपूर्ति श्रृंखला को हल करना है।' :
      isHinglish ?
      'Generator #02 ka hardware fault 5 departments mein cascade effect create kar raha hai. Spare parts ki supply resolve karna hi nominal health restore karne ka critical path hai.' :
      'A single hardware fault in Generator #02 is rippling across 5 operational departments. Resolving the spare part supply chain is the single critical path to restoring nominal station health.';

    return {
      station: isHi ? 'भरती स्टेशन (Bharati Station)' : 'Bharati Station',
      title: isHi ? 'डिजिटल ट्विन निर्भरता एवं कैस्केड प्रभाव विश्लेषण' : isHinglish ? 'Digital Twin Dependency & Cascade Impact Analysis' : 'Digital Twin Dependency & Cascade Impact Analysis',
      nodes,
      conclusion
    };
  }

  // Station Comparison: Maitri vs Bharati
  compareStations(language = 'en') {
    const maitri = this.dataService.getStation('maitri');
    const bharati = this.dataService.getStation('bharati');
    const isHi = language === 'hi';
    const isHinglish = language === 'hinglish';

    const comparison = [
      {
        metric: isHi ? 'समग्र स्वास्थ्य सूचकांक' : isHinglish ? 'Overall Health Index' : 'Overall Health Index',
        maitri: `${maitri.healthScore}% (${isHi ? 'सामान्य' : 'Nominal'})`,
        bharati: `${bharati.healthScore}% (${isHi ? 'ध्यान आवश्यक' : 'Attention'})`
      },
      {
        metric: isHi ? 'सक्रिय कर्मी' : isHinglish ? 'Active Crew On-Site' : 'Active Crew On-Site',
        maitri: `${maitri.crewOnSite} ${isHi ? 'वैज्ञानिक एवं कर्मचारी' : 'scientists & staff'}`,
        bharati: `${bharati.crewOnSite} ${isHi ? 'वैज्ञानिक एवं कर्मचारी' : 'scientists & staff'}`
      },
      {
        metric: isHi ? 'विद्युत भार' : isHinglish ? 'Current Power Load' : 'Current Power Load',
        maitri: `${maitri.currentPowerKw} kW / ${maitri.powerCapacityKw} kW`,
        bharati: `${bharati.currentPowerKw} kW / ${bharati.powerCapacityKw} kW`
      },
      {
        metric: isHi ? 'ईंधन भंडार' : isHinglish ? 'Fuel Reserves' : 'Fuel Reserves',
        maitri: `${maitri.fuelReserveLiters.toLocaleString()} L (${maitri.fuelDaysRemaining} ${isHi ? 'दिन' : 'days'})`,
        bharati: `${bharati.fuelReserveLiters.toLocaleString()} L (${bharati.fuelDaysRemaining} ${isHi ? 'दिन' : 'days'})`
      },
      {
        metric: isHi ? 'तापमान' : isHinglish ? 'Ambient Temperature' : 'Ambient Temperature',
        maitri: `${maitri.ambientTemp} °C (${isHi ? 'हवा' : 'Wind'}: ${maitri.windSpeedKnots} kts)`,
        bharati: `${bharati.ambientTemp} °C (${isHi ? 'हवा' : 'Wind'}: ${bharati.windSpeedKnots} kts)`
      },
      {
        metric: isHi ? 'सक्रिय अलर्ट' : isHinglish ? 'Active Urgent Alerts' : 'Active Urgent Alerts',
        maitri: isHi ? '1 (मौसम चेतावनी)' : isHinglish ? '1 (Weather Advisory)' : '1 (Weather Advisory)',
        bharati: isHi ? '3 (2 गंभीर उपकरण/आपूर्ति)' : isHinglish ? '3 (2 Critical Hardware/Supply)' : '3 (2 Critical Hardware/Supply)'
      }
    ];

    const recommendation = isHi ?
      'उपकरण की टूट-फूट और लॉजिस्टिक्स में देरी के कारण भरती स्टेशन पर तत्काल प्रशासनिक ध्यान आवश्यक है, जबकि मैतरी स्टेशन परिचालन रूप से स्थिर है।' :
      isHinglish ?
      'Bharati Station ko immediate administrative focus chahiye equipment wear aur supply delay ki wajah se, jabki Maitri Station fully stable hai.' :
      'Bharati Station requires immediate administrative focus due to equipment wear and logistics delays, while Maitri Station maintains stable operational reserves.';

    return {
      maitri,
      bharati,
      comparison,
      recommendation
    };
  }

  // Morning Executive Briefing
  generateMorningBriefing(user = 'Dr. Kashish Sharma', language = 'en') {
    const maitri = this.dataService.getStation('maitri');
    const bharati = this.dataService.getStation('bharati');
    const isHi = language === 'hi';
    const isHinglish = language === 'hinglish';

    if (isHi) {
      return {
        title: 'अंटार्कटिक अभियान दैनिक मिशन ब्रीफिंग',
        date: new Date().toLocaleDateString('hi-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        commander: user,
        classification: 'केवल आधिकारिक उपयोग हेतु // भारतीय अंटार्कटिक कार्यक्रम',
        sections: [
          {
            heading: 'कार्यकारी सारांश',
            text: `मैतरी (${maitri.crewOnSite}) और भरती (${bharati.crewOnSite}) के सभी 48 कर्मी सुरक्षित एवं उपस्थित हैं। कोई चिकित्सा हताहत नहीं। मैतरी का स्वास्थ्य सूचकांक ${maitri.healthScore}% (सामान्य) है, जबकि भरती का सूचकांक जनरेटर समस्याओं के कारण ${bharati.healthScore}% पर है।`
          },
          {
            heading: 'ऊर्जा एवं माइक्रोग्रिड स्थिति',
            text: `कुल संयुक्त विद्युत मांग ${(maitri.currentPowerKw + bharati.currentPowerKw).toFixed(1)} kW है। सहायक हीटिंग बर्नर चालू होने के कारण भरती की ईंधन खपत दर सामान्य से 18% अधिक चल रही है। ईंधन भंडार मैतरी में 112 दिन और भरती में 68 दिन के लिए पर्याप्त है।`
          },
          {
            heading: 'लॉजिस्टिक्स एवं आपूर्ति पाइपलाइन',
            text: `महत्वपूर्ण टर्बोचार्जर बेयरिंग ले जाने वाली एलसी-130 उड़ान IA-884 कम दृश्यता के कारण नोवो एयरबेस पर 48 घंटे के विलंब से रुकी हुई है। अनुसंधान पोत आर/वी भरती समय पर है (ईटीए 8 दिन)।`
          },
          {
            heading: 'वैज्ञानिक अनुसंधान',
            text: `4 में से 3 प्रमुख शोध कार्यक्रम पूरी तरह सक्रिय हैं। पेलियोक्लाइमेट आइस कोर का संरक्षण द्वितीयक थर्मल सुरक्षा उपायों के तहत संचालित हो रहा है।`
          },
          {
            heading: 'आज के लिए अनुशंसित कार्य योजना',
            bullets: [
              '1. भरती जनरेटर बेयरिंग किट के लिए उच्च प्राथमिकता वाली एयरलिफ्ट स्लॉट अधिकृत करें।',
              '2. 55-नॉट्स के संभावित तूफान के मद्देनजर मैतरी में बाहरी शोध कार्य स्थगित करें।',
              '3. 18:00 UTC पर दैनिक ईंधन संतुलन रिपोर्ट की समीक्षा करें।'
            ]
          }
        ]
      };
    }

    if (isHinglish) {
      return {
        title: 'Antarctic Daily Mission Briefing (Hinglish)',
        date: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        commander: user,
        classification: 'OFFICIAL USE ONLY // INDIAN ANTARCTIC PROGRAM',
        sections: [
          {
            heading: 'Executive Summary',
            text: `Maitri (${maitri.crewOnSite}) aur Bharati (${bharati.crewOnSite}) ke sabhi 48 personnel safe aur accounted for hain. Maitri health index nominal ${maitri.healthScore}% par hai, jabki Bharati ka index generator maintenance issues ki wajah se ${bharati.healthScore}% par hai.`
          },
          {
            heading: 'Energy & Fuel Status',
            text: `Total combined power demand ${(maitri.currentPowerKw + bharati.currentPowerKw).toFixed(1)} kW hai. Bharati mein auxiliary heating burner chalne ki wajah se daily fuel burn rate 18% zyada hai. Fuel reserve Maitri mein 112 days aur Bharati mein 68 days bacha hai.`
          },
          {
            heading: 'Logistics Pipeline',
            text: `LC-130 Flight IA-884 (Generator Turbo Spares) weather ki wajah se Novo Airbase par 48h delay par hai. R/V Bharati ship on-schedule hai (ETA 8 days).`
          },
          {
            heading: 'Recommended Action Items',
            bullets: [
              '1. Bharati generator spare kit ke liye emergency airlift slot authorize karein.',
              '2. Maitri mein 55-knot blizzard se pehle outdoor research lockdown karein.',
              '3. Daily fuel balance report ko review karein.'
            ]
          }
        ]
      };
    }

    return {
      title: 'Antarctic Operations Daily Mission Briefing',
      date: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      commander: user,
      classification: 'OFFICIAL USE ONLY // INDIAN ANTARCTIC PROGRAM',
      sections: [
        {
          heading: 'Executive Summary',
          text: `All 48 personnel accounted for across Maitri (${maitri.crewOnSite}) and Bharati (${bharati.crewOnSite}). No medical casualties. Maitri health index is nominal at ${maitri.healthScore}%. Bharati health index is depressed at ${bharati.healthScore}% due to microgrid generator maintenance constraints.`
        },
        {
          heading: 'Energy & Microgrid Status',
          text: `Total combined power demand is ${(maitri.currentPowerKw + bharati.currentPowerKw).toFixed(1)} kW. Bharati fuel burn rate is running 18% higher than nominal due to auxiliary heating burner activation. Fuel reserves are adequate for 112 days at Maitri and 68 days at Bharati.`
        },
        {
          heading: 'Logistics & Supply Pipeline',
          text: `LC-130 Flight IA-884 carrying critical turbocharger bearings is currently holding at Novo Airbase due to reduced visibility (48-hr delay). Maritime vessel R/V Bharati is on schedule, ETA 8 days to Larsemann Hills.`
        },
        {
          heading: 'Scientific Research',
          text: `3 of 4 major research programs fully active. Paleoclimate ice core preservation is operating under secondary thermal safeguards.`
        },
        {
          heading: 'Recommended Action Items for Today',
          bullets: [
            '1. Authorize high-priority airlift slot for Bharati generator bearing kit.',
            '2. Lock down outdoor field research at Maitri ahead of forecasted 55-knot storm.',
            '3. Review daily fuel balance report at 18:00 UTC.'
          ]
        }
      ]
    };
  }
}

export const dependencyEngine = new DependencyEngine();
