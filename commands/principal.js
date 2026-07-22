export const name = "principal";

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  if (!jid.endsWith("@g.us")) {
    return await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: ɢʀᴏᴜᴘ ᴄᴏᴍᴍᴀɴᴅ.*" }, { quoted: msg });
  }
  try {
    const meta = await natsu.groupMetadata(jid);
    const creatorId = meta.owner;
    if (!creatorId) return await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: ❌ ᴄʀᴇᴀᴛᴏʀ ɪɴғᴏ ᴜɴᴀᴠᴀɪʟᴀʙʟᴇ.*" }, { quoted: msg });
    await natsu.sendMessage(jid, {
      text: `> *ᴅʀᴜᴢᴢ xᴅ: ᴛʜᴇ ɢʀᴏᴜᴘ ᴄʀᴇᴀᴛᴏʀ ɪs: @${creatorId.split("@")[0]}*`,
      mentions: [creatorId],
    }, { quoted: msg });
  } catch (e) {
    await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: ❌ ᴇʀʀᴏʀ.*" }, { quoted: msg });
  }
}
