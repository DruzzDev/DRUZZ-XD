export const name = "tagall";

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  if (!jid.endsWith("@g.us")) {
    return await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: ɢʀᴏᴜᴘ-ᴏɴʟʏ ᴄᴏᴍᴍᴀɴᴅ.*" }, { quoted: msg });
  }
  try {
    const meta = await natsu.groupMetadata(jid);
    const mentions = meta.participants.map((p) => p.id);
    const text = mentions.map((m) => `@${m.split("@")[0]}`).join(" ");
    const extra = args.join(" ");
    await natsu.sendMessage(jid, {
      text: `*ᴛᴀɢᴀʟʟ ʙʏ ᴅʀᴜᴢᴢ xᴅ* ${extra ? extra + "\n\n" : ""}${text}`,
      mentions,
    }, { quoted: msg });
  } catch (e) {
    await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: ❌ ᴇʀʀᴏʀ ᴅᴜʀɪɴɢ ᴛᴀɢᴀʟʟ.*" }, { quoted: msg });
  }
}
