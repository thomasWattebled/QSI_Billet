import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Lister tous les billets disponibles
export const getTickets = async (req: Request, res: Response) => {
  try {
    const tickets = await prisma.ticket.findMany({
      where: { expired: false, canceled: false },
    });
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des billets', error });
  }
};

// Acheter un billet
export const purchaseTicket = async (req: Request, res: Response) => {
  const { concertId, userId } = req.body;

  try {
    // Vérifier si le concert existe
    const concert = await prisma.concert.findUnique({ where: { concertId: concertId } });
    if (!concert) {
      return res.status(404).json({ message: 'Concert non trouvé' });
    }

    // Créer un nouveau billet
    const ticket = await prisma.ticket.create({
      data: {
        concertId: concert.id,
        ownerId: userId,
        expired: false,
        used: false,
        repayed: false,
        canceled: false,
      },
    });

    res.status(201).json(ticket);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de l achat du billet', error });
  }
};


