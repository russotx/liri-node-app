var allkeys = require('./keys.js');
var twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
var fs = require('fs');

var liri = {
    commands : ['my-tweets','spotify-this-song','movie-this','do-what-it-says'],
    askTwitter : function(option) {
        var client = new twitter ({
            consumer_key : allkeys.twitterKeys.consumer_key,
            consumer_secret : allkeys.twitterKeys.consumer_secret,
            access_token_key : allkeys.twitterKeys.access_token_key,
            access_token_secret : allkeys.twitterKeys.access_token_secret 
        });
        var params = {screen_name: 'bobertjones999', count: 20};
        client.get('statuses/user_timeline', params, function(error, tweets, response) {
            if (!error) {
                tweets.forEach(function(aTweet){
                                    console.log(aTweet.created_at.substring(4,10)+" "+aTweet.created_at.substring(aTweet.created_at.length-4)+" : "+aTweet.text);
                               });
            } else {
                console.log('something went wrong with Twitter.');
            }
        });
    },
    askSpotify : function(option) {
        // artist(s)
        // song name
        // preview link
        // album
        // default to the sign by ace of base if no song provided
        spotify.search({type: 'track', query: 'track:"'+option.trim()+'"' || 'track:"the+sign"&artist:"ace+of+base"'}, function(err, data){
            if (err) {
                console.log('invalid song search');
            } else {
                data.tracks.items.forEach(function(result){
                  console.log('artist(s): ');
                  result.artists.forEach(function(artistResult){
                    console.log(artistResult.name);
                  });
                  console.log('Song Title: '+result.name);
                  console.log('Preview: '+result.preview_url);
                  console.log('Album: '+result.album.name);
                });
            }
        });
    },
    askOMDB : function(option) {
        movie = option.trim().split(' ').join('+');
        request('http://omdbapi.com/?t='+movie,function(err,res,body){
                if (err) {
                    console.log('Invalid movie title format.');
                } else {
                    var result = JSON.parse(body);
                    if (result.Response === 'False') {
                        console.log(result.Error);
                    } else {
                        console.log('Movie Title: '+result.Title);
                        console.log('Year Released: '+result.Year);
                        console.log('IMDB Rating: '+result.imdbRating);
                        console.log('Produced in '+result.Country);
                        console.log('Language(s): '+result.Language);
                        console.log('Plot Summary: '+result.Plot);
                        console.log('Actors: '+result.Actors);
                        result.Ratings.forEach(function(rating){
                            if (rating.Source === "Rotten Tomatoes") {
                                console.log('Rotten Tomatoes Score: '+rating.Value);
                            }
                        });
                        console.log('Website: '+(result.Webite || 'no website available'));
                    }
                }
            });
    },
    askFile : function(option) {

    },
    isValidCommand : function(command){
        return (this.commands.indexOf(command) != -1) ? commands.indexOf(command) : false;
    },
    grabCommand : function() {
        return process.argv[2];
    },
    grabOption : function() {
        var option = '';
        for(x=3;x<process.argv.length;x++) {
            option += process.argv[x]+' ';
        }
        return option;
    },
    askLiri : function(){
        var command = this.grabCommand();
        if (this.commands.indexOf(command) === -1) {
            console.log('invalid command');    
        } else if (this.commands.indexOf(command) === 0) {
              this.askTwitter();
          } else if (this.commands.indexOf(command) === 1) {
                this.askSpotify(this.grabOption());
            } else if (this.commands.indexOf(command) === 2) {
                  this.askOMDB(this.grabOption());
              } else {
                    this.askFile();
                }
        }
};

liri.askLiri();



















