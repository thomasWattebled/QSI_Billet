import { TicketStatus } from '../enum/ticket-status.enum';

export class Ticket {
    ticketId: string;
    concertId: string;
    ownerId: string;
    status: TicketStatus;
    isAvailable: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;

    constructor(
        ticketId: string,
        concertId: string,
        ownerId: string,
        status: TicketStatus,
        isAvailable: boolean,
        createdAt: Date,
        updatedAt: Date,
        deletedAt?: Date | null
    ) {
        this.ticketId = ticketId;
        this.concertId = concertId;
        this.ownerId = ownerId;
        this.status = status;
        this.isAvailable = isAvailable;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt || null;
    }
}
