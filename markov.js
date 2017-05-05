module.exports = {

    var endOfSentence = /\.\?\!/;
    var dictionary = {};

    training: function(text) {
        var dict = {};


        // http://stackoverflow.com/questions/171251/how-can-i-merge-properties-of-two-javascript-objects-dynamically
        Object.assign(dictionary, dict);
    }

    generate: function(sentenceCount) {
        var sentences = [];
        for (var i = 0; i < sentenceCount; i++) {
            sentences.push(generateSentence());
        }

        return sentences.join(' ');
    }

    generateSentence: function() {

    }
}
