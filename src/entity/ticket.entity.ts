export class Ticket {
    ticketId: string;
    concertId: string;
    ownerId: string;
    expired: boolean;
    used: boolean;
    repayed: boolean;
    canceled: boolean;
    createdAt: Date;
  
    constructor(
      ticketId: string,
      concertId: string,
      ownerId: string,
      expired: boolean,
      used: boolean,
      repayed: boolean,
      canceled: boolean,
      createdAt: Date,
    ) {
      this.ticketId = ticketId;
      this.concertId = concertId;
      this.ownerId = ownerId;
      this.expired = expired;
      this.used = used;
      this.repayed = repayed;
      this.canceled = canceled;
      this.createdAt = createdAt;
    }
  }