const redis = require('redis');

const createCLient =  () =>  {
    // Configuração do cliente Redis
    const client = redis.createClient({
        host: 'localhost', // Endereço do servidor Redis
        port: 6379, // Porta do servidor Redis
    });
    return client;
}

const verify = (cpf) =>{
    const client = createCLient()
    client.get(cpf, (err, reply) => {

        if (err) {
            console.error('Erro ao verificar JSON no Redis:', err);
            return null
        } else {
            if (reply) {
                // Se a resposta do Redis não for nula, o JSON existe
                console.log('JSON encontrado no Redis:', JSON.parse(reply));
                return JSON.parse(reply)
            } else {
                console.log('JSON não encontrado no Redis.');
                return null
            }
        }
    })
}

module.exports = {
    verify: verify,
    cachefy: function (cpf,json)  {
            const client = createCLient()
            client.set(cpf, JSON.stringify(json), (err, reply) => {
                if (err) {
                    console.error('Erro ao enviar JSON para o Redis:', err);
                } else {
                    console.log('JSON enviado com sucesso para o Redis:', reply);
                }
            })
        }
}