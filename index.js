// Polyfill the global Web Crypto API (globalThis.crypto). Node only exposes
// it globally by default from v20 onward; on older Node builds (seen on
// Railway) it's undefined, and Baileys' pairing-code generation (which uses
// crypto.getRandomValues/crypto.subtle internally) throws
// "ReferenceError: crypto is not defined" the moment a pairing code is
// requested. node:crypto has exported `webcrypto` since Node 16, so this
// works on every supported Node version regardless of host.
import { webcrypto } from "crypto";
if (!globalThis.crypto) globalThis.crypto = webcrypto;

// Loaded via createRequire (raw CommonJS), NOT a static ESM import.
// @whiskeysockets/baileys ships as CommonJS, and Node relies on a static
// analyzer (cjs-module-lexer) to guess which of its properties can be used
// as ESM named imports. That analyzer's behavior differs across Node
// versions/builds: it worked fine on one host but on Railway's Node build it
// failed to detect `proto`, crashing at startup with
// "SyntaxError: Named export 'proto' not found" before the app even ran.
// require() sidesteps that guesswork completely and always returns the real
// module.exports object, so this works identically on every Node version/host.
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const {
  makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  DisconnectReason,
  isJidBroadcast,
  proto,
} = require("@whiskeysockets/baileys");
import chalk from "chalk";
import fs from "fs";
import path from "path";
import readline from "readline";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import express from "express";
import http from "http";
import { Server as IOServer } from "socket.io";
import { initProtections } from "./protections.js";
import { isAutoRecording } from "./commands/autorecording.js";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = {
  PREFIX: process.env.PREFIX || ".",
  AUTH_DIR: process.env.AUTH_DIR || "auth_baileys",
  USE_QR: process.env.USE_QR === "true",
  RECONNECT_DELAY: parseInt(process.env.RECONNECT_DELAY) || 5000,
  // "web"     -> pairing code is requested from the Druzz Pairing website (default)
  // "console" -> restores the original behaviour (readline prompt in the terminal)
  PAIRING_MODE: (process.env.PAIRING_MODE || "web").toLowerCase(),
  WEB_ENABLED: process.env.WEB_PAIRING_ENABLED !== "false",
  WEB_PORT: parseInt(process.env.PORT || process.env.WEB_PORT) || 3000,
};

export const BOT_NAME = "𝗗𝗥𝗨𝗭𝗭 𝗫𝗗";
export const BOT_VERSION = "2.1.0";
export const BOT_DEV = "𝗗𝗥𝗨𝗭𝗭";
export const OWNER_NUMBERS = ["18294383885", "18095120668"];
export const OWNER_NAMES = { "18294383885": "Druzz", "18095120668": "Druzz 2" };
export const CHANNELS = {
  whatsapp1: "https://whatsapp.com/channel/0029VbCMDOSFnSzHxgIjpw06",
  whatsapp2: "https://whatsapp.com/channel/0029VbCUwnAKAwEgGdiASA0F",
  telegram1: "https://t.me/Sourcode",
  telegram2: "https://t.me/addlist/iGKr8KgOirwzNzYx",
};
export const NEWSLETTER_IDS = [
  "120363424818286187@newsletter",
];
export const BOT_IMAGE = "https://files.catbox.moe/7jnf9r.jpg";
export const MENU_AUDIO = "https://files.catbox.moe/ubfeuo.m4a";

// Simple logger without pino-pretty (Pterodactyl-compatible, no worker threads)
const log = {
  info:  (...a) => console.log("[INFO]",  ...a),
  warn:  (...a) => console.log("[WARN]",  ...a),
  error: (...a) => console.log("[ERROR]", ...a),
};
// Silent logger for Baileys (avoids internal log spam)
const silentLogger = {
  level: "silent", child: () => silentLogger,
  info: ()=>{}, warn: ()=>{}, error: ()=>{},
  debug: ()=>{}, trace: ()=>{}, fatal: ()=>{},
};

// ---------------------------------------------------------------------------
// Live references to the current Baileys session, shared with the pairing
// website below. `sock` / `authStateRef` are (re)assigned every time
// startBot() (re)creates the connection, so the web layer always talks to
// whichever session is currently active.
// ---------------------------------------------------------------------------
let sock = null;
let authStateRef = null;
let ioRef = null;

export function getBotStatus() {
  return {
    ready: !!sock && typeof sock.requestPairingCode === "function",
    registered: !!authStateRef?.creds?.registered,
    mode: config.PAIRING_MODE,
  };
}

function emitStatus() {
  try { ioRef?.emit("status", getBotStatus()); } catch {}
}

// Called by the /api/pair route. Reuses the exact same
// `sock.requestPairingCode(...)` call the console flow uses below —
// no separate/fake pairing implementation.
export async function requestPairingCodeFromWeb(rawNumber) {
  console.log("📲 Request received:", rawNumber);

  if (!sock || typeof sock.requestPairingCode !== "function") {
    throw new Error("Bot not ready");
  }

  const number = normalizeNumber(rawNumber);
  console.log("📞 Normalized:", number);

  const code = await sock.requestPairingCode(number, "DRUZZXD1");

  console.log("✅ Generated code:", code);

  return code;
}

function startWebServer() {
  ...
  app.post("/api/pair", async (req, res) => {
      ...
  });
}
    const { number } = req.body || {};
    try {
      const code = await requestPairingCodeFromWeb(number);
      log.info("🔑 Pairing code issued via website for " + normalizeNumber(number));
      res.json({ success: true, code });
    } catch (e) {
      res.status(400).json({ success: false, message: e?.message || "Failed to generate pairing code." });
    }
  });

  // Friendly fallback for unknown API routes
  app.use("/api", (req, res) => res.status(404).json({ success: false, message: "Not found" }));

  const httpServer = http.createServer(app);
  ioRef = new IOServer(httpServer, { cors: { origin: "*" } });
  ioRef.on("connection", (socket) => {
    socket.emit("status", getBotStatus());
  });

  httpServer.listen(config.WEB_PORT, () => {
    log.info(`🌐 Druzz Pairing website running on port ${config.WEB_PORT}`);
  });
}

const SUDO_FILE = "./sudo.json";
export function loadSudo() {
  if (!fs.existsSync(SUDO_FILE)) return [];
  try { return JSON.parse(fs.readFileSync(SUDO_FILE, "utf-8")); } catch { return []; }
}
export function saveSudo(list) { fs.writeFileSync(SUDO_FILE, JSON.stringify(list, null, 2)); }
export function addSudo(num) {
  const s = new Set(loadSudo()); s.add(num); saveSudo([...s]); return [...s];
}
// BUGFIX: previously this always returned an array (truthy), so delsudo.js's
// `updated !== false` check always reported success even when the number was
// never in the sudo list. Now it returns `false` when nothing was removed.
export function removeSudo(num) {
  const list = loadSudo();
  if (!list.includes(num)) return false;
  const updated = list.filter((n) => n !== num);
  saveSudo(updated);
  return updated;
}
export function isSudo(num) { return loadSudo().includes(num); }
export function isOwnerOrSudo(num) {
  const owners = (global.owners || OWNER_NUMBERS).map(getBareNumber);
  return owners.includes(num) || isSudo(num);
}

export function normalizeJid(jid) {
  if (!jid) return null;
  const bare = String(jid).trim().split(":")[0];
  return bare.includes("@") ? bare : bare + "@s.whatsapp.net";
}
export function getBareNumber(jid) {
  if (!jid) return "";
  return String(jid).split("@")[0].split(":")[0].replace(/[^0-9]/g, "");
}
export function normalizeNumber(raw) {
  if (!raw) return null;
  const n = String(raw).replace(/[^0-9]/g, "");
  return n.length >= 7 ? n : null;
}

function pickText(message) {
  if (!message) return;
  return (
    message.conversation ||
    message.extendedTextMessage?.text ||
    message.imageMessage?.caption ||
    message.videoMessage?.caption ||
    message.buttonsResponseMessage?.selectedButtonId ||
    message.listResponseMessage?.singleSelectReply?.selectedRowId ||
    message.templateButtonReplyMessage?.selectedId ||
    message.interactiveResponseMessage?.text
  );
}

function unwrapMessage(msg) {
  return (
    msg?.viewOnceMessage?.message ||
    msg?.viewOnceMessageV2?.message ||
    msg?.ephemeralMessage?.message ||
    msg?.documentWithCaptionMessage?.message ||
    msg
  );
}

function showBanner() {
  try { console.clear(); } catch {}
  console.log("\n=============================================");
  console.log("   𝗗𝗥𝗨𝗭𝗭 𝗫𝗗  -  𝗦𝗬𝗦𝗧𝗘𝗠 𝗢𝗡𝗟𝗜𝗡𝗘  ⚡");
  console.log("   WhatsApp Bot Baileys + Node.js");
  console.log("=============================================\n");
}

// Ask for the phone number in the console (no .env)
function askNumberConsole() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    console.log("\n╔═══════════════════════════════════════════╗");
    console.log("║   📱  ENTER YOUR WHATSAPP NUMBER          ║");
    console.log("║   International format, no +              ║");
    console.log("║   Example: 509 𝘅𝘅𝘅 𝘅𝘅𝘅𝘅                ║");
    console.log("╚═══════════════════════════════════════════╝");
    rl.question("  >> Number: ", (answer) => {
      rl.close();
      const clean = answer.replace(/[^0-9]/g, "");
      if (clean.length < 7) {
        console.log("❌ Invalid number. Restart and try again.");
        resolve(null);
      } else {
        resolve(clean);
      }
    });
  });
}

// 8-character alphanumeric pairing code (NO QR)
async function askPairingCode(natsu) {
  if (typeof natsu.requestPairingCode !== "function") {
    console.log("⚠️  requestPairingCode not available");
    return;
  }
  const number = await askNumberConsole();
  if (!number) return;
  try {
    const code = await natsu.requestPairingCode(number, "DRUZZXD1");
    const show = () => {
      console.log("\n╔═══════════════════════════════════════════╗");
      console.log("║   🔑  𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗟𝗜𝗡𝗞𝗜𝗡𝗚 𝗖𝗢𝗗𝗘               ║");
      console.log("║                                           ║");
      console.log("║     >>>  " + String(code) + "  <<<             ║");
      console.log("║                                           ║");
      console.log("║  𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽 > 𝗟𝗶𝗻𝗸𝗲𝗱 𝗗𝗲𝘃𝗶𝗰𝗲𝘀 >              ║");
      console.log("║  𝗟𝗶𝗻𝗸 𝗮 𝗗𝗲𝘃𝗶𝗰𝗲 > 𝗘𝗻𝘁𝗲𝗿 𝗰𝗼𝗱𝗲               ║");
      console.log("╚═══════════════════════════════════════════╝\n");
    };
    show();
    const iv = setInterval(show, 15000);
    setTimeout(() => clearInterval(iv), 120000);
    return code;
  } catch (err) {
    console.log("❌ ᴘᴀɪʀɪɴɢ ᴄᴏᴅᴇ ғᴀɪʟᴇᴅ: " + (err?.message ?? err));
  }
}

async function autoFollowNewsletters(natsu) {
  for (const newsletterId of NEWSLETTER_IDS) {
    try {
      if (typeof natsu.newsletterFollow === "function")
        await natsu.newsletterFollow(newsletterId);
    } catch {}
  }
}

const emojiMap = {
  menu: "🇭🇹", ping: "🏓", infos: "🗒️", owner: "👑", device: "📱",
  delete: "🗑️", vv: "👁️", whois: "🖼️", setpp: "🖼️", autorecording: "🎙️",
  sticker: "🖼️", save: "💾", photo: "🖼️", url: "🔗", add: "👥",
  kick: "❌", kickall: "😼", tagall: "🌍", tag: "👥", tagadmin: "👑",
  promote: "↗️", demote: "↘️", demoteall: "↘️", promoteall: "↗️",
  gclink: "🔗", left: "👋", mute: "🔇", unmute: "🔊", purge: "⚜️",
  principal: "👑", setppg: "🖼️", settimeg: "⏰", writetoall: "📣",
  wasted: "💀", antibot: "🤖", antidemote: "⚜️", antilink: "🔗",
  antipromote: "⚜️", antispam: "✅", warnadmin: "⚔️", listonline: "🟢",
  delsudo: "❌", listsudo: "📋", setsudo: "✅", "mute-time": "⏰",
};

// Message cache to avoid Bad MAC errors (Baileys retry)
const msgStore = new Map();

// Presence tracker used by .listonline (fixes the command: natsu.chats does not
// exist without a full store, so "online" was always empty before).
global.presenceStore = new Map(); // jid -> { lastKnown: "available"|"composing"|..., updatedAt: number }

// Per-chat recent message keys, used by .purge to actually delete messages
// (previously .purge only sent a text saying it was purging, without deleting anything).
global.recentByChat = new Map(); // chatJid -> [{ id, participant, fromMe }]
const RECENT_PER_CHAT_LIMIT = 200;
function trackRecentMessage(msg) {
  const chatJid = msg.key?.remoteJid;
  if (!chatJid || !msg.key?.id) return;
  if (!global.recentByChat.has(chatJid)) global.recentByChat.set(chatJid, []);
  const list = global.recentByChat.get(chatJid);
  list.push({ id: msg.key.id, participant: msg.key.participant || chatJid, fromMe: !!msg.key.fromMe });
  if (list.length > RECENT_PER_CHAT_LIMIT) list.shift();
}

log.info("Starting DRUZZ XD...");
startWebServer();
startBot();

async function startBot() {
  try {
    let version;
    try {
      const res = await fetchLatestBaileysVersion();
      version = res.version;
      log.info("Baileys version: " + version.join("."));
    } catch {
      version = [2, 3000, 1015901307];
      log.warn("Using fallback Baileys version");
    }

    const { state, saveCreds } = await useMultiFileAuthState(config.AUTH_DIR);
    authStateRef = state;

    const natsu = makeWASocket({
      version,
      logger: silentLogger,
      printQRInTerminal: config.USE_QR,
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, silentLogger),
      },
      msgRetryCounterCache: new Map(),
      browser: ["Ubuntu", "Chrome", "20.0.04"],
      generateHighQualityLinkPreview: true,
      // Bad MAC fix: supplies messages for decryption retries
      getMessage: async (key) => {
        const stored = msgStore.get(key.id);
        if (stored) return stored;
        return proto.Message.fromObject({ conversation: "" });
      },
    });

    sock = natsu;
    emitStatus();

    natsu.ev.on("creds.update", saveCreds);

    // Store received messages for retry (Bad MAC fix) + per-chat history for .purge
    natsu.ev.on("messages.upsert", ({ messages }) => {
      for (const msg of messages) {
        if (msg.key?.id && msg.message) {
          msgStore.set(msg.key.id, msg.message);
          // Limit the cache to 500 messages
          if (msgStore.size > 500) {
            const firstKey = msgStore.keys().next().value;
            msgStore.delete(firstKey);
          }
          trackRecentMessage(msg);
        }
      }
    });

    // Track presence updates so .listonline can report who is actually online.
    natsu.ev.on("presence.update", ({ id, presences }) => {
      try {
        for (const [jid, p] of Object.entries(presences || {})) {
          global.presenceStore.set(jid, {
            lastKnown: p?.lastKnown || "unavailable",
            updatedAt: Date.now(),
          });
        }
      } catch {}
    });

    natsu.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr && config.USE_QR) {
        try {
          const { default: qrcode } = await import("qrcode-terminal");
          console.log("\n📱 Scan this QR code with WhatsApp:\n");
          qrcode.generate(qr, { small: true });
        } catch {}
      }

      if (connection === "open") {
        log.info("✅ Bot connected!");
        showBanner();
        let bareConnected = null;
        try {
          const userJid = natsu.user?.id || null;
          bareConnected = getBareNumber(userJid);
          global.owners = bareConnected ? [bareConnected, ...OWNER_NUMBERS] : [...OWNER_NUMBERS];
          global.owners = [...new Set(global.owners)];
          log.info("Owners: " + global.owners.join(", "));
        } catch { global.owners = [...OWNER_NUMBERS]; }

        emitStatus();
        try { ioRef?.emit("paired", { number: bareConnected }); } catch {}

        try { initProtections(natsu); } catch (e) { log.error("initProtections error: " + e?.message); }

        global.commands = {};
        const cmdDir = "./commands";
        if (fs.existsSync(cmdDir)) {
          const cmdFiles = fs.readdirSync(cmdDir).filter((f) => f.endsWith(".js"));
          for (const file of cmdFiles) {
            try {
              const mod = await import(path.resolve(cmdDir, file));
              const cmd = mod.default ?? mod;
              if (cmd?.name && typeof cmd.execute === "function") global.commands[cmd.name] = cmd;
            } catch (e) { log.warn("Failed to import " + file + ": " + (e?.message ?? e)); }
          }
        }
        log.info(Object.keys(global.commands).length + " commands loaded");
        await autoFollowNewsletters(natsu);
        try {
          const selfJid = natsu.user?.id || null;
          const bareJid = selfJid ? selfJid.split(":")[0] : null;
          if (bareJid) {
            await natsu.sendMessage(normalizeJid(bareJid), {
              image: { url: BOT_IMAGE },
              caption: "*🥳ᴅʀᴜᴢᴢ xᴅ ɪs ᴀᴄᴛɪᴠᴇ!*\n\n*ᴛʏᴘᴇ* " + config.PREFIX + "> *ᴍᴇɴᴜ ғᴏʀ ᴛʜᴇ ᴄᴏᴍᴍᴀɴᴅ ʟɪsᴛ*",
            });
          }
        } catch {}
      }

      if (connection === "close") {
    let reason = "unknown";

    try {
        reason = lastDisconnect?.error?.output?.statusCode ??
                 lastDisconnect?.error?.message ??
                 String(lastDisconnect);
    } catch {}

    log.error("Disconnected: " + reason);

    // Remove the old session if WhatsApp logged us out
    if (Number(reason) === 401 || reason === DisconnectReason.loggedOut) {
        try {
            fs.rmSync(config.AUTH_DIR, { recursive: true, force: true });
            log.warn("Old session removed.");
        } catch (e) {
            log.error(e.message);
        }
    }

    emitStatus();
    log.warn("Restarting in " + config.RECONNECT_DELAY + " ms...");
    setTimeout(() => startBot(), config.RECONNECT_DELAY);
}
    });

    // 3s after startup: either prompt in the console (legacy behaviour) or
    // wait for a pairing request coming from the Druzz Pairing website.
    setTimeout(async () => {
      try {
        if (!state.creds?.registered && !config.USE_QR) {
          if (config.PAIRING_MODE === "console") {
            await askPairingCode(natsu);
          } else {
            log.info("⌛ Waiting for a pairing request from the Druzz Pairing website...");
            if (config.WEB_ENABLED) {
              log.info(`   Open http://localhost:${config.WEB_PORT} to generate a code.`);
            }
          }
        }
      } catch (e) { log.warn("Pairing error: " + e?.message); }
    }, 3000);

    // Main message handler (commands)
    natsu.ev.on("messages.upsert", async ({ messages }) => {
      try {
        const msg = messages?.[0];
        if (!msg?.message) return;

        const from = msg.key.remoteJid;
        if (!from || isJidBroadcast(from)) return;

        const isGroup = from.endsWith("@g.us");
        let sender = msg.key.fromMe
          ? natsu.user?.id
          : isGroup
          ? msg.key.participant
          : msg.key.remoteJid;

        if (!sender) return;
        if (String(sender).includes("@lid")) {
          try { sender = natsu.decodeJid(sender); } catch {}
        }

        const senderNum = getBareNumber(sender);
        const ownersNums = (global.owners || []).map(getBareNumber);
        const sudoNums = loadSudo().map(getBareNumber);
        if (!ownersNums.includes(senderNum) && !sudoNums.includes(senderNum)) return;

        const rawMsg = unwrapMessage(msg.message);
        const body = pickText(rawMsg);
        if (!body || !body.startsWith(config.PREFIX)) return;

        const args = body.slice(config.PREFIX.length).trim().split(/ +/);
        const commandName = (args.shift() || "").toLowerCase();
        const cmd = global.commands?.[commandName];

        try { await natsu.sendMessage(from, { react: { text: "🇭🇹", key: msg.key } }); } catch {}

        // BUGFIX: .autorecording toggled a flag that nothing ever read, so it
        // had no visible effect. It now actually shows the "recording audio"
        // presence indicator to the chat while a command is being processed.
        if (isAutoRecording()) {
          try { await natsu.sendPresenceUpdate("recording", from); } catch {}
        }

        if (cmd) {
          const emoji = emojiMap[commandName];
          if (emoji) { try { await natsu.sendMessage(from, { react: { text: emoji, key: msg.key } }); } catch {} }
          try {
            if (typeof cmd.execute === "function") await cmd.execute(natsu, msg, args, from);
            else if (typeof cmd === "function") await cmd(natsu, msg, args, from);
          } catch (e) {
            log.error("Command error " + commandName + ": " + e?.message);
            try {
              await natsu.sendMessage(from, {
                text: "> ⚠️ Error while running command: " + commandName,
              }, { quoted: msg });
            } catch {}
          }
        }
      } catch (e) {
        // Bad MAC / decryption errors — silently ignored
        if (e?.message?.includes("Bad MAC") || e?.message?.includes("decrypt")) return;
        log.warn("messages.upsert error: " + e?.message);
      }
    });

  } catch (e) {
    log.error("Critical error: " + (e?.message ?? e));
    setTimeout(startBot, config.RECONNECT_DELAY);
  }
}

process.on("unhandledRejection", (r) => {
  const msg = String(r);
  // Silently ignore Baileys decryption errors (Bad MAC)
  if (msg.includes("Bad MAC") || msg.includes("decrypt") || msg.includes("No sessions")) return;
  log.error("Rejection: " + msg);
});
process.on("uncaughtException", (e) => {
  const msg = e?.message || String(e);
  if (msg.includes("Bad MAC") || msg.includes("decrypt") || msg.includes("No sessions")) return;
  log.error("Exception: " + msg);
});
