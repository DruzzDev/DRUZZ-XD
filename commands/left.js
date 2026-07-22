export const name = "left";

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  if (!jid.endsWith("@g.us")) {
    return await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: ɢʀᴏᴜᴘ-ᴏɴʟʏ ᴄᴏᴍᴍᴀɴᴅ.*" }, { quoted: msg });
  }
  await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: 👋🏾 ɢᴏᴏᴅʙʏᴇ!*" }, { quoted: msg });
  await natsu.groupLeave(jid);
}
