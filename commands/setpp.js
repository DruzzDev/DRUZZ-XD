import { downloadContentFromMessage } from "@whiskeysockets/baileys";

export const name = "setpp";

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  const ctxInfo = msg.message?.extendedTextMessage?.contextInfo;
  if (!ctxInfo || !ctxInfo.quotedMessage?.imageMessage) {
    return await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: ⚠️ ʀᴇᴘʟʏ ᴛᴏ ᴀɴ ɪᴍᴀɢᴇ ᴛᴏ ᴄʜᴀɴɢᴇ ᴛʜᴇ ʙᴏᴛ's ᴘʀᴏғɪʟᴇ ᴘɪᴄᴛᴜʀᴇ.*" }, { quoted: msg });
  }
  try {
    const quoted = ctxInfo.quotedMessage.imageMessage;
    const stream = await downloadContentFromMessage(quoted, "image");
    let buffer = Buffer.from([]);
    for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
    await natsu.updateProfilePicture(natsu.user.id, buffer);
    await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: ✅ ʙᴏᴛ's ᴘʀᴏғɪʟᴇ ᴘɪᴄᴛᴜʀᴇ ᴜᴘᴅᴀᴛᴇᴅ!*" }, { quoted: msg });
  } catch (e) {
    await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: ❌ ᴜɴᴀʙʟᴇ ᴛᴏ ᴄʜᴀɴɢᴇ ᴛʜᴇ ᴘʀᴏғɪʟᴇ ᴘɪᴄᴛᴜʀᴇ.*" }, { quoted: msg });
  }
}
