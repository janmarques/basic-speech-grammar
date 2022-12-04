 /// <reference types="dom-speech-recognition" />
 import { tryFindCommand, ResultType } from "./index";

 var ongoingList = new SpeechRecognitionResultList();
 ongoingList.item[0] = {isFinal: false} as SpeechRecognitionResult;
 const speechResultOngoing = {
   results: ongoingList,
   resultIndex: 0

 } as unknown as SpeechRecognitionEvent;

 const haystack = ["blue", "red", "GREEN", "pur ple"];

 export function tests(){
     var result = tryFindCommand(speechResultOngoing, haystack);
     var expected = ResultType.RecognitionNotFinished;
     var assertion = result.resultType === expected
     if(!assertion){
         throw "FAILED";
     }
 }