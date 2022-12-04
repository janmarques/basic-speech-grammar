/// <reference types="dom-speech-recognition" />
import { Rating, findBestMatch } from "./string-similarity";


export enum ResultType {
    /**
     * SpeechRecognition is still ongoing
     */
    RecognitionNotFinished,
    /**
     * No result found
     */
    NoResult,
    /**
     * Found multiple possible results
     */
    MultipleCandidates,
    /**
     * One result found
     */
    Ok
}

export class GrammarResult {
    /**
     * the single successful result that was found. Can be null if not established. 
     */
    public result: string;
    /**
     * array of 2 or more possible matches. Can be null if not established. 
     */
    public conflictingResults: string[];
    /**
     * the status code which indicates what kind of result was found
     */
    public resultType: ResultType;
}
/**
 * From a series of possible spoken words, tries to find a matching word in the haystack. Check https://github.com/janmarques/basic-speech-grammar for more information
 * @param speechResult stream of possible words that the user has spoken. 
 * @param haystack possible words that you want to detect if the user has spoken them
 * @param minimumRatingToConsider how similar should the spoken word be to the possible word from the haystack. Between 0.0 and 1.0
 */
export function tryFindNeedle(speechResult: SpeechRecognitionEvent, haystack: string[], minimumRatingToConsider = 0.6): GrammarResult {
    var last = speechResult.results[speechResult.resultIndex];

    if (!last.isFinal) {
        return { result: null, conflictingResults: null, resultType: ResultType.RecognitionNotFinished } as GrammarResult;
    }
    var upperHaystack = haystack.map(x => normalize(x));

    var guesses: Rating[] = [];
    for (var i = 0; i < last.length; i++) {
        var needle = normalize(last[i].transcript);
        var result = findBestMatch(needle, upperHaystack);
        guesses.push(result.bestMatch);
    }

    var possible = guesses.sort(x => x.rating).filter(x => x.rating > minimumRatingToConsider).map(x => x.target);
    var distinct = [...new Set(possible)];
    distinct = distinct.map(x => haystack.filter(y => normalize(y) === normalize(x))[0]) // revert to original casing
    if (distinct.length == 0) {
        return { result: null, conflictingResults: null, resultType: ResultType.NoResult } as GrammarResult;
    } else if (distinct.length == 1) {
        return { result: distinct[0], conflictingResults: null, resultType: ResultType.Ok } as GrammarResult;
    } else {
        return { result: null, conflictingResults: distinct, resultType: ResultType.MultipleCandidates } as GrammarResult;
    }
}

/**
 * Indicates whether the Speech event is "finished"
 * @param speechResult
 */
export function isLast(speechResult: SpeechRecognitionEvent): boolean {
    var last = speechResult.results[speechResult.resultIndex];
    return last.isFinal;
}


function normalize(input: string): string {
    return replaceAll(input.toUpperCase(), " ", "");
}

// https://stackoverflow.com/questions/1144783/how-do-i-replace-all-occurrences-of-a-string-in-javascript
function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function replaceAll(str: string, find: string, replace: string) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}
