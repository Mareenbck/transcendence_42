# 🏓 ft_transcendence

> Projet final du tronc commun de l'école 42 - Application web de Pong multijoueur avec chat en temps réel, gestion d'amis et authentification.

Le projet est entièrement conteneurisé avec **Docker**.

## ✨ Fonctionnalités

- 🏓 **Jeu Pong** — Matchmaking et parties en temps réel via WebSockets
- 💬 **Chat en temps réel** — Channels publics/privés, messages directs, commandes d'administration
- 👤 **Profil utilisateur** — Avatar, statistiques de jeu, historique des parties
- 🤝 **Système d'amis** — Ajout/suppression d'amis, statut en ligne/hors-ligne
- 🔐 **Authentification** — Système d'auth sécurisé avec JWT
- ⚙️ **Paramètres** — Personnalisation du profil et des préférences
- 📱 **SPA** — Navigation fluide sans rechargement de page

## 🛠 Stack technique

**Frontend** : React · TypeScript · Vite · Material UI  
**Backend** : NestJS · Prisma · PostgreSQL · Socket.io  
**DevOps** : Docker · Docker Compose

## 📸 Captures d'écran

| Page d'accueil | Accueil connecté |
|:-:|:-:|
| ![Accueil](img/acceuil.png) | ![Accueil 2](img/acceuil2.png) |

| Jeu Pong | Chat |
|:-:|:-:|
| ![Game](img/game.png) | ![Chat](img/chat.png) |

| Profil | Paramètres |
|:-:|:-:|
| ![Profil](img/profil.png) | ![Settings](img/settings.png) |

---

## 📦 Prérequis

- [Docker](https://docs.docker.com/get-docker/) & [Docker Compose](https://docs.docker.com/compose/install/)
- [Make](https://www.gnu.org/software/make/)

---

## 🚀 Lancement

```bash
git clone https://github.com/Mareenbck/transcendence_42v2.git
cd transcendence_42v2
make
```

L'app est accessible sur **http://localhost:8080**

---

## 🔧 Variables d'environnement

Créer un fichier `.env` dans le dossier `api/` avec les variables suivantes :

```env
# Base de données PostgreSQL
POSTGRES_USER=your_user
POSTGRES_PASSWORD=your_password
POSTGRES_DB=your_database
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}

# JWT
JWT_SECRET=your_jwt_secret

# Application
APP_PORT=3000
```



