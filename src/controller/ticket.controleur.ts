import { Request, Response } from 'express';
import { TicketsService } from '../service/ticket.service';
import { validateTokenWithUserService } from '../rabbitMQ/validateJWT_Token';


const ticketsService = new TicketsService();


export class TicketsController {

  async getTicket(req: Request, res: Response): Promise<void> {
    const { ticketId } = req.params;

    try {
      const ticket = await ticketsService.getTicketById(ticketId);

      if (!ticket) {
        res.status(404).json({ message: 'Billet non trouvé' });
        return;
      }

      res.status(200).json(ticket);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: 'Erreur lors de la récupération du billet', error: error.message });
      } else {
        res.status(500).json({ message: 'Erreur inconnue lors de la récupération du billet' });
      }
    }
  }


  async purchaseTicket(req: Request, res: Response) {
    const concertId  = req.params.concertId;
    const token = req.headers.authorization?.split(' ')[1]; 
/*
    if (!token) {
      return res.status(401).json({ message: 'Token manquant' });
    }
    try {
      const isValid = await validateTokenWithUserService(token);
      if (!isValid) {
        return res.status(401).json({ message: 'Token invalide' });
      }
      const userId = isValid.userId;*/
      try{
      const ticket = await ticketsService.purchaseTicket(concertId, '1');
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

  async listTickets(req: Request, res: Response): Promise<void> {
      const { userId } = req.params;
  
      try {
        const tickets = await ticketsService.listTicketsByUser(userId);
        res.status(200).json(tickets);
      } catch (error) {
        if (error instanceof Error) {
          res.status(500).json({ message: 'Erreur lors de la récupération des billets', error: error.message });
        } else {
          res.status(500).json({ message: 'Erreur inconnue lors de la récupération des billets' });
        }
      }
    }
  
  async deleteTicket(req: Request, res: Response): Promise<void> {
      const { ticketId } = req.params;
  
      try {
        await ticketsService.deleteTicket(ticketId);
        res.status(204).send(); // 204 No Content
      } catch (error) {
        if (error instanceof Error) {
          if (error.message === 'Billet non trouvé') {
            res.status(404).json({ message: error.message });
          } else {
            res.status(500).json({ message: 'Erreur lors de la suppression du billet', error: error.message });
          }
        } else {
          res.status(500).json({ message: 'Erreur inconnue lors de la suppression du billet' });
        }
      }
    }





}