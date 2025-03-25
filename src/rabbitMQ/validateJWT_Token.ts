import amqp from 'amqplib';
import { generateUuid } from './producer';

const RABBITMQ_URL = 'amqp://localhost'; 
const QUEUE_NAME_JWT = 'jwt_decode';


export async function validateTokenWithUserService(token: string): Promise<{ userId: string } | null> {
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();

  // Déclarer une file d'attente de réponse temporaire
  const {queue} = await channel.assertQueue('', { exclusive: true });
  console.log(`✅ File temporaire créée : ${queue}`);

    const correlationId = generateUuid();
  
  // Envoyer la requête de validation du token
  channel.sendToQueue(QUEUE_NAME_JWT, Buffer.from(token), {
        correlationId,
        replyTo: queue,
      });

  console.log('Requête de validation du token envoyée');

  // Attendre la réponse
  const response = await new Promise<{ userId: string } | null>((resolve) => {
    console.log(`📡 Tentative d'enregistrement du consume() sur la file : ${queue}`);
    channel.consume(queue, (message) => {
      console.log(`📡 En attente d'une réponse dans la file : ${queue}`);
      if (message) {
        if(message.properties.correlationId === correlationId) {
        const response = JSON.parse(message.content.toString());
        channel.ack(message);
        resolve(response);
      }
    }}, { noAck: false });
  });
  // Fermer la connexion
  setTimeout(() => {
    connection.close();
  }, 500);

  return response;
}