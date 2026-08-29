## Changelist

- Created Express backend with Socket.IO support
- Implemented real-time messaging between connected users
- Added chat history for newly connected users
- Added username persistence using localStorage
- Added online user counter
- Added join announcements with a 10-minute repeat window
- Added message timestamps
- Added Enter-to-send functionality, with Shift+Enter for a new line
- Added auto-scroll to latest message
- Added own-message highlighting to distinguish sent from received
- Styled chat interface with responsive CSS
- Configured CORS and Express middleware
- Added a /health endpoint for deployment health checks
- Rendered messages with textContent to prevent script injection
- Validated and trimmed usernames on the server
- Capped chat history at 200 messages and message length at 500 characters
- Re-sent the username on every reconnect so messages keep the correct author
- Cleared the message list before replaying history to prevent duplicates
- Loaded the Socket.IO client from a pinned CDN version matching the server
- Moved the backend URL into config.js so the frontend can be hosted separately
- Added a build step to override the backend URL from an environment variable
- Added .gitignore and removed node_modules from version control
- Added netlify.toml and render.yaml to configure both deployments
- Deployed the backend on Render and the frontend on Netlify

## Known limitations

- Messages are stored in memory, so the history resets when the backend restarts
- The backend sleeps after 15 minutes idle on the free tier, so the first load can take around 50 seconds
