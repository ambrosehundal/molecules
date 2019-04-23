const elasticsearchClient = require('./client');

elasticsearchClient.ping({
    requestTimeout: 1000
}, function(error){
    if(error){
        console.trace('elasticsearch cluster is down, not working');
    } else{
        console.log('Implemented elasticsearch, good to use');
    }
})