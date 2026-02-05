# API Documentation

## Base URL
```
http://localhost:3000
```

## Endpoints

### 1. GET /api/messages
**Pobierz wszystkie wiadomości**

**Request:**
```bash
curl http://localhost:3000/api/messages
```

**Response:**
```json
{
  "messages": [
    {
      "id": 1,
      "nick": "Anonymous",
      "pic": "https://ui-avatars.com/api/?name=Anonymous&background=667eea&color=fff&size=40",
      "text": "Hello!",
      "timestamp": "2026-02-05T10:00:00.000Z"
    }
  ]
}
```

---

### 2. POST /api/messages
**Wyślij nową wiadomość**

**Request:**
```bash
curl -X POST http://localhost:3000/api/messages \
  -H "Content-Type: application/json" \
  -d '{
    "nick": "Anonymous",
    "pic": "https://ui-avatars.com/api/?name=Anonymous&background=667eea&color=fff&size=40",
    "text": "My message",
    "timestamp": "2026-02-05T10:00:00.000Z"
  }'
```

**Request Body:**
```json
{
  "nick": "Anonymous",           // Optional, default: "Anonymous"
  "pic": "URL_TO_AVATAR",       // Optional, default: auto-generated
  "text": "Message text",        // Required, max 500 chars
  "timestamp": "ISO_STRING"     // Optional, default: current time
}
```

**Response:**
```json
{
  "success": true,
  "message": {
    "id": 1,
    "nick": "Anonymous",
    "pic": "https://...",
    "text": "My message",
    "timestamp": "2026-02-05T10:00:00.000Z"
  }
}
```

**Status Codes:**
- `201 Created` - Wiadomość dodana pomyślnie
- `400 Bad Request` - Pusty tekst wiadomości
- `500 Server Error` - Błąd serwera

---

### 3. DELETE /api/messages/:id
**Usuń konkretną wiadomość**

**Request:**
```bash
curl -X DELETE http://localhost:3000/api/messages/1
```

**Response:**
```json
{
  "success": true,
  "message": "Message deleted"
}
```

**Status Codes:**
- `200 OK` - Wiadomość usunięta
- `404 Not Found` - Wiadomość nie istnieje
- `500 Server Error` - Błąd serwera

---

### 4. DELETE /api/messages
**Usuń wszystkie wiadomości**

**Request:**
```bash
curl -X DELETE http://localhost:3000/api/messages
```

**Response:**
```json
{
  "success": true,
  "message": "All messages cleared"
}
```

**Status Codes:**
- `200 OK` - Wszystkie wiadomości usunięte
- `500 Server Error` - Błąd serwera

---

### 5. GET /api/stats
**Pobierz statystyki czatu**

**Request:**
```bash
curl http://localhost:3000/api/stats
```

**Response:**
```json
{
  "totalMessages": 42,
  "messagesPerUser": {
    "Anonymous": 42
  }
}
```

---

## Message Object

```typescript
{
  id: number,              // Unique message ID
  nick: string,            // Username (default: "Anonymous")
  pic: string,             // Avatar URL
  text: string,            // Message content (max 500 chars)
  timestamp: string        // ISO 8601 timestamp
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Message cannot be empty"
}
```

### 404 Not Found
```json
{
  "error": "Message not found"
}
```

### 500 Server Error
```json
{
  "error": "Failed to read messages"
}
```

## Testing with JavaScript

```javascript
// Fetch all messages
fetch('/api/messages')
  .then(res => res.json())
  .then(data => console.log(data));

// Send a message
fetch('/api/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    nick: 'Anonymous',
    text: 'Hello!'
  })
})
  .then(res => res.json())
  .then(data => console.log(data));

// Delete message
fetch('/api/messages/1', {
  method: 'DELETE'
})
  .then(res => res.json())
  .then(data => console.log(data));

// Clear all
fetch('/api/messages', {
  method: 'DELETE'
})
  .then(res => res.json())
  .then(data => console.log(data));
```

## Testing with Postman

1. Import these endpoints into Postman
2. Create new requests for each method
3. Set request body for POST requests
4. Send and verify responses

## Rate Limiting

Currently no rate limiting is implemented. In production, consider adding:
- IP-based rate limiting
- Message count limits per minute
- Max message length validation

## CORS

CORS is enabled for all origins. In production, restrict to specific domains:

```javascript
app.use(cors({
  origin: 'https://yourdomain.com'
}));
```

## Data Persistence

All messages are stored in `SQL/log.json` as plain text JSON.

**Backup recommendations:**
- Regular backups of `log.json`
- Version control with Git
- Consider database migration for production

## Performance

- Max message length: 500 characters
- Frontend polls API every 2 seconds
- No message pagination (may need optimization for 1000+ messages)

---

**Last Updated:** February 5, 2026
