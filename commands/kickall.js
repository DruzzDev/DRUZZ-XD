export const name = "kickall";

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  if (!jid.endsWith("@g.us")) {
    return await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: ɢʀᴏᴜᴘ-ᴏɴʟʏ ᴄᴏᴍᴍᴀɴᴅ.*" }, { quoted: msg });
  }
  try {
    const meta = await natsu.groupMetadata(jid);
    const botId = natsu.user?.id;
    const participants = meta.participants.filter((p) => p.id !== botId && !p.admin);
    if (!participants.length) {
      return await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: ɴᴏ ᴍᴇᴍʙᴇʀ ᴛᴏ ʀᴇᴍᴏᴠᴇ.*" }, { quoted: msg });
    }
    await natsu.sendMessage(jid, { text: `> *ᴅʀᴜᴢᴢ xᴅ: 🚮 ʀᴇᴍᴏᴠɪɴɢ ${participants.length} ᴍᴇᴍʙᴇʀs...*` }, { quoted: msg });
    for (const p of participants) {
      await natsu.groupParticipantsUpdate(jid, [p.id], "remove").catch(() => {});
    }
    await natsu.sendMessage(jid, { text: `> *ᴅʀᴜᴢᴢ xᴅ: ✅ ${participants.length} ᴍᴇᴍʙᴇʀs ʀᴇᴍᴏᴠᴇᴅ!*` });
  } catch (e) {
    await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: ❌ ᴇʀʀᴏʀ ᴡʜɪʟᴇ ʀᴇᴍᴏᴠɪɴɢ:* " + e.message }, { quoted: msg });
  }
}
