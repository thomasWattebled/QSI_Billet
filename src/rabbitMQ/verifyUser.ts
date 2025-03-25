import amqp from 'amqplib';
const RABBITMQ_URL = 'amqp://localhost'; 
const QUEUE_NAME_VERIFY_USER = 'verify_user';
import {generateUuid} from './producer'


export async function sendUserId(userId: string): Promise<boolean> {
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();

  // Crée une queue temporaire pour la réponse
  const { queue } = await channel.assertQueue('', { exclusive: true });

  const correlationId = generateUuid();

  console.log(`Sending userId: ${userId} with correlationId: ${correlationId}`);
  channel.sendToQueue( QUEUE_NAME_VERIFY_USER,Buffer.from(userId),{
      correlationId,
      replyTo: queue,
    }
  );

  const exist: boolean= await new Promise((resolve, reject) => {
    channel.consume(
      queue,
      (msg) => {
        if (msg?.properties.correlationId === correlationId) {
          const response = msg.content.toString();
          console.log(`Received response: ${response}`);
          if (response === 'true') {
            resolve(true);
          } else {
            reject(new Error('User not found'));
          }

          channel.close();
          connection.close();
        }
      },
      { noAck: true }
    );
  });
  return exist;
}
