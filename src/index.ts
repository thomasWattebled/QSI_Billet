import express, { Request, Response } from 'express';
import { TicketsController } from './controller/ticket.controleur';
import cors from 'cors';

const app = express();
const port = 3030;
const ticketsController = new TicketsController();

const corsOption = {origin: "http://localhost:3001", 
  methods: ["GET", "POST", "PUT", "DELETE"], 
  allowedHeaders: ["Content-Type", "Authorization"] }

app.use(cors(corsOption));
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express!');
});


// Routes pour la gestion des billets
app.get('/tickets/:ticketId', (req, res) => ticketsController.getTicket(req, res));
app.post('/tickets/purchase/:concertId', async function(req :Request, res: Response) {ticketsController.purchaseTicket(req, res)});
app.post('/tickets/:ticketId/refund', (req, res) => ticketsController.refundTicket(req, res));
app.post('/tickets/:ticketId/use', (req, res) => ticketsController.useTicket(req, res));
app.post('/tickets/:ticketId/transfer',  async function(req :Request, res: Response) {console.log("Body reçu :", req.body);
  ticketsController.transferTicket(req, res)});
//app.get('/tickets/:userId', (req, res) => ticketsController.listTickets(req, res));
app.post('/tickets/myTickets', async function(req :Request, res: Response) {ticketsController.listTickets(req, res)});

app.delete('/tickets/:ticketId', (req, res) => ticketsController.deleteTicket(req, res));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});