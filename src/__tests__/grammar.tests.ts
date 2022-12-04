import { tryFindCommand, ResultType } from '../index';

const speechResultOngoing = {
    results: [({ isFinal: false } as any)],
    resultIndex: 0
} as unknown as any;

interface ResultList {
    [name: number]: Result;
    isFinal: boolean;
}
class Result {
    constructor(public transcript: string) { }
}


const spokenWordList1 = { isFinal: true } as ResultList;
spokenWordList1[0] = new Result("blue")
spokenWordList1[1] = new Result("below")
spokenWordList1[2] = new Result("black")

const spokenWordList2 = ["person", "woman", "man", "camera", "tv"]
const spokenWordList3 = ["blue", "red", "black", "white"]
const spokenWordList4 = ["very", "stable", "genious"]
const speechResultFinishedMatch = {
    results: [spokenWordList1],
    resultIndex: 0
} as any;

const haystack = ["blue", "red", "GREEN", "sta ble"];

test('Ongoing yields no result', () => {
    var result = tryFindCommand(speechResultOngoing, haystack);
    console.log("lala1")
    console.log(result.conflictingResults)
    console.log(result.result)
    console.log(result.resultType)
    console.log("lili1")
    expect(ResultType.RecognitionNotFinished).toBe(result.resultType);
});

test('Match', () => {
    var result = tryFindCommand(speechResultFinishedMatch, haystack);
    console.log("lala2")
    console.log(result.conflictingResults)
    console.log(result.result)
    console.log(result.resultType)
    console.log("lili2")
    expect(ResultType.RecognitionNotFinished).toBe(result.resultType);
});