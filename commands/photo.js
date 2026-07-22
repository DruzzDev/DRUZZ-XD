import { downloadContentFromMessage } from "@whiskeysockets/baileys";

export const name = "photo";

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  try {
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.stickerMessage;
    if (!quoted) {
      return await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: ʀᴇᴘʟʏ ᴛᴏ ᴛʜᴇ sᴛɪᴄᴋᴇʀ ᴛᴏ ᴄᴏɴᴠᴇʀᴛ ɪᴛ ᴛᴏ ᴀɴ ɪᴍᴀɢᴇ.*" }, { quoted: msg });
    }
    const stream = await downloadContentFromMessage(quoted, "sticker");
    let buffer = Buffer.from([]);
    for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
    await natsu.sendMessage(jid, { image: buffer, caption: "> *ᴅʀᴜᴢᴢ xᴅ: ᴄᴏɴᴠᴇʀsɪᴏɴ sᴜᴄᴄᴇssғᴜʟ ✅*" }, { quoted: msg });
  } catch (e) {
    await natsu.sendMessage(jid, { text: "*❌ ᴇʀʀᴏʀ ᴄᴏɴᴠᴇʀᴛɪɴɢ sᴛɪᴄᴋᴇʀ ᴛᴏ ᴘʜᴏᴛᴏ:* " + e.message }, { quoted: msg });
  }
}
