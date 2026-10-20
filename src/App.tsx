import { useState, useEffect, useCallback, useRef } from 'react';
import {
  STATIONS, WEIGHTS, SCALE_NAMES, LEVELS, BADGES, GLOSSARY, TEACHER_PASSWORD,
  type Station, type CaseOption
} from './data/gameData';

// ===== TYPES =====
interface PlayerProfile {
  name: string;
  position: string;
  startTime: string;
}

interface CaseResult {
  caseId: string;
  stationId: string;
  optionId: string;
  rating: 'best' | 'acceptable' | 'miss';
  technique?: string;
  ethicsBreach: boolean;
  timestamp: string;
}

interface MiniGameResult {
  stationId: string;
  score: number; // 0..1
  timestamp: string;
}

interface GameState {
  profile: PlayerProfile | null;
  currentStation: number;
  currentCase: number;
  currentTask: number;
  caseResults: CaseResult[];
  miniGameResults: MiniGameResult[];
  badges: string[];
  glossaryUnlocked: string[];
  scales: Record<string, number>;
  ethicsBreach: boolean;
  flags: Record<string, boolean>;
  endTime?: string;
  completed: boolean;
}

type Screen = 'welcome' | 'role' | 'profile' | 'game' | 'station-intro' | 'case' | 'reflection' | 'minigame' | 'final' | 'teacher' | 'teacher-detail' | 'glossary' | 'rules';

// ===== HELPERS =====
function getLevel(score: number): string {
  for (const l of LEVELS) {
    if (score >= l.min && score <= l.max) return l.label;
  }
  return 'Ориентир';
}

function calcCommIndex(scales: Record<string, number>): number {
  const vals = Object.values(scales);
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function saveGame(state: GameState) {
  if (!state.profile) return;
  const key = `medcomm_dpo_progress_${state.profile.name}`;
  localStorage.setItem(key, JSON.stringify(state));
}

function loadGame(name: string): GameState | null {
  const key = `medcomm_dpo_progress_${name}`;
  const data = localStorage.getItem(key);
  if (data) return JSON.parse(data);
  return null;
}

function getAllSavedGames(): GameState[] {
  const games: GameState[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('medcomm_dpo_progress_')) {
      const data = localStorage.getItem(key);
      if (data) games.push(JSON.parse(data));
    }
  }
  return games;
}

function deleteGame(name: string) {
  const key = `medcomm_dpo_progress_${name}`;
  localStorage.removeItem(key);
}

function clearAllGames() {
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('medcomm_dpo_progress_')) keys.push(key);
  }
  keys.forEach(k => localStorage.removeItem(k));
}

function createInitialState(profile: PlayerProfile): GameState {
  return {
    profile,
    currentStation: 0,
    currentCase: 0,
    currentTask: 0,
    caseResults: [],
    miniGameResults: [],
    badges: [],
    glossaryUnlocked: ['barrier', 'rapport'],
    scales: { sh1: 50, sh2: 50, sh3: 50, sh4: 50, sh5: 50, sh6: 50 },
    ethicsBreach: false,
    flags: {},
    completed: false
  };
}

// ===== SVG COMPONENTS =====
function SVGMap() {
  return (
    <svg viewBox="0 0 400 200" className="svg-container">
      <defs>
        <linearGradient id="pathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2ec4b6" />
          <stop offset="100%" stopColor="#e9c46a" />
        </linearGradient>
      </defs>
      <path d="M 40 100 Q 100 40 160 100 Q 220 160 280 100 Q 340 40 380 100" fill="none" stroke="url(#pathGrad)" strokeWidth="3" strokeDasharray="8,4" />
      {[40, 120, 200, 280, 360].map((x, i) => (
        <g key={i}>
          <circle cx={x} cy={100} r="18" fill="rgba(46,196,182,0.2)" stroke="#2ec4b6" strokeWidth="2" />
          <text x={x} y={105} textAnchor="middle" fill="#eef6f4" fontSize="14" fontWeight="bold">{i + 1}</text>
          <text x={x} y={140} textAnchor="middle" fill="#eef6f4" fontSize="9" opacity="0.7">
            {['Коммуникация', 'Профайлинг', '5 минут', 'Голос', 'Превенция'][i]}
          </text>
        </g>
      ))}
    </svg>
  );
}

function SVGStation1() {
  return (
    <svg viewBox="0 0 300 200" className="svg-container">
      <rect x="20" y="30" width="260" height="140" rx="10" fill="rgba(46,196,182,0.08)" stroke="#2ec4b6" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="25" fill="rgba(231,111,81,0.2)" stroke="#e76f51" strokeWidth="1.5" />
      <text x="100" y="105" textAnchor="middle" fill="#e76f51" fontSize="12">✕</text>
      <path d="M 140 100 L 180 100" stroke="#e9c46a" strokeWidth="2" strokeDasharray="4,3" />
      <circle cx="210" cy="100" r="25" fill="rgba(46,196,182,0.2)" stroke="#2ec4b6" strokeWidth="1.5" />
      <text x="210" y="105" textAnchor="middle" fill="#2ec4b6" fontSize="12">✓</text>
      <text x="100" y="145" textAnchor="middle" fill="#eef6f4" fontSize="10" opacity="0.7">Барьер</text>
      <text x="210" y="145" textAnchor="middle" fill="#eef6f4" fontSize="10" opacity="0.7">Мост</text>
      <text x="150" y="25" textAnchor="middle" fill="#e9c46a" fontSize="12" fontFamily="Georgia">Модели коммуникации</text>
    </svg>
  );
}

function SVGStation2() {
  return (
    <svg viewBox="0 0 300 200" className="svg-container">
      <ellipse cx="150" cy="90" rx="40" ry="50" fill="rgba(58,134,255,0.1)" stroke="#3a86ff" strokeWidth="1.5" />
      <ellipse cx="150" cy="90" rx="55" ry="65" fill="none" stroke="rgba(58,134,255,0.3)" strokeWidth="1" strokeDasharray="4,3" />
      <ellipse cx="150" cy="90" rx="70" ry="80" fill="none" stroke="rgba(58,134,255,0.15)" strokeWidth="1" strokeDasharray="4,3" />
      <circle cx="150" cy="70" r="15" fill="rgba(58,134,255,0.2)" stroke="#3a86ff" strokeWidth="1" />
      <text x="150" y="75" textAnchor="middle" fill="#3a86ff" fontSize="8">Тип</text>
      <text x="150" y="110" textAnchor="middle" fill="#3a86ff" fontSize="8">Мотив</text>
      <text x="150" y="140" textAnchor="middle" fill="#3a86ff" fontSize="8">Стиль</text>
      <text x="150" y="185" textAnchor="middle" fill="#e9c46a" fontSize="11" fontFamily="Georgia">Слои профиля</text>
    </svg>
  );
}

function SVGStation3() {
  return (
    <svg viewBox="0 0 300 200" className="svg-container">
      <rect x="80" y="60" width="60" height="80" rx="5" fill="rgba(244,162,97,0.1)" stroke="#f4a261" strokeWidth="1.5" />
      <rect x="160" y="60" width="60" height="80" rx="5" fill="rgba(244,162,97,0.1)" stroke="#f4a261" strokeWidth="1.5" />
      <circle cx="110" cy="80" r="10" fill="rgba(244,162,97,0.3)" />
      <circle cx="190" cy="80" r="10" fill="rgba(244,162,97,0.3)" />
      <rect x="120" y="90" width="60" height="30" rx="3" fill="rgba(233,196,106,0.1)" stroke="#e9c46a" strokeWidth="1" />
      <text x="150" y="110" textAnchor="middle" fill="#e9c46a" fontSize="9">Стол</text>
      <path d="M 100 50 Q 150 30 200 50" fill="none" stroke="#2ec4b6" strokeWidth="1.5" strokeDasharray="3,3" />
      <text x="150" y="25" textAnchor="middle" fill="#2ec4b6" fontSize="10">Раппорт</text>
      <text x="150" y="185" textAnchor="middle" fill="#e9c46a" fontSize="11" fontFamily="Georgia">Кабинет приёма</text>
    </svg>
  );
}

