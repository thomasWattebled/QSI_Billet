import { PrismaClient, TicketStatus } from '@prisma/client';
import { Ticket } from '../entity/ticket.entity';

const prisma = new PrismaClient();

export class TicketRepository {

  async findTicketById(ticketId: string) {
    return prisma.ticket.findUnique({
      where: { ticketId },
    });
  }

  async createTicket(concertId: string, ownerId: string, price:number|null): Promise<Ticket> {
    return prisma.ticket.create({
      data: {
        concertId,
        ownerId,
        price,
        status: TicketStatus.CREATED,
        isAvailable: true
      }
    });
  }

  async getTicketById(ticketId: string): Promise<Ticket | null> {
    return prisma.ticket.findUnique({
      where: { ticketId, deletedAt: null } // Récupère uniquement les tickets actifs
    });
  }

  async updateTicket(ticketId: string, data: Partial<Ticket>): Promise<Ticket> {
    return prisma.ticket.update({
      where: { ticketId, deletedAt: null },
      data
    });
  }

  async refundTicket(ticketId: string): Promise<Ticket> {
    const ticket = await prisma.ticket.findUnique({
      where: { ticketId, deletedAt: null },
    });

    if (!ticket) throw new Error('Billet non trouvé');
    if (ticket.status !== TicketStatus.CREATED) throw new Error('Remboursement impossible');

    const now = new Date();
    /*
    const concertDate = new Date(ticket.concert.date);
    const hoursBeforeConcert = (concertDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursBeforeConcert < 48) throw new Error('Remboursement impossible à moins de 48h du concert');
*/
    return prisma.ticket.update({
      where: { ticketId, deletedAt: null },
      data: { status: TicketStatus.REFUNDED, isAvailable: true } // Permet la revente
    });
  }

  async listTicketsByUser(userId: string): Promise<Ticket[]> {
    return prisma.ticket.findMany({
      where: { ownerId: userId, deletedAt: null }
    });
  }

  async deleteTicket(ticketId: string): Promise<void> {
    await prisma.ticket.update({
      where: { ticketId },
      data: { deletedAt: new Date() } // Suppression logique
    });
  }
}
