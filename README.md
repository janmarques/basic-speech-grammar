# Basic speech recognition grammar - use case
When working with SpeechRecognition, you are given back a range of possibilities about word that the user said.

If your application works in the sense of "commands", meaning you know beforehand which words your are looking (listening) for, then this package could help you.

## How to use
Install with `npm i basic-speech-grammar`

Import the tryFindNeedle method `import { isLast, tryFindNeedle } from 'basic-speech-grammar';`

In the `onresult` handler of `SpeechRecognition`, pass that whole event to `tryFindNeedle`. 

This will return a `GrammarResult`, containing the status and possible result.

Example:
```
this.reco = new this.SpeechRecognition();
this.reco.continuous = false;
this.reco.interimResults = true;
this.reco.lang = this.language.code;
this.reco.maxAlternatives = 10;

this.reco.onresult = (x) => {
    if (!isLast(x)) { return; }

    var haystack  = ["red", "blue", "green"];
    var result = tryFindNeedle(x, haystack);
    if (result.resultType == ResultType.RecognitionNotFinished) {
        return;
    }
    if (result.resultType == ResultType.NoResult) {
        this.sayOutLoud(this.language.notFound);
        return;
    }
    if (result.resultType == ResultType.MultipleCandidates) {
        this.sayOutLoud(this.language.foundMultiple + result.conflictingResults.join(", "));
        return;
    }

    var heardCommand = result.result;
        // do sth with result.
};
```

## Implementation details
The possible words said are compared with the predefined haystack you provide.

This comparison is done using [this project|https://github.com/aceakash/string-similarity]. 

The comparison is purely based on the written similarity, not the auditive similarity.

It is considered a "match" if the similarity is 0.6 or higher. This is configurable in the tryFindNeedle() options.

Spaces and capitalization are ignored when comparing strings.