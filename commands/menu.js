import { BOT_NAME, BOT_VERSION, BOT_DEV, CHANNELS, BOT_IMAGE, MENU_AUDIO } from "../index.js";

export const name = "menu";

export async function execute(natsu, msg, args, from) {
  try {
    const jid = from || msg.key.remoteJid;
    const uptime = process.uptime();
    const h = Math.floor(uptime / 3600);
    const m = Math.floor((uptime % 3600) / 60);
    const s = Math.floor(uptime % 60);
    const uptimeStr = `${h}h ${m}m ${s}s`;

    const caption = `> ╔══════════════════╗
       ㉿ ${BOT_NAME} ㉿
> ╚══════════════════╝

╔══════════════════════╗
║           *ɪɴғᴏ...*
╠══════════════════════╣
║𓈃 *𝗨𝗦𝗘𝗥*    │ ${msg.pushName |"ʏᴏᴜ"}
║𓈃 *𝗠𝗢𝗗𝗘*    │ ᴘʀɪᴠᴀᴛᴇ
║𓈃 *𝗨𝗣𝗧𝗜𝗠𝗘*   │ ${uptimeStr}
║𓈃 *𝗩𝗘𝗥𝗦𝗜𝗢𝗡*  │ ${BOT_VERSION}
║𓈃 *𝗗𝗘𝗩* │ ${BOT_DEV}
╠══════════════════════╣


╔━━━𓈃 𝗨𝗧𝗜𝗟𝗜𝗧𝗬 𓈃━━━╗
║╭────────────
║𓈃│ᴅᴇʟᴇᴛᴇ
║𓈃│ᴠᴠ
║𓈃│ᴅᴇᴠɪᴄᴇ
║𓈃│ɪɴғᴏs
║𓈃│ᴘɪɴɢ
║𓈃│ᴡʜᴏɪs
║𓈃│ᴀᴜᴛᴏʀᴇᴄᴏʀᴅɪɴɢ
║𓈃│ᴀᴜᴛᴏᴊᴏɪɴ
║𓈃│sᴇᴛᴘᴘ
║╰────────────
╚━━━━━━━━━━━━━━━╝

╔━━━𓈃 𝗦𝗨𝗗𝗢 𓈃━━━╗
║╭───────────
║𓈃│ᴅᴇʟsᴜᴅᴏ
║𓈃│ʟɪsᴛsᴜᴅᴏ
║𓈃│sᴇᴛsᴜᴅᴏ
║╰───────────
╚━━━━━━━━━━━━━━━╝

╔━━━𓈃 𝗚𝗥𝗢𝗨𝗣𝗦 𓈃━━━╗
║╭─────────────
║𓈃│ᴀᴅᴅ
║𓈃│ᴅᴇᴍᴏᴛᴇ @
║𓈃│ᴅᴇᴍᴏᴛᴇᴀʟʟ
║𓈃│ɢᴄʟɪɴᴋ
║𓈃│ɪɴғᴏsɢʀᴏᴜᴘs
║𓈃│ᴋɪᴄᴋ @
║𓈃│ᴋɪᴄᴋᴀʟʟ
║𓈃│ʟᴇғᴛ
║𓈃│ʟɪsᴛᴏɴʟɪɴᴇ
║𓈃│ᴍᴜᴛᴇ
║𓈃│ᴜɴᴍᴜᴛᴇ
║𓈃│ᴍᴜᴛᴇ-ᴛɪᴍᴇ
║𓈃│ᴘʀᴏᴍᴏᴛᴇ @
║𓈃│ᴘʀᴏᴍᴏᴛᴇᴀʟʟ
║𓈃│ᴘʀɪɴᴄɪᴘᴀʟ
║𓈃│ᴘᴜʀɢᴇ
║𓈃│sᴇᴛᴘᴘɢ
║𓈃│sᴇᴛᴛɪᴍᴇɢ
║𓈃│ᴛᴀɢ
║𓈃│ᴛᴀɢᴀᴅᴍɪɴ
║𓈃│ᴛᴀɢᴀʟʟ
║𓈃│ᴡʀɪᴛᴇᴛᴏᴀʟʟ
║╰─────────────
╚━━━━━━━━━━━━━━━╝

╔━━━𓈃 𝗦𝗘𝗖𝗨𝗥𝗜𝗧𝗬 𓈃━━━╗
║╭─────────────
║𓈃│ᴀɴᴛɪʙᴏᴛ
║𓈃│ᴀɴᴛɪᴅᴇᴍᴏᴛᴇ
║𓈃│ᴀɴᴛɪʟɪɴᴋ
║𓈃│ᴀɴᴛɪᴘʀᴏᴍᴏᴛᴇ
║𓈃│ᴀɴᴛɪsᴘᴀᴍ
║𓈃│ᴡᴀʀɴᴀᴅᴍɪɴ
║𓈃│!ᴘʀᴏᴛᴇᴄᴛ
║╰─────────────
╚━━━━━━━━━━━━━━━╝

╔━━━𓈃 𝗠𝗘𝗗𝗜𝗔𝗦 𓈃━━━╗
║╭────────────
║𓈃│ᴘʜᴏᴛᴏ
║𓈃│sᴀᴠᴇ
║𓈃│sᴛɪᴄᴋᴇʀ
║𓈃│ᴜʀʟ
║╰────────────
╚━━━━━━━━━━━━━━━╝

╔━━━𓈃 𝗙𝗨𝗡 𓈃━━━╗
║╭─────────
║𓈃│ᴡᴀsᴛᴇᴅ
║╰─────────
╚━━━━━━━━━━━━━╝

> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅʀᴜᴢᴢ*`;

    await natsu.sendMessage(jid, { image: { url: BOT_IMAGE }, caption, gifPlayback: true }, { quoted: msg });
    await natsu.sendMessage(jid, { audio: { url: MENU_AUDIO }, mimetype: "audio/mpeg" }, { quoted: msg });
  } catch (e) {
    console.error("❌ ᴍᴇɴᴜ ᴄᴏᴍᴍᴀɴᴅ ᴇʀʀᴏʀ:", e);
    await natsu.sendMessage(from || msg.key.remoteJid, { text: "> *⚠️ ᴜɴᴀʙʟᴇ ᴛᴏ ᴅɪsᴘʟᴀʏ ᴛʜᴇ ᴍᴇɴᴜ.*" });
  }
}
