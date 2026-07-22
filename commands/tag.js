export const name = "tag";

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  if (!jid.endsWith("@g.us")) {
    return await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: ɢʀᴏᴜᴘ-ᴏɴʟʏ ᴄᴏᴍᴍᴀɴᴅ.*" }, { quoted: msg });
  }
  const text = args.join(" ");
  if (!text) return await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: ᴜsᴀɢᴇ: .ᴛᴀɢ <ᴍᴇssᴀɢᴇ>*" }, { quoted: msg });
  try {
    const meta = await natsu.groupMetadata(jid);
    const mentions = meta.participants.map((p) => p.id);
    await natsu.sendMessage(jid, { text, mentions }, { quoted: msg });
  } catch (e) {
    await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: ❌ ᴇʀʀᴏʀ ᴅᴜʀɪɴɢ ᴛᴀɢ.*" }, { quoted: msg });
  }
}
