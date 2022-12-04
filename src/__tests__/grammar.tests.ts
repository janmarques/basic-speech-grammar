import { tryFindCommand, ResultType } from '../index';

var ongoingList = new SpeechRecognitionResultList();
ongoingList.item[0] = {isFinal: false} as SpeechRecognitionResult;
const speechResultOngoing = {
  results: ongoingList,
  resultIndex: 0

} as unknown as SpeechRecognitionEvent;

const haystack = ["blue", "red", "GREEN", "pur ple"];

test('Ongoing yields no result', () => {
  var result = tryFindCommand(speechResultOngoing, haystack);
  expect(ResultType.RecognitionNotFinished).toBe(result.resultType);
});