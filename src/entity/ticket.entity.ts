import { TicketStatus } from "@prisma/client";


export class Ticket {
    ticketId: string;
    concertId: string;
    ownerId: string;
    status: TicketStatus;
    isAvailable: boolean;
    price: number | null;
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
        price: number | null,
        updatedAt: Date,
        deletedAt?: Date | null | undefined
    ) {
        this.ticketId = ticketId;
        this.concertId = concertId;
        this.ownerId = ownerId;
        this.status = status;
        this.isAvailable = isAvailable;
        this.createdAt = createdAt;
        this.price = price;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt || null;
    }
}
