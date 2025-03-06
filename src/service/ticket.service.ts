import amqp from 'amqplib';
import { Ticket } from '../entity/ticket.entity';
import { TicketsRepository } from '../repository/ticket.repository';
import { PrismaClient } from '@prisma/client';

const RABBITMQ_URL = 'amqp://localhost';
const QUEUE_NAME = 'concert';
const prisma = new PrismaClient();


export class TicketsService {
  private ticketsRepository: TicketsRepository;

  constructor() {
    this.ticketsRepository = new TicketsRepository();
  }

  async purchaseTicket(concertId: string, userId: string): Promise<Ticket> {
    // Vérifier si le concert existe via RabbitMQ
    const concert = await this.getConcertInfo(concertId);
    if (!concert) {
      throw new Error('Concert non trouvé');
    }

    const ticket = await this.ticketsRepository.createTicket(concertId, userId);
    return ticket;
  }

  async getConcertInfo(concertId: string): Promise<any> {
    try {
      // Se connecter à RabbitMQ
      const connection = await amqp.connect(RABBITMQ_URL);
      const channel = await connection.createChannel();
      const replyQueue = await channel.assertQueue('', { exclusive: true });

      // Publier la demande de concert
      channel.sendToQueue(QUEUE_NAME, Buffer.from(concertId), {
        replyTo: replyQueue.queue,
      });

      console.log(`Demande envoyée pour le concert ID : ${concertId}`);

      // Attendre la réponse
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
      console.error('Erreur lors de la récupération des informations du concert :', error);
      throw error;
    }
  }

  async refundTicket(ticketId: string): Promise<Ticket> {
    const ticket = await prisma.ticket.findUnique({ where: { ticketId } });
    if (!ticket) {
      throw new Error('Billet non trouvé');
    }
    if (ticket.repayed || ticket.canceled || ticket.used) {
      throw new Error('Billet déjà remboursé ou annulé ou tuilisé');
    }

    const updatedTicket = await prisma.ticket.update({
      where: { ticketId },
      data: { repayed: true, canceled: true },
    });

    return new Ticket(
      updatedTicket.ticketId,
      updatedTicket.concertId,
      updatedTicket.ownerId,
      updatedTicket.expired,
      updatedTicket.used,
      updatedTicket.repayed,
      updatedTicket.canceled,
      updatedTicket.createdAt,
    );
  }


}