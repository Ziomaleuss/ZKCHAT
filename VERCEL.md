Deploying to Vercel — Important notes

1) Persistent storage warning ⚠️
- Vercel serverless functions run on ephemeral instances. Writing to local files (like `SQL/log.json`) will work for a short time on a single instance but is NOT reliable or durable.
- For production use, configure a real database (MongoDB Atlas, Firebase, or Vercel KV).

2) Quick deploy steps
- Install Vercel CLI: `npm i -g vercel` or use the Vercel web UI.
- Add this repo and deploy from root. The provided `vercel.json` maps `/api/messages` to `api/messages.js`.
- If you want persistence, set up a DB and update `api/messages.js` to use that DB instead of the local JSON file.

3) How to switch to Vercel KV (recommended for small-scale)
- Enable Vercel KV in your project and set `USE_KV=true` in project Environment Variables.
- Replace file-based functions in `api/messages.js` with `@vercel/kv` client calls. Example:

  const { kv } = require('@vercel/kv');
  await kv.json.set('messages', messages);

4) How to switch to MongoDB (recommended for production)
- Create a MongoDB Atlas cluster, get connection string, add it as `MONGODB_URI` env var.
- Use `mongodb` or `mongoose` in `api/messages.js` to read/write messages.

5) Local development
- `npm install`
- `npm run dev` to run the Express server locally (`server.js` still works for dev)
- Use `vercel dev` to emulate Vercel functions locally (note ephemeral fs behavior)

6) Testing
- After deploy, test endpoints:
  GET https://your-deployment-url/api/messages
  POST https://your-deployment-url/api/messages {text: 'hi'}

7) Next steps (optional)
- Implement authentication
- Add rate limiting
- Add input sanitization to prevent XSS

If you want, I can update `api/messages.js` to use Vercel KV or MongoDB now — tell me which provider you'd like and I'll implement it. 
