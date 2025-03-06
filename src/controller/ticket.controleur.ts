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

  async refundTicket(req: Request, res: Response) {
    const { ticketId } = req.params;
    try {
      const ticket = await ticketsService.refundTicket(ticketId);
      res.status(200).json(ticket);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Billet non trouvé') {
          res.status(404).json({ message: error.message });
        } else if (error.message === 'Billet déjà remboursé ou annulé ou utilisé') {
          res.status(400).json({ message: error.message });
        } else {
          res.status(500).json({ message: 'Erreur lors du remboursement du billet', error: error.message });
        }
      } else {
        res.status(500).json({ message: 'Erreur inconnue lors du remboursement du billet' });
      }
    }
  }

  async useTicket(req: Request, res: Response) {
    const { ticketId } = req.params;
    try {
      const ticket = await ticketsService.useTicket(ticketId);
      res.status(200).json(ticket);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Billet non trouvé') {
          res.status(404).json({ message: error.message });
        } else if (error.message === 'Billet déjà utilisé') {
          res.status(400).json({ message: error.message });
        } else {
          res.status(500).json({ message: 'Erreur lors de l utilisation du billet', error: error.message });
        }
      } else {
        res.status(500).json({ message: 'Erreur inconnue lors de l utilisation du billet' });
      }
    }
  }

  async transferTicket(req: Request, res: Response) {
    const { ticketId } = req.params;
    const { newOwnerId } = req.body;

    try {
      const ticket = await ticketsService.transferTicket(ticketId, newOwnerId);
      res.status(200).json(ticket);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Billet non trouvé') {
          res.status(404).json({ message: error.message });
        } else if (error.message === 'Nouveau propriétaire invalide') {
          res.status(400).json({ message: error.message });
        } else {
          res.status(500).json({ message: 'Erreur lors du transfert du billet', error: error.message });
        }
      } else {
        res.status(500).json({ message: 'Erreur inconnue lors du transfert du billet' });
      }
    }
  }


}