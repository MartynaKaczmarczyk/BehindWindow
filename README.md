# TransitTales

TransitTales is an AI-powered travel companion for train and bus journeys. It uses the device's current location or a sample railway route to find nearby places, generate short stories about them, and display related images. Stories can be saved to a local SQLite database and managed later.

## Technology

- **Frontend:** Angular 20, TypeScript, Angular Router, RxJS
- **Backend:** Node.js, Express 4, CommonJS
- **Database:** SQLite with `better-sqlite3`
- **External services:** Groq for AI-generated stories, Nominatim for reverse geocoding, and the Wikimedia APIs for nearby places and thumbnails
- **Browser features:** Geolocation, speech synthesis, and an optional YouTube music player

## Notable Implementation Details

- Location lookup and nearby-place search run concurrently; thumbnail lookup and story generation also run concurrently.
- The selected featured place is shared between the AI prompt, API response, and image shown beside the story.
- Saved-story CRUD uses parameterized SQLite queries. The database and table are created automatically on startup at `backend/data/stories.sqlite`.

## API

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/explore?lat=<latitude>&lon=<longitude>` | Find nearby places and generate a travel story |
| `POST` | `/api/stories` | Save a story |
| `GET` | `/api/stories` | List saved stories |
| `GET` | `/api/stories/:id` | Get one saved story |
| `PATCH` | `/api/stories/:id` | Update a story's name or text |
| `DELETE` | `/api/stories/:id` | Delete a saved story |

## Configuration

Create `backend/.env` and add a Groq API key to enable AI-generated stories:

```env
GROQ_API_KEY=your_groq_api_key
```

Without the key, the API returns a short fallback story.

## Run Locally

Install and start the backend in one terminal:

```sh
cd backend
npm install
npm run dev
```

Install and start the Angular development server in a second terminal:

```sh
cd frontend
npm install
npm start
```

Open `http://localhost:4200`. The Angular development proxy forwards `/api` requests to the backend on port `3000`.

To serve the production frontend through Express instead:

```sh
npm --prefix frontend run build
npm --prefix backend start
```

The production app is served at `http://localhost:3000`.
