//set up elasticsearch with this code below
const elasticsearch = require('elasticsearch');
const elasticsearchClient = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'error'
});

module.exports = elasticsearchClient;