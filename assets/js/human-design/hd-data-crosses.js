// hd-data-crosses.js — 192 組輪迴交叉名稱（64 個人格太陽閘門 × 3 種角度）。
// 結構對照衍生自 SharpAstrology 的 IncarnationCross.cs（MIT License）；授權聲明見
// /THIRD_PARTY_NOTICES.md。中文名稱為本站翻譯，只提供名稱與結構，不搬用第三方解讀文案。

const CROSS_ENUM_BY_ANGLE = {
  juxtaposition: [null,
    'JuxtapositionCrossOfSelfExpression', 'JuxtapositionCrossOfTheDriver', 'JuxtapositionCrossOfMutation', 'JuxtapositionCrossOfFormulization',
    'JuxtapositionCrossOfHabits', 'JuxtapositionCrossOfConflict', 'JuxtapositionCrossOfInteraction', 'JuxtapositionCrossOfContribution',
    'JuxtapositionCrossOfFocus', 'JuxtapositionCrossOfBehavior', 'JuxtapositionCrossOfIdeas', 'JuxtapositionCrossOfArticulation',
    'JuxtapositionCrossOfListening', 'JuxtapositionCrossOfEmpowering', 'JuxtapositionCrossOfExtremes', 'JuxtapositionCrossOfExperimentation',
    'JuxtapositionCrossOfOpinions', 'JuxtapositionCrossOfCorrection', 'JuxtapositionCrossOfNeed', 'JuxtapositionCrossOfTheNow',
    'JuxtapositionCrossOfControl', 'JuxtapositionCrossOfGrace', 'JuxtapositionCrossOfAssimilation', 'JuxtapositionCrossOfRationalization',
    'JuxtapositionCrossOfInnocence', 'JuxtapositionCrossOfTheTrickster', 'JuxtapositionCrossOfCaring', 'JuxtapositionCrossOfRisks',
    'JuxtapositionCrossOfCommitment', 'JuxtapositionCrossOfFates', 'JuxtapositionCrossOfInfluence', 'JuxtapositionCrossOfConservation',
    'JuxtapositionCrossOfRetreat', 'JuxtapositionCrossOfPower', 'JuxtapositionCrossOfExperience', 'JuxtapositionCrossOfCrisis',
    'JuxtapositionCrossOfBargains', 'JuxtapositionCrossOfOpposition', 'JuxtapositionCrossOfProvocation', 'JuxtapositionCrossOfDenial',
    'JuxtapositionCrossOfFantasy', 'JuxtapositionCrossOfCompletion', 'JuxtapositionCrossOfInsight', 'JuxtapositionCrossOfAlertness',
    'JuxtapositionCrossOfPossession', 'JuxtapositionCrossOfSerendipity', 'JuxtapositionCrossOfOppression', 'JuxtapositionCrossOfDepth',
    'JuxtapositionCrossOfPrinciples', 'JuxtapositionCrossOfValues', 'JuxtapositionCrossOfShock', 'JuxtapositionCrossOfStillness',
    'JuxtapositionCrossOfBeginnings', 'JuxtapositionCrossOfAmbition', 'JuxtapositionCrossOfMoods', 'JuxtapositionCrossOfStimulation',
    'JuxtapositionCrossOfIntuition', 'JuxtapositionCrossOfVitality', 'JuxtapositionCrossOfStrategy', 'JuxtapositionCrossOfLimitation',
    'JuxtapositionCrossOfThinking', 'JuxtapositionCrossOfDetail', 'JuxtapositionCrossOfDoubts', 'JuxtapositionCrossOfConfusion',
  ],
  left: [null,
    'LeftAngleCrossOfDefiance2', 'LeftAngleCrossOfDefiance', 'LeftAngleCrossOfWishes', 'LeftAngleCrossOfRevolution2',
    'LeftAngleCrossOfSeparation2', 'LeftAngleCrossOfThePlane2', 'LeftAngleCrossOfMasks2', 'LeftAngleCrossOfUncertainty',
    'LeftAngleCrossOfIdentification2', 'LeftAngleCrossOfPrevention2', 'LeftAngleCrossOfEducation2', 'LeftAngleCrossOfEducation',
    'LeftAngleCrossOfMasks', 'LeftAngleCrossOfUncertainty2', 'LeftAngleCrossOfPrevention', 'LeftAngleCrossOfIdentification',
    'LeftAngleCrossOfUpheaval', 'LeftAngleCrossOfUpheaval2', 'LeftAngleCrossOfRefinement2', 'LeftAngleCrossOfDuality',
    'LeftAngleCrossOfEndeavour', 'LeftAngleCrossOfInforming', 'LeftAngleCrossOfDedication', 'LeftAngleCrossOfIncarnation',
    'LeftAngleCrossOfHealing', 'LeftAngleCrossOfConfrontation2', 'LeftAngleCrossOfAlignment', 'LeftAngleCrossOfAlignment2',
    'LeftAngleCrossOfIndustry2', 'LeftAngleCrossOfIndustry', 'LeftAngleCrossOfTheAlpha', 'LeftAngleCrossOfLimitation2',
    'LeftAngleCrossOfRefinement', 'LeftAngleCrossOfDuality2', 'LeftAngleCrossOfSeparation', 'LeftAngleCrossOfThePlane',
    'LeftAngleCrossOfMigration', 'LeftAngleCrossOfIndividualism2', 'LeftAngleCrossOfIndividualism', 'LeftAngleCrossOfMigration2',
    'LeftAngleCrossOfTheAlpha2', 'LeftAngleCrossOfLimitation', 'LeftAngleCrossOfDedication2', 'LeftAngleCrossOfIncarnation2',
    'LeftAngleCrossOfConfrontation', 'LeftAngleCrossOfHealing2', 'LeftAngleCrossOfInforming2', 'LeftAngleCrossOfEndeavour2',
    'LeftAngleCrossOfRevolution', 'LeftAngleCrossOfWishes2', 'LeftAngleCrossOfTheClarion', 'LeftAngleCrossOfDemands',
    'LeftAngleCrossOfCycles', 'LeftAngleCrossOfCycles2', 'LeftAngleCrossOfSpirit', 'LeftAngleCrossOfDistraction',
    'LeftAngleCrossOfTheClarion2', 'LeftAngleCrossOfDemands2', 'LeftAngleCrossOfSpirit2', 'LeftAngleCrossOfDistraction2',
    'LeftAngleCrossOfObscuration2', 'LeftAngleCrossOfObscuration', 'LeftAngleCrossOfDominion', 'LeftAngleCrossOfDominion2',
  ],
  right: [null,
    'RightAngleCrossOfTheSphinx4', 'RightAngleCrossOfTheSphinx2', 'RightAngleCrossOfLaws', 'RightAngleCrossOfExplanation3',
    'RightAngleCrossOfConsciousness4', 'RightAngleCrossOfEden3', 'RightAngleCrossOfTheSphinx3', 'RightAngleCrossOfContagion2',
    'RightAngleCrossOfPlanning4', 'RightAngleCrossOfTheVesselOfLove4', 'RightAngleCrossOfEden4', 'RightAngleCrossOfEden2',
    'RightAngleCrossOfTheSphinx', 'RightAngleCrossOfContagion4', 'RightAngleCrossOfTheVesselOfLove2', 'RightAngleCrossOfPlanning2',
    'RightAngleCrossOfService', 'RightAngleCrossOfService3', 'RightAngleCrossOfTheFourWays4', 'RightAngleCrossOfTheSleepingPhoenix2',
    'RightAngleCrossOfTension', 'RightAngleCrossOfRulership', 'RightAngleCrossOfExplanation2', 'RightAngleCrossOfTheFourWays',
    'RightAngleCrossOfTheVesselOfLove', 'RightAngleCrossOfRulership4', 'RightAngleCrossOfTheUnexpected', 'RightAngleCrossOfTheUnexpected3',
    'RightAngleCrossOfContagion3', 'RightAngleCrossOfContagion', 'RightAngleCrossOfTheUnexpected2', 'RightAngleCrossOfMaya3',
    'RightAngleCrossOfTheFourWays2', 'RightAngleCrossOfTheSleepingPhoenix4', 'RightAngleCrossOfConsciousness2', 'RightAngleCrossOfTheEden',
    'RightAngleCrossOfPlanning', 'RightAngleCrossOfTension4', 'RightAngleCrossOfTension2', 'RightAngleCrossOfPlanning3',
    'RightAngleCrossOfTheUnexpected4', 'RightAngleCrossOfMaya', 'RightAngleCrossOfExplanation4', 'RightAngleCrossOfTheFourWays3',
    'RightAngleCrossOfRulership2', 'RightAngleCrossOfTheVesselOfLove3', 'RightAngleCrossOfRulership3', 'RightAngleCrossOfTension3',
    'RightAngleCrossOfExplanation', 'RightAngleCrossOfLaws3', 'RightAngleCrossOfPenetration', 'RightAngleCrossOfService2',
    'RightAngleCrossOfPenetration2', 'RightAngleCrossOfPenetration4', 'RightAngleCrossOfTheSleepingPhoenix', 'RightAngleCrossOfLaws2',
    'RightAngleCrossOfPenetration3', 'RightAngleCrossOfService4', 'RightAngleCrossOfTheSleepingPhoenix3', 'RightAngleCrossOfLaws4',
    'RightAngleCrossOfMaya4', 'RightAngleCrossOfMaya2', 'RightAngleCrossOfConsciousness', 'RightAngleCrossOfConsciousness3',
  ],
};

const TOPIC_ZH = {
  SelfExpression: '自我表達', TheDriver: '驅動者', Mutation: '變異', Formulization: '公式化', Habits: '習慣', Conflict: '衝突',
  Interaction: '互動', Contribution: '貢獻', Focus: '專注', Behavior: '行為', Ideas: '想法', Articulation: '表達',
  Listening: '聆聽', Empowering: '賦能', Extremes: '極端', Experimentation: '實驗', Opinions: '意見', Correction: '修正',
  Need: '需求', TheNow: '當下', Control: '控制', Grace: '優雅', Assimilation: '同化', Rationalization: '合理化',
  Innocence: '純真', TheTrickster: '詭術師', Caring: '關懷', Risks: '風險', Commitment: '承諾', Fates: '命運',
  Influence: '影響', Conservation: '保存', Retreat: '退隱', Power: '力量', Experience: '經驗', Crisis: '危機',
  Bargains: '協議', Opposition: '對立', Provocation: '挑釁', Denial: '否認', Fantasy: '幻想', Completion: '完成',
  Insight: '洞見', Alertness: '警覺', Possession: '擁有', Serendipity: '偶然之喜', Oppression: '壓迫', Depth: '深度',
  Principles: '原則', Values: '價值', Shock: '震撼', Stillness: '靜止', Beginnings: '開端', Ambition: '野心',
  Moods: '情緒', Stimulation: '刺激', Intuition: '直覺', Vitality: '活力', Strategy: '策略', Limitation: '限制',
  Thinking: '思考', Detail: '細節', Doubts: '懷疑', Confusion: '困惑', Defiance: '挑戰', Wishes: '願望',
  Revolution: '革命', Separation: '分離', ThePlane: '平面', Masks: '面具', Uncertainty: '不確定', Identification: '認同',
  Prevention: '預防', Education: '教育', Upheaval: '劇變', Refinement: '精煉', Duality: '二元性', Endeavour: '奮進',
  Informing: '告知', Dedication: '奉獻', Incarnation: '化身', Healing: '療癒', Confrontation: '對峙', Alignment: '對齊',
  Industry: '產業', TheAlpha: '領袖', Migration: '遷移', Individualism: '個人主義', TheClarion: '號角', Demands: '要求',
  Cycles: '循環', Spirit: '精神', Distraction: '分心', Obscuration: '遮蔽', Dominion: '統御', TheSphinx: '人面獅身',
  Laws: '法則', Explanation: '解釋', Consciousness: '意識', Eden: '伊甸園', TheEden: '伊甸園', Contagion: '傳染',
  Planning: '計畫', TheVesselOfLove: '愛之容器', Service: '服務', TheFourWays: '四方道路',
  TheSleepingPhoenix: '沉睡鳳凰', Tension: '張力', Rulership: '統領', TheUnexpected: '意外', Maya: '瑪雅', Penetration: '穿透',
};

