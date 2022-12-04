/// <reference types="dom-speech-recognition" />
import { Rating, findBestMatch } from "./string-similarity";

/**
 * From a series of possible spoken words, tries to find a matching word in the haystack. Check https://github.com/janmarques/basic-speech-grammar for more information
 * @param speechResult stream of possible words that the user has spoken. 
 * @param haystack possible words that you want to detect if the user has spoken them
 * @param minimumRatingToConsider how similar should the spoken word be to the possible word from the haystack. Between 0.0 and 1.0
 */
export function tryFindCommand(speechResult: SpeechRecognitionEvent, haystack: string[], minimumRatingToConsider = 0.6): GrammarResult {
        var last = speechResult.results[speechResult.resultIndex];

        if (!last.isFinal) {
            return new GrammarResult(null, null, ResultType.RecognitionNotFinished);
        }

        var upperHaystack = haystack.map(x => x.toUpperCase());

        var guesses: Rating[] = [];
        for (var i = 0; i < last.length; i++) {
            var needle = last[i].transcript.toUpperCase().replace(" ", "");
            var result = findBestMatch(needle, upperHaystack);
            guesses.push(result.bestMatch);
        }

        var possible = guesses.sort(x => x.rating).filter(x => x.rating > minimumRatingToConsider).map(x => x.target);
        var unique = [...new Set(possible)];
        if (unique.length == 0) {
            return new GrammarResult(null, null, ResultType.NoResult);

        } else if (unique.length == 1) {
            var needle = unique[0];
            var originalCasing = haystack.filter(x => x.toUpperCase().replace(" ", "") == needle)[0];
            return new GrammarResult(originalCasing, null, ResultType.Ok);
        } else {
            return new GrammarResult(null, unique, ResultType.MultipleCandidates);
        }
    }

    
export enum ResultType {
    RecognitionNotFinished,
    NoResult,
    MultipleCandidates,
    Ok
}

export class GrammarResult{
    /**
     * 
     * @param result the single successful result that was found. Can be null if not established. 
     * @param conflictingResults array of 2 or more possible matches. Can be null if not established. 
     * @param resultType the status code which indicates what kind of result was found
     */
    public constructor(
        public result: string,
        public conflictingResults: string[],
        public resultType: ResultType
    ){}
}