export const name = "kick";

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  if (!jid.endsWith("@g.us")) {
    return await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: ɢʀᴏᴜᴘ-ᴏɴʟʏ ᴄᴏᴍᴍᴀɴᴅ.*" }, { quoted: msg });
  }
  const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
  const participant = msg.message?.extendedTextMessage?.contextInfo?.participant;
  const targets = mentioned.length ? mentioned : participant ? [participant] : [];
  if (!targets.length) {
    return await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: ⚠️ ᴍᴇɴᴛɪᴏɴ ᴀ ᴍᴇᴍʙᴇʀ: .ᴋɪᴄᴋ @ᴍᴇᴍʙᴇʀ*" }, { quoted: msg });
  }
  try {
    await natsu.groupParticipantsUpdate(jid, targets, "remove");
    await natsu.sendMessage(jid, {
      text: `> *ᴅʀᴜᴢᴢ xᴅ: ✅ ${targets.map((t) => "@" + t.split("@")[0]).join(", ")} ᴡᴀs / ᴡᴇʀᴇ ʀᴇᴍᴏᴠᴇᴅ.*`,
      mentions: targets,
    }, { quoted: msg });
  } catch (e) {
    await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: ❌ ᴜɴᴀʙʟᴇ ᴛᴏ ʀᴇᴍᴏᴠᴇ (ᴄʜᴇᴄᴋ ᴍʏ ᴀᴅᴍɪɴ ʀɪɢʜᴛs).*" }, { quoted: msg });
  }
}
