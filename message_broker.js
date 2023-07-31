const amqp = require('amqplib');
require('dotenv').config();
const crawler = require('./crawler')

module.exports = async function consumeCPFQueue() {
  try {
    // Conecta-se ao servidor RabbitMQ
    const connection = await amqp.connect(process.env.RABBIT_HOST);

    // Cria um canal para interagir com o servidor
    const channel = await connection.createChannel();

    // Nome da fila que será consumida
    const queueName = process.env.CPF_QUEUE;

    // Declara a fila para garantir que ela exista
    await channel.assertQueue(queueName, { durable: true });

    // Define a quantidade de mensagens que o consumidor pode pegar por vez (prefetch)
    channel.prefetch(0);

    console.log('Aguardando mensagens...');

    // Inicia o consumo da fila
    channel.consume(queueName, async (msg) => {
      if (msg !== null) {
        const cpf = msg.content.toString();
        console.log('CPF recebido:', cpf);
        //Apos recebido cpf da lista, é enviado para o crawler logar no portal e obter o json dos beneficiarios
        await crawler(cpf)

        // Confirma o processamento da mensagem
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error('Erro ao consumir fila:', error);
  }
}