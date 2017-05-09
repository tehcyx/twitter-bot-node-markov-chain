var fs = require('fs');

module.exports = {

    train: function(text, factor = 1) {
        var dict = {};

        var words = text.split(/\s/).filter(function(word){ // get all words in text.
            return word.length > 0;
        });

        for (var i = 0; i < words.length; i++) {
            // words[i] = words[i].toLowerCase();
            // words[i] = words[i].replace(/[^-a-z0-9\']/i, ''); // remove also punctuation
            words[i].trim();
        }

        for (var i = 0; i < words.length - 1; i++) {
            var a = words[i];
            var b = words[i + 1];
            if (typeof dict[a] == 'undefined') {
                dict[a] = {};
            }
            if (typeof dict[a][b] == 'undefined') {
                dict[a][b] = factor;
            } else {
                dict[a][b] = dict[a][b] + dict[a][b] * factor;
            }
        }

        // http://stackoverflow.com/questions/171251/how-can-i-merge-properties-of-two-javascript-objects-dynamically
        //Object.assign(dictionary, dict);

        return dict;
    },

    trainFromFile: function(path) {
        var text = fs.readFileSync(path, 'utf8');
        return this.train(text);
    },

    trainFromFolder: function(path) {
        var files = fs.readdirSync(path);
        var txtFiles = files.filter(function(txtPath) {
            return txtPath.match(/.*\.txt$/)
        });
        var dict = [];

        for (var i = 0; i < txtFiles.length; i++) {
            var tmp = this.trainFromFile(path + "/" + txtFiles[i]);
            dict = mergeDict(dict, tmp);
        }

        console.log("Successfully trained on " + txtFiles.length + " files.");

        return dict;
    },

    generate: function(dict, maxLength = 0, startWord = '') {
        var word;
        if (startWord == '') {
            word = pickRandom(dict);
        } else {
            word = startWord;
        }

        sentence = word.charAt(0).toUpperCase() + word.slice(1); // make first letter always capital and add the word to the sentence

        var i = 0;
        while (maxLength == 0 || i < maxLength) {
            i++;

            var highest = 0;
            for (var val in dict[word]) {
                if (dict[word].hasOwnProperty(val)) {
                    // var items = Object.keys(dict[word]).map(function(key) {
                    //     return [key, dict[word][key]];
                    // });
                    // items.sort(function(first, second) {
                    //     return second[1] - first[1];
                    // });
                    // word = items[0][0];
                    word = pickRandom(dict[word]);
                }
            }

            if (typeof word == 'undefined') {
                break;
            }
            sentence = sentence + ' ' + word;
        }
        sentence = sentence + ".";
        return sentence;
    }
}

function mergeDict(dict1, dict2) {
    var dict3 = dict1;
    for (var val in dict2) {
        if (typeof dict3[val] == 'undefined') {
            dict3[val] = dict2[val];
        } else {
            for (var sval in dict2[val]) {
                if (typeof dict3[val][sval] == 'undefined') {
                    dict3[val][sval] = dict2[val][sval];
                } else {
                    dict3[val][sval] = dict3[val][sval] + dict2[val][sval];
                }
            }
        }
    }
    return dict3;
}

function pickRandom(dict) {
    var keys = [];
    for (var val in dict) {
        if (dict.hasOwnProperty(val)) {
            keys.push(val);
        }
    }

    return keys[Math.floor(Math.random() * keys.length)];
}
