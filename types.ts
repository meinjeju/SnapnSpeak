
export enum Proficiency {
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Advanced = 'Advanced',
}

export interface DialogueLine {
  speaker: string;
  line: string;
}

export interface DialogueResponse {
    dialogue: DialogueLine[];
}
