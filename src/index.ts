import express, { Request, Response } from 'express';
import { TicketsController } from './controller/ticket.controleur';

const app = express();
const port = 3030;
const ticketsController = new TicketsController();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express!');
});

// Routes pour la gestion des billets
app.post('/tickets/purchase', (req, res) => ticketsController.purchaseTicket(req, res));
app.post('/tickets/:ticketId/refund', (req, res) => ticketsController.refundTicket(req, res));
app.post('/tickets/:ticketId/use', (req, res) => ticketsController.useTicket(req, res));
app.post('/tickets/:ticketId/transfer', (req, res) => ticketsController.transferTicket(req, res));
app.get('/tickets/:userId', (req, res) => ticketsController.listTickets(req, res));
app.delete('/tickets/:ticketId', (req, res) => ticketsController.deleteTicket(req, res));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});