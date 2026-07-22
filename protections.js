import chalk from "chalk";
import dotenv from "dotenv";
import { isOwnerOrSudo, getBareNumber } from "./index.js";
dotenv.config();

export const statusProtections = {
  antiLink: false,
  antiPromote: false,
  antiDemote: false,
  antiBot: false,
  antiSpam: false,
  autoLikeStatus: true,
  warnAdmin: false,
};

const SPAM_LIMIT = 4;
const TIME_LIMIT_MS = 5000;
const messageHistory = {};
const blockedLinks = ["chat.whatsapp.com", "bit.ly", "t.me"];

async function isBotAdmin(natsu, groupId) {
  try {
    const meta = await natsu.groupMetadata(groupId);
    const botId = natsu.user?.id;
    const bot = meta.participants.find((p) => p.id === botId);
    return bot?.admin != null;
  } catch {
    return false;
  }
}

export function antiLink(natsu) {
  natsu.ev.on("messages.upsert", async ({ messages }) => {
    if (!statusProtections.antiLink) return;
    const msg = messages[0];
    if (!msg.message) return;
    const from = msg.key.remoteJid;
    const sender = msg.key.participant || from;
    const text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text ||
      msg.message.imageMessage?.caption ||
      msg.message.videoMessage?.caption;
    if (!text) return;
    try {
      if (!from.endsWith("@g.us")) return;
      const meta = await natsu.groupMetadata(from);
      const senderInfo = meta.participants.find((p) => p.id === sender);
      if (senderInfo?.admin) return;
      for (const link of blockedLinks) {
        if (text.includes(link)) {
          await natsu.sendMessage(from, {
            text: `╭═════㉿ 𝗗𝗥𝗨𝗭𝗭 𝗫𝗗 ㉿═════╮\n🔷 𝗗𝗥𝗨𝗭𝗭 𝗫𝗗 🔷\n╰═════════════════╯\n\n╭═══㉿ 𝐀𝐍𝐓𝐈-𝐋𝐈𝐍𝐊 ㉿═══╮\n│ ⚠️ @${sender.split("@")[0]}, 𝐥𝐢𝐧𝐤𝐬 𝐚𝐫𝐞 𝐧𝐨𝐭 𝐚𝐥𝐥𝐨𝐰𝐞𝐝 𝐡𝐞𝐫𝐞!\n╰════════════════════╯\n\n> 𝐃𝐞𝐯 ${process.env.BOT_DEV || "𝗗𝗥𝗨𝗭𝗭"}`,
            mentions: [sender],
          });
          await natsu.sendMessage(from, { delete: msg.key });
          const isAdmin = await isBotAdmin(natsu, from);
          if (isAdmin) await natsu.groupParticipantsUpdate(from, [sender], "remove");
          console.log(chalk.yellow(`[ANTI-LINK] Message deleted from ${sender} in ${from}`));
          return;
        }
      }
    } catch (e) {
      if (!String(e).includes("Bad MAC")) console.log("[WARN]", e?.message ?? e);
    }
  });
}

export function antiPromote(natsu) {
  natsu.ev.on("group-participants.update", async (update) => {
    if (!statusProtections.antiPromote) return;
    if (update.action !== "promote") return;
    const groupId = update.id;
    try {
      const isAdmin = await isBotAdmin(natsu, groupId);
      for (const p of update.participants) {
        await natsu.groupParticipantsUpdate(groupId, [p], "demote");
        if (isAdmin) await natsu.groupParticipantsUpdate(groupId, [p], "remove");
        console.log(chalk.yellow(`[ANTI-PROMOTE] ${p} demoted${isAdmin ? " and removed" : " (not removed)"} in ${groupId}`));
      }
    } catch (e) { if (!String(e).includes("Bad MAC")) console.log("[WARN]", e?.message ?? e); }
  });
}

export function antiDemote(natsu) {
  natsu.ev.on("group-participants.update", async (update) => {
    if (!statusProtections.antiDemote) return;
    if (update.action !== "demote") return;
    const groupId = update.id;
    try {
      const isAdmin = await isBotAdmin(natsu, groupId);
      for (const p of update.participants) {
        await natsu.groupParticipantsUpdate(groupId, [p], "promote");
        if (isAdmin) await natsu.groupParticipantsUpdate(groupId, [p], "remove");
        console.log(chalk.yellow(`[ANTI-DEMOTE] ${p} re-promoted${isAdmin ? " and removed" : " (not removed)"} in ${groupId}`));
      }
    } catch (e) { if (!String(e).includes("Bad MAC")) console.log("[WARN]", e?.message ?? e); }
  });
}

// NOTE: WhatsApp does not expose any reliable way to know whether a phone
// number belongs to an automated account. The "add" check below can only
// ever match if you keep an explicit list of known bot numbers; matching the
// literal substring "bot" against a phone number will never trigger, so it
// is left here only as a placeholder for that explicit list.
const KNOWN_BOT_NUMBERS = (process.env.KNOWN_BOT_NUMBERS || "")
  .split(",").map((s) => s.trim()).filter(Boolean);

export function antiBot(natsu) {
  const selfNumber = process.env.NUMBER;
  natsu.ev.on("group-participants.update", async (update) => {
    if (!statusProtections.antiBot) return;
    if (update.action === "add") {
      try {
        const isAdmin = await isBotAdmin(natsu, update.id);
        for (const p of update.participants) {
          const number = String(p).split("@")[0];
          if (KNOWN_BOT_NUMBERS.includes(number)) {
            await natsu.groupParticipantsUpdate(update.id, [p], "remove");
            console.log(chalk.red(`[ANTI-BOT] Bot ${p} removed${isAdmin ? "" : " (not removed, bot has no admin rights)"} in ${update.id}`));
          }
        }
      } catch (e) { if (!String(e).includes("Bad MAC")) console.log("[WARN]", e?.message ?? e); }
    }
  });
  natsu.ev.on("messages.upsert", async ({ messages }) => {
    if (!statusProtections.antiBot) return;
    const msg = messages[0];
    if (!msg.message) return;
    const from = msg.key.remoteJid;
    if (!from.endsWith("@g.us")) return;
    const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
    if (!text) return;
    const botChars = ["'", '"', ":", ";", "!", "?", "/", ")", "(", "+", "-", "&", "_", "€", "#", ",", "."];
    if (!botChars.some((c) => text.startsWith(c))) return;
    try {
      const meta = await natsu.groupMetadata(from);
      const sender = msg.key.participant || from;
      const senderInfo = meta.participants.find((p) => p.id === sender);
      const isSelf = sender === selfNumber;
      if (senderInfo?.admin || isSelf || msg.key.fromMe) return;
      const isAdmin = await isBotAdmin(natsu, from);
      await natsu.sendMessage(from, { delete: msg.key });
      if (isAdmin) {
        await natsu.groupParticipantsUpdate(from, [sender], "remove");
        await natsu.sendMessage(from, { text: `> *ᴅʀᴜᴢᴢ xᴅ : ⚠️ @${sender.split("@")[0]} ᴡᴀs ʀᴇᴍᴏᴠᴇᴅ.*`, mentions: [sender] });
      } else {
        await natsu.sendMessage(from, { text: `> *ᴅʀᴜᴢᴢ xᴅ : ⚠️ ᴜɴᴀᴜᴛʜᴏʀɪᴢᴇᴅ ᴍᴇssᴀɢᴇ ᴅᴇᴛᴇᴄᴛᴇᴅ! @${sender.split("@")[0]}.*`, mentions: [sender] });
      }
      console.log(chalk.red(`[ANTI-BOT] Message from ${sender} in ${from} - ${isAdmin ? "user removed" : "bot not admin, could not remove"}`));
    } catch (e) { if (!String(e).includes("Bad MAC")) console.log("[WARN]", e?.message ?? e); }
  });
}

export function antiSpam(natsu) {
  const selfNumber = process.env.NUMBER;
  natsu.ev.on("messages.upsert", async ({ messages }) => {
    if (!statusProtections.antiSpam) return;
    const msg = messages[0];
    if (!msg.message) return;
    const from = msg.key.remoteJid;
    const sender = msg.key.participant || from;
    const timestamp = msg.messageTimestamp * 1000;
    if (!from.endsWith("@g.us")) return;
    try {
      const meta = await natsu.groupMetadata(from);
      const senderInfo = meta.participants.find((p) => p.id === sender);
      const isSelf = sender === selfNumber;
      if (senderInfo?.admin || isSelf || msg.key.fromMe) return;
      if (!messageHistory[sender]) messageHistory[sender] = [];
      messageHistory[sender].unshift({ key: msg.key, timestamp });
      if (messageHistory[sender].length > SPAM_LIMIT) messageHistory[sender].pop();
      if (messageHistory[sender].length === SPAM_LIMIT) {
        const newest = messageHistory[sender][0].timestamp;
        const oldest = messageHistory[sender][SPAM_LIMIT - 1].timestamp;
        const diff = newest - oldest;
        if (diff <= TIME_LIMIT_MS) {
          const keys = messageHistory[sender].map((m) => m.key);
          await Promise.allSettled(keys.map((k) => natsu.sendMessage(from, { delete: k })));
          messageHistory[sender] = [];
          await natsu.sendMessage(from, {
            text: `> *ᴅʀᴜᴢᴢ xᴅ : 🚫 ᴀɴᴛɪ-sᴘᴀᴍ ᴛʀɪɢɢᴇʀᴇᴅ. @${sender.split("@")[0]} sent ${SPAM_LIMIT} ᴍᴇssᴀɢᴇs ɪɴ ᴜɴᴅᴇʀ 5 sᴇᴄᴏɴᴅs. ᴛʜᴇʏ ᴡᴇʀᴇ ᴅᴇʟᴇᴛᴇᴅ.*`,
            mentions: [sender],
          });
          console.log(chalk.red(`[ANTI-SPAM] ${SPAM_LIMIT} messages from ${sender} deleted in ${from} (time: ${diff}ms).`));
        }
      }
    } catch (e) { if (!String(e).includes("Bad MAC")) console.log("[WARN]", e?.message ?? e); }
  });
}

export function warnAdmin(natsu) {
  natsu.ev.on("group-participants.update", async (update) => {
    if (!statusProtections.warnAdmin) return;
    try {
      const groupId = update.id;
      const meta = await natsu.groupMetadata(groupId);
      if (update.action === "promote" || update.action === "demote") {
        for (const p of update.participants) {
          const tag = "@" + p.split("@")[0];
          const msg =
            update.action === "promote"
              ? `*👑 ${tag} ᴡᴀs ᴘʀᴏᴍᴏᴛᴇᴅ ᴛᴏ ᴀᴅᴍɪɴ*!`
              : `*⚠️ ${tag} ʜᴀs ʙᴇᴇɴ ᴅᴇᴍᴏᴛᴇᴅ*!`;
          const text = `> ╭═══𒑛 ${global.BOT_NAME || "*ᴅʀᴜᴢᴢ*"} 𒑛════╮\n⚔️ *ᴀᴅᴍɪɴ ᴀʟᴇʀᴛ* ⚔️\n╰══════════════════════╯\n📌 *ɢʀᴏᴜᴘ: ${meta.subject}\n${msg}*\n\n> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅʀᴜᴢᴢ*`;
          await natsu.sendMessage(groupId, { text, mentions: [p] });
        }
      }
    } catch (e) { if (!String(e).includes("Bad MAC")) console.log("[WARN][WARNADMIN]", e?.message ?? e); }
  });
}

// BUGFIX: this command previously had no permission check at all — any
// member of any chat could toggle group protections. It is now restricted
// to the bot owner(s) and sudo users, like every other admin command.
export function protectCommand(natsu) {
  natsu.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message) return;
    const from = msg.key.remoteJid;
    const senderJid = msg.key.fromMe ? natsu.user?.id : (msg.key.participant || from);
    const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
    if (!text || !text.startsWith("!protect")) return;

    if (!msg.key.fromMe && !isOwnerOrSudo(getBareNumber(senderJid))) {
      await natsu.sendMessage(from, { text: "> *ᴅʀᴜᴢᴢ xᴅ : ⛔ ᴏɴʟʏ ᴛʜᴇ ᴏᴡɴᴇʀ ᴏʀ sᴜᴅᴏ ᴜsᴇʀs ᴄᴀɴ ᴜsᴇ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ." });
      return;
    }

    const args = text.trim().split(/ +/).slice(1);
    if (args.length === 0) {
      const status = Object.entries(statusProtections)
        .map(([k, v]) => `• ${k}: ${v ? "✅" : "❌"}`)
        .join("\n");
      await natsu.sendMessage(from, { text: "sᴇᴄᴜʀɪᴛʏ sᴛᴀᴛᴜs:\n" + status });
      return;
    }
    const [toggle, key] = args;
    if (!["on", "off"].includes(toggle) || !Object.keys(statusProtections).includes(key)) {
      await natsu.sendMessage(from, {
        text: "> *ᴅʀᴜᴢᴢ xᴅ : ᴜsᴀɢᴇ: !ᴘʀᴏᴛᴇᴄᴛ <on/off> <ᴀɴᴛɪʟɪɴᴋ | ᴀɴᴛɪᴘʀᴏᴍᴏᴛᴇ | ᴀɴᴛɪᴅᴇᴍᴏᴛᴇ | ᴀɴᴛɪʙᴏᴛ | ᴀɴᴛɪsᴘᴀᴍ | ᴀᴜᴛᴏʟɪᴋᴇsᴛᴀᴛᴜs | ᴡᴀʀɴᴀᴅᴍɪɴ>*",
      });
      return;
    }
    statusProtections[key] = toggle === "on";
    // BUGFIX: this used to compare toggle to a stylized unicode string
    // ("ᴏɴ") that could never equal "on"/"off", so it always reported
    // "disabled" regardless of the actual new state.
    await natsu.sendMessage(from, { text: `> *ᴅʀᴜᴢᴢ xᴅ : ᴘʀᴏᴛᴇᴄᴛɪᴏɴ ${key} ${toggle === "ᴏɴ" ? "ᴇɴᴀʙʟᴇᴅ ✅" : "ᴅɪsᴀʙʟᴇᴅ ❌"}!*` });
  });
}

// BUGFIX: autoLikeStatus was a toggle in statusProtections that nothing ever
// read — turning it on/off had zero effect. This actually reacts to
// contacts' WhatsApp status updates when enabled.
export function autoLikeStatus(natsu) {
  natsu.ev.on("messages.upsert", async ({ messages }) => {
    if (!statusProtections.autoLikeStatus) return;
    const msg = messages[0];
    if (!msg?.key || msg.key.remoteJid !== "status@broadcast" || msg.key.fromMe) return;
    try {
      await natsu.sendMessage(
        "status@broadcast",
        { react: { text: "❤️", key: msg.key } },
        { statusJidList: [msg.key.participant, natsu.user?.id].filter(Boolean) }
      );
    } catch (e) { if (!String(e).includes("Bad MAC")) console.log("[WARN][AUTO-LIKE]", e?.message ?? e); }
  });
}

export function initProtections(natsu) {
  antiLink(natsu);
  antiPromote(natsu);
  antiDemote(natsu);
  antiBot(natsu);
  antiSpam(natsu);
  warnAdmin(natsu);
  autoLikeStatus(natsu);
  protectCommand(natsu);
}
