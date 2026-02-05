# Anonymous Chat Application

System anonimowego czatu w real-time z zapisywaniem wiadomości do pliku JSON.

## Funkcionalności

✅ **Anonimowe wiadomości** - Każdy użytkownik to "Anonymous"  
✅ **Real-time wyświetlanie** - Wiadomości pojawiają się natychmiast  
✅ **Animacje** - Płynne dodawanie i wyświetlanie wiadomości  
✅ **Przechowywanie** - Wszystkie wiadomości zapisane w `SQL/log.json`  
✅ **Responsywny design** - Działa na wszystkich urządzeniach  
✅ **Kolorowe bubble'i** - Wiadomości z różnymi kolorami  
✅ **Avatary** - Dynamiczne avatary dla każdego użytkownika  

## Struktura pliku log.json

```json
{
  "messages": [
    {
      "id": 1,
      "nick": "Anonymous",
      "pic": "https://ui-avatars.com/api/?name=Anonymous&background=667eea&color=fff&size=40",
      "text": "Hello everyone!",
      "timestamp": "2026-02-05T10:30:00.000Z"
    },
    {
      "id": 2,
      "nick": "Anonymous",
      "pic": "https://ui-avatars.com/api/?name=Anonymous&background=76b8ff&color=fff&size=40",
      "text": "Great chat!",
      "timestamp": "2026-02-05T10:31:00.000Z"
    }
  ]
}
```

## Instalacja i Uruchamianie

### 1. Instalacja zależności Node.js

```bash
npm install
```

To zainstaluje:
- `express` - Framework do backendu
- `cors` - Do obsługi cross-origin requests
- `nodemon` - Do development (auto-reload)

### 2. Uruchomienie serwera

```bash
# Production
npm start

# Development z auto-reload
npm run dev
```

Serwer będzie dostępny na: **http://localhost:3000**

### 3. Otwórz aplikację

Przejdź do: `http://localhost:3000/chat.html`

## API Endpoints

### GET `/api/messages`
Pobierz wszystkie wiadomości
```bash
curl http://localhost:3000/api/messages
```

### POST `/api/messages`
Wyślij nową wiadomość
```bash
curl -X POST http://localhost:3000/api/messages \
  -H "Content-Type: application/json" \
  -d '{"nick":"Anonymous","pic":"URL_DO_AVATARA","text":"Moja wiadomość"}'
```

### DELETE `/api/messages/:id`
Usuń konkretną wiadomość
```bash
curl -X DELETE http://localhost:3000/api/messages/1
```

### DELETE `/api/messages`
Usuń wszystkie wiadomości
```bash
curl -X DELETE http://localhost:3000/api/messages
```

### GET `/api/stats`
Pobierz statystyki czatu
```bash
curl http://localhost:3000/api/stats
```

## Pliki projektu

```
CHAT APP/
├── server.js                 # Backend serwera
├── package.json             # Zależności Node.js
├── chat.html                # Strona główna czatu
├── CSS/
│   ├── chat.css            # Stylizacja czatu
│   └── style.css           # Globalny styl
├── JS/
│   └── chat-system.js      # Frontend logika czatu
└── SQL/
    └── log.json            # Przechowywanie wiadomości
```

## Jak to działa

1. **Frontend** (`chat-system.js`):
   - Nasłuchuje na nowe wiadomości
   - Wysyła wiadomości do serwera
   - Wyświetla wiadomości w real-time
   - Aktualizuje co 2 sekundy

2. **Backend** (`server.js`):
   - Express server na porcie 3000
   - Obsługuje GET/POST/DELETE requests
   - Zapisuje wiadomości do JSON
   - Serwuje pliki statyczne

3. **Przechowywanie** (`SQL/log.json`):
   - Plik JSON z historią wiadomości
   - Persystentne przechowywanie
   - Formatowany dla łatwej czytelności

## Customizacja

### Zmienić wygląd avatara
W `JS/chat-system.js` zmień:
```javascript
this.defaultAvatar = 'https://ui-avatars.com/api/?name=Anonymous&background=667eea&color=fff&size=40';
```

### Zmienić kolory bubble'ów
W `CSS/chat.css` zmień gradient colors:
```css
.message-bubble {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%);
}
```

### Zmienić port serwera
W `server.js` zmień:
```javascript
const PORT = 3000; // Zmień tutaj
```

## Wymagania

- Node.js v12+
- npm
- Modern web browser

## Autor

Chat App Team

## Licencja

MIT