const ANGLES = {
  right: { enumPrefix: 'RightAngleCrossOf', zh: '右角度交叉之', en: 'Right Angle' },
  left: { enumPrefix: 'LeftAngleCrossOf', zh: '左角度交叉之', en: 'Left Angle' },
  juxtaposition: { enumPrefix: 'JuxtapositionCrossOf', zh: '並列交叉之', en: 'Juxtaposition' },
};

function humanizeTopic(topic) {
  return topic.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^The /, 'the ').replace(/ Of /g, ' of ');
}

export function getIncarnationCross(personalitySunGate, angle) {
  const gate = Number(personalitySunGate);
  const angleInfo = ANGLES[angle];
  const enumName = CROSS_ENUM_BY_ANGLE[angle]?.[gate];
  if (!angleInfo || !enumName) return null;

  const rawTopic = enumName.slice(angleInfo.enumPrefix.length);
  const variantMatch = rawTopic.match(/([2-4])$/);
  const variant = variantMatch ? Number(variantMatch[1]) : 1;
  const topic = variantMatch ? rawTopic.slice(0, -1) : rawTopic;
  const variantZh = variant > 1 ? `（${variant}）` : '';
  const variantEn = variant > 1 ? ` ${variant}` : '';

  return Object.freeze({
    id: enumName,
    angle,
    personalitySunGate: gate,
    variant,
    topic,
    nameZh: `${angleInfo.zh}${TOPIC_ZH[topic] || humanizeTopic(topic)}${variantZh}`,
    nameEn: `The ${angleInfo.en} Cross of ${humanizeTopic(topic)}${variantEn}`,
  });
}

export const INCARNATION_CROSS_COUNT = Object.values(CROSS_ENUM_BY_ANGLE)
  .reduce((count, entries) => count + entries.filter(Boolean).length, 0);
