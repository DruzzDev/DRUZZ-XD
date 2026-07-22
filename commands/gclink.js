export const name = "gclink";

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  if (!jid.endsWith("@g.us")) {
    return await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: ɢʀᴏᴜᴘ-ᴏɴʟʏ ᴄᴏᴍᴍᴀɴᴅ.*" }, { quoted: msg });
  }
  try {
    const code = await natsu.groupInviteCode(jid);
    await natsu.sendMessage(jid, {
      text: `> *ᴅʀᴜᴢᴢ xᴅ: 🔗 ɢʀᴏᴜᴘ ɪɴᴠɪᴛᴇ ʟɪɴᴋ:*\nhttps://chat.whatsapp.com/${code}`,
    }, { quoted: msg });
  } catch (e) {
    await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: ❌ ᴜɴᴀʙʟᴇ ᴛᴏ ʀᴇᴛʀɪᴇᴠᴇ ᴛʜᴇ ʟɪɴᴋ (ᴄʜᴇᴄᴋ ᴍʏ ᴀᴅᴍɪɴ ʀɪɢʜᴛs).*" }, { quoted: msg });
  }
}
