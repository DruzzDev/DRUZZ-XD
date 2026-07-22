export const name = "add";

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  if (!jid.endsWith("@g.us")) {
    return await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: ɢʀᴏᴜᴘ-ᴏɴʟʏ ᴄᴏᴍᴍᴀɴᴅ.*" }, { quoted: msg });
  }
  if (!args[0]) return await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: ᴜsᴀɢᴇ: .ᴀᴅᴅ 509 xxx xxx*" }, { quoted: msg });
  const number = args[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net";
  try {
    const res = await natsu.groupParticipantsUpdate(jid, [number], "add");
    const status = res?.[0]?.status;
    if (status === 200 || status === "200") {
      await natsu.sendMessage(jid, { text: `> *ᴅʀᴜᴢᴢ xᴅ: ✅ @${number.split("@")[0]} ʜᴀs ʙᴇᴇɴ ᴀᴅᴅᴇᴅ.*`, mentions: [number] }, { quoted: msg });
    } else {
      await natsu.sendMessage(jid, { text: `> *ᴅʀᴜᴢᴢ xᴅ: ⚠️ ᴜɴᴀʙʟᴇ ᴛᴏ ᴀᴅᴅ (ᴄᴏᴅᴇ: ${status}). ᴛʜᴇ ɴᴜᴍʙᴇʀ ᴍᴜsᴛ ʙᴇ ᴏɴ ᴡʜᴀᴛsᴀᴘᴘ ᴀɴᴅ ɪᴛs ᴘʀɪᴠᴀᴄʏ sᴇᴛᴛɪɴɢs ᴍᴜsᴛ ᴀʟʟᴏᴡ ᴛʜɪs.*` }, { quoted: msg });
    }
  } catch (e) {
    await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: ❌ ᴇʀʀᴏʀ ᴡʜɪʟᴇ ᴀᴅᴅɪɴɢ.*" }, { quoted: msg });
  }
}
