const { Client } = require('elasticsearch');

// Configuração do cliente Elasticsearch
const client = new Client({
  node: 'http://localhost:9200', // URL do Elasticsearch
});

// Função para injetar o JSON indexado pelo CPF no Elasticsearch
module.exports = async function injectByIndex(cpf, jsonData) {
  try {
    const indexName = 'cpf-index'; // Nome do índice que você deseja usar

    // Indexa o JSON no Elasticsearch com o CPF como ID do documento
    const response = await client.index({
      index: indexName,
      id: cpf,
      body: jsonData,
    });

    console.log(`JSON injetado para CPF ${cpf} no Elasticsearch.`, response);
  } catch (error) {
    console.error('Erro ao injetar JSON no Elasticsearch:', error);
  }
}
