import { tryFindCommand, ResultType } from '../index';

const speechResultOngoing = {
    results: [({ isFinal: false } as any)],
    resultIndex: 0
} as unknown as any;

const haystack = ["blue", "red", "GREEN", "pur ple"];

test('Ongoing yields no result', () => {
    var result = tryFindCommand(speechResultOngoing, haystack);
    expect(ResultType.RecognitionNotFinished).toBe(result.resultType);
});