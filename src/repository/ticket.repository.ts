import { PrismaClient } from '@prisma/client';
import { Ticket } from '../entity/ticket.entity';

const prisma = new PrismaClient();

export class TicketsRepository {
  async createTicket(concertId: string, ownerId: string): Promise<Ticket> {
    const ticket = await prisma.ticket.create({
      data: {
        concertId,
        ownerId,
        expired: false,
        used: false,
        repayed: false,
        canceled: false,
      },
    });

    return new Ticket(
      ticket.ticketId,
      ticket.concertId,
      ticket.ownerId,
      ticket.expired,
      ticket.used,
      ticket.repayed,
      ticket.canceled,
      ticket.createdAt,
    );
  }

  async getTicketById(ticketId: string): Promise<Ticket | null> {
    const ticket = await prisma.ticket.findUnique({
      where: { ticketId },
    });

    if (!ticket) return null;

    return new Ticket(
      ticket.ticketId,
      ticket.concertId,
      ticket.ownerId,
      ticket.expired,
      ticket.used,
      ticket.repayed,
      ticket.canceled,
      ticket.createdAt,
    );
  }

  async updateTicket(ticketId: string, data: Partial<Ticket>): Promise<Ticket> {
    const updatedTicket = await prisma.ticket.update({
      where: { ticketId },
      data,
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

  async deleteTicket(ticketId: string): Promise<void> {
    await prisma.ticket.delete({
      where: { ticketId },
    });
  }
}