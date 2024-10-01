// Data models

import { formatDateForTitle } from "./utils";

type ProgrammingLanguage = 'python';

interface User {
    uuid: string;
    email: string;
}

interface Scratch {
    code: string;
    language: ProgrammingLanguage;
    user: User | null;
    createdDate: Date;
    lastSaved: Date;
    title: string;
}

// Creates a new, blank scratch with the given default programming language.
function newScratch(language: ProgrammingLanguage): Scratch {
    const now = new Date();
    return {
        code: "",
        language: language,
        createdDate: now,
        lastSaved: now,
        title: formatDateForTitle(now),
        user: null
    };
}

export type { ProgrammingLanguage, Scratch };

export { newScratch };
