// Data models

import { formatDateForTitle } from "./utils";

type ProgrammingLanguage = 'python' | 'cpp' | 'c' | 'javascript';

interface Scratch {
    id: number | null; // id null when this scratch hasn't been saved to DB yet
    title: string;
    code: string;
    language: ProgrammingLanguage;
    createdAt: Date;
    updatedAt: Date;
}

interface User {
    email: string;
    scratches: Scratch[];
}

// Creates a new, blank scratch with the given default programming language.
function newScratch(language: ProgrammingLanguage): Scratch {
    const now = new Date();
    return {
        id: null,
        code: "",
        language: language,
        createdAt: now,
        updatedAt: now,
        title: formatDateForTitle(now),
    };
}

export type { ProgrammingLanguage, Scratch, User };

export { newScratch };
