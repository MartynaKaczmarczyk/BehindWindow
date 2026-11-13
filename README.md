# BehindWindow
What is behind the window? — AI-powered travel companion for public transport.  A lightweight full-stack app that automatically tracks your GPS during a train or bus ride, fetches nearby locations and uses AI to generate engaging stories about the places passing by your window.

## Uruchomienie lokalne

Zainstaluj zależności backendu i uruchom serwer:

```powershell
cd backend
npm install
npm start
```

W drugim terminalu uruchom Angulara w trybie developerskim:

```powershell
cd frontend
npm install
npm start
```

Aplikacja developerska jest dostępna pod adresem `http://localhost:4200`. Jej konfiguracja proxy przekazuje `/api` do backendu na porcie 3000.

Aby serwować zbudowany frontend bezpośrednio przez Express:

```powershell
npm --prefix frontend run build
npm --prefix backend start
```

W tym trybie aplikacja jest dostępna pod adresem `http://localhost:3000`.
