import amqp from 'amqplib';

const RABBITMQ_URL = 'amqp://localhost';
const QUEUE_NAME = 'concert_details';

export async function startBilletConsumer() {
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();
  await channel.assertQueue(QUEUE_NAME, { durable: false });

  console.log('[Billet] En attente de concerts...');

  channel.consume(QUEUE_NAME, (message) => {
    if (message) {
        
      const concert = JSON.parse(message.content.toString());
      console.log(concert);
      console.log(`[Billet] Concert reçu : ${concert.name}`);
      channel.ack(message);
    }
  });
}

startBilletConsumer();