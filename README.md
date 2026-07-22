# 🤖 𝗗𝗥𝗨𝗭𝗭 𝗫𝗗 - Free WhatsApp XD bot

𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽 𝗯𝗼𝘁 𝗯𝘂𝗶𝗹𝘁 𝗼𝗻 [@whiskeysockets/baileys](https://github.com/WhiskeySockets/Baileys).
Dev **DRUZZ** — Version **2.1.0**

---

## ⚙️ Installation on Pterodactyl

### 1. Create a server
- Egg type: **Node.js**
- Node version: **18, 20, 22 or 24**
- Start command: `node index.js`

### 2. Upload the files
Upload the contents of this zip to the server's root directory.

### 3. Configure
- Rename `.env.example` to `.env` (or edit the included `.env`)
- Put your number in `NUMBER=18294383885`

### 4. Install dependencies
```bash
npm install
```
`ffmpeg` must also be installed on the server/host for `.sticker` to work (e.g. `apt install ffmpeg`).

### 5. Start
```bash
npm start
```

---
```
## 📱 Connecting WhatsApp

**Option 1 — Druzz Pairing website (default, USE_QR=false, PAIRING_MODE=web)**
- Start the bot (`npm start`) and open `http://localhost:3000` (or your deployed URL)
- Enter your WhatsApp number with the `+` sign and tap **Generate pairing code**
- The website calls the bot's real `requestPairingCode()` function and shows the code live
- Go to WhatsApp > Linked Devices > Link a Device > Link with phone number instead > Enter the code

**Option 2 — Console pairing code (legacy, set `PAIRING_MODE=console`)**
- On startup, an 8-character code is shown in the console instead
- Go to WhatsApp > Linked Devices > Link a Device > Enter the code

**Option 3 — QR Code (USE_QR=true)**
- A QR code is shown in the console
- Scan it with WhatsApp
```
The session is saved in `/auth_baileys` — no need to re-scan on restart.

---

## 🌐 Druzz Pairing website

A dark-themed, glassmorphism pairing website ships in `web/public/` and is served automatically by `index.js` on the same process/port as the bot — no separate server to run.

### Cross-host compatibility notes
Two Node-version-dependent issues were fixed so the bot runs identically on Pterodactyl, Railway, Render, or a VPS regardless of the host's exact Node build:
- **`crypto is not defined`** — Baileys' pairing-code generation uses the global Web Crypto API, only exposed automatically from Node 20+. `index.js` now polyfills `globalThis.crypto` from `node:crypto`'s `webcrypto` export at the very top of the file, so it works on any Node ≥16.
- **`SyntaxError: Named export 'proto' not found`** — Node's static CJS→ESM export detection is inconsistent across builds for Baileys' CommonJS output. Baileys is now loaded via `createRequire()` instead of a static `import { ... }`, which always returns the real `module.exports` regardless of that detection.


### How it works
- `index.js` keeps a live reference to the active Baileys socket (`sock`) and its auth state.
- `POST /api/pair` (body: `{ "number": "+18095551234" }`) calls **the exact same** `sock.requestPairingCode(number, "DRUZZXD1")` used by the original console flow — nothing is re-implemented or faked.
- `GET /api/status` reports `{ ready, registered, mode }` so the UI knows whether the bot is up and whether it's already linked.
- A Socket.IO channel pushes `status` updates and a `paired` event the instant the device finishes linking, so the website updates in real time without polling.

### Configuration (`.env`)
| Variable | Default | Description |
|---|---|---|
| `PAIRING_MODE` | `web` | `web` = website generates the code, `console` = original readline prompt |
| `WEB_PAIRING_ENABLED` | `true` | Set to `false` to disable the website entirely |
| `PORT` | `3000` | Port the website/API listens on (Railway/Render set this automatically) |

### Run locally
```bash
npm install
cp .env.example .env   # then edit values, especially NUMBER
npm start
```
Open `http://localhost:3000`.

### Deploy on Railway
1. Push this project to a GitHub repo and create a new Railway project from it (or `railway init` + `railway up` from the CLI).
2. Railway auto-detects Node.js and runs `npm install` then `npm start`.
3. In **Variables**, add the contents of `.env.example` (Railway injects `PORT` automatically — don't hardcode it).
4. Once deployed, open the Railway-provided public URL to reach the pairing website.
5. Because the filesystem is ephemeral on redeploys, consider a Railway **Volume** mounted at `/auth_baileys` if you want the session to survive redeploys.

### Deploy on Render
1. Create a new **Web Service** from your GitHub repo.
2. Build command: `npm install` · Start command: `npm start`.
3. Environment: Node · Add the variables from `.env.example` (Render also injects `PORT` automatically).
4. Under **Disks**, add a persistent disk mounted at `/auth_baileys` if you want the session to survive restarts (Render's default filesystem is ephemeral).
5. Deploy, then open the service URL to reach the pairing website.

### Deploy on a VPS
```bash
git clone <your-repo-url>
cd "DENTSUS MD V1"
npm install
cp .env.example .env && nano .env
sudo apt install -y ffmpeg   # required for .sticker
npm install -g pm2
pm2 start index.js --name druzz-xd
pm2 save && pm2 startup
```
Open a firewall port for `PORT` (default `3000`), or put Nginx in front of it as a reverse proxy with TLS (recommended for a public pairing page):
```nginx
server {
    listen 80;
    server_name your-domain.com;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```
Then run `sudo certbot --nginx` for HTTPS.

---

## 📋 Available commands (prefix `.`)

| Command | Description |
|---|---|
| `.menu` | Main menu with audio |
| `.ping` | Bot latency |
| `.infos` | Bot system info |
| `.owner` | Owner contact info |
| `.whois @` | Info about a user |
| `.device @` | Checks whether a number is on WhatsApp (device count is not exposed by the API) |
| `.sticker` | Convert image/video to sticker |
| `.save` | Save a piece of media |
| `.photo` | Sticker → image |
| `.url` | Media → URL (catbox.moe) |
| `.vv` | Reveal a view-once message |
| `.delete` | Delete a message |
| `.add 1xxxxxxxxxx` | Add a member |
| `.kick @` | Remove a member |
| `.kickall` | Remove all non-admin members |
| `.promote @` | Promote to admin |
| `.demote @` | Demote an admin |
| `.promoteall` | Promote everyone to admin |
| `.demoteall` | Demote every admin |
| `.tagall` | Mention everyone |
| `.tag <msg>` | Send a message tagging everyone |
| `.tagadmin` | Mention the admins |
| `.gclink` | Group invite link |
| `.infosgroups` | Group info |
| `.listonline` | Members currently detected as online (best-effort; see command notes) |
| `.mute` | Close the group (read-only) |
| `.unmute` | Open the group |
| `.mute-time MM:SS` | Close the group after a delay |
| `.settimeg HH:MM open/close` | Schedule daily open/close |
| `.writetoall <msg>` | Send a message to all group members individually |
| `.purge [n]` | Delete the last n tracked messages (default 10, max 50) |
| `.left` | Make the bot leave the group |
| `.principal` | Tag the group creator |
| `.setpp` | Change the bot's profile picture |
| `.setppg` | Change the group's profile picture |
| `.autorecording on/off` | Simulate recording audio |
| `.wasted @` | Wasted effect + removal |
| `.setsudo 1xxxxxxxxxx` | Add a sudo user |
| `.delsudo 1xxxxxxxxxx` | Remove a sudo user |
| `.listsudo` | List sudo users |
| `.antilink on/off` | Anti-link protection in groups |
| `.antispam on/off` | Anti-spam protection |
| `.antibot on/off` | Anti-bot protection (requires KNOWN_BOT_NUMBERS in .env) |
| `.antidemote on/off` | Anti admin-demotion protection |
| `.antipromote on/off` | Anti admin-promotion protection |
| `.warnadmin on/off` | Alerts on admin changes |
| `.autojoin on/off/status` | Auto-follow official newsletters |
| `!protect` | Show/toggle all protections at once (owner/sudo only) |

---

## 📁 File structure


> *𝗗𝗥𝗨𝗭𝗭 𝗫𝗗/*
*├── index.js          — Main entry point (bot + pairing website server)*
*├── protections.js    — Protection system*
*├── commands/         — All commands*
*├── web/*
*│   └── public/       — Druzz Pairing website (HTML/CSS/JS)*
*│       ├── index.html*
*│       ├── css/style.css*
*│       └── js/app.js*
*├── auth_baileys/     — WhatsApp session (auto-created)*
*├── temp/             — Temporary files (auto-created)*
*├── sudo.json         — Sudo user list*
*├── .env              — Environment variables*
*├── .env.example      — Environment variable reference*
*└── package.json*
---

##👑 Owners
[𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣](+18294383885)
[𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 ²](+18095120668)
[𝗧𝗘𝗟𝗘𝗚𝗥𝗔𝗠](https://t.me/druzzdev2)

## 🌐 Official Channels
- [𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽 𝗰𝗵𝗮𝗻𝗻𝗲𝗹](https://whatsapp.com/channel/0029VbCMDOSFnSzHxgIjpw06)
- [𝗧𝗲𝗹𝗲𝗴𝗿𝗮𝗺](https://t.me/addlist/iGKr8KgOirwzNzYx)

---

## 🛠️ What was fixed in this version

- Translated the entire bot (UI messages, console logs, comments, README) from French to English.
- `.env` variable names `PREFIXE`/`DOSSIER_AUTH` renamed to `PREFIX`/`AUTH_DIR`.
- `removeSudo()` no longer always reports success — `.delsudo` now correctly tells you if a number wasn't in the sudo list.
- `!protect` is now restricted to the owner/sudo (previously anyone, anywhere, could toggle group protections).
- Fixed a comparison bug in `!protect` that always displayed "disabled" regardless of the actual new state.
- `autoLikeStatus` now actually reacts to contacts' WhatsApp statuses instead of being a toggle with no effect.
- `.listonline` now uses a live presence tracker instead of a non-existent `natsu.chats` store, so it can actually report members.
- `.purge` now really deletes tracked messages instead of only printing "Purging...".
- `.device` no longer spams the target with visible "check" messages; it now does a clean WhatsApp-registration check.
- `.wasted` now points at the correct API host (`api.some-random-api.com`) instead of a domain that never resolved to the API.
- `.sticker` gives a clear message if `ffmpeg` isn't installed instead of a raw error.
- Removed 8 commands from `.menu` that were advertised but never implemented (`play`, `tiktok`, `tik2`, `youtube`, `countryinfos`, `fancy`, `meteo`, `blur`), and added the ones that existed but weren't listed (`purge`, `writetoall`, `autojoin`, `setppg`, `settimeg`, `url`).
