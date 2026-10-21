export type Language = 'es' | 'hy';

export type TenseType = 'perfecto' | 'indefinido' | 'imperfecto' | 'mix';

export interface Question {
  id: string;
  spanishQuestion: string;
  armenianTranslation: string;
  options: string[];
  correctIndex: number;
  tense: TenseType;
  armenianExplanation: string;
  timeMarker?: string;
  verbInfinitive?: string;
}

export interface ErrorCorrectionItem {
  id: string;
  wrongSentence: string;
  wrongWord: string;
  options: string[];
  correctIndex: number;
  correctedSentence: string;
  armenianTranslation: string;
  armenianExplanation: string;
}

export interface CoachDialogueItem {
  id: string;
  coachQuestionEs: string;
  coachQuestionHy: string;
  options: {
    es: string;
    hy: string;
    isCorrect: boolean;
    feedbackHy: string;
  }[];
}

export interface AdventureStep {
  id: string;
  chapterTitleEs: string;
  chapterTitleHy: string;
  storyEs: string;
  storyHy: string;
  options: {
    textEs: string;
    textHy: string;
    isCorrect: boolean;
    nextStepId: string;
    feedbackHy: string;
    xpBonus: number;
  }[];
  isEnding?: boolean;
  isVictory?: boolean;
}

export interface JournalistInterviewItem {
  id: string;
  journalistQuestionEs: string;
  journalistQuestionHy: string;
  idiomEs?: string;
  idiomHy?: string;
  options: {
    es: string;
    hy: string;
    isCorrect: boolean;
  }[];
  armenianExplanation: string;
}

export interface MemoryCard {
  id: string;
  spanish: string;
  armenian: string;
  type: 'verb' | 'football' | 'marker';
}

export interface UnscrambleItem {
  id: string;
  words: string[];
  correctSentence: string;
  armenianTranslation: string;
  armenianExplanation: string;
  tense: TenseType;
}

export interface SmartGoalkeeperItem {
  id: string;
  promptEs: string;
  promptHy: string;
  options: string[];
  correctIndex: number;
  timerSeconds: number;
  explanationHy: string;
}

export interface UserStats {
  goals: number;
  penaltiesAttempted: number;
  penaltiesScored: number;
  championshipProgress: number; // 1 to 4
  championshipCompleted: boolean;
  trophies: string[];
  stars: number;
  xp: number;
  streak: number;
  bestStreak: number;
  mistakeIds: string[];
  gamesPlayed: number;
}
