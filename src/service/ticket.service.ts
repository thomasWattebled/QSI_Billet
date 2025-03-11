import { Ticket } from '../entity/ticket.entity';
import { TicketsRepository } from '../repository/ticket.repository';
import { PrismaClient } from '@prisma/client';
import { sendConcertRequest, sendOwnerRequest} from '../rabbitMQ/producer'

const prisma = new PrismaClient();


export class TicketsService {
  private ticketsRepository: TicketsRepository;

  constructor() {
    this.ticketsRepository = new TicketsRepository();
  }

  async purchaseTicket(concertId: string, userId: string): Promise<Ticket> {
    // Vérifier si le concert existe via RabbitMQ
    const concert = await sendConcertRequest(concertId);
    if (!concert) {
      throw new Error('Concert non trouvé');
    }

    const ticket = await this.ticketsRepository.createTicket(concertId, userId);
    return ticket;
  }


  async refundTicket(ticketId: string): Promise<Ticket> {
    const ticket = await prisma.ticket.findUnique({ where: { ticketId } });
    if (!ticket) {
      throw new Error('Billet non trouvé');
    }
    if (ticket.repayed || ticket.canceled || ticket.used) {
      throw new Error('Billet déjà remboursé ou annulé ou tuilisé');
    }

    const updatedTicket:Ticket = await prisma.ticket.update({
      where: { ticketId },
      data: { repayed: true, canceled: true },
    });

    return updatedTicket;
  }

  async useTicket(ticketId: string): Promise<Ticket> {
    const ticket = await prisma.ticket.findUnique({ where: { ticketId } });
    if (!ticket) {
      throw new Error('Billet non trouvé');
    }
    if (ticket.used) {
      throw new Error('Billet déjà utilisé');
    }
    const updatedTicket:Ticket = await prisma.ticket.update({
      where: { ticketId },
      data: { used: true },
    });
    return updatedTicket;
  }


  async transferTicket(ticketId: string, newOwnerId: string): Promise<Ticket> {
    const ticket = await prisma.ticket.findUnique({ where: { ticketId } });
    if (!ticket) {
      throw new Error('Billet non trouvé');
    }

    const newOwner = await await sendOwnerRequest(newOwnerId);
    if (!newOwner) {
      throw new Error('Nouveau propriétaire invalide');
    }

    await prisma.ticket.update({
      where: { ticketId },
      data: { canceled: true },
    });

    const newTicket:Ticket = await this.ticketsRepository.createTicket(ticket.concertId, newOwnerId);
    return newTicket;
  }


}