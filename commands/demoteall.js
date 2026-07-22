export const name = "demoteall";

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  if (!jid.endsWith("@g.us")) {
    return await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: ɢʀᴏᴜᴘ-ᴏɴʟʏ ᴄᴏᴍᴍᴀɴᴅ.*" }, { quoted: msg });
  }
  try {
    const meta = await natsu.groupMetadata(jid);
    const botId = natsu.user?.id;
    const admins = meta.participants.filter((p) => p.admin && p.id !== botId);
    if (!admins.length) return await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: ɴᴏ ᴀᴅᴍɪɴ ᴛᴏ ᴅᴇᴍᴏᴛᴇ.*" }, { quoted: msg });
    for (const a of admins) {
      await natsu.groupParticipantsUpdate(jid, [a.id], "demote").catch(() => {});
    }
    await natsu.sendMessage(jid, { text: `> *ᴅʀᴜᴢᴢ xᴅ: ✅ ${admins.length} ᴀᴅᴍɪɴ(s) ᴅᴇᴍᴏᴛᴇᴅ.*` }, { quoted: msg });
  } catch (e) {
    await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: ❌ ᴇʀʀᴏʀ ᴅᴜʀɪɴɢ ᴅᴇᴍᴏᴛᴇᴀʟʟ.*" }, { quoted: msg });
  }
}
