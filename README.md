Para execuçao da soluçao sera preciso ter previamente instalados:
1 - rabbitmq
2 - redis
3 - elastic_search

Todos eles podem ser instalados via docker

RABBITMQ
docker run -it --rm --name rabbitmq -d -p 5672:5672 -p 15672:15672 rabbitmq:3.12-management

REDIS
docker run -d -p 6379:6379 --name redis-container redis

ELASTIC_SEARCH
docker run -e "discovery.type=single-node" -d -p 9200:9200 -p 9300:9300 --name elasticsearch docker.elastic.co/elasticsearch/elasticsearch:7.15.1

A soluçao dispõe de dois scripts principais que devem ser executados:
node worker.js
responsavel por fazer a parte de ler a fila no rabbit, fazer o fluxo de cache no redis e inserçao e indexaçao no elastic

node api.js
responsavel por expor 2 endpoints: 
1 - GET/:cpf    (como a url ja indica, executa a consulta no elastic com base no cpf)
2 GET/    (simplesmente retorna todos os cpf e dados de beneficiarios capturados pelo crawler)

Obs: antes de executar o worker.js é necessario que os cpf's disponibilizados para teste sejam inseridos manualmente na fila do rabbit informada no .env na propriedade CPF_QUEUE
assim como o usuario e senha do portal devem ser informados nas propriedades USER_LOGIN e USER_PASS