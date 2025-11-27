# Tema IAS

* Comsa Iuliana Violeta
* Master: Management in Tehnologia Informatiei
* Grupa: MTI1-A

---

## Descriere generala

Aplicatia reprezinta un sistem Kanban simplu, similar cu Trello, unde utilizatorii pot crea:

* **Boards**
* **Liste in cadrul unui board**
* **Carduri in interiorul listelor**

Interfata este 100% client-side, insa operatiile CRUD sunt gestionate prin **server actions** Next.js.

Aplicatia foloseste MongoDB pentru persistarea datelor si este impartita in 3 resurse principale:

* **Boards**
* **Lists**
* **Cards**

---

## Functionalitati

### Boards

* Creare board
* Editare nume board
* Stergere board
* Listare boards cu sortare dupa data crearii
* Navigare catre pagina dedicata unui board

### Lists

* Creare lista intr-un board
* Editare titlu lista
* Stergere lista
* Sortare dupa campul `order`

### Cards

* Creare card intr-o lista
* Editare titlu si descriere card
* Stergere card
* Ordine stabilita automat

---

## Tehnologii folosite

* **Next.js 14** (App Router)
* **React 18**
* **TypeScript**
* **MongoDB + Mongoose**
* **Server Actions**
* **TailwindCSS** pentru UI

---

## Structura proiectului

```
app/
├── actions/
│ ├── boardActions.ts
│ ├── listActions.ts
│ └── cardActions.ts
├── layout.tsx
├── page.tsx
├── README.md
├── board/[id]/page.tsx
├── components/
│ ├── BoardList.tsx
│ ├── BoardView.tsx
│ └── ...
models/
├── board.ts
├── list.ts
└── card.ts
db/
└── mongoose.ts
```

---

## Arhitectura backend

Aplicatia foloseste actiuni server-side pentru operatiile CRUD.

### Board actions

* `getBoards()` — returneaza lista de boards
* `getBoard(id)` — returneaza un board
* `createBoard(name)` — creeaza un board
* `updateBoard(id, name)` — editeaza numele
* `deleteBoard(id)` — elimina un board

### List actions

* `getLists(boardId)` — returneaza listele unui board
* `createList(boardId, name)`
* `updateList(id, name)`
* `deleteList(id)`

### Card actions

* `getCards(listId)`
* `createCard(listId, title)`
* `updateCard(id, data)`
* `deleteCard(id)`

Toate sunt definite in directorul **app/actions**.

---

## Frontend

### Board List Page (`BoardList.tsx`)

* Afiseaza toate board-urile
* Ofera interfata pentru CRUD
* Fiecare card de board are butoane pentru edit si delete

### Board Page (`BoardView.tsx`)

* Afiseaza listele si cardurile
* Incarca cardurile pentru fiecare lista
* Permite CRUD pentru liste si carduri

### Card Modal

* Permite editarea titlului
* Permite editarea descrierii

---

## Modele Mongoose

### Board

```
{
  _id: ObjectId,
  name: string,
  createdAt,
  updatedAt
}
```

### List

```
{
  _id: ObjectId,
  name: string,
  boardId: ObjectId,
  order: number,
  createdAt,
  updatedAt
}
```

### Card

```
{
  _id: ObjectId,
  title: string,
  description: string,
  listId: ObjectId,
  order: number,
  createdAt,
  updatedAt
}
```

---

## Deployment
### Vercel
Aplicatia a fost deployata pe Vercel, care ofera suport nativ pentru Next.js si MongoDB Atlas.

Procesul de deployment a inclus urmatorii pasi:
* Importarea repository-ului GitHub in Vercel (https://github.com/Violeta2002/homework-trello-app)
* Selectarea framework-ului Next.js (detectat automat)
* Configurarea variabilelor de mediu (MONGODB_URI)
* Rularea build-ului automat si generarea deployment-ului
* Activarea deploy-urilor continue (orice commit nou declanseaza un nou deploy)

Aplicatia poate fi accesata la urmatorul link public:

[https://homework-trello-app-hpvq.vercel.app](https://homework-trello-app-hpvq.vercel.app)