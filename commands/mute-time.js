export const name = "mute-time";

const scheduled = {};

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  if (!jid.endsWith("@g.us")) {
    return await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: ❌ ɢʀᴏᴜᴘ-ᴏɴʟʏ ᴄᴏᴍᴍᴀɴᴅ.*" }, { quoted: msg });
  }
  if (!args[0]) {
    return await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: ⏰ ᴜsᴀɢᴇ: .ᴍᴜᴛᴇ-ᴛɪᴍᴇ ᴍᴍ:ss\nᴇxᴀᴍᴘʟᴇ: .ᴍᴜᴛᴇ-ᴛɪᴍᴇ 05:00 (ᴄʟᴏsᴇs ɪɴ 5 ᴍɪɴᴜᴛᴇs)*" }, { quoted: msg });
  }
  const match = args[0].match(/^(\d{2}):(\d{2})$/);
  if (!match) return await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: ⚠️ ɪɴᴠᴀʟɪᴅ ғᴏʀᴍᴀᴛ. ᴇxᴀᴍᴘʟᴇ: .ᴍᴜᴛᴇ-ᴛɪᴍᴇ 00:10*" }, { quoted: msg });
  const delayMs = (parseInt(match[1]) * 60 + parseInt(match[2])) * 60 * 1000;
  await natsu.sendMessage(jid, { text: `> *ᴅʀᴜᴢᴢ xᴅ: ⏰ ᴛʜᴇ ɢʀᴏᴜᴘ ᴡɪʟʟ ʙᴇ ᴍᴜᴛᴇᴅ ɪɴ ${args[0]}.*` }, { quoted: msg });
  if (scheduled[jid]) clearTimeout(scheduled[jid]);
  scheduled[jid] = setTimeout(async () => {
    try {
      await natsu.groupSettingUpdate(jid, "announcement");
      await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: 🔴 ᴛʜᴇ ɢʀᴏᴜᴘ ɪs ɴᴏᴡ ᴄʟᴏsᴇᴅ!*" });
    } catch (e) { console.error("mute-time error:", e); }
  }, delayMs);
}
