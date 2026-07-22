export const name = "whois";

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  try {
    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    const participant = msg.message?.extendedTextMessage?.contextInfo?.participant;
    const target = mentioned || participant || (jid.endsWith("@g.us") ? msg.key.participant : jid);
    if (!target) return await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: ᴍᴇɴᴛɪᴏɴ ᴀ ᴜsᴇʀ ᴏʀ ʀᴇᴘʟʏ ᴛᴏ ᴛʜᴇɪʀ ᴍᴇssᴀɢᴇ.*" }, { quoted: msg });
    let pp = "ɴᴏ ᴘʜᴏᴛᴏ";
    try { pp = await natsu.profilePictureUrl(target, "image"); } catch {}
    const text = `╭════𒑛════╮
   *ᴅʀᴜᴢᴢ xᴅ - ᴡʜᴏɪs*
╰════𒑛════╯
📱 *ɴᴜᴍʙᴇʀ:* +${target.split("@")[0]}
🔗 *ᴊɪᴅ:* ${target}`;
    if (pp !== "ɴᴏ ᴘʜᴏᴛᴏ") {
      await natsu.sendMessage(jid, { image: { url: pp }, caption: text }, { quoted: msg });
    } else {
      await natsu.sendMessage(jid, { text }, { quoted: msg });
    }
  } catch (e) {
    await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: ❌ ᴇʀʀᴏʀ ᴅᴜʀɪɴɢ ᴡʜᴏɪs." }, { quoted: msg });
  }
}
