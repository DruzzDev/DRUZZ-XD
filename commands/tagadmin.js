export const name = "tagadmin";

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  if (!jid.endsWith("@g.us")) {
    return await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: ɢʀᴏᴜᴘ-ᴏɴʟʏ ᴄᴏᴍᴍᴀɴᴅ.*" }, { quoted: msg });
  }
  try {
    const meta = await natsu.groupMetadata(jid);
    const admins = meta.participants.filter((p) => p.admin);
    if (!admins.length) return await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: ɴᴏ ᴀᴅᴍɪɴ ғᴏᴜɴᴅ.*" }, { quoted: msg });
    const mentions = admins.map((p) => p.id);
    const text = `👑 *ᴀᴅᴍɪɴs ᴅᴜ ɢʀᴏᴜᴘᴇ :*\n` + mentions.map((m) => `@${m.split("@")[0]}`).join("\n");
    await natsu.sendMessage(jid, { text, mentions }, { quoted: msg });
  } catch (e) {
    await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: ❌ ᴇʀʀᴏʀ ᴅᴜʀɪɴɢ ᴛᴀɢᴀᴅᴍɪɴ.*" }, { quoted: msg });
  }
}
