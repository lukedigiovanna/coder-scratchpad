import React from "react";
import { ProgrammingLanguage } from "../constants/models";

interface LanguageLogoProps {
    language: ProgrammingLanguage;
    className: string;
}

const logos = {
    "python": "assets/python.webp",
    "cpp": "assets/cpp.png",
    "c": "assets/c.png",
    "javascript": "assets/javascript.png",
};

const LanguageLogo: React.FC<LanguageLogoProps> = ({language, className}) => {
    return (
        <img className={className} src={logos[language]} alt={language} />
    )
}

export { LanguageLogo };