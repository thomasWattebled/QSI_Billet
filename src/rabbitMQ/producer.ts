import amqp from 'amqplib';

const RABBITMQ_URL = 'amqp://localhost'; 
const QUEUE_NAME = 'concert'; // Nom de la file d'attente

async function sendConcertRequest(concertId: string) {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: false });
    channel.sendToQueue(QUEUE_NAME, Buffer.from(concertId));

    console.log(`Message envoyé pour le concert ID : ${concertId}`);
    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message à RabbitMQ :', error);
  }
}

// Exemple d'utilisation
sendConcertRequest('123e4567-e89b-12d3-a456-426614174000');