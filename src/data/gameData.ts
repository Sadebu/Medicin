// ===== GAME DATA (v2 — исправленная) =====
// Все варианты перемешаны, best НЕ всегда первый, длины сопоставимы.
// Англицизмы переведены; допустимые термины — с русской расшифровкой.

export interface CaseOption {
  id: string;
  text: string;
  rating: 'best' | 'acceptable' | 'miss';
  effects: Record<string, number>;
  technique?: string;
  ethicsBreach?: boolean;
  why: string;
}

export interface CaseTask {
  id: string;
  prompt: string;
  context: string;
  options: CaseOption[];
}

export interface StationCase {
  id: string;
  title: string;
  intro: string[];
  respondent?: string;
  tasks: CaseTask[];
  svgId: string;
}

export interface Station {
  id: string;
  konspekt: string;
  title: string;
  scale: string;
  scaleKey: string;
  intro: string[];
  cases: StationCase[];
  miniGame: MiniGameData;
}

export interface MiniGameData {
  id: string;
  title: string;
  description: string;
  type: 'drag-sort' | 'slider' | 'classify' | 'match' | 'sequence' | 'multiselect';
  items: any[];
}

export const WEIGHTS = [1, 1, 1, 1, 1, 1];

export const SCALE_NAMES: Record<string, string> = {
  sh1: 'Профессиональная коммуникация',
  sh2: 'Медицинский профайлинг',
  sh3: 'Первые 5 минут',
  sh4: 'Паравербальная коммуникация',
  sh5: 'Превентивная коммуникация',
  sh6: 'Интеграция и саморегуляция'
};

export const LEVELS = [
  { min: 0, max: 39, label: 'Ориентир' },
  { min: 40, max: 64, label: 'Практик' },
  { min: 65, max: 84, label: 'Уверенный специалист' },
  { min: 85, max: 100, label: 'Эксперт коммуникации' }
];

export const BADGES: Record<string, { name: string; desc: string }> = {
  first_rapport: { name: 'Первый раппорт', desc: 'Установлен контакт в первые минуты' },
  clean_profile: { name: 'Чистый профиль', desc: 'Верно определён тип собеседника' },
  voice_tool: { name: 'Голос — инструмент', desc: 'Осознанное управление голосом' },
  prevention_works: { name: 'Превенция сработала', desc: 'Конфликт предупреждён заранее' },
  no_jargon: { name: 'Без жаргона', desc: 'Информация доступна пациенту' },
  pause_power: { name: 'Пауза — сила', desc: 'Использование паузы в диалоге' },
  full_consent: { name: 'Согласие полное', desc: 'Информированное согласие получено' },
  bridge_barrier: { name: 'Мост через барьер', desc: 'Преодолён коммуникационный барьер' },
  mentor_dialogue: { name: 'Наставник в диалоге', desc: 'Высокий уровень интеграции навыков' }
};

export const GLOSSARY: Record<string, { term: string; definition: string; konspekt: string }> = {
  teach_back: { term: 'Teach-back (проверка понимания пересказом)', definition: 'Просьба к пациенту пересказать информацию своими словами для проверки понимания.', konspekt: 'К1' },
  barrier: { term: 'Коммуникационный барьер', definition: 'Препятствие в общении: фонетический, семантический, стилистический, логический, социокультурный, барьер отношений.', konspekt: 'К1' },
  profiling: { term: 'Медицинский профайлинг', definition: 'Распознавание типа собеседника для подстройки стиля коммуникации. Профиль — гипотеза, проверяемая в диалоге. 6 типов: Тревожный, Агрессивный, Всезнайка, Пассивно-покорный, Манипулятивный, Ригидный.', konspekt: 'К2' },
  rapport: { term: 'Раппорт', definition: 'Состояние взаимного доверия и контакта, устанавливаемое в первые минуты общения.', konspekt: 'К3' },
  agenda: { term: 'Повестка приёма', definition: 'Совместное определение целей и плана беседы с пациентом в начале приёма.', konspekt: 'К3' },
  paraverbalics: { term: 'Паравербалика', definition: 'Невербальные компоненты речи: тон, темп, ритм, громкость, интонация, паузы. Регистр: верхний (дистанция), средний (нейтральный), нижний (близость).', konspekt: 'К4' },
  anticipation: { term: 'Антиципация', definition: 'Упреждающее прогнозирование реакций и вопросов собеседника.', konspekt: 'К5' },
  prevention: { term: 'Превентивная коммуникация', definition: 'Заблаговременное проговаривание ожиданий, рисков и рамок для предотвращения конфликтов. Инструменты: превентивная рамка, признание неудобства, точки напряжения, план при неопределённости.', konspekt: 'К5' },
  ethics: { term: 'Этические рамки', definition: 'Принципы уважения автономии, конфиденциальности, благодеяния и справедливости в общении.', konspekt: 'К1' },
  small_talk: { term: 'Small talk (светская беседа)', definition: 'Краткий неформальный контакт для установления раппорта, ограниченный по времени и теме.', konspekt: 'К3' },
  emotional_regulation: { term: 'Саморегуляция', definition: 'Управление собственным эмоциональным состоянием в процессе диалога.', konspekt: 'К4' },
  calgary_cambridge: { term: 'Калгари—Кембриджская модель', definition: 'Каркас беседы: начало → сбор информации → обследование → объяснение и план → завершение.', konspekt: 'К5' },
  yes_no_yes: { term: 'Приём «Да—Нет—Да»', definition: 'Признать запрос → чётко обозначить предел → предложить допустимый шаг.', konspekt: 'К5' },
  i_message: { term: '«Я-сообщение»', definition: 'Формулировка от первого лица о своих чувствах и потребностях: «Мне важно, чтобы мы обсудили это спокойно».', konspekt: 'К5' },
  broken_record: { term: '«Заезженная пластинка»', definition: 'Спокойное повторение границы без новых оправданий.', konspekt: 'К5' },
  aidet: { term: 'AIDET (Acknowledge/Introduce/Duration/Explanation/Thank you)', definition: 'Признать/представиться/обозначить время/объяснить/поблагодарить — структура первого контакта.', konspekt: 'К3' }
};

// ===== SVG для каждого кейса =====
export const CASE_SVGS: Record<string, string> = {
  s1c1: `<svg viewBox="0 0 300 160" style="width:100%;max-width:300px;margin:0 auto 16px;display:block"><rect width="300" height="160" rx="12" fill="rgba(46,196,182,0.06)"/><circle cx="90" cy="70" r="22" fill="rgba(244,162,97,0.2)" stroke="#f4a261" stroke-width="1.5"/><text x="90" y="75" text-anchor="middle" fill="#f4a261" font-size="10">62</text><rect x="140" y="50" width="120" height="40" rx="6" fill="rgba(58,134,255,0.1)" stroke="#3a86ff" stroke-width="1"/><text x="200" y="68" text-anchor="middle" fill="#3a86ff" font-size="8" font-family="monospace">гипертензия</text><text x="200" y="80" text-anchor="middle" fill="#3a86ff" font-size="8" font-family="monospace">стеноз</text><path d="M115 70 L138 70" stroke="#e9c46a" stroke-width="1.5" stroke-dasharray="3,2"/><text x="150" y="115" text-anchor="middle" fill="#eef6f4" font-size="9" opacity="0.7">Языковой барьер</text><text x="150" y="145" text-anchor="middle" fill="#e9c46a" font-size="10" font-family="Georgia">Результаты обследования</text></svg>`,
  s1c2: `<svg viewBox="0 0 300 160" style="width:100%;max-width:300px;margin:0 auto 16px;display:block"><rect width="300" height="160" rx="12" fill="rgba(231,111,81,0.06)"/><circle cx="80" cy="70" r="20" fill="rgba(46,196,182,0.2)" stroke="#2ec4b6" stroke-width="1.5"/><text x="80" y="75" text-anchor="middle" fill="#2ec4b6" font-size="10">45</text><path d="M110 50 Q130 40 150 50 Q170 60 190 50 Q210 40 230 50" fill="none" stroke="#e76f51" stroke-width="2" opacity="0.6"/><path d="M110 70 Q130 60 150 70 Q170 80 190 70 Q210 60 230 70" fill="none" stroke="#e76f51" stroke-width="2" opacity="0.4"/><path d="M110 90 Q130 80 150 90 Q170 100 190 90 Q210 80 230 90" fill="none" stroke="#e76f51" stroke-width="2" opacity="0.3"/><text x="170" y="120" text-anchor="middle" fill="#e76f51" font-size="9">Шум</text><text x="150" y="145" text-anchor="middle" fill="#e9c46a" font-size="10" font-family="Georgia">Физический барьер</text></svg>`,
  s1c3: `<svg viewBox="0 0 300 160" style="width:100%;max-width:300px;margin:0 auto 16px;display:block"><rect width="300" height="160" rx="12" fill="rgba(58,134,255,0.06)"/><circle cx="100" cy="60" r="25" fill="rgba(233,196,106,0.15)" stroke="#e9c46a" stroke-width="1.5"/><text x="100" y="55" text-anchor="middle" fill="#e9c46a" font-size="8">Зав.</text><text x="100" y="68" text-anchor="middle" fill="#e9c46a" font-size="8">отдел.</text><circle cx="200" cy="80" r="18" fill="rgba(46,196,182,0.15)" stroke="#2ec4b6" stroke-width="1.5"/><text x="200" y="84" text-anchor="middle" fill="#2ec4b6" font-size="8">Вы</text><path d="M128 65 L180 78" stroke="#e76f51" stroke-width="1.5" stroke-dasharray="4,3"/><text x="150" y="50" text-anchor="middle" fill="#e76f51" font-size="8">Субординация</text><text x="150" y="130" text-anchor="middle" fill="#e9c46a" font-size="10" font-family="Georgia">Иерархический барьер</text></svg>`,
  s2c1: `<svg viewBox="0 0 300 160" style="width:100%;max-width:300px;margin:0 auto 16px;display:block"><rect width="300" height="160" rx="12" fill="rgba(58,134,255,0.06)"/><circle cx="100" cy="70" r="22" fill="rgba(58,134,255,0.15)" stroke="#3a86ff" stroke-width="1.5"/><text x="100" y="74" text-anchor="middle" fill="#3a86ff" font-size="9">40 лет</text><rect x="150" y="40" width="100" height="60" rx="4" fill="rgba(233,196,106,0.1)" stroke="#e9c46a" stroke-width="1"/><text x="200" y="58" text-anchor="middle" fill="#e9c46a" font-size="8">Данные</text><text x="200" y="72" text-anchor="middle" fill="#e9c46a" font-size="8">Логика</text><text x="200" y="86" text-anchor="middle" fill="#e9c46a" font-size="8">Структура</text><text x="150" y="130" text-anchor="middle" fill="#e9c46a" font-size="10" font-family="Georgia">Тип: Аналитик</text></svg>`,
  s2c2: `<svg viewBox="0 0 300 160" style="width:100%;max-width:300px;margin:0 auto 16px;display:block"><rect width="300" height="160" rx="12" fill="rgba(244,162,97,0.06)"/><circle cx="100" cy="70" r="22" fill="rgba(244,162,97,0.2)" stroke="#f4a261" stroke-width="1.5"/><text x="100" y="74" text-anchor="middle" fill="#f4a261" font-size="9">35 лет</text><path d="M80 45 Q85 35 90 45" fill="none" stroke="#f4a261" stroke-width="1.5"/><path d="M110 45 Q115 35 120 45" fill="none" stroke="#f4a261" stroke-width="1.5"/><path d="M130 70 L150 65 L170 70 L190 65 L210 70" fill="none" stroke="#e76f51" stroke-width="1.5" opacity="0.6"/><text x="170" y="60" text-anchor="middle" fill="#e76f51" font-size="8">Тревога</text><text x="150" y="130" text-anchor="middle" fill="#e9c46a" font-size="10" font-family="Georgia">Тип: Тревожный</text></svg>`,
  s2c3: `<svg viewBox="0 0 300 160" style="width:100%;max-width:300px;margin:0 auto 16px;display:block"><rect width="300" height="160" rx="12" fill="rgba(231,111,81,0.06)"/><circle cx="100" cy="70" r="25" fill="rgba(231,111,81,0.15)" stroke="#e76f51" stroke-width="1.5"/><text x="100" y="65" text-anchor="middle" fill="#e76f51" font-size="8">50 лет</text><text x="100" y="78" text-anchor="middle" fill="#e76f51" font-size="8">25 лет</text><path d="M75 50 L65 40" stroke="#e76f51" stroke-width="2"/><path d="M125 50 L135 40" stroke="#e76f51" stroke-width="2"/><path d="M130 70 L160 68 L190 70 L220 68 L250 70" fill="none" stroke="#e76f51" stroke-width="2"/><text x="190" y="60" text-anchor="middle" fill="#e76f51" font-size="8">Перебивает</text><text x="150" y="130" text-anchor="middle" fill="#e9c46a" font-size="10" font-family="Georgia">Тип: Агрессивный</text></svg>`,
  s3c1: `<svg viewBox="0 0 300 160" style="width:100%;max-width:300px;margin:0 auto 16px;display:block"><rect width="300" height="160" rx="12" fill="rgba(46,196,182,0.06)"/><circle cx="90" cy="70" r="20" fill="rgba(46,196,182,0.2)" stroke="#2ec4b6" stroke-width="1.5"/><text x="90" y="74" text-anchor="middle" fill="#2ec4b6" font-size="9">52</text><circle cx="210" cy="70" r="20" fill="rgba(233,196,106,0.2)" stroke="#e9c46a" stroke-width="1.5"/><text x="210" y="74" text-anchor="middle" fill="#e9c46a" font-size="9">Врач</text><path d="M115 70 L185 70" stroke="#2ec4b6" stroke-width="1.5" stroke-dasharray="4,3"/><path d="M150 55 Q155 45 160 55" fill="none" stroke="#e9c46a" stroke-width="1.5"/><text x="150" y="45" text-anchor="middle" fill="#e9c46a" font-size="8">Раппорт</text><text x="150" y="130" text-anchor="middle" fill="#e9c46a" font-size="10" font-family="Georgia">Первый приём</text></svg>`,
  s3c2: `<svg viewBox="0 0 300 160" style="width:100%;max-width:300px;margin:0 auto 16px;display:block"><rect width="300" height="160" rx="12" fill="rgba(231,111,81,0.06)"/><circle cx="100" cy="70" r="22" fill="rgba(231,111,81,0.15)" stroke="#e76f51" stroke-width="1.5"/><text x="100" y="74" text-anchor="middle" fill="#e76f51" font-size="9">45</text><path d="M85 55 L80 50" stroke="#e76f51" stroke-width="2"/><path d="M115 55 L120 50" stroke="#e76f51" stroke-width="2"/><path d="M90 82 Q100 78 110 82" fill="none" stroke="#e76f51" stroke-width="1.5"/><path d="M75 60 L70 55 L65 60" fill="none" stroke="#e76f51" stroke-width="1.5"/><path d="M125 60 L130 55 L135 60" fill="none" stroke="#e76f51" stroke-width="1.5"/><text x="100" y="110" text-anchor="middle" fill="#e76f51" font-size="8">Скрестил руки</text><text x="150" y="140" text-anchor="middle" fill="#e9c46a" font-size="10" font-family="Georgia">Настороженный пациент</text></svg>`,
  s4c1: `<svg viewBox="0 0 300 160" style="width:100%;max-width:300px;margin:0 auto 16px;display:block"><rect width="300" height="160" rx="12" fill="rgba(244,162,97,0.06)"/><circle cx="100" cy="70" r="20" fill="rgba(244,162,97,0.2)" stroke="#f4a261" stroke-width="1.5"/><text x="100" y="74" text-anchor="middle" fill="#f4a261" font-size="9">28</text><path d="M130 50 Q140 40 150 50 Q160 60 170 50 Q180 40 190 50 Q200 60 210 50 Q220 40 230 50" fill="none" stroke="#e76f51" stroke-width="2"/><path d="M130 70 Q140 60 150 70 Q160 80 170 70 Q180 60 190 70 Q200 80 210 70 Q220 60 230 70" fill="none" stroke="#e76f51" stroke-width="2" opacity="0.6"/><text x="180" y="40" text-anchor="middle" fill="#e76f51" font-size="8">Быстрый темп</text><text x="150" y="130" text-anchor="middle" fill="#e9c46a" font-size="10" font-family="Georgia">Паническая атака</text></svg>`,
  s4c2: `<svg viewBox="0 0 300 160" style="width:100%;max-width:300px;margin:0 auto 16px;display:block"><rect width="300" height="160" rx="12" fill="rgba(58,134,255,0.06)"/><circle cx="100" cy="70" r="20" fill="rgba(58,134,255,0.15)" stroke="#3a86ff" stroke-width="1.5"/><text x="100" y="74" text-anchor="middle" fill="#3a86ff" font-size="9">55</text><circle cx="200" cy="70" r="20" fill="rgba(233,196,106,0.15)" stroke="#e9c46a" stroke-width="1.5"/><text x="200" y="74" text-anchor="middle" fill="#e9c46a" font-size="9">Врач</text><path d="M125 70 L175 70" stroke="#e9c46a" stroke-width="2"/><circle cx="150" cy="70" r="4" fill="#e9c46a"/><text x="150" y="55" text-anchor="middle" fill="#e9c46a" font-size="8">Пауза</text><text x="150" y="130" text-anchor="middle" fill="#e9c46a" font-size="10" font-family="Georgia">Серьёзная информация</text></svg>`,
  s4c3: `<svg viewBox="0 0 300 160" style="width:100%;max-width:300px;margin:0 auto 16px;display:block"><rect width="300" height="160" rx="12" fill="rgba(46,196,182,0.06)"/><circle cx="100" cy="70" r="20" fill="rgba(46,196,182,0.15)" stroke="#2ec4b6" stroke-width="1.5"/><text x="100" y="74" text-anchor="middle" fill="#2ec4b6" font-size="9">48</text><path d="M130 60 Q150 55 170 60 Q190 65 210 60 Q230 55 250 60" fill="none" stroke="#f4a261" stroke-width="1.5"/><path d="M130 80 Q150 75 170 80 Q190 85 210 80" fill="none" stroke="#f4a261" stroke-width="1" opacity="0.5"/><text x="190" y="50" text-anchor="middle" fill="#f4a261" font-size="8">Тон выше обычного</text><text x="150" y="130" text-anchor="middle" fill="#e9c46a" font-size="10" font-family="Georgia">Скрытая тревога</text></svg>`,
  s5c1: `<svg viewBox="0 0 300 160" style="width:100%;max-width:300px;margin:0 auto 16px;display:block"><rect width="300" height="160" rx="12" fill="rgba(233,196,106,0.06)"/><circle cx="90" cy="70" r="20" fill="rgba(233,196,106,0.2)" stroke="#e9c46a" stroke-width="1.5"/><text x="90" y="74" text-anchor="middle" fill="#e9c46a" font-size="9">Пациент</text><rect x="150" y="50" width="80" height="40" rx="4" fill="rgba(231,111,81,0.1)" stroke="#e76f51" stroke-width="1"/><text x="190" y="68" text-anchor="middle" fill="#e76f51" font-size="8">Результат</text><text x="190" y="80" text-anchor="middle" fill="#e76f51" font-size="8">Задержка</text><path d="M115 70 L148 70" stroke="#e9c46a" stroke-width="1.5" stroke-dasharray="3,2"/><text x="150" y="130" text-anchor="middle" fill="#e9c46a" font-size="10" font-family="Georgia">Превентивный звонок</text></svg>`,
  s5c2: `<svg viewBox="0 0 300 160" style="width:100%;max-width:300px;margin:0 auto 16px;display:block"><rect width="300" height="160" rx="12" fill="rgba(46,196,182,0.06)"/><circle cx="100" cy="70" r="20" fill="rgba(46,196,182,0.2)" stroke="#2ec4b6" stroke-width="1.5"/><text x="100" y="74" text-anchor="middle" fill="#2ec4b6" font-size="9">38</text><path d="M85 55 Q90 48 95 55" fill="none" stroke="#2ec4b6" stroke-width="1.5"/><path d="M105 55 Q110 48 115 55" fill="none" stroke="#2ec4b6" stroke-width="1.5"/><path d="M90 80 Q100 85 110 80" fill="none" stroke="#2ec4b6" stroke-width="1.5"/><rect x="150" y="45" width="100" height="50" rx="6" fill="rgba(244,162,97,0.1)" stroke="#f4a261" stroke-width="1"/><text x="200" y="63" text-anchor="middle" fill="#f4a261" font-size="8">Побочные</text><text x="200" y="76" text-anchor="middle" fill="#f4a261" font-size="8">эффекты</text><text x="200" y="89" text-anchor="middle" fill="#f4a261" font-size="8">⚠</text><text x="150" y="130" text-anchor="middle" fill="#e9c46a" font-size="10" font-family="Georgia">Информирование о рисках</text></svg>`,
  s5c3: `<svg viewBox="0 0 300 160" style="width:100%;max-width:300px;margin:0 auto 16px;display:block"><rect width="300" height="160" rx="12" fill="rgba(231,111,81,0.06)"/><circle cx="100" cy="70" r="22" fill="rgba(231,111,81,0.15)" stroke="#e76f51" stroke-width="1.5"/><text x="100" y="74" text-anchor="middle" fill="#e76f51" font-size="9">50</text><path d="M80 50 L75 42" stroke="#e76f51" stroke-width="2"/><path d="M120 50 L125 42" stroke="#e76f51" stroke-width="2"/><rect x="150" y="45" width="110" height="50" rx="6" fill="rgba(233,196,106,0.1)" stroke="#e9c46a" stroke-width="1"/><text x="205" y="62" text-anchor="middle" fill="#e9c46a" font-size="8">«Полное</text><text x="205" y="75" text-anchor="middle" fill="#e9c46a" font-size="8">излечение</text><text x="205" y="88" text-anchor="middle" fill="#e9c46a" font-size="8">за 1 приём!»</text><text x="150" y="130" text-anchor="middle" fill="#e9c46a" font-size="10" font-family="Georgia">Завышенные ожидания</text></svg>`
};

// ===== СТАНЦИИ =====
export const STATIONS: Station[] = [
  {
    id: 'station_1',
    konspekt: 'К1',
    title: 'Профессиональная коммуникация',
    scale: 'Ш1: Профессиональная коммуникация и барьеры',
    scaleKey: 'sh1',
    intro: [
      'Вы входите в просторный кабинет консультаций. На стене — схема моделей коммуникации: линейная, интерактивная, транзактная.',
      'Профессиональная медицинская коммуникация — целенаправленный обмен информацией, подчинённый принципам этики, точности и эмпатии. Она отличается от бытового общения целеполаганием, ролевой структурой и ответственностью.',
      'Ваша задача — преодолеть барьеры (фонетический, семантический, стилистический, логический, социокультурный, барьер отношений) и выстроить мосты понимания.'
    ],
    cases: [
      {
        id: 's1c1',
        title: 'Пациент не понимает терминов',
        svgId: 's1c1',
        intro: [
          'Пациент Иван Петрович, 62 года, пришёл с результатами обследования. Вы объясняете, используя профессиональную лексику. Замечаете, что он кивает, но глаза растерянные.'
        ],
        respondent: 'Пациент, 62 года, среднее образование',
        tasks: [
          {
            id: 's1c1t1',
            prompt: 'Как вы продолжите объяснение?',
            context: 'Пациент кивает, но не понимает. Термины: «гипертензия», «стеноз», «коронарография».',
            options: [
              {
                id: 's1c1t1a',
                text: 'Продолжить в том же ключе, добавить письменную памятку с терминами.',
                rating: 'miss',
                effects: { sh1: -5 },
                why: 'Памятка не компенсирует непонимание устной речи. Семантический барьер не преодолевается.'
              },
              {
                id: 's1c1t1b',
                text: '«Иван Петрович, давайте проще. Давление выше нормы — сосуды «зажаты». Чтобы проверить, посмотрим сосуды сердца исследованием — тонкая трубочка через руку покажет сужение. Расскажите, как вы поняли?»',
                rating: 'best',
                effects: { sh1: 15, sh3: 5, sh6: 5 },
                technique: 'Переформулирование без жаргона + Teach-back (проверка понимания пересказом)',
                why: 'Преодолён семантический барьер (К1): простые слова, метафора, проверка понимания через Teach-back.'
              },
              {
                id: 's1c1t1c',
                text: '«Вам всё понятно? Если что — спрашивайте.»',
                rating: 'acceptable',
                effects: { sh1: 5, sh3: 2 },
                why: 'Формально даёт возможность спросить, но не использует активную проверку понимания. Пациент может постесняться переспросить.'
              }
            ]
          }
        ]
      },
      {
        id: 's1c2',
        title: 'Шум и очередь — физический барьер',
        svgId: 's1c2',
        intro: [
          'Коридор заполнен людьми. Шум аппаратов, разговоры, звонки. Пациентка пытается расслышать ваши слова о подготовке к исследованию. Она переспрашивает третий раз.'
        ],
        respondent: 'Пациентка, 45 лет, тревожная',
        tasks: [
          {
            id: 's1c2t1',
            prompt: 'Как преодолеть фонетический барьер?',
            context: 'Шумный коридор, пациентка не слышит инструкцию, тревога растёт.',
            options: [
              {
                id: 's1c2t1a',
                text: 'Говорить громче и повторить инструкцию ещё раз.',
                rating: 'acceptable',
                effects: { sh1: 3 },
                why: 'Попытка преодолеть барьер, но громкость не решает проблему понимания. Эмоциональная нагрузка растёт.'
              },
              {
                id: 's1c2t1b',
                text: '«Подождите, здесь слишком шумно. Давайте пройдём в кабинет — там объясню спокойно, и вы сможете записать.»',
                rating: 'best',
                effects: { sh1: 12, sh3: 5, sh5: 5, sh6: 5 },
                technique: 'Устранение фонетического барьера + превентивная запись',
                why: 'Фонетический барьер (шум) устранён сменой обстановки. Добавлена возможность записи — превентивная мера (К1, К5).'
              },
              {
                id: 's1c2t1c',
                text: '«Вы что, не слышите? Я уже три раза повторила!»',
                rating: 'miss',
                effects: { sh1: -10, sh3: -5, sh6: -5 },
                ethicsBreach: true,
                why: 'Нарушение этических рам: обвинение пациента. Иерархическое давление. Разрушение контакта.'
              }
            ]
          }
        ]
      },
      {
        id: 's1c3',
        title: 'Иерархический барьер',
        svgId: 's1c3',
        intro: [
          'Заведующий отделением даёт указания по ведению пациента. Вы заметили потенциальную проблему в назначениях, но боитесь возразить — авторитет, субординация.'
        ],
        respondent: 'Заведующий отделением, 58 лет',
        tasks: [
          {
            id: 's1c3t1',
            prompt: 'Как преодолеть иерархический барьер?',
            context: 'Вы видите проблему, но субординация давит. Молчание может навредить пациенту.',
            options: [
              {
                id: 's1c3t1a',
                text: 'Промолчать и выполнить указания как есть.',
                rating: 'miss',
                effects: { sh1: -8, sh6: -10 },
                ethicsBreach: true,
                why: 'Барьер не преодолён. Безопасность пациента под угрозой. Пассивность — не профессиональная коммуникация.'
              },
              {
                id: 's1c3t1b',
                text: 'Громко при всех заявить: «Это неправильное назначение!»',
                rating: 'miss',
                effects: { sh1: -5, sh3: -8 },
                why: 'Форма нарушает профессиональную этику. Публичная конфронтация разрушает рабочие отношения.'
              },
              {
                id: 's1c3t1c',
                text: '«Иван Сергеевич, хочу уточнить момент по назначениям. Заметил риск взаимодействия препаратов. Могу предложить альтернативу для обсуждения?»',
                rating: 'best',
                effects: { sh1: 15, sh6: 8 },
                technique: 'Преодоление иерархического барьера через уважительный запрос',
                why: 'Барьер преодолён профессионально: уважение к статусу + защита интересов пациента. Безопасность — приоритет (К1).'
              }
            ]
          }
        ]
      }
    ],
    miniGame: {
      id: 'mg1',
      title: 'Барьеры и мосты',
      description: 'Соотнесите ситуацию (слева) с приёмом-«мостом» (справа). Нажмите на карточку слева, затем на соответствующую справа.',
      type: 'match',
      items: [
        { id: 'b1', situation: '«...коронарография покажет фракцию выброса при стенозе...» — пациент не понимает.', barrier: 'Семантический', bridge: 'Простые слова и Teach-back (проверка пересказом)' },
        { id: 'b2', situation: 'Шумный коридор, пациент переспрашивает, не слышит инструкцию.', barrier: 'Фонетический', bridge: 'Замедлиться, проверить слышимость, сменить обстановку' },
        { id: 'b3', situation: 'Коллега обращается на «ты» при пациенте, пациент напряжён.', barrier: 'Стилистический', bridge: 'Уважительный нейтральный тон' },
        { id: 'b4', situation: 'Объяснение из 7 пунктов подряд, пациент потерял нить.', barrier: 'Логический', bridge: 'Разбить план на последовательные шаги' },
        { id: 'b5', situation: 'Пациент из другой культуры отводит взгляд, вы трактуете как «скрывает».', barrier: 'Социокультурный', bridge: 'Уточнять обстоятельства, не опираться на стереотипы' },
        { id: 'b6', situation: 'Вы устали к концу смены, раздражаетесь на вопросы пациента.', barrier: 'Отношений', bridge: 'Саморегуляция, короткая пауза, возвращение к запросу' }
      ]
    }
  },
  {
    id: 'station_2',
    konspekt: 'К2',
    title: 'Медицинский профайлинг',
    scale: 'Ш2: Медицинский профайлинг',
    scaleKey: 'sh2',
    intro: [
      'Перед вами — «комната профайлинга». На экране — силуэт собеседника с «слоями»: мотивы, стиль восприятия, эмоциональное состояние, тип личности.',
      'Медицинский профайлинг — распознавание типа собеседника для подстройки коммуникации. Профиль — гипотеза, проверяемая в диалоге. Не стереотип, не ярлык, а рабочая модель.',
      'Шесть типов по конспекту К2: Тревожный, Агрессивный, Всезнайка, Пассивно-покорный, Манипулятивный, Ригидный. У каждого — маркеры, потребность, стратегия и «чего избегать».'
    ],
    cases: [
      {
        id: 's2c1',
        title: 'Пациент в тревоге',
        svgId: 's2c2',
        intro: [
          'К вам подходит дочь пациентки. Говорит быстро, сбивчиво. «А вдруг это что-то страшное? А вдруг не поможет? А вы уверены?» Задаёт один и тот же вопрос дважды. Руки сжимают сумку.'
        ],
        respondent: 'Дочь пациентки, 35 лет',
        tasks: [
          {
            id: 's2c1t1',
            prompt: 'Какой тип профиля и какая стратегия?',
            context: 'Быстрая речь, повторные вопросы «а вдруг», напряжённость, потребность в безопасности.',
            options: [
              {
                id: 's2c1t1a',
                text: 'Тип: Агрессивный. Стратегия: выслушать, признать эмоцию, обозначить границы.',
                rating: 'miss',
                effects: { sh2: -5 },
                why: 'Неверная классификация. У собеседницы нет обвинений и перебивания — это не агрессия.'
              },
              {
                id: 's2c1t1b',
                text: 'Тип: Тревожный. Стратегия: «Давайте разберём по шагам, что происходит и что мы будем делать. Вот план... Проверим понимание.»',
                rating: 'best',
                effects: { sh2: 15, sh4: 5, sh3: 5, sh6: 5 },
                technique: 'Профайлинг Тревожного: спокойный пошаговый план + проверка понимания',
                why: 'Верный тип (К2). Стратегия из таблицы: потребность в безопасности → пошаговый план. НЕ обесценивать страх.'
              },
              {
                id: 's2c1t1c',
                text: 'Тип: Тревожный. Стратегия: «Не волнуйтесь, всё будет хорошо, не накручивайте себя.»',
                rating: 'miss',
                effects: { sh2: -3, sh3: -3 },
                why: 'Тип верный, но стратегия из колонки «чего избегать»: обесценивание страха («не волнуйтесь») — запрещённый приём для Тревожного.'
              }
            ]
          }
        ]
      },
      {
        id: 's2c2',
        title: 'Пациент с интернет-подготовкой',
        svgId: 's2c1',
        intro: [
          'Пациент, 45 лет, инженер. Достаёт распечатки исследований из интернета, цитирует термины. «Я читал, что по последним рекомендациям нужно совсем другое. Вы знакомы с этой статьёй?»'
        ],
        respondent: 'Пациент, 45 лет',
        tasks: [
          {
            id: 's2c2t1',
            prompt: 'Какой тип и стратегия?',
            context: 'Ссылки на интернет, термины, распечатки. Потребность: признание компетентности, партнёрство.',
            options: [
              {
                id: 's2c2t1a',
                text: 'Тип: Пассивно-покорный. Стратегия: открытые вопросы, малые порции информации.',
                rating: 'miss',
                effects: { sh2: -5 },
                why: 'Неверный тип. Пациент активен, инициирует, а не подчиняется молча.'
              },
              {
                id: 's2c2t1b',
                text: 'Тип: Всезнайка. Стратегия: «Интернет — не источник. Я врач, мне виднее. Будем делать по протоколу.»',
                rating: 'miss',
                effects: { sh2: -5, sh1: -5 },
                why: 'Тип верный, но стратегия нарушает правило: меряемся знаниями, обесцениваем подготовку пациента.'
              },
              {
                id: 's2c2t1c',
                text: 'Тип: Всезнайка. Стратегия: «Вы хорошо подготовились. Давайте обсудим данные и клиническую логику вместе.»',
                rating: 'best',
                effects: { sh2: 15, sh1: 5, sh6: 5 },
                technique: 'Профайлинг Всезнайки: уважить подготовку + обсудить данные',
                why: 'Верный тип и стратегия из таблицы (К2). Признание компетентности, партнёрство. НЕ мериться знаниями.'
              }
            ]
          }
        ]
      },
      {
        id: 's2c3',
        title: 'Коллега на консилиуме',
        svgId: 's2c3',
        intro: [
          'На консилиуме коллега перебивает, говорит громко, обвиняет: «Вы опять не учли анамнез! Сколько можно!» Жесты широкие, кулак сжат.'
        ],
        respondent: 'Коллега, 50 лет',
        tasks: [
          {
            id: 's2c3t1',
            prompt: 'Какой тип и стратегия?',
            context: 'Обвинения, перебивание, громкость, напряжённые жесты. Потребность: быть услышанным, вернуть контроль.',
            options: [
              {
                id: 's2c3t1a',
                text: 'Тип: Агрессивный. Стратегия: перебить в ответ: «Не повышайте на меня голос! Я тоже знаю, что делаю!»',
                rating: 'miss',
                effects: { sh1: -8, sh6: -5 },
                why: 'Тип верный, но стратегия из «чего избегать»: зеркалить гнев — запрещено. Эскалация неизбежна.'
              },
              {
                id: 's2c3t1b',
                text: 'Тип: Агрессивный. Стратегия: «Я слышу, что Вы недовольны. Давайте выслушаю вашу позицию, затем уточню запрос и обозначу, в каких рамках мы можем обсудить это.»',
                rating: 'best',
                effects: { sh2: 15, sh1: 8, sh6: 5 },
                technique: 'Профайлинг Агрессивного: выслушать + признать эмоцию + обозначить границы',
                why: 'Верный тип и стратегия из таблицы (К2). Выслушать, признать эмоцию, уточнить запрос, обозначить границы. НЕ говорить «успокойтесь».'
              },
              {
                id: 's2c3t1c',
                text: 'Тип: Манипулятивный. Стратегия: профессиональные границы, нейтральный тон.',
                rating: 'acceptable',
                effects: { sh2: 3, sh1: 2 },
                why: 'Частично верная стратегия, но тип неточный: открытая агрессия с обвинениями — это Агрессивный, не Манипулятивный.'
              }
            ]
          }
        ]
      }
    ],
    miniGame: {
      id: 'mg2',
      title: 'Определи профиль и подбери подход',
      description: 'Карточка собеседника с маркерами → выберите тип по таблице К2 → затем стратегию. Профиль — гипотеза, проверяемая в диалоге.',
      type: 'classify',
      items: [
        { id: 'p1', markers: '«А вдруг...», повторные вопросы, напряжённость', type: 'Тревожный', strategy: 'Спокойный пошаговый план, проверить понимание', avoid: '«Не волнуйтесь»' },
        { id: 'p2', markers: 'Обвинения, перебивание, громкость, кулак сжат', type: 'Агрессивный', strategy: 'Выслушать, признать эмоцию, обозначить границы', avoid: '«Успокойтесь»' },
        { id: 'p3', markers: 'Распечатки из интернета, термины, ссылки на статьи', type: 'Всезнайка', strategy: 'Уважить подготовку, обсудить данные и логику', avoid: 'Мериться знаниями' },
        { id: 'p4', markers: 'Односложные ответы, кивки, мало вопросов', type: 'Пассивно-покорный', strategy: 'Открытые вопросы, малые порции, Teach-back', avoid: 'Считать молчание согласием' },
        { id: 'p5', markers: 'Лесть, давление на жалость, скрытые угрозы', type: 'Манипулятивный', strategy: 'Границы, нейтральный тон, «Да—Нет—Да»', avoid: 'Торговаться' },
        { id: 'p6', markers: '«Всю жизнь так делал», повторяет прежние аргументы', type: 'Ригидный', strategy: 'Связать с опытом, небольшой шаг, время', avoid: 'Требовать мгновенной перестройки' }
      ]
    }
  },
  {
    id: 'station_3',
    konspekt: 'К3',
    title: 'Первые 5 минут общения',
    scale: 'Ш3: Первые 5 минут: контакт и раппорт',
    scaleKey: 'sh3',
    intro: [
      'Вы входите в кабинет приёма. Два удобных кресла, стол, мягкий свет. Здесь решается всё: доверие, контакт, готовность пациента делиться.',
      'Первые 5 минут — критическое окно. Именно здесь формируется раппорт — состояние взаимного доверия. «Правило первых минут»: пациент оценивает вас за 7–17 секунд.',
      'Структура входа (AIDET — признать/представиться/обозначить время/объяснить/поблагодарить): приветствие → представление → светская беседа (1–2 реплики) → повестка → переход к сути.'
    ],
    cases: [
      {
        id: 's3c1',
        title: 'Новый пациент — первый приём',
        svgId: 's3c1',
        intro: [
          'В кабинет заходит новая пациентка, Мария Сергеевна, 52 года. Первый раз у вас. Оглядывается, садится на край стула, руки на коленях.'
        ],
        respondent: 'Новая пациентка, 52 года',
        tasks: [
          {
            id: 's3c1t1',
            prompt: 'Как начать приём?',
            context: 'Первый контакт. Важно установить раппорт и обозначить цель.',
            options: [
              {
                id: 's3c1t1a',
                text: 'Не поднимая глаз от компьютера: «Так, Мария Сергеевна, 52 года. Жалобы есть?»',
                rating: 'miss',
                effects: { sh3: -10, sh1: -5 },
                ethicsBreach: true,
                why: 'Нет зрительного контакта, представления, приветствия. Пациент — «случай», а не человек.'
              },
              {
                id: 's3c1t1b',
                text: 'Встать навстречу, улыбнуться: «Здравствуйте, Мария Сергеевна! Я доктор Алексеев. Проходите удобно. Как добрались? ... Расскажите, что вас привело сегодня?»',
                rating: 'best',
                effects: { sh3: 15, sh1: 5, sh4: 3, sh6: 5 },
                technique: 'Полная структура AIDET: приветствие + представление + светская беседа + повестка',
                why: 'Соблюдена структура первых 5 минут (К3): приветствие, представление, краткая светская беседа, переход к повестке. Раппорт формируется.'
              },
              {
                id: 's3c1t1c',
                text: '«Здравствуйте. Садитесь. Что беспокоит?»',
                rating: 'acceptable',
                effects: { sh3: 5 },
                why: 'Есть приветствие и переход к сути, но нет представления, светской беседы. Раппорт формируется слабо.'
              }
            ]
          }
        ]
      },
      {
        id: 's3c2',
        title: 'Настороженный пациент',
        svgId: 's3c2',
        intro: [
          'Пациент, 45 лет, заходит хмуро. Садится, скрестив руки. «Ну, дайте побыстрее. Прошлый врач мне не помог. И вообще, я не очень верю в эту медицину.»'
        ],
        respondent: 'Пациент, 45 лет, негативный опыт',
        tasks: [
          {
            id: 's3c2t1',
            prompt: 'Как установить контакт с настороженным пациентом?',
            context: 'Пациент закрыт, имеет негативный опыт, торопит.',
            options: [
              {
                id: 's3c2t1a',
                text: '«Хорошо, давайте быстро. Что у вас?»',
                rating: 'miss',
                effects: { sh3: -5, sh1: -3 },
                why: 'Подстройка под темп без контакта. Закрытый пациент закроется ещё больше. Раппорт не сформирован.'
              },
              {
                id: 's3c2t1b',
                text: '«Не волнуйтесь, я хороший врач, всё будет хорошо. Рассказывайте.»',
                rating: 'acceptable',
                effects: { sh3: 3 },
                why: 'Попытка успокоить, но без конкретики. Обесценивание переживания. Раппорт формируется медленно.'
              },
              {
                id: 's3c2t1c',
                text: '«Понимаю, что предыдущий опыт был непростым. Я доктор [имя], и мне важно разобраться вместе с вами. Давайте определим, что сейчас самое важное, и построим разговор вокруг этого.»',
                rating: 'best',
                effects: { sh3: 15, sh1: 8, sh5: 5, sh6: 5 },
                technique: 'Признание опыта + совместная повестка + представление',
                why: 'Признание негативного опыта (эмпатия), представление, совместная повестка — всё из К3. Закрытый пациент получает сигнал: «я слышу».'
              }
            ]
          }
        ]
      }
    ],
    miniGame: {
      id: 'mg3',
      title: 'Собери первые 5 минут',
      description: 'Расставьте шаги входа в контакт в правильном порядке согласно структуре AIDET (К3).',
      type: 'drag-sort',
      items: [
        { id: 1, text: 'Признать пациента (встретить взглядом, поздороваться)', order: 1 },
        { id: 2, text: 'Представить себя и свою роль', order: 2 },
        { id: 3, text: 'Краткая светская беседа (1–2 реплики)', order: 3 },
        { id: 4, text: 'Обозначить время и установить повестку', order: 4 },
        { id: 5, text: 'Переход к основной беседе', order: 5 }
      ]
    }
  },
  {
    id: 'station_4',
    konspekt: 'К4',
    title: 'Паравербальная коммуникация',
    scale: 'Ш4: Паравербальная коммуникация',
    scaleKey: 'sh4',
    intro: [
      'Кабинет погружён в мягкий свет. На стене — визуализация звуковой волны: амплитуда, частота, паузы. Голос — ваш главный инструмент.',
      'Паравербалика — это НЕ что вы говорите, а КАК. Тон, темп, ритм, громкость, интонация, паузы, тембр. До 38% смысла передаётся через голос.',
      'Регистр голоса: верхний — дистанция/напряжение; средний — нейтральный контакт; нижний — близость/успокоение. Правило трёх сообщений: первое — эмоция, второе — суть, третье — действие.'
    ],
    cases: [
      {
        id: 's4c1',
        title: 'Паникующая пациентка',
        svgId: 's4c1',
        intro: [
          'Пациентка, 28 лет, задыхается. «Мне плохо, я не могу дышать, это опять! Что со мной?!» Голос дрожит, темп речи очень быстрый.'
        ],
        respondent: 'Пациентка, 28 лет, паническая атака',
        tasks: [
          {
            id: 's4c1t1',
            prompt: 'Какие параметры голоса выбрать?',
            context: 'Пациентка в панике: быстрый темп, высокий тон, прерывистое дыхание.',
            options: [
              {
                id: 's4c1t1a',
                text: 'Замедлить свой темп, снизить тон, говорить мягко. Пауза перед каждым предложением. «Я здесь. Вы в безопасности. Давайте дышать вместе... медленно...»',
                rating: 'best',
                effects: { sh4: 15, sh3: 5, sh6: 5 },
                technique: 'Паравербальное присоединение с постепенным ведением (К4)',
                why: 'Замедление своего темпа «ведёт» собеседника к успокоению. Паузы дают время. Принцип «присоединиться — потом вести» (К4).'
              },
              {
                id: 's4c1t1b',
                text: 'Говорить быстро и уверенно: «Всё нормально, дышите, это пройдёт, не бойтесь!»',
                rating: 'miss',
                effects: { sh4: -5, sh3: -3 },
                why: 'Быстрый темп усиливает панику. Обесценивание («не бойтесь») не работает. Паравербально — зеркалим тревогу.'
              },
              {
                id: 's4c1t1c',
                text: 'Говорить обычным темпом: «Расскажите подробнее, когда началось.»',
                rating: 'acceptable',
                effects: { sh4: 3 },
                why: 'Спокойный тон — хорошо, но нет подстройки к состоянию. В пике паники когнитивные вопросы не обрабатываются.'
              }
            ]
          }
        ]
      },
      {
        id: 's4c2',
        title: 'Сообщить серьёзное',
        svgId: 's4c2',
        intro: [
          'Вам нужно сообщить пациенту о необходимости серьёзного вмешательства. Пациент спокоен, не ожидает.'
        ],
        respondent: 'Пациент, 55 лет, спокойный',
        tasks: [
          {
            id: 's4c2t1',
            prompt: 'Как использовать голос и паузу?',
            context: 'Необходимо сообщить серьёзную информацию спокойному пациенту.',
            options: [
              {
                id: 's4c2t1a',
                text: 'Сказать быстро, чтобы «не тянуть», и сразу перейти к плану действий.',
                rating: 'miss',
                effects: { sh4: -8, sh5: -3 },
                why: 'Быстрый темп обесценивает серьёзность. Нет времени на эмоциональную обработку.'
              },
              {
                id: 's4c2t1b',
                text: 'Снизить темп, сделать паузу перед ключевой фразой, ровный тёплый тон. После — выдержать паузу молчания, дать время на осмысление.',
                rating: 'best',
                effects: { sh4: 15, sh5: 5, sh6: 5 },
                technique: 'Пауза как инструмент + управление темпом (К4)',
                why: 'Пауза перед ключевым — сигнал важности. Замедление передаёт серьёзность. Молчание после — уважение к процессу осмысления (К4).'
              },
              {
                id: 's4c2t1c',
                text: 'Говорить обычным темпом, без выделения паузами.',
                rating: 'acceptable',
                effects: { sh4: 2 },
                why: 'Нейтрально, но не использует паравербальные инструменты для передачи значимости момента.'
              }
            ]
          }
        ]
      },
      {
        id: 's4c3',
        title: 'Услышать скрытую тревогу',
        svgId: 's4c3',
        intro: [
          'Пациент рассказывает о плановом обследовании. Слова спокойные, но вы замечаете: голос чуть выше обычного, мелкие паузы между словами, сглатывание.'
        ],
        respondent: 'Пациент, 48 лет, скрывает тревогу',
        tasks: [
          {
            id: 's4c3t1',
            prompt: 'Что вы «слышите» и как отреагируете?',
            context: 'Слова спокойные, но паравербальные сигналы говорят о тревоге.',
            options: [
              {
                id: 's4c3t1a',
                text: 'Продолжить по тексту, не замечая сигналов.',
                rating: 'miss',
                effects: { sh4: -5, sh2: -3 },
                why: 'Игнорирование паравербальных сигналов = потеря важной информации. Тревога проявится позже конфликтом.'
              },
              {
                id: 's4c3t1b',
                text: '«Вы нервничаете? Не волнуйтесь, всё будет хорошо.»',
                rating: 'acceptable',
                effects: { sh4: 3, sh3: -2 },
                why: 'Замечание верное, но форма обесценивающая. Прямой вопрос «вы нервничаете?» может вызвать защиту.'
              },
              {
                id: 's4c3t1c',
                text: 'Отметить сигналы и мягко отразить: «Замечаю, что тема обследования для вас непроста. Хотите поделиться, что вас беспокоит?»',
                rating: 'best',
                effects: { sh4: 15, sh2: 5, sh3: 5, sh6: 5 },
                technique: 'Считывание паравербалики + эмпатическое отражение (К4)',
                why: 'Считан паравербальный сигнал (К4). Отражение даёт разрешение на эмоцию. Не навязывание, а приглашение.'
              }
            ]
          }
        ]
      }
    ],
    miniGame: {
      id: 'mg4',
      title: 'Настрой голос',
      description: 'Три части: А) Параметры голоса под ситуацию; Б) Ловушка → переключатель; В) Услышь эмоцию.',
      type: 'slider',
      items: [
        { part: 'А', situation: 'Успокоить паникующего', tempo: 'Медленный', tone: 'Нижний регистр (близость)', pause: 'Длинные паузы', volume: 'Тихий-средний' },
        { part: 'А', situation: 'Сообщить важное', tempo: 'Замедленный', tone: 'Средний регистр (нейтральный)', pause: 'Пауза до и после', volume: 'Средний' },
        { part: 'Б', trap: 'Оправдательная восходящая интонация', switch_: 'Спокойное нисходящее окончание' },
        { part: 'Б', trap: 'Монотонность', switch_: 'Поднять взгляд на ключевой фразе, выделить голосом смысл' },
        { part: 'Б', trap: 'Тараторение при трудном вопросе', switch_: 'Вдох → пауза ~3 секунды → структурированный ответ' },
        { part: 'В', voice: 'Голос дрожит, темп скачет, паузы неровные', state: 'Тревога / паника', reaction: 'Замедлить свой темп, нижний регистр, «Я здесь»' },
        { part: 'В', voice: 'Тихий голос, слова «как бы» через паузу, нисходящая интонация', state: 'Скрытая неуверенность / подавленность', reaction: 'Открытый вопрос, пауза, «Что для вас сейчас самое важное?»' }
      ]
    }
  },
  {
    id: 'station_5',
    konspekt: 'К5',
    title: 'Превентивная коммуникация',
    scale: 'Ш5: Превентивная коммуникация',
    scaleKey: 'sh5',
    intro: [
      'Перед вами — «мост над трещиной». Превентивная коммуникация — искусство предупреждать конфликты ДО их возникновения.',
      'Инструменты превенции (К5): превентивная рамка (этапы, длительность, ограничения, сроки); признание неудобства (коротко, без вины); точки напряжения (назвать трудности заранее); план при неопределённости (шаги, сроки, связь).',
      'Приёмы обозначения границы: «Да—Нет—Да» (признать → предел → допустимый шаг); «Я-сообщение»; «заезженная пластинка». Каркас беседы — Калгари—Кембриджская модель. Проверка понимания — Teach-back открытым вопросом.'
    ],
    cases: [
      {
        id: 's5c1',
        title: 'Задержка результата',
        svgId: 's5c1',
        intro: [
          'Результат анализа задержится на 3 дня вместо обещанного завтра. Пациент ещё не знает. Он придёт завтра и будет ждать.'
        ],
        respondent: 'Пациент, ожидающий результат',
        tasks: [
          {
            id: 's5c1t1',
            prompt: 'Как действовать превентивно?',
            context: 'Результат задерживается. Пациент придёт завтра и не найдёт его.',
            options: [
              {
                id: 's5c1t1a',
                text: 'Дождаться, пока пациент придёт завтра, и объяснить на месте.',
                rating: 'miss',
                effects: { sh5: -10, sh1: -5 },
                why: 'Превенция не сработала → конфликт. «Почему мне не сказали?» — закономерный вопрос.'
              },
              {
                id: 's5c1t1b',
                text: 'Написать смс: «Результат задерживается.»',
                rating: 'acceptable',
                effects: { sh5: 5 },
                why: 'Информирование есть, но без эмпатии, нового срока, обратного контакта. Пациент может тревожиться.'
              },
              {
                id: 's5c1t1c',
                text: 'Позвонить сегодня: «Иван Петрович, хочу предупредить: результат задерживается на 3 дня — лаборатория перегружена. Это не повод для беспокойства. Я позвоню, как только будет готово.»',
                rating: 'best',
                effects: { sh5: 15, sh1: 5, sh6: 5 },
                technique: 'Упреждающее информирование + план при неопределённости (К5)',
                why: 'Превентивная коммуникация (К5):anticipation + информирование ДО проблемы + новый срок + обратная связь. Конфликт предотвращён.'
              }
            ]
          }
        ]
      },
      {
        id: 's5c2',
        title: 'Процедура с риском',
        svgId: 's5c2',
        intro: [
          'Пациенту предстоит процедура с известными побочными эффектами. Он настроен оптимистично, ожидает «быстро и без проблем».'
        ],
        respondent: 'Пациент, 38 лет, оптимист',
        tasks: [
          {
            id: 's5c2t1',
            prompt: 'Как проговорить ожидания «на берегу»?',
            context: 'Пациент ожидает лёгкую процедуру, но есть реальные побочные эффекты.',
            options: [
              {
                id: 's5c2t1a',
                text: '«Хочу заранее рассказать: процедура 20 минут, переносится хорошо. Но 2–3 дня может быть побочный эффект — это нормально. Вот что поможет... Вот когда звонить мне.»',
                rating: 'best',
                effects: { sh5: 15, sh1: 5, sh4: 3, sh6: 5 },
                technique: 'Проговаривание ожиданий + точки напряжения + план действий (К5)',
                why: 'Полная превенция (К5): что будет, что нормально, что делать, когда бить тревогу. Полное информирование из 5 вопросов.'
              },
              {
                id: 's5c2t1b',
                text: 'Дать письменную памятку с побочными эффектами и отпустить.',
                rating: 'acceptable',
                effects: { sh5: 5 },
                why: 'Информация передана, но без устного обсуждения, проверки понимания, эмоциональной подготовки.'
              },
              {
                id: 's5c2t1c',
                text: '«Всё будет хорошо, не переживайте. Приходите завтра.»',
                rating: 'miss',
                effects: { sh5: -10, sh1: -5 },
                ethicsBreach: true,
                why: 'Сокрытие информации о побочных эффектах. Нарушение информированного согласия. Шок при столкновении с эффектом.'
              }
            ]
          }
        ]
      },
      {
        id: 's5c3',
        title: 'Завышенные ожидания',
        svgId: 's5c3',
        intro: [
          'Пациент убеждён: «Вы обязаны меня полностью вылечить за один приём. Я читал в интернете...» Реальность: хроническое состояние, полное излечение невозможно.'
        ],
        respondent: 'Пациент, 50 лет, завышенные ожидания',
        tasks: [
          {
            id: 's5c3t1',
            prompt: 'Как управлять ожиданиями превентивно?',
            context: 'Пациент ожидает полного излечения за один приём. Реальность — хроническое управление.',
            options: [
              {
                id: 's5c3t1a',
                text: 'Согласиться, чтобы не расстраивать, назначить лечение.',
                rating: 'miss',
                effects: { sh5: -10, sh1: -8 },
                ethicsBreach: true,
                why: 'Ложное обещание. Нарушение честности. Когда результат не совпадёт — тяжёлый конфликт.'
              },
              {
                id: 's5c3t1b',
                text: '«Понимаю ваше желание выздороветь — это естественно. Хочу честно рассказать: состояние хроническое, но мы можем добиться [конкретные цели]. Вот план на месяцы, вот критерии улучшения.»',
                rating: 'best',
                effects: { sh5: 15, sh1: 8, sh3: 5, sh6: 5 },
                technique: 'Управление ожиданиями + реалистичный план + конкретные цели (К5)',
                why: 'Признание желания (эмпатия) + честность + конкретный план. Превентивно снимает фрустрацию от нереалистичных ожиданий (К5).'
              },
              {
                id: 's5c3t1c',
                text: '«Нет, полное излечение невозможно. Привыкайте.»',
                rating: 'miss',
                effects: { sh5: -8, sh1: -5, sh3: -5 },
                why: 'Правда без эмпатии = удар. Разрушение контакта, возможная жалоба.'
              }
            ]
          }
        ]
      }
    ],
    miniGame: {
      id: 'mg5',
      title: 'Предупреди конфликт',
      description: 'Выберите УПРЕЖДАЮЩИЕ действия из предложенных. Часть — верные инструменты превенции, часть — ловушки/бездействие.',
      type: 'multiselect',
      items: [
        {
          id: 'sit1',
          situation: 'Длительное ожидание в очереди. Пациенты начинают нервничать.',
          correct: ['Обозначить ориентировочное время ожидания', 'Объяснить причину задержки', 'Предложить вариант: подождать или перезаписаться'],
          traps: ['Молчать и делать вид, что всё по плану', 'Сказать «Ждите, когда вызовут»']
        },
        {
          id: 'sit2',
          situation: 'Стоимость услуги выше ожидаемой для пациента.',
          correct: ['Сообщить стоимость ДО процедуры', 'Объяснить структуру стоимости', 'Предложить альтернативы или рассрочку'],
          traps: ['Сообщить стоимость после, «чтобы не расстраивать заранее»', 'Сказать «Ну это же очевидно»']
        },
        {
          id: 'sit3',
          situation: 'Необходимость повторного визита, пациент не ожидает.',
          correct: ['Объяснить причину повторения', 'Назначить конкретный срок', 'Дать контакт для вопросов между визитами'],
          traps: ['Не говорить, пока пациент не спросит', 'Сказать «Придёте ещё, и всё»']
        }
      ]
    }
  }
];

export const TEACHER_PASSWORD = 'teacher2024';
