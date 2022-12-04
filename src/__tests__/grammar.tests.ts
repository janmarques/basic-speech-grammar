import { tryFindNeedle as tryFindNeedle, ResultType } from '../index';

interface ResultList {
    [name: number]: Result;
    isFinal: boolean;
    length: number;
}
class Result {
    constructor(public transcript: string) { }
}


function createSpeechResult(spokenWords: string[], isFinal: boolean = true): any {
    var resultList = { isFinal: isFinal, length: spokenWords.length } as ResultList;
    for (let i = 0; i < spokenWords.length; i++) {
        resultList[i] = new Result(spokenWords[i]);
    }

    var speechResult = {
        results: [resultList],
        resultIndex: 0
    } as any;

    return speechResult;
}

const haystack = ["blue", "red", "Green", "st ab le"];

test('Ongoing yields no result', () => {
    var event = createSpeechResult([], false);
    var result = tryFindNeedle(event, haystack);
    expect(result.resultType).toBe(ResultType.RecognitionNotFinished);
    expect(result.result).toBe(null);
    expect(result.conflictingResults).toBe(null);
});

test('Match', () => {
    var event = createSpeechResult(["blue", "below", "black"]);
    var result = tryFindNeedle(event, haystack);
    expect(result.resultType).toBe(ResultType.Ok);
    expect(result.result).toBe("blue");
    expect(result.conflictingResults).toBe(null);
});

test('NoMatch', () => {
    var event = createSpeechResult(["person", "woman", "man", "camera", "tv"]);
    var result = tryFindNeedle(event, haystack);
    expect(result.resultType).toBe(ResultType.NoResult);
    expect(result.result).toBe(null);
    expect(result.conflictingResults).toBe(null);
});

test('MultipleMatches', () => {
    var event = createSpeechResult(["blue", "red", "black", "white"]);
    var result = tryFindNeedle(event, haystack);
    expect(result.resultType).toBe(ResultType.MultipleCandidates);
    expect(result.result).toBe(null);
    expect(result.conflictingResults.length).toBe(2)
    expect(result.conflictingResults).toContain("blue")
    expect(result.conflictingResults).toContain("red")
});


test('Match Space Insensitive', () => {
    var event = createSpeechResult(["very", "sta ble", "genious"]);
    var result = tryFindNeedle(event, haystack);
    expect(result.resultType).toBe(ResultType.Ok);
    expect(result.result).toBe("st ab le");
    expect(result.conflictingResults).toBe(null);
});


test('Match Case Insensitive', () => {
    var event = createSpeechResult(["GREEN", "white", "loud"]);
    var result = tryFindNeedle(event, haystack);
    expect(result.resultType).toBe(ResultType.Ok);
    expect(result.result).toBe("Green");
    expect(result.conflictingResults).toBe(null);
});
