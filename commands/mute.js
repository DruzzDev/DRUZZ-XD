export const name = "mute";

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  if (!jid.endsWith("@g.us")) {
    return await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: ɢʀᴏᴜᴘ-ᴏɴʟʏ ᴄᴏᴍᴍᴀɴᴅ.*" }, { quoted: msg });
  }
  try {
    await natsu.groupSettingUpdate(jid, "announcement");
    await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: 🔇 ɢʀᴏᴜᴘ sᴇᴛ ᴛᴏ `read-only` mode (ᴏɴʟʏ ᴀᴅᴍɪɴs ᴄᴀɴ sᴇɴᴅ ᴍᴇssᴀɢᴇs).*" }, { quoted: msg });
  } catch (e) {
    await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: ❌ ᴜɴᴀʙʟᴇ ᴛᴏ ᴍᴜᴛᴇ ᴛʜᴇ ɢʀᴏᴜᴘ.*" }, { quoted: msg });
  }
}