function SVGStation4() {
  return (
    <svg viewBox="0 0 300 200" className="svg-container">
      <circle cx="100" cy="100" r="30" fill="rgba(46,196,182,0.1)" stroke="#2ec4b6" strokeWidth="1.5" />
      <circle cx="100" cy="85" r="12" fill="rgba(46,196,182,0.2)" />
      <path d="M 140 80 Q 160 70 180 80 Q 200 90 220 80 Q 240 70 260 80" fill="none" stroke="#f4a261" strokeWidth="2">
        <animate attributeName="d" dur="2s" repeatCount="indefinite" values="M 140 80 Q 160 70 180 80 Q 200 90 220 80 Q 240 70 260 80;M 140 80 Q 160 90 180 80 Q 200 70 220 80 Q 240 90 260 80;M 140 80 Q 160 70 180 80 Q 200 90 220 80 Q 240 70 260 80" />
      </path>
      <path d="M 140 100 Q 160 90 180 100 Q 200 110 220 100 Q 240 90 260 100" fill="none" stroke="#e9c46a" strokeWidth="1.5" opacity="0.6">
        <animate attributeName="d" dur="3s" repeatCount="indefinite" values="M 140 100 Q 160 90 180 100 Q 200 110 220 100 Q 240 90 260 100;M 140 100 Q 160 110 180 100 Q 200 90 220 100 Q 240 110 260 100;M 140 100 Q 160 90 180 100 Q 200 110 220 100 Q 240 90 260 100" />
      </path>
      <text x="200" y="140" textAnchor="middle" fill="#eef6f4" fontSize="10" opacity="0.7">Тон • Темп • Пауза</text>
      <text x="150" y="185" textAnchor="middle" fill="#e9c46a" fontSize="11" fontFamily="Georgia">Голос как инструмент</text>
    </svg>
  );
}

function SVGStation5() {
  return (
    <svg viewBox="0 0 300 200" className="svg-container">
      <path d="M 30 120 L 120 120" stroke="#e76f51" strokeWidth="2" />
      <path d="M 180 120 L 270 120" stroke="#e76f51" strokeWidth="2" />
      <path d="M 120 120 Q 150 80 180 120" fill="none" stroke="#2ec4b6" strokeWidth="3" />
      <line x1="130" y1="120" x2="130" y2="140" stroke="#e76f51" strokeWidth="1" strokeDasharray="3,2" />
      <line x1="170" y1="120" x2="170" y2="140" stroke="#e76f51" strokeWidth="1" strokeDasharray="3,2" />
      <text x="150" y="155" textAnchor="middle" fill="#e76f51" fontSize="9" opacity="0.7">Конфликт</text>
      <text x="150" y="75" textAnchor="middle" fill="#2ec4b6" fontSize="10">Мост превенции</text>
      <text x="150" y="185" textAnchor="middle" fill="#e9c46a" fontSize="11" fontFamily="Georgia">Предупреди, не туши</text>
    </svg>
  );
}

function SVGRadar({ scales }: { scales: Record<string, number> }) {
  const keys = ['sh1', 'sh2', 'sh3', 'sh4', 'sh5', 'sh6'];
  const labels = ['К1', 'К2', 'К3', 'К4', 'К5', 'Ш6'];
  const cx = 150, cy = 130, r = 80;
  
  const getPoint = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / 6 - Math.PI / 2;
    const dist = (value / 100) * r;
    return { x: cx + dist * Math.cos(angle), y: cy + dist * Math.sin(angle) };
  };

  const points = keys.map((k, i) => getPoint(i, scales[k] || 0));
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <svg viewBox="0 0 300 260" style={{ width: '100%', maxWidth: 300, margin: '0 auto' }}>
      {[0.25, 0.5, 0.75, 1].map(f => (
        <polygon key={f} points={keys.map((_, i) => {
          const p = getPoint(i, f * 100);
          return `${p.x},${p.y}`;
        }).join(' ')} fill="none" stroke="rgba(238,246,244,0.1)" strokeWidth="1" />
      ))}
      {keys.map((_, i) => {
        const p = getPoint(i, 100);
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(238,246,244,0.1)" strokeWidth="1" />;
      })}
      <path d={pathD} fill="rgba(46,196,182,0.2)" stroke="#2ec4b6" strokeWidth="2" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4" fill="#2ec4b6" />
          <text x={getPoint(i, 120).x} y={getPoint(i, 120).y} textAnchor="middle" fill="#eef6f4" fontSize="10" dominantBaseline="middle">{labels[i]}</text>
        </g>
      ))}
    </svg>
  );
}

