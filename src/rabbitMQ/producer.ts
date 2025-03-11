import amqp from 'amqplib';

const RABBITMQ_URL = 'amqp://localhost'; 
const QUEUE_NAME_CONCERT = 'concert'; // Nom de la file d'attente
const QUEUE_NAME_OWNER = 'user';

export async function sendConcertRequest(concertId: string):Promise<any> {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    const replyQueue = await channel.assertQueue('', { exclusive: true });
    await channel.assertQueue(QUEUE_NAME_CONCERT, { durable: false });
          // Publier la demande de concert
    channel.sendToQueue(QUEUE_NAME_CONCERT, Buffer.from(concertId), {
            replyTo: replyQueue.queue,
          });
    console.log(`Message envoyé pour le concert ID : ${concertId}`);

    const concert = await new Promise((resolve, reject) => {
      channel.consume(replyQueue.queue, (message) => {
        if (message) {
          const concert = JSON.parse(message.content.toString());
          channel.ack(message);
          resolve(concert);
        }
      }, { noAck: false });
    });
    setTimeout(() => {
      connection.close();
    }, 500);
    return concert;
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message à RabbitMQ :', error);
  }
}


export async function sendOwnerRequest(ownerId: string):Promise<any> {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    const replyQueue = await channel.assertQueue('', { exclusive: true });
    await channel.assertQueue(QUEUE_NAME_OWNER, { durable: false });
          // Publier la demande de concert
    channel.sendToQueue(QUEUE_NAME_OWNER, Buffer.from(ownerId), {
            replyTo: replyQueue.queue,
          });
    console.log(`Message envoyé pour le ownerId : ${ownerId}`);

    const owner = await new Promise((resolve, reject) => {
      channel.consume(replyQueue.queue, (message) => {
        if (message) {
          const owner = JSON.parse(message.content.toString());
          channel.ack(message);
          resolve(owner);
        }
      }, { noAck: false });
    });
    setTimeout(() => {
      connection.close();
    }, 500);
    return owner;
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message à RabbitMQ :', error);
  }
}