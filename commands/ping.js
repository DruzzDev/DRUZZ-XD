export const name = "ping";

export async function execute(natsu, msg, args, from) {
  try {
    const jid = from || msg.key.remoteJid;
    const start = Date.now();
    const sentMsg = await natsu.sendMessage(jid, { text: "🫩 ᴘɪɴɢ..." }, { quoted: msg });
    const latency = Date.now() - start;

    await natsu.sendMessage(jid, {
      text: `> ╭═㉿ 𝗣𝗢𝗡𝗚 ㉿══╮\n> │ 🏎️ *𝖡𝗈𝗍 𝗈𝗉𝖾𝗋𝖺𝗍𝗂𝗈𝗇𝖺𝗅*\n> │ ⏱️ : ${latency} 𝗆𝗌\n> ╰═══════════╯`,
    }, { quoted: sentMsg });
  } catch (e) {
    console.error("❌ ping error:", e);
    await natsu.sendMessage(from || msg.key.remoteJid, { text: "> *⚠️ ᴅʀᴜᴢᴢ xᴅ: ᴜɴᴀʙʟᴇ ᴛᴏ ᴄᴀʟᴄᴜʟᴀᴛᴇ sᴘᴇᴇᴅ.*" }, { quoted: msg });
  }
}