// ===== MAIN APP =====
export default function App() {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [teacherAuth, setTeacherAuth] = useState(false);
  const [teacherPassword, setTeacherPassword] = useState('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showReflection, setShowReflection] = useState(false);
  const [currentReflection, setCurrentReflection] = useState<CaseOption | null>(null);
  const [miniGameActive, setMiniGameActive] = useState(false);
  const [miniGameScore, setMiniGameScore] = useState(0);
  const [miniGameCompleted, setMiniGameCompleted] = useState(false);
  const [teacherDetail, setTeacherDetail] = useState<GameState | null>(null);
  const [savedGames, setSavedGames] = useState<GameState[]>([]);
  const [profileName, setProfileName] = useState('');
  const [profilePosition, setProfilePosition] = useState('');
  const [dragItems, setDragItems] = useState<any[]>([]);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [matchSelections, setMatchSelections] = useState<Record<number, string>>({});
  const [sliderValues, setSliderValues] = useState<Record<string, number>>({});
  const [hudExpanded, setHudExpanded] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-save
  useEffect(() => {
    if (gameState) saveGame(gameState);
  }, [gameState]);

  // Load saved games list
  useEffect(() => {
    setSavedGames(getAllSavedGames());
  }, [screen, gameState]);

  const showNotification = useCallback((msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  }, []);

  // ===== SCORING =====
  const updateScales = useCallback((effects: Record<string, number>) => {
    setGameState(prev => {
      if (!prev) return prev;
      const newScales = { ...prev.scales };
      for (const [key, val] of Object.entries(effects)) {
        newScales[key] = Math.max(0, Math.min(100, (newScales[key] || 50) + val));
      }
      return { ...prev, scales: newScales };
    });
  }, []);

  const recalcScales = useCallback((state: GameState): GameState => {
    const stationScores: Record<string, { total: number; max: number }> = {};
    const stationMiniGames: Record<string, number> = {};

    state.caseResults.forEach(r => {
      if (!stationScores[r.stationId]) stationScores[r.stationId] = { total: 0, max: 0 };
      const maxScore = r.rating === 'best' ? 1 : r.rating === 'acceptable' ? 0.6 : 0;
      stationScores[r.stationId].total += maxScore;
      stationScores[r.stationId].max += 1;
    });

    state.miniGameResults.forEach(r => {
      stationMiniGames[r.stationId] = r.score;
    });

    const newScales: Record<string, number> = {};
    const stationMap: Record<string, string> = {
      station_1: 'sh1', station_2: 'sh2', station_3: 'sh3',
      station_4: 'sh4', station_5: 'sh5'
    };

    for (const [stId, scaleKey] of Object.entries(stationMap)) {
      const modScore = stationScores[stId] ? stationScores[stId].total / Math.max(1, stationScores[stId].max) : 0;
      const mgScore = stationMiniGames[stId] || 0;
      newScales[scaleKey] = Math.round(70 * modScore * 100 + 30 * mgScore * 100) / 100;
      newScales[scaleKey] = Math.max(0, Math.min(100, newScales[scaleKey]));
    }

    // Ш6 - integration
    const totalCases = state.caseResults.length;
    const techniqueApplied = state.caseResults.filter(r => r.technique).length;
    const ethicsClean = state.ethicsBreach ? 0 : 1;
    const positiveFlags = Object.values(state.flags).filter(v => v).length;
    
    newScales.sh6 = Math.round(
      50 * (totalCases > 0 ? techniqueApplied / totalCases : 0) * 100 +
      30 * Math.min(1, positiveFlags / 5) * 100 +
      20 * ethicsClean * 100
    ) / 100;
    newScales.sh6 = Math.max(0, Math.min(100, newScales.sh6));

    return { ...state, scales: newScales };
  }, []);

  const checkBadges = useCallback((state: GameState): string[] => {
    const badges: string[] = [...state.badges];
    
    if (state.caseResults.some(r => r.stationId === 'station_3' && r.rating === 'best')) {
      if (!badges.includes('first_rapport')) badges.push('first_rapport');
    }
    if (state.caseResults.some(r => r.stationId === 'station_2' && r.rating === 'best')) {
      if (!badges.includes('clean_profile')) badges.push('clean_profile');
    }
    if (state.miniGameResults.some(r => r.stationId === 'station_4' && r.score >= 0.7)) {
      if (!badges.includes('voice_tool')) badges.push('voice_tool');
    }
    if (state.caseResults.some(r => r.stationId === 'station_5' && r.rating === 'best')) {
      if (!badges.includes('prevention_works')) badges.push('prevention_works');
    }
    if (state.caseResults.some(r => r.stationId === 'station_1' && r.rating === 'best' && r.technique?.includes('жаргон'))) {
      if (!badges.includes('no_jargon')) badges.push('no_jargon');
    }
    if (state.caseResults.some(r => r.technique?.includes('ауза'))) {
      if (!badges.includes('pause_power')) badges.push('pause_power');
    }
    if (state.caseResults.some(r => r.stationId === 'station_5' && r.technique?.includes('информиров'))) {
      if (!badges.includes('full_consent')) badges.push('full_consent');
    }
    if (state.caseResults.some(r => r.stationId === 'station_1' && r.technique?.includes('мост') || r.technique?.includes('барьер'))) {
      if (!badges.includes('bridge_barrier')) badges.push('bridge_barrier');
    }
    if (state.scales.sh6 >= 85) {
      if (!badges.includes('mentor_dialogue')) badges.push('mentor_dialogue');
    }

    return badges;
  }, []);

  const unlockGlossary = useCallback((state: GameState, technique?: string): string[] => {
    const unlocked = [...state.glossaryUnlocked];
    if (technique) {
      if (technique.includes('Teach') || technique.includes('переформулир')) {
        if (!unlocked.includes('teach_back')) unlocked.push('teach_back');
      }
      if (technique.includes('барьер') || technique.includes('Барьер')) {
        if (!unlocked.includes('barrier')) unlocked.push('barrier');
      }
      if (technique.includes('рофайл') || technique.includes('Профайл')) {
        if (!unlocked.includes('profiling')) unlocked.push('profiling');
      }
      if (technique.includes('раппорт') || technique.includes('Раппорт')) {
        if (!unlocked.includes('rapport')) unlocked.push('rapport');
      }
      if (technique.includes('араверб') || technique.includes('Пауза') || technique.includes('голос')) {
        if (!unlocked.includes('paraverbalics')) unlocked.push('paraverbalics');
      }
      if (technique.includes('превент') || technique.includes('Превент') || technique.includes('антицип')) {
        if (!unlocked.includes('prevention')) unlocked.push('prevention');
        if (!unlocked.includes('anticipation')) unlocked.push('anticipation');
      }
      if (technique.includes('этич') || technique.includes('Этич')) {
        if (!unlocked.includes('ethics')) unlocked.push('ethics');
      }
      if (technique.includes('повестк') || technique.includes('agenda')) {
        if (!unlocked.includes('agenda')) unlocked.push('agenda');
      }
      if (technique.includes('саморег') || technique.includes('Саморег')) {
        if (!unlocked.includes('emotional_regulation')) unlocked.push('emotional_regulation');
      }
    }
    return unlocked;
  }, []);

  // ===== NAVIGATION =====
  const startNewGame = () => {
    setScreen('profile');
  };

  const continueGame = () => {
    if (gameState && gameState.profile) {
      setScreen('game');
    }
  };

  const createProfile = () => {
    if (!profileName.trim()) return;
    const profile: PlayerProfile = {
      name: profileName.trim(),
      position: profilePosition.trim(),
      startTime: new Date().toISOString()
    };
    const existing = loadGame(profile.name);
    if (existing && !existing.completed) {
      setGameState(existing);
    } else {
      setGameState(createInitialState(profile));
    }
    setScreen('game');
  };

  const startStation = (stationIdx: number) => {
    if (!gameState) return;
    setGameState({ ...gameState, currentStation: stationIdx, currentCase: 0, currentTask: 0 });
    setScreen('station-intro');
  };

  const startCase = () => {
    setScreen('case');
    setSelectedOption(null);
    setShowReflection(false);
  };

  const selectOption = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const confirmChoice = () => {
    if (!gameState || !selectedOption) return;
    const station = STATIONS[gameState.currentStation];
    const caseData = station.cases[gameState.currentCase];
    const task = caseData.tasks[gameState.currentTask];
    const option = task.options.find(o => o.id === selectedOption);
    if (!option) return;

    const result: CaseResult = {
      caseId: caseData.id,
      stationId: station.id,
      optionId: option.id,
      rating: option.rating,
      technique: option.technique,
      ethicsBreach: option.ethicsBreach || false,
      timestamp: new Date().toISOString()
    };

    let newState = {
      ...gameState,
      caseResults: [...gameState.caseResults, result],
      ethicsBreach: gameState.ethicsBreach || (option.ethicsBreach || false)
    };

    if (option.ethicsBreach) {
      newState.flags = { ...newState.flags, ethics_violation: true };
    }

    // Track positive flags for cross-station effects
    if (option.rating === 'best') {
      newState.flags = { ...newState.flags, [`best_${station.id}`]: true };
    }

    newState = recalcScales(newState);
    newState.badges = checkBadges(newState);
    newState.glossaryUnlocked = unlockGlossary(newState, option.technique);

    setGameState(newState);
    updateScales(option.effects);
    setCurrentReflection(option);
    setShowReflection(true);
    setScreen('reflection');
  };

  const nextTask = () => {
    if (!gameState) return;
    const station = STATIONS[gameState.currentStation];
    const caseData = station.cases[gameState.currentCase];

    if (gameState.currentTask < caseData.tasks.length - 1) {
      setGameState({ ...gameState, currentTask: gameState.currentTask + 1 });
      setSelectedOption(null);
      setShowReflection(false);
      setScreen('case');
    } else if (gameState.currentCase < station.cases.length - 1) {
      setGameState({ ...gameState, currentCase: gameState.currentCase + 1, currentTask: 0 });
      setSelectedOption(null);
      setShowReflection(false);
      setScreen('case');
    } else {
      // Station cases done, go to mini-game
      setMiniGameActive(true);
      setMiniGameCompleted(false);
      setScreen('minigame');
      initMiniGame(station.miniGame);
    }
  };

  // ===== MINI-GAMES =====
  const initMiniGame = (mg: any) => {
    if (mg.type === 'drag-sort') {
      setDragItems(shuffleArray(mg.items));
    } else if (mg.type === 'match') {
      setMatchSelections({});
    } else if (mg.type === 'slider') {
      setSliderValues({});
    } else if (mg.type === 'classify' || mg.type === 'sequence') {
      setMatchSelections({});
    }
  };

  const completeMiniGame = (score: number) => {
    if (!gameState) return;
    const station = STATIONS[gameState.currentStation];
    const mgResult: MiniGameResult = {
      stationId: station.id,
      score: Math.max(0, Math.min(1, score)),
      timestamp: new Date().toISOString()
    };

    let newState = {
      ...gameState,
      miniGameResults: [...gameState.miniGameResults, mgResult]
    };
    newState = recalcScales(newState);
    newState.badges = checkBadges(newState);

    setGameState(newState);
    setMiniGameScore(score);
    setMiniGameCompleted(true);
    setMiniGameActive(false);
    setMiniGameScore(score);
    setMiniGameCompleted(true);
  };

  const goToNextStation = () => {
    if (!gameState) return;
    if (gameState.currentStation < STATIONS.length - 1) {
      const nextStation = gameState.currentStation + 1;
      setGameState({ ...gameState, currentStation: nextStation, currentCase: 0, currentTask: 0 });
      setScreen('station-intro');
    } else {
      finishGame();
    }
  };

  const finishGame = () => {
    if (!gameState) return;
    let finalState = recalcScales(gameState);
    finalState.badges = checkBadges(finalState);
    finalState.completed = true;
    finalState.endTime = new Date().toISOString();
    setGameState(finalState);
    saveGame(finalState);
    setScreen('final');
  };

  // ===== TEACHER =====
  const teacherLogin = () => {
    if (teacherPassword === TEACHER_PASSWORD) {
      setTeacherAuth(true);
      setSavedGames(getAllSavedGames());
      setScreen('teacher');
    } else {
      showNotification('Неверный пароль');
    }
  };

  const exportCSV = () => {
    const games = getAllSavedGames();
    let csv = 'Имя;Должность;Дата;Индекс;Ш1;Ш2;Ш3;Ш4;Ш5;Ш6;Зачёт\n';
    games.forEach(g => {
      const idx = calcCommIndex(g.scales);
      const level = getLevel(idx);
      const pass = !g.ethicsBreach && idx >= 40 ? 'Зачтено' : 'Доработка';
      csv += `${g.profile?.name || ''};${g.profile?.position || ''};${g.endTime || g.profile?.startTime || ''};${idx};${g.scales.sh1};${g.scales.sh2};${g.scales.sh3};${g.scales.sh4};${g.scales.sh5};${g.scales.sh6};${pass}\n`;
    });
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'medcomm_results.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportTxt = () => {
    const games = getAllSavedGames();
    let txt = 'ОТЧЁТ ПО ТОКУ ДПО — Медицинская коммуникация\n';
    txt += '=========================================\n\n';
    txt += `Дата формирования: ${new Date().toLocaleDateString('ru-RU')}\n`;
    txt += `Участников: ${games.length}\n\n`;

    games.forEach(g => {
      const idx = calcCommIndex(g.scales);
      txt += `--- ${g.profile?.name || 'Без имени'} ---\n`;
      txt += `Должность: ${g.profile?.position || 'не указана'}\n`;
      txt += `Начало: ${new Date(g.profile?.startTime || '').toLocaleString('ru-RU')}\n`;
      txt += `Завершение: ${g.endTime ? new Date(g.endTime).toLocaleString('ru-RU') : 'не завершено'}\n`;
      txt += `Коммуникативный индекс: ${idx}/100 (${getLevel(idx)})\n`;
      txt += `Шкалы: Ш1=${g.scales.sh1}, Ш2=${g.scales.sh2}, Ш3=${g.scales.sh3}, Ш4=${g.scales.sh4}, Ш5=${g.scales.sh5}, Ш6=${g.scales.sh6}\n`;
      txt += `Этика: ${g.ethicsBreach ? 'НАРУШЕНИЯ' : 'без нарушений'}\n`;
      txt += `Бейджи: ${g.badges.map(b => BADGES[b]?.name || b).join(', ')}\n`;
      txt += `Кейсов: ${g.caseResults.length}, Мини-игр: ${g.miniGameResults.length}\n\n`;
    });

    // Aggregate
    if (games.length > 0) {
      txt += '\n===== АГРЕГАТ ПО ПОТОКУ =====\n';
      const avgIdx = Math.round(games.reduce((s, g) => s + calcCommIndex(g.scales), 0) / games.length);
      txt += `Средний индекс: ${avgIdx}\n`;
      
      const scaleKeys = ['sh1', 'sh2', 'sh3', 'sh4', 'sh5', 'sh6'];
      const scaleAvgs = scaleKeys.map(k => ({
        key: k,
        avg: Math.round(games.reduce((s, g) => s + (g.scales[k] || 0), 0) / games.length)
      }));
      scaleAvgs.sort((a, b) => a.avg - b.avg);
      txt += `Слабые места (топ-3): ${scaleAvgs.slice(0, 3).map(s => `${SCALE_NAMES[s.key]} (${s.avg})`).join(', ')}\n`;
      txt += `Доля с нарушениями этики: ${games.filter(g => g.ethicsBreach).length}/${games.length}\n`;
    }

    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'medcomm_report.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  // ===== RENDER =====
  const renderHUD = () => {
    if (!gameState) return null;
    const scaleKeys = ['sh1', 'sh2', 'sh3', 'sh4', 'sh5', 'sh6'];
    return (
      <div className={`hud ${hudExpanded ? 'expanded' : 'collapsed'}`}>
        <div className="hud-toggle" onClick={() => setHudExpanded(!hudExpanded)}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>
            📊 {hudExpanded ? 'Свернуть шкалы' : `Индекс: ${calcCommIndex(gameState.scales)}/100`}
          </span>
          <span>{hudExpanded ? '▲' : '▼'}</span>
        </div>
        {hudExpanded && (
          <div style={{ marginTop: 12 }}>
            {scaleKeys.map(k => (
              <div key={k} style={{ marginBottom: 8 }}>
                <div className="scale-label">
                  <span>{SCALE_NAMES[k]}</span>
                  <span>{Math.round(gameState.scales[k])} — {getLevel(gameState.scales[k])}</span>
                </div>
                <div className="scale-bar">
                  <div className="scale-bar-fill" style={{
                    width: `${gameState.scales[k]}%`,
                    background: gameState.scales[k] >= 85 ? '#2ec4b6' : gameState.scales[k] >= 65 ? '#3a86ff' : gameState.scales[k] >= 40 ? '#f4a261' : '#e76f51'
                  }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderStationSVG = (idx: number) => {
    switch (idx) {
      case 0: return <SVGStation1 />;
      case 1: return <SVGStation2 />;
      case 2: return <SVGStation3 />;
      case 3: return <SVGStation4 />;
      case 4: return <SVGStation5 />;
      default: return null;
    }
  };

  // ===== MINI-GAME RENDERS =====
  const renderMiniGame = () => {
    if (!gameState) return null;
    const station = STATIONS[gameState.currentStation];
    const mg = station.miniGame;

    if (miniGameCompleted) {
      return (
        <div className="glass-card text-center">
          <h3 style={{ color: '#e9c46a', marginBottom: 16 }}>Мини-игра завершена!</h3>
          <p style={{ fontSize: 24, fontWeight: 700, color: '#2ec4b6' }}>{Math.round(miniGameScore * 100)}%</p>
          <p className="mt-16 opacity-70">{miniGameScore >= 0.7 ? 'Отличный результат!' : miniGameScore >= 0.4 ? 'Неплохо, но есть куда расти.' : 'Стоит повторить материал конспекта.'}</p>
          <button className="btn btn-primary btn-full mt-24" onClick={goToNextStation}>
            {gameState.currentStation < STATIONS.length - 1 ? 'Следующая станция →' : 'Завершить квест →'}
          </button>
        </div>
      );
    }

    if (mg.type === 'drag-sort') {
      return (
        <div className="minigame-area">
          <h3 style={{ color: '#e9c46a', marginBottom: 8 }}>{mg.title}</h3>
          <p className="text-sm opacity-70 mb-16">{mg.description}</p>
          <p className="text-sm mb-16">Расставьте шаги в правильном порядке (нажимайте для перемещения):</p>
          {dragItems.map((item, idx) => (
            <div
              key={item.id}
              className={`drag-item ${dragIdx === idx ? 'selected' : ''}`}
              onClick={() => {
                if (dragIdx === null) {
                  setDragIdx(idx);
                } else {
                  const newItems = [...dragItems];
                  const temp = newItems[dragIdx];
                  newItems[dragIdx] = newItems[idx];
                  newItems[idx] = temp;
                  setDragItems(newItems);
                  setDragIdx(null);
                }
              }}
              style={{ border: dragIdx === idx ? '2px solid #2ec4b6' : undefined }}
            >
              <span style={{ marginRight: 8, opacity: 0.5 }}>{idx + 1}.</span>
              {item.text}
            </div>
          ))}
          <button className="btn btn-primary btn-full mt-16" onClick={() => {
            let correct = 0;
            dragItems.forEach((item, idx) => {
              if (item.order === idx + 1) correct++;
            });
            completeMiniGame(correct / dragItems.length);
          }}>
            Проверить порядок
          </button>
        </div>
      );
    }

    if (mg.type === 'match' || mg.type === 'classify') {
      return (
        <div className="minigame-area">
          <h3 style={{ color: '#e9c46a', marginBottom: 8 }}>{mg.title}</h3>
          <p className="text-sm opacity-70 mb-16">{mg.description}</p>
          {mg.items.map((item: any, idx: number) => (
            <div key={idx} className="glass-card" style={{ marginBottom: 12 }}>
              <p style={{ marginBottom: 8, fontWeight: 600 }}>{item.barrier || item.desc}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {(item.type ? [item.type] : ['Аналитик', 'Эмоционал', 'Доминант', 'Избегающий']).map((opt: string) => (
                  <button
                    key={opt}
                    className={`btn ${matchSelections[idx] === opt ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: 13, padding: '8px 12px', minHeight: 36 }}
                    onClick={() => setMatchSelections({ ...matchSelections, [idx]: opt })}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <button className="btn btn-primary btn-full mt-16" onClick={() => {
            let correct = 0;
            mg.items.forEach((item: any, idx: number) => {
              const answer = item.type || item.profile;
              if (matchSelections[idx] === answer) correct++;
            });
            completeMiniGame(correct / mg.items.length);
          }}>
            Проверить ответы
          </button>
        </div>
      );
    }

    if (mg.type === 'slider') {
      return (
        <div className="minigame-area">
          <h3 style={{ color: '#e9c46a', marginBottom: 8 }}>{mg.title}</h3>
          <p className="text-sm opacity-70 mb-16">{mg.description}</p>
          {mg.items.map((item: any, idx: number) => (
            <div key={idx} className="glass-card" style={{ marginBottom: 12 }}>
              <p style={{ marginBottom: 8, fontWeight: 600 }}>Ситуация: {item.situation}</p>
              <p className="text-sm opacity-70">Выберите правильный параметр голоса:</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                {[item.tempo, item.tone, item.pause, item.volume].map((opt: string, i: number) => (
                  <span key={i} className="chip chip-blue">{opt}</span>
                ))}
              </div>
            </div>
          ))}
          <button className="btn btn-primary btn-full mt-16" onClick={() => completeMiniGame(0.75)}>
            Завершить (эталонные параметры изучены)
          </button>
        </div>
      );
    }

    if (mg.type === 'sequence') {
      return (
        <div className="minigame-area">
          <h3 style={{ color: '#e9c46a', marginBottom: 8 }}>{mg.title}</h3>
          <p className="text-sm opacity-70 mb-16">{mg.description}</p>
          {mg.items.map((item: any, idx: number) => (
            <div key={idx} className="glass-card" style={{ marginBottom: 12 }}>
              <p style={{ marginBottom: 8, fontWeight: 600 }}>⚡ {item.situation}</p>
              <p className="text-sm" style={{ color: '#2ec4b6' }}>Превенция: {item.prevention}</p>
              <p className="text-sm opacity-70 mt-16">Без превенции: <span style={{ color: '#e76f51' }}>{item.consequence_if_skip}</span></p>
            </div>
          ))}
          <button className="btn btn-primary btn-full mt-16" onClick={() => completeMiniGame(0.8)}>
            Усвоено — продолжить
          </button>
        </div>
      );
    }

    return null;
  };

  // ===== SCREENS =====
  const renderScreen = () => {
    switch (screen) {
      case 'welcome':
        return (
          <div className="screen active">
            <div style={{ textAlign: 'center', paddingTop: 40 }}>
              <SVGMap />
              <h1 className="title-hero">ГОВОРЯЩИЙ ВРАЧ</h1>
              <p className="subtitle-hero">Квест медицинской коммуникации • ДПО</p>
              <div className="glass-card" style={{ textAlign: 'left', marginTop: 24 }}>
                <p style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 16, opacity: 0.9 }}>
                  «Медицинская коммуникация — это не мягкий навык. Это основной инструмент врача, от которого зависят приверженность лечению, безопасность пациента и профессиональное долголетие врача.»
                </p>
              </div>
              <div style={{ marginTop: 32 }}>
                <button className="btn btn-primary btn-full" onClick={startNewGame}>🩺 Новая смена</button>
                {gameState && !gameState.completed && (
                  <button className="btn btn-secondary btn-full" onClick={continueGame}>▶ Продолжить</button>
                )}
                <button className="btn btn-secondary btn-full" onClick={() => setScreen('rules')}>📋 Правила квеста</button>
                <button className="btn btn-secondary btn-full" onClick={() => setScreen('glossary')}>📖 Глоссарий техник</button>
                <button className="btn btn-amber btn-full" onClick={() => setScreen('role')}>👨‍🏫 Режим преподавателя</button>
              </div>
            </div>
          </div>
        );

      case 'role':
        return (
          <div className="screen active">
            <h2 style={{ textAlign: 'center', marginBottom: 24, color: '#e9c46a' }}>Вход для преподавателя</h2>
            <div className="glass-card">
              <label className="text-sm opacity-70" style={{ display: 'block', marginBottom: 8 }}>Пароль:</label>
              <input
                type="password"
                className="input-field"
                value={teacherPassword}
                onChange={e => setTeacherPassword(e.target.value)}
                placeholder="Введите пароль"
              />
              <button className="btn btn-primary btn-full mt-24" onClick={teacherLogin}>Войти</button>
              <button className="btn btn-secondary btn-full" onClick={() => setScreen('welcome')}>← Назад</button>
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="screen active">
            <h2 style={{ textAlign: 'center', marginBottom: 24, color: '#e9c46a' }}>Профиль участника</h2>
            <div className="glass-card">
              <label className="text-sm opacity-70" style={{ display: 'block', marginBottom: 8 }}>Имя *</label>
              <input
                className="input-field"
                value={profileName}
                onChange={e => setProfileName(e.target.value)}
                placeholder="Ваше имя"
                style={{ marginBottom: 16 }}
              />
              <label className="text-sm opacity-70" style={{ display: 'block', marginBottom: 8 }}>Должность / направление (необязательно)</label>
              <input
                className="input-field"
                value={profilePosition}
                onChange={e => setProfilePosition(e.target.value)}
                placeholder="Например: врач-терапевт"
              />
              <p className="text-sm opacity-70 mt-16">* Должность используется только как подпись в отчёте и не влияет на сложность или содержание квеста.</p>
              <button className="btn btn-primary btn-full mt-24" onClick={createProfile} disabled={!profileName.trim()}>
                Начать смену →
              </button>
              <button className="btn btn-secondary btn-full" onClick={() => setScreen('welcome')}>← Назад</button>
            </div>
          </div>
        );

      case 'rules':
        return (
          <div className="screen active">
            <h2 style={{ color: '#e9c46a', marginBottom: 24 }}>Правила квеста</h2>
            <div className="glass-card">
              <h3 style={{ color: '#2ec4b6', marginBottom: 8 }}>📍 Структура</h3>
              <p>5 станций = 5 конспектов курса. На каждой — сюжетные кейсы с выборами и мини-игра.</p>
            </div>
            <div className="glass-card">
              <h3 style={{ color: '#2ec4b6', marginBottom: 8 }}>🎯 Оценивание</h3>
              <p>Каждый выбор оценивается: <span className="chip chip-mint">best</span> <span className="chip chip-amber">acceptable</span> <span className="chip chip-coral">miss</span>. Не «угадай букву» — важен обоснованный выбор.</p>
            </div>
            <div className="glass-card">
              <h3 style={{ color: '#2ec4b6', marginBottom: 8 }}>📊 Результат</h3>
              <p>6 шкал компетенций, Коммуникативный индекс, бейджи, персональные рекомендации. Авто-зачёт как рекомендация для преподавателя.</p>
            </div>
            <div className="glass-card">
              <h3 style={{ color: '#2ec4b6', marginBottom: 8 }}>💡 Рефлексия</h3>
              <p>После каждого выбора — разбор: что сработало, почему, какая техника из конспекта применена.</p>
            </div>
            <button className="btn btn-secondary btn-full mt-24" onClick={() => setScreen('welcome')}>← Назад</button>
          </div>
        );

      case 'glossary':
        return (
          <div className="screen active">
            <h2 style={{ color: '#e9c46a', marginBottom: 24 }}>Глоссарий техник</h2>
            {gameState ? (
              Object.entries(GLOSSARY).map(([key, item]) => {
                const unlocked = gameState.glossaryUnlocked.includes(key);
                return (
                  <div key={key} className="glossary-card" style={{ opacity: unlocked ? 1 : 0.4 }}>
                    <h4>{item.term} <span className="chip chip-gold">{item.konspekt}</span></h4>
                    <p className="text-sm">{unlocked ? item.definition : '🔒 Откроется по ходу квеста'}</p>
                  </div>
                );
              })
            ) : (
              Object.entries(GLOSSARY).map(([key, item]) => (
                <div key={key} className="glossary-card">
                  <h4>{item.term} <span className="chip chip-gold">{item.konspekt}</span></h4>
                  <p className="text-sm">{item.definition}</p>
                </div>
              ))
            )}
            <button className="btn btn-secondary btn-full mt-24" onClick={() => setScreen('welcome')}>← Назад</button>
          </div>
        );

      case 'game':
        if (!gameState) return null;
        return (
          <div className="screen active">
            {renderHUD()}
            <h2 style={{ color: '#e9c46a', marginBottom: 16, textAlign: 'center' }}>Карта квеста</h2>
            <div className="station-map">
              {STATIONS.map((station, idx) => {
                const completed = gameState.caseResults.some(r => r.stationId === station.id) &&
                  gameState.miniGameResults.some(r => r.stationId === station.id);
                const current = idx === gameState.currentStation && !completed;
                return (
                  <div
                    key={station.id}
                    className={`station-node ${completed ? 'completed' : ''} ${current ? 'current' : ''}`}
                    onClick={() => { if (current || completed) startStation(idx); }}
                    style={{ opacity: !completed && !current ? 0.5 : 1 }}
                  >
                    <div className="station-number">{idx + 1}</div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{station.title}</div>
                      <div className="text-sm opacity-70">{station.konspekt} — {station.scale}</div>
                      {completed && <span className="chip chip-mint" style={{ marginTop: 4 }}>✓ Завершено</span>}
                      {current && <span className="chip chip-amber" style={{ marginTop: 4 }}>▶ Текущая</span>}
                    </div>
                  </div>
                );
              })}
            </div>
            {gameState.badges.length > 0 && (
              <div className="glass-card">
                <h3 style={{ color: '#e9c46a', marginBottom: 8 }}>🏆 Бейджи</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {gameState.badges.map(b => (
                    <span key={b} className="badge">{BADGES[b]?.name || b}</span>
                  ))}
                </div>
              </div>
            )}
            <button className="btn btn-secondary btn-full" onClick={() => setScreen('welcome')}>← В главное меню</button>
          </div>
        );

      case 'station-intro':
        if (!gameState) return null;
        const station = STATIONS[gameState.currentStation];
        return (
          <div className="screen active">
            {renderHUD()}
            <div className="text-center">
              <span className="chip chip-gold" style={{ marginBottom: 8, display: 'inline-block' }}>Станция {gameState.currentStation + 1}</span>
              <h2 style={{ color: '#e9c46a', marginBottom: 8 }}>{station.title}</h2>
              <p className="text-sm opacity-70 mb-16">{station.konspekt} — {station.scale}</p>
            </div>
            {renderStationSVG(gameState.currentStation)}
            {station.intro.map((p, i) => (
              <div key={i} className="glass-card" style={{ animationDelay: `${i * 0.1}s` }}>
                <p>{p}</p>
              </div>
            ))}
            <button className="btn btn-primary btn-full mt-24" onClick={startCase}>
              Начать кейсы →
            </button>
          </div>
        );

      case 'case':
        if (!gameState) return null;
        const st = STATIONS[gameState.currentStation];
        const cs = st.cases[gameState.currentCase];
        const task = cs.tasks[gameState.currentTask];
        return (
          <div className="screen active">
            {renderHUD()}
            <div style={{ marginBottom: 8 }}>
              <span className="chip chip-blue">{st.konspekt}</span>
              <span className="text-sm opacity-70" style={{ marginLeft: 8 }}>
                Кейс {gameState.currentCase + 1}/{st.cases.length} • Задача {gameState.currentTask + 1}/{cs.tasks.length}
              </span>
            </div>
            <h3 style={{ color: '#2ec4b6', marginBottom: 8 }}>{cs.title}</h3>
            {cs.respondent && <p className="text-sm opacity-70 mb-16">Собеседник: {cs.respondent}</p>}
            {cs.intro.map((p, i) => (
              <p key={i} style={{ marginBottom: 12, lineHeight: 1.7 }}>{p}</p>
            ))}
            <div className="glass-card" style={{ marginTop: 16, borderColor: 'rgba(58,134,255,0.3)' }}>
              <p style={{ fontWeight: 600, marginBottom: 8 }}>{task.prompt}</p>
              {task.context && <p className="text-sm opacity-70" style={{ marginBottom: 16 }}>{task.context}</p>}
              {task.options.map(opt => (
                <button
                  key={opt.id}
                  className={`option-card ${selectedOption === opt.id ? 'selected' : ''}`}
                  onClick={() => selectOption(opt.id)}
                >
                  {opt.text}
                </button>
              ))}
            </div>
            <button
              className="btn btn-primary btn-full mt-16"
              onClick={confirmChoice}
              disabled={!selectedOption}
              style={{ opacity: selectedOption ? 1 : 0.5 }}
            >
              Подтвердить выбор
            </button>
          </div>
        );

      case 'reflection':
        if (!currentReflection) return null;
        return (
          <div className="screen active">
            {renderHUD()}
            <div className={`reflection ${currentReflection.rating === 'best' ? '' : currentReflection.rating === 'acceptable' ? 'acceptable-reflection' : 'miss-reflection'}`}>
              <h3 style={{ color: currentReflection.rating === 'best' ? '#2ec4b6' : currentReflection.rating === 'acceptable' ? '#f4a261' : '#e76f51', marginBottom: 12 }}>
                {currentReflection.rating === 'best' ? '✅ Отлично!' : currentReflection.rating === 'acceptable' ? '⚠️ Приемлемо' : '❌ Не сработало'}
              </h3>
              <p style={{ marginBottom: 12 }}>{currentReflection.why}</p>
              {currentReflection.technique && (
                <p className="text-sm" style={{ color: '#e9c46a' }}>
                  📌 Техника: {currentReflection.technique}
                </p>
              )}
              {currentReflection.ethicsBreach && (
                <p className="text-sm mt-16" style={{ color: '#e76f51', fontWeight: 600 }}>
                  ⚠️ Нарушение этических рам! Это влияет на сквозную шкалу и авто-зачёт.
                </p>
              )}
            </div>
            <div className="glass-card">
              <h4 style={{ color: '#e9c46a', marginBottom: 8 }}>Влияние на шкалы:</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {Object.entries(currentReflection.effects).map(([key, val]) => (
                  <span key={key} className={`chip ${val > 0 ? 'chip-mint' : 'chip-coral'}`}>
                    {SCALE_NAMES[key]}: {val > 0 ? '+' : ''}{val}
                  </span>
                ))}
              </div>
            </div>
            <button className="btn btn-primary btn-full mt-16" onClick={nextTask}>
              Далее →
            </button>
          </div>
        );

      case 'minigame':
        return (
          <div className="screen active">
            {renderHUD()}
            <div className="text-center mb-16">
              <span className="chip chip-amber">Мини-игра</span>
            </div>
            {renderMiniGame()}
          </div>
        );

      case 'final':
        if (!gameState) return null;
        const commIndex = calcCommIndex(gameState.scales);
        const level = getLevel(commIndex);
        const autoPass = !gameState.ethicsBreach && commIndex >= 40;
        const scaleKeys = ['sh1', 'sh2', 'sh3', 'sh4', 'sh5', 'sh6'];
        const sortedScales = scaleKeys.map(k => ({ key: k, val: gameState.scales[k] })).sort((a, b) => b.val - a.val);
        const topStrengths = sortedScales.slice(0, 3);
        const topGrowth = sortedScales.slice(-3).reverse();

        return (
          <div className="screen active">
            <div className="result-card">
              <div className="text-center mb-24">
                <h2 style={{ color: '#14343a', marginBottom: 4 }}>Карточка результатов ДПО</h2>
                <p style={{ opacity: 0.7 }}>{gameState.profile?.name} {gameState.profile?.position && `• ${gameState.profile.position}`}</p>
                <p className="text-sm opacity-70">{gameState.endTime ? new Date(gameState.endTime).toLocaleDateString('ru-RU') : ''}</p>
              </div>
              <div className="text-center mb-24">
                <p className="text-sm" style={{ color: '#14343a', opacity: 0.7 }}>Коммуникативный индекс</p>
                <div className="result-index">{commIndex}/100</div>
                <p style={{ color: commIndex >= 85 ? '#2ec4b6' : commIndex >= 65 ? '#3a86ff' : commIndex >= 40 ? '#f4a261' : '#e76f51', fontWeight: 700, fontSize: 18 }}>
                  {level}
                </p>
              </div>
              <SVGRadar scales={gameState.scales} />
              <div style={{ marginTop: 20 }}>
                {scaleKeys.map(k => (
                  <div key={k} style={{ marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#14343a' }}>
                      <span>{SCALE_NAMES[k]}</span>
                      <span>{Math.round(gameState.scales[k])} — {getLevel(gameState.scales[k])}</span>
                    </div>
                    <div style={{ height: 6, background: '#e0dcd5', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${gameState.scales[k]}%`,
                        background: gameState.scales[k] >= 85 ? '#2ec4b6' : gameState.scales[k] >= 65 ? '#3a86ff' : gameState.scales[k] >= 40 ? '#f4a261' : '#e76f51',
                        borderRadius: 3,
                        transition: 'width 0.6s'
                      }} />
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <h4 style={{ color: '#2ec4b6', fontSize: 14, marginBottom: 8 }}>💪 Сильные стороны</h4>
                  {topStrengths.map(s => (
                    <p key={s.key} className="text-sm" style={{ color: '#14343a' }}>• {SCALE_NAMES[s.key]}</p>
                  ))}
                </div>
                <div>
                  <h4 style={{ color: '#f4a261', fontSize: 14, marginBottom: 8 }}>📈 Зоны роста</h4>
                  {topGrowth.map(s => (
                    <p key={s.key} className="text-sm" style={{ color: '#14343a' }}>• {SCALE_NAMES[s.key]}</p>
                  ))}
                </div>
              </div>
              {gameState.badges.length > 0 && (
                <div style={{ marginTop: 20 }}>
                  <h4 style={{ color: '#e9c46a', fontSize: 14, marginBottom: 8 }}>🏆 Бейджи</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {gameState.badges.map(b => (
                      <span key={b} style={{ padding: '4px 10px', borderRadius: 12, fontSize: 12, background: 'rgba(233,196,106,0.2)', border: '1px solid #e9c46a', color: '#8a6d20' }}>
                        {BADGES[b]?.name || b}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div style={{ marginTop: 20, padding: 16, background: autoPass ? 'rgba(46,196,182,0.1)' : 'rgba(231,111,81,0.1)', borderRadius: 12, border: `1px solid ${autoPass ? '#2ec4b6' : '#e76f51'}` }}>
                <h4 style={{ color: autoPass ? '#1a8a7f' : '#c44530', fontSize: 14, marginBottom: 4 }}>
                  Авто-зачёт (рекомендация):
                </h4>
                <p style={{ color: '#14343a', fontSize: 14 }}>
                  {autoPass ? `Зачтено на уровне: ${level}` : 'Требуется доработка'}
                  {gameState.ethicsBreach && ' (есть нарушения этических рам)'}
                  {!gameState.ethicsBreach && commIndex < 40 && ' (индекс ниже 40)'}
                </p>
              </div>
              <div style={{ marginTop: 20 }}>
                <h4 style={{ color: '#14343a', fontSize: 14, marginBottom: 8 }}>📋 Рекомендации:</h4>
                {topGrowth.map(s => {
                  const stationIdx = scaleKeys.indexOf(s.key);
                  if (stationIdx >= 0 && stationIdx < STATIONS.length) {
                    return <p key={s.key} className="text-sm" style={{ color: '#14343a' }}>• Повторить: {STATIONS[stationIdx].konspekt} «{STATIONS[stationIdx].title}»</p>;
                  }
                  return null;
                })}
              </div>
            </div>
            <div style={{ marginTop: 24 }}>
              <button className="btn btn-primary btn-full" onClick={() => {
                const text = `Результат ДПО: ${gameState.profile?.name}\nИндекс: ${commIndex}/100 (${level})\nШкалы: ${scaleKeys.map(k => `${SCALE_NAMES[k]}=${Math.round(gameState.scales[k])}`).join(', ')}`;
                navigator.clipboard.writeText(text).then(() => showNotification('Скопировано в буфер!'));
              }}>
                📋 Копировать результат
              </button>
              <button className="btn btn-secondary btn-full" onClick={() => {
                setGameState(null);
                setProfileName('');
                setProfilePosition('');
                setScreen('welcome');
              }}>
                🔄 Пройти заново
              </button>
              <button className="btn btn-secondary btn-full" onClick={() => setScreen('glossary')}>
                📖 Глоссарий
              </button>
              <button className="btn btn-secondary btn-full" onClick={() => setScreen('welcome')}>
                ← В главное меню
              </button>
            </div>
          </div>
        );

      case 'teacher':
        if (!teacherAuth) return null;
        return (
          <div className="screen active">
            <h2 style={{ color: '#e9c46a', marginBottom: 16 }}>👨‍🏫 Панель преподавателя</h2>
            
            <div className="glass-card">
              <h3 style={{ color: '#2ec4b6', marginBottom: 12 }}>📊 Агрегат по потоку</h3>
              {savedGames.length > 0 ? (
                <>
                  <p>Участников: <strong>{savedGames.length}</strong></p>
                  <p>Средний индекс: <strong>{Math.round(savedGames.reduce((s, g) => s + calcCommIndex(g.scales), 0) / savedGames.length)}</strong></p>
                  {(() => {
                    const scaleKeys = ['sh1', 'sh2', 'sh3', 'sh4', 'sh5', 'sh6'];
                    const avgs = scaleKeys.map(k => ({
                      key: k,
                      avg: Math.round(savedGames.reduce((s, g) => s + (g.scales[k] || 0), 0) / savedGames.length)
                    })).sort((a, b) => a.avg - b.avg);
                    return (
                      <div style={{ marginTop: 8 }}>
                        <p className="text-sm" style={{ color: '#e76f51' }}>Слабые места потока:</p>
                        {avgs.slice(0, 3).map(s => (
                          <p key={s.key} className="text-sm">• {SCALE_NAMES[s.key]}: ср. {s.avg}</p>
                        ))}
                      </div>
                    );
                  })()}
                  <p style={{ marginTop: 8 }}>Нарушения этики: {savedGames.filter(g => g.ethicsBreach).length}/{savedGames.length}</p>
                </>
              ) : (
                <p className="opacity-70">Нет сохранённых результатов</p>
              )}
            </div>

            <div className="glass-card">
              <h3 style={{ color: '#2ec4b6', marginBottom: 12 }}>📋 Участники</h3>
              {savedGames.length === 0 ? (
                <p className="opacity-70">Нет участников</p>
              ) : (
                savedGames.map((g, idx) => (
                  <div key={idx} className="glass-card" style={{ cursor: 'pointer', marginBottom: 8 }} onClick={() => { setTeacherDetail(g); setScreen('teacher-detail'); }}>
                    <div className="flex-between">
                      <div>
                        <strong>{g.profile?.name}</strong>
                        {g.profile?.position && <span className="text-sm opacity-70"> — {g.profile.position}</span>}
                      </div>
                      <span style={{ fontWeight: 700, color: '#2ec4b6' }}>{calcCommIndex(g.scales)}</span>
                    </div>
                    <div className="text-sm opacity-70">
                      {g.endTime ? new Date(g.endTime).toLocaleDateString('ru-RU') : 'Не завершено'}
                      {g.completed && <span className="chip chip-mint" style={{ marginLeft: 8 }}>Завершено</span>}
                      {g.ethicsBreach && <span className="chip chip-coral" style={{ marginLeft: 8 }}>Этика</span>}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={exportCSV} style={{ flex: 1 }}>📊 Экспорт CSV</button>
              <button className="btn btn-secondary" onClick={exportTxt} style={{ flex: 1 }}>📄 Экспорт TXT</button>
            </div>
            <button className="btn btn-coral btn-full mt-16" onClick={() => {
              if (confirm('Удалить ВСЕ результаты участников?')) {
                clearAllGames();
                setSavedGames([]);
                showNotification('Все данные удалены');
              }
            }}>
              🗑 Очистить все данные
            </button>
            <button className="btn btn-secondary btn-full" onClick={() => { setTeacherAuth(false); setScreen('welcome'); }}>← Выйти</button>
          </div>
        );

      case 'teacher-detail':
        if (!teacherDetail) return null;
        const idx = calcCommIndex(teacherDetail.scales);
        return (
          <div className="screen active">
            <h2 style={{ color: '#e9c46a', marginBottom: 8 }}>{teacherDetail.profile?.name}</h2>
            <p className="text-sm opacity-70 mb-16">{teacherDetail.profile?.position || 'Должность не указана'}</p>
            
            <div className="glass-card">
              <div className="flex-between mb-16">
                <span>Коммуникативный индекс:</span>
                <span style={{ fontSize: 24, fontWeight: 700, color: '#2ec4b6' }}>{idx}/100</span>
              </div>
              <SVGRadar scales={teacherDetail.scales} />
              <div style={{ marginTop: 12 }}>
                {(['sh1', 'sh2', 'sh3', 'sh4', 'sh5', 'sh6'] as const).map(k => (
                  <div key={k} style={{ marginBottom: 6 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                      <span>{SCALE_NAMES[k]}</span>
                      <span>{Math.round(teacherDetail.scales[k])} — {getLevel(teacherDetail.scales[k])}</span>
                    </div>
                    <div className="scale-bar">
                      <div className="scale-bar-fill" style={{
                        width: `${teacherDetail.scales[k]}%`,
                        background: teacherDetail.scales[k] >= 85 ? '#2ec4b6' : teacherDetail.scales[k] >= 65 ? '#3a86ff' : teacherDetail.scales[k] >= 40 ? '#f4a261' : '#e76f51'
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card">
              <h3 style={{ color: '#2ec4b6', marginBottom: 8 }}>История кейсов</h3>
              {teacherDetail.caseResults.map((r, i) => (
                <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid rgba(238,246,244,0.1)' }}>
                  <div className="flex-between">
                    <span className="text-sm">{r.caseId}</span>
                    <span className={`chip ${r.rating === 'best' ? 'chip-mint' : r.rating === 'acceptable' ? 'chip-amber' : 'chip-coral'}`}>
                      {r.rating}
                    </span>
                  </div>
                  {r.technique && <p className="text-sm opacity-70">Техника: {r.technique}</p>}
                  {r.ethicsBreach && <p className="text-sm" style={{ color: '#e76f51' }}>⚠️ Нарушение этики</p>}
                </div>
              ))}
            </div>

            {teacherDetail.badges.length > 0 && (
              <div className="glass-card">
                <h3 style={{ color: '#e9c46a', marginBottom: 8 }}>Бейджи</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {teacherDetail.badges.map(b => (
                    <span key={b} className="badge">{BADGES[b]?.name || b}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="glass-card">
              <h3 style={{ color: '#2ec4b6', marginBottom: 8 }}>Авто-зачёт</h3>
              <p>{!teacherDetail.ethicsBreach && idx >= 40 ? `Зачтено: ${getLevel(idx)}` : 'Требуется доработка'}</p>
            </div>

            <button className="btn btn-secondary btn-full" onClick={() => setScreen('teacher')}>← К списку</button>
            <button className="btn btn-secondary btn-full" onClick={() => setScreen('welcome')}>В главное меню</button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      {notification && (
        <div style={{
          position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
          background: '#2ec4b6', color: '#14343a', padding: '12px 24px',
          borderRadius: 12, fontWeight: 600, zIndex: 1000, animation: 'popIn 0.3s ease'
        }}>
          {notification}
        </div>
      )}
      {renderScreen()}
    </div>
  );
}
