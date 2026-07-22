export const name = "writetoall";

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  if (!args || !args.length) {
    return await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: ᴜsᴀɢᴇ: .ᴡʀɪᴛᴇᴛᴏᴀʟʟ <ᴍᴇssᴀɢᴇ>*" }, { quoted: msg });
  }
  if (!jid.endsWith("@g.us")) {
    return await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ ᴍᴜsᴛ ʙᴇ ᴜsᴇᴅ ɪɴ ᴀ ɢʀᴏᴜᴘ!*" }, { quoted: msg });
  }
  const textToSend = args.join(" ");
  try {
    const meta = await natsu.groupMetadata(jid);
    const participants = meta.participants.map((p) => p.id);
    for (const p of participants) {
      if (p.includes("bot")) continue;
      await natsu.sendMessage(p, { text: textToSend }).catch(() => {});
    }
    await natsu.sendMessage(jid, { text: `> *ᴅʀᴜᴢᴢ xᴅ: ᴍᴇssᴀɢᴇ sᴇɴᴛ ᴛᴏ ᴀʟʟ ɢʀᴏᴜᴘ ᴍᴇᴍʙᴇʀs (${participants.length} ᴍᴇᴍʙᴇʀs).*` }, { quoted: msg });
  } catch (e) {
    await natsu.sendMessage(jid, { text: "*❌ ᴀɴ ᴇʀʀᴏʀ ᴏᴄᴄᴜʀʀᴇᴅ ᴡʜɪʟᴇ sᴇɴᴅɪɴɢ ᴛʜᴇ ᴍᴇssᴀɢᴇ.*" }, { quoted: msg });
  }
}
