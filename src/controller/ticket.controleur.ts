import { Request, Response } from 'express';
import { TicketsService } from '../service/ticket.service';

const ticketsService = new TicketsService();

export class TicketsController {
  async purchaseTicket(req: Request, res: Response) {
    const { concertId, userId } = req.body;

    try {
      const ticket = await ticketsService.purchaseTicket(concertId, userId);
      res.status(201).json(ticket);
    } catch (error) {
      if(error instanceof Error){
        if (error.message === 'Concert non trouvé') {
          res.status(404).json({ message: error.message });
        } else {
          res.status(500).json({ message: 'Erreur lors de l achat du billet', error: error.message });
        }
      }
      else {
        res.status(500).json({ message: 'Erreur inconnue lors de l achat du billet' });
      }
      
    }
  }

}