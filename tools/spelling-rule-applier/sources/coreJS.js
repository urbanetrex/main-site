// Event listeners for buttons
function addEnterKeyListener(inputId, handler) {
    document.getElementById(inputId).addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            event.preventDefault();  // Prevent form submission or default action
            handler();
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Existing listeners
    document.getElementById('analyze').addEventListener('click', analyzeChar);
    document.getElementById('pattern').addEventListener('click', analyzeString);
    document.getElementById('combine').addEventListener('click', combineMorphographs);
    document.getElementById('pluralize').addEventListener('click', pluralize);

    // Input enter-key listeners for triggering functions
    addEnterKeyListener('charInput', analyzeChar);
    addEnterKeyListener('vcStringInput', analyzeString);
    addEnterKeyListener('morph2', combineMorphographs);
    addEnterKeyListener('pluralInput', pluralize);

    // New: when Enter pressed in morph1, focus morph2 input
    const morph1Input = document.getElementById('morph1');
    const morph2Input = document.getElementById('morph2');

    morph1Input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.keyCode === 13) {
            event.preventDefault();
            if (morph2Input) {
                morph2Input.focus();
                // Optional: select all text in morph2 for easy overwrite
                morph2Input.select();
            } else {
                console.warn('morph2 input not found');
            }
        }
    });
});


// Core validation
function isLetterOnly(s) {
    return /^[a-zA-Z]+$/.test(s);
}

function isValidCharInput(id) {
    const val = document.getElementById(id).value;
    return val.length === 1 && isLetterOnly(val);
}

function show(id, msg) {
    document.getElementById(id).innerHTML = msg;
}

// Vowel or consonant classification
function vcJudge(c) {
    return ['a', 'e', 'i', 'o', 'u'].includes(c.toLowerCase()) ? 'v' : 'c';
}

function analyzeChar() {
    const input = document.getElementById('charInput').value;
    if (!isValidCharInput('charInput')) {
        show('charResult', "Please enter a single alphabetic letter.");
        return;
    }

    const lower = input.toLowerCase();
    const type = vcJudge(lower) === 'v' ? "vowel" : "consonant";

    show('charResult', `The character <strong>${lower}</strong> is a <strong>${type}</strong>.`);
}

function analyzeString() {
    const input = document.getElementById('vcStringInput').value;
    if (!isLetterOnly(input)) {
        show('vcResult1', "Please enter letters only.");
        show('vcResult2', "");
        return;
    }

    const s = input.toLowerCase();
    let result = "";
    const last = s.length - 1;

    for (let i = 0; i <= last; i++) {
        if (i === last) {
            if (s[i] === 'x') result += "c(+c)";
            else if (['y', 'w'].includes(s[i])) result += "v";
            else result += vcJudge(s[i]);
        } else {
            result += vcJudge(s[i]);
        }
    }

    show('vcResult1', `The V/C string for <strong>${s}</strong> is: <strong>${result}</strong>.`);
    
    if (['y', 'w'].includes(s[last])) {
        show('vcResult2', `The last character is a vowel (y and w are vowels at the end of a morphograph).`);
    } else if (s[last] === 'x') {
        show('vcResult2', `The last character is a consonant (x sounds like two consonants).`);
    } else {
        show('vcResult2', "");
    }
}

function combineMorphographs() {
    let s1 = document.getElementById('morph1').value;
    let s2 = document.getElementById('morph2').value;

    if (!isLetterOnly(s1) || !isLetterOnly(s2)) {
        show('combineResult', "Please enter valid letter strings.");
        return;
    }

    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    const vc1 = getVCString(s1);
    let result = s1 + s2;
    let rule = "";

    if (s1.endsWith('e') && vcJudge(s2[0]) === 'v') {
        result = s1.slice(0, -1) + s2;
        rule = "Drop the final 'e' when followed by a vowel morphograph.";
    } else if (
        s1.length < 5 &&
        vcJudge(s1.slice(-1)) === 'c' &&
        vcJudge(s2[0]) === 'v' &&
        vc1.endsWith("cvc") &&
        !s1.endsWith('x')
    ) {
        result = s1 + s1.slice(-1) + s2;
        rule = "Double the final consonant for short CVC words followed by a vowel.";
    } else if (
        s1.endsWith('y') &&
        vcJudge(s1.slice(-2, -1)) === 'c' &&
        s2[0] !== 'i'
    ) {
        result = s1.slice(0, -1) + 'i' + s2;
        rule = "Change y to i when preceded by a consonant and not followed by 'i'.";
    }

    show('combineResult', `Combined: <strong>${result}</strong>`);
    show('combineRule', rule);
}

function getVCString(s) {
    s = s.toLowerCase();
    let vc = "";
    for (let i = 0; i < s.length - 1; i++) {
        vc += vcJudge(s[i]);
    }
    const last = s.slice(-1);
    if (['a','e','i','o','u','y','w'].includes(last)) vc += 'v';
    else vc += 'c';
    return vc;
}

import { pluralizeWord } from './pluralJS/plural.js';

function pluralize() {
    const word = document.getElementById('pluralInput').value;

    if (!/^[a-zA-Z]+$/.test(word)) {
        show('pluralResult', "Please enter letters only.");
        show('pluralRule', "");
        return;
    }

    const { plural, rule } = pluralizeWord(word);

    show('pluralResult', `Plural: <strong>${plural}</strong>`);
    show('pluralRule', rule);
}