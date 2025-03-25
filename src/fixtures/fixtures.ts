import { TicketStatus } from '@prisma/client';
import { Ticket } from '../entity/ticket.entity';

export const ticketMock = new Ticket(
  'ticket-id',
  'concert-id',
  'user-id',
  TicketStatus.CREATED,
  true,
  new Date(),
  40,
  new Date(),
  null
);
