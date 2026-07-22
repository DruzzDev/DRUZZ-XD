export const name = "promoteall";

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  if (!jid.endsWith("@g.us")) {
    return await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: ɢʀᴏᴜᴘ-ᴏɴʟʏ ᴄᴏᴍᴍᴀɴᴅ.*" }, { quoted: msg });
  }
  try {
    const meta = await natsu.groupMetadata(jid);
    const nonAdmins = meta.participants.filter((p) => !p.admin);
    if (!nonAdmins.length) return await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: ᴇᴠᴇʀʏᴏɴᴇ ɪs ᴀʟʀᴇᴀᴅʏ ᴀɴ ᴀᴅᴍɪɴ.*" }, { quoted: msg });
    for (const p of nonAdmins) {
      await natsu.groupParticipantsUpdate(jid, [p.id], "promote").catch(() => {});
    }
    await natsu.sendMessage(jid, { text: `> *ᴅʀᴜᴢᴢ xᴅ: ✅ ${nonAdmins.length} ᴍᴇᴍʙᴇʀ(s) ᴘʀᴏᴍᴏᴛᴇᴅ ᴛᴏ ᴀᴅᴍɪɴ.*` }, { quoted: msg });
  } catch (e) {
    await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: ❌ ᴇʀʀᴏʀ ᴅᴜʀɪɴɢ ᴘʀᴏᴍᴏᴛᴇᴀʟʟ.*" }, { quoted: msg });
  }
}
