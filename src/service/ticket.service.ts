import { Ticket } from '../entity/ticket.entity';
import { TicketRepository } from '../repository/ticket.repository';
import { PrismaClient,TicketStatus} from '@prisma/client';
import { sendConcertRequest, sendOwnerRequest, processPayment } from '../rabbitMQ/producer';

const prisma = new PrismaClient();

export class TicketsService {
  private ticketsRepository: TicketRepository;

  constructor() {
    this.ticketsRepository = new TicketRepository();
  }

  async getTicketById(ticketId: string): Promise<Ticket | null> {
    return this.ticketsRepository.findTicketById(ticketId);
  }

  /**
   * Achat d'un billet
   */
  async purchaseTicket(concertId: string, userId: string): Promise<Ticket> {
    const concert = await sendConcertRequest(concertId);
    if (!concert) throw new Error('Concert non trouvé');

    if (!concert) throw new Error('Concert introuvable ou supprimé');
    const price = concert.price;
    const ticket =await this.ticketsRepository.createTicket(concertId, userId, price);
    /*const paymentSuccess = await processPayment(ticket.ticketId, ticket.price );

    if (!paymentSuccess) {
      await this.ticketsRepository.deleteTicket(ticket.ticketId);
      throw new Error('Paiement échoué');
    }*/

    return ticket;

  }

  /**
   * Remboursement d'un billet
   */
  async refundTicket(ticketId: string): Promise<Ticket> {
    return this.ticketsRepository.refundTicket(ticketId);
  }

  /**
   * Utilisation d'un billet à l'entrée du concert
   */
  async useTicket(ticketId: string): Promise<Ticket> {
    const ticket = await prisma.ticket.findUnique({
      where: { ticketId, deletedAt: null },
    });
  
    if (!ticket) throw new Error('Billet non trouvé');
    if (ticket.status !== TicketStatus.CREATED) throw new Error('Billet invalide pour l\'entrée');
  
    return prisma.ticket.update({
      where: { ticketId },
      data: { status: TicketStatus.USED }
    });
  }

  /**
   * Annulation d'un billet
   */
  async cancelTicket(ticketId: string): Promise<Ticket> {
    const ticket = await prisma.ticket.findUnique({ where: { ticketId, deletedAt: null } });
    if (!ticket) throw new Error('Billet non trouvé');

    return prisma.ticket.update({
      where: { ticketId },
      data: { status: TicketStatus.CANCELED }
    });
  }

  /**
   * Transfert d'un billet vers un nouvel utilisateur
   */
  async transferTicket(ticketId: string, newOwnerId: string): Promise<Ticket> {
    const ticket = await prisma.ticket.findUnique({ where: { ticketId, deletedAt: null } });
    if (!ticket) throw new Error('Billet non trouvé');
    if (ticket.status !== TicketStatus.CREATED) throw new Error('Transfert impossible');

    // Le nouveau propriétaire existe t-il ?
    const newOwner = await sendOwnerRequest(newOwnerId);
    if (!newOwner) throw new Error('Nouveau propriétaire invalide');

    return prisma.ticket.update({
      where: { ticketId },
      data: { ownerId: newOwnerId }
    });
  }

  /**
   * Expiration automatique d'un billet (exécution via un job planifié)
   */
  async expireTicket(ticketId: string): Promise<Ticket> {
    const ticket = await prisma.ticket.findUnique({ where: { ticketId, deletedAt: null } });
    if (!ticket) throw new Error('Billet non trouvé');

    return prisma.ticket.update({
      where: { ticketId },
      data: { status: TicketStatus.EXPIRED }
    });
  }

  /**
   * Liste des billets d'un utilisateur
   */
  async listTicketsByUser(userId: string): Promise<Ticket[]> {
    return this.ticketsRepository.listTicketsByUser(userId);
  }

  /**
   * Suppression logique d'un billet
   */
  async deleteTicket(ticketId: string): Promise<void> {
    await this.ticketsRepository.deleteTicket(ticketId);
  }
}
