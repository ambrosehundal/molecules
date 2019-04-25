//set up elasticsearch with this code below
const elasticsearch = require('elasticsearch');
const elasticsearchClient = new elasticsearch.Client({
    host: 'http://localhost:9200',
    log: 'error'
});

module.exports = elasticsearchClient;