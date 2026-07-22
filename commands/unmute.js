export const name = "unmute";

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  if (!jid.endsWith("@g.us")) {
    return await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: ɢʀᴏᴜᴘ-ᴏɴʟʏ ᴄᴏᴍᴍᴀɴᴅ.*" }, { quoted: msg });
  }
  try {
    await natsu.groupSettingUpdate(jid, "ɴᴏᴛ_ᴀɴɴᴏᴜɴᴄᴇᴍᴇɴᴛ");
    await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: 🔊 ɢʀᴏᴜᴘ ᴜɴᴍᴜᴛᴇᴅ — ᴇᴠᴇʀʏᴏɴᴇ ᴄᴀɴ sᴇɴᴅ ᴍᴇssᴀɢᴇs.*" }, { quoted: msg });
  } catch (e) {
    await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: ❌ ᴜɴᴀʙʟᴇ ᴛᴏ ᴜɴᴍᴜᴛᴇ ᴛʜᴇ ɢʀᴏᴜᴘ.*" }, { quoted: msg });
  }
}
