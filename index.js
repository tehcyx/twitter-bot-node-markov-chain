var CronJob = require('cron').CronJob;
var Twitter = require('twitter');
var markov = require('./markov.js');

new CronJob('*/5 * * * * *', function() {
    runLogic();
}, null, true, 'America/Los_Angeles');


var client = new Twitter({
    consumer_key: process.env.MARKOV_TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.MARKOV_TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.MARKOV_TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.MARKOV_TWITTER_ACCESS_TOKEN_SECRET
});

var dictionary = markov.trainFromFolder('training');
//var dictionary = markov.trainFromFile('training/shakespeare_rape_of_lucrece.txt');

function runLogic(sources) {
    if(typeof sources == 'undefined') {
        // if no topic is defined, maybe tweet about a trending topic
        source = ["_danielroth"]
    }
    // var rand_lat = (Math.random() * (180.000000 - 0.000000) + 0.000000);
    // rand_lat = (rand_lat - 90.000000).toFixed(6);
    // var rand_lon = (Math.random() * (360.000000 - 0.000000) + 0.000000);
    // rand_lon = (rand_lon - 180.000000).toFixed(6);
    //
    // console.log('Pretending to be in lat: ' + rand_lat + ', long: ' + rand_lon);

    var message = markov.generate(dictionary, 10);

    console.log(message);

    // var params_tweet = { status: message, lat: rand_lat, long: rand_lon };
    //client.post('statuses/update', params_tweet, handleTweet);
}

function handleTweet(error, result, response) {
    if(!error) {
        console.log("tweet successful");
    } // not trying again on error, due to api-limits
}

runLogic();
