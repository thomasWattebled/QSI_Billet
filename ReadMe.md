<h1> Billet : </h1>

/ticket POST (Billet US2) :{
      ticketId : UUID,
      concertId* : UUID,
      userId* : UUID,
      expired : bool,
      used : bool (Billet US4),
      repayed : bool (Billet US6),
      canceled : bool (Concert RG1)
}

/ticket PUT (Billet US3) :{
      ticketId : UUID
      concertId* : UUID
      userId* : UUID
}

ticket/idTicket GET
/tickets/idConcert GET (Billet US1)
tickets/userId GET (Billet US5)
ticket/repay/ticketId POST (Billet US6)




<Strong>User Stories </Strong>

- Story 1 : En tant qu’Administrateur, je peux représenter les billets de mon concert. 
- Story 2 : En tant qu’Acheteur, je peux acheter un billet, afin d’assister au concert 
- Story 3 : En tant qu’Utilisateur, je peux transférer un billet que je possède, afin de donner mon 
billet à un autre utilisateur 
- Story 4 : En tant qu’utilisateur, je peux utiliser un billet que je possède, afin de signifier mon 
entrée dans le concert. 
- Story 5 : En tant qu’utilisateur, je peux lister mes billets afin de visualiser les concerts auxquels 
je participe 
- Story 6 : En tant qu’Acheteur, je peux me faire rembourser mon billet afin de récupérer l’argent 
utilisé pour payer mon billet



<Strong> Règles de gestion </Strong> 
- RG1 : les identifiants techniques en base de données doivent être au format UUID 
- RG2 : le remboursement du billet n’est possible que jusqu'à 48h avant le début du concert 
- RG3 : le remboursement d’un billet permet à un autre acheteur de racheter la place (= la place 
est de nouveau disponible à l’achat) 