export const name = "infosgroups";

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  if (!jid.endsWith("@g.us")) {
    return await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: ɢʀᴏᴜᴘ-ᴏɴʟʏ ᴄᴏᴍᴍᴀɴᴅ.*" }, { quoted: msg });
  }
  try {
    const meta = await natsu.groupMetadata(jid);
    const admins = meta.participants.filter((p) => p.admin);
    const desc = meta.desc || "ɴᴏ ᴅᴇsᴄʀɪᴘᴛɪᴏɴ";
    const text = `╭════𓈃════╮
   *ᴅʀᴜᴢᴢ xᴅ - ɢʀᴏᴜᴘ ɪɴғᴏ*
╰════𓈃════╯
╭───────────────━━━
║𒑡 *ɴᴀᴍᴇ:* ${meta.subject}
║𒑡 *ᴍᴇᴍʙᴇʀs:* ${meta.participants.length}
║𒑡 *ᴀᴅᴍɪɴs:* ${admins.length}
║𒑡 *ᴅᴇsᴄʀɪᴘᴛɪᴏɴ:* ${desc}
║𒑡 *ʀᴇsᴛʀɪᴄᴛɪᴏɴ:* ${meta.announce ? "ᴀᴅᴍɪɴs ᴏɴʟʏ" : "ᴀʟʟ"}
║𒑡 *ɪᴅ:* ${meta.id}
╰───────────────━━━`;
    await natsu.sendMessage(jid, { text }, { quoted: msg });
  } catch (e) {
    await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: ❌ ᴜɴᴀʙʟᴇ ᴛᴏ ʀᴇᴛʀɪᴇᴠᴇ ɢʀᴏᴜᴘ ɪɴғᴏ.*" }, { quoted: msg });
  }
}
