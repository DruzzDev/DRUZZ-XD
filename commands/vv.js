import { downloadMediaMessage } from "@whiskeysockets/baileys";

export const name = "vv";

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  const quoted = msg.message?.extendedTextMessage?.contextInfo;
  if (!quoted?.quotedMessage) {
    return await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: ⚠️ ʀᴇᴘʟʏ ᴛᴏ ᴀ ᴠɪᴇᴡ-ᴏɴᴄᴇ (ᴇᴘʜᴇᴍᴇʀᴀʟ) ᴍᴇssᴀɢᴇ.*" }, { quoted: msg });
  }
  try {
    const qMsg = {
      key: { remoteJid: jid, id: quoted.stanzaId, participant: quoted.participant },
      message: quoted.quotedMessage,
    };
    const buffer = await downloadMediaMessage(qMsg, "buffer", {}, { reuploadRequest: natsu.updateMediaMessage });
    const type = quoted.quotedMessage.imageMessage ? "image" : quoted.quotedMessage.videoMessage ? "video" : null;
    if (!type) return await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: ᴜɴsᴜᴘᴘᴏʀᴛᴇᴅ ᴍᴇᴅɪᴀ ᴛʏᴘᴇ.*" }, { quoted: msg });
    await natsu.sendMessage(jid, { [type]: buffer, caption: "> *ᴅʀᴜᴢᴢ xᴅ: 👁️ ᴍᴇᴅɪᴀ ʀᴇᴛʀɪᴇᴠᴇᴅ!*" }, { quoted: msg });
  } catch (e) {
    await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: ❌ ᴜɴᴀʙʟᴇ ᴛᴏ ʀᴇᴛʀɪᴇᴠᴇ ᴛʜᴇ ᴍᴇᴅɪᴀ.*" }, { quoted: msg });
  }
}
