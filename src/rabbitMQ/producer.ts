import amqp from 'amqplib';

const RABBITMQ_URL = 'amqp://localhost'; 
const QUEUE_NAME_CONCERT = 'concert_details';
const QUEUE_NAME_JWT = 'validate_jwt';
 // Nom de la file d'attente
const QUEUE_NAME_OWNER = 'user';
const QUEUE_NAME_PAYMENT = 'process_payment';


export async function sendConcertRequest(concertId: string):Promise<any> {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    const replyQueue = await channel.assertQueue('', { exclusive: true });
    console.log(`✅ File temporaire créée : ${replyQueue.queue}`);
    await channel.assertQueue(QUEUE_NAME_CONCERT, { durable: false });
          // Publier la demande de concert
    const correlationId = generateUuid();
    
    channel.sendToQueue(QUEUE_NAME_CONCERT, Buffer.from(concertId), {
      replyTo: replyQueue.queue,
      correlationId,          });
    console.log(`Message envoyé pour le concert ID : ${concertId}`);

    const concert = await new Promise((resolve, reject) => {
      channel.consume(replyQueue.queue, (message) => {
        if (message) {
          if (message.properties.correlationId === correlationId){
            
            const concert = JSON.parse(message.content.toString());
            channel.ack(message);
            resolve(concert);
            console.log('✅ Achat de billet reussis')
          }
          
        }
      }, { noAck: false });
    });
    setTimeout(() => {
      connection.close();
    }, 500);
    return concert;
  } catch (error) {
    console.error('Erreur lors de l envoi du message à RabbitMQ :', error);
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

export async function validateTokenWithUserService(token: string): Promise<{ userId: string } | null> {
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();

  // Déclarer une file d'attente de réponse temporaire
  const replyQueue = await channel.assertQueue('', { exclusive: true });
  console.log(`✅ File temporaire créée : ${replyQueue.queue}`);

  // Envoyer la requête de validation du token
  channel.sendToQueue(QUEUE_NAME_JWT, Buffer.from(token), {
    replyTo: replyQueue.queue,
  });

  console.log('Requête de validation du token envoyée');

  // Attendre la réponse
  const response = await new Promise<{ userId: string } | null>((resolve) => {
    console.log(`📡 Tentative d'enregistrement du consume() sur la file : ${replyQueue.queue}`);
    channel.consume(replyQueue.queue, (message) => {
      console.log(`📡 En attente d'une réponse dans la file : ${replyQueue.queue}`);

      if (message) {
        const response = JSON.parse(message.content.toString());
        channel.ack(message);
        resolve(response);
      }
    }, { noAck: false });
  });

  // Fermer la connexion
  setTimeout(() => {
    connection.close();
  }, 500);

  return response;
}

export async function processPayment(ticketId: string, price: number | null): Promise<boolean> {
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();

  // Déclarer une file d'attente de réponse temporaire
  const replyQueue = await channel.assertQueue('', { exclusive: true });
  const correlationId = generateUuid();
  // Envoyer la requête de paiement
  const paymentRequest = { ticketId, price };
  channel.sendToQueue(QUEUE_NAME_PAYMENT, Buffer.from(JSON.stringify(paymentRequest)), {
    replyTo: replyQueue.queue,
    correlationId,
  });

  console.log(`Requête de paiement envoyée pour le billet ID : ${ticketId}`);

  // Attendre la réponse
  const response = await new Promise<boolean>((resolve) => {
    channel.consume(replyQueue.queue, (message) => {
      if (message) {
        console.log(`📩 Message reçu avec correlationId : ${message.properties.correlationId}`);
        const paymentSuccess = JSON.parse(message.content.toString());
        channel.ack(message);
        resolve(paymentSuccess);
      }
    }, { noAck: false });
  });

  // Fermer la connexion
  setTimeout(() => {
    connection.close();
  }, 500);

  return response;
}

const generateUuid = () => {
  return Math.random().toString() + Math.random().toString() + Math.random().toString();
};