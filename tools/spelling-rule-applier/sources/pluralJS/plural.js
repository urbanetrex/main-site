import { plural_exclusives } from './exclusives.js';

function isConsonant(letter) {
    return !['a','e','i','o','u'].includes(letter.toLowerCase());
}

function endsWithAny(word, suffixes) {
    return suffixes.some(suf => word.endsWith(suf));
}

export function pluralizeWord(word) {
    const lowerWord = word.toLowerCase();

    for (const category in plural_exclusives) {
        if (plural_exclusives[category].hasOwnProperty(lowerWord)) {
            return {
                plural: plural_exclusives[category][lowerWord],
                rule: `Special case: <strong>${word}</strong> → <strong>${plural_exclusives[category][lowerWord]}</strong>.<br> <a href="./exclusives/plurals.html">See more exceptions</a>`
            };
        }
    }

    if (endsWithAny(lowerWord, ['s', 'x', 'z', 'o'])) {
        return {
            plural: lowerWord + 'es',
            rule: "Add 'es' to words ending in s, x, z, or o."
        };
    }

    if (endsWithAny(lowerWord, ['ch', 'sh'])) {
        return {
            plural: lowerWord + 'es',
            rule: "Add 'es' to words ending in 'ch' or 'sh'."
        };
    }

    if (lowerWord.endsWith('y') && isConsonant(lowerWord[lowerWord.length - 2])) {
        return {
            plural: lowerWord.slice(0, -1) + 'ies',
            rule: "Consonant + y becomes 'ies'."
        };
    }

    if (lowerWord.endsWith('fe')) {
        return {
            plural: lowerWord.slice(0, -2) + 'ves',
            rule: "'fe' becomes 'ves'."
        };
    }

    if (lowerWord.endsWith('f')) {
        return {
            plural: lowerWord.slice(0, -1) + 'ves',
            rule: "'f' becomes 'ves'."
        };
    }

    // Default rule
    return {
        plural: lowerWord + 's',
        rule: ""
    };
}
