import { downloadMediaMessage } from "@whiskeysockets/baileys";

export const name = "save";

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  try {
    const selfJid = natsu.user.id;
    const rawMsg = msg.message?.extendedTextMessage
      ? msg.message?.extendedTextMessage?.contextInfo?.quotedMessage
      : msg.message;
    if (!rawMsg) {
      return await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: ʀᴇᴘʟʏ ᴛᴏ ᴀ ᴍᴇᴅɪᴀ ᴏʀ ᴛᴇxᴛ ᴍᴇssᴀɢᴇ ᴛᴏ sᴀᴠᴇ ɪᴛ.*" }, { quoted: msg });
    }
    const type = Object.keys(rawMsg)[0];
    if (type === "conversation" || type === "extendedTextMessage") {
      const text = rawMsg.conversation || rawMsg.extendedTextMessage?.text || "ᴍᴇssᴀɢᴇ ᴠɪᴅᴇ";
      await natsu.sendMessage(selfJid, { text: `*💾 sᴀᴜᴠᴇɢᴀʀᴅᴇ:\n\n${text}*` });
      return await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: ᴛᴇxᴛ sᴀᴠᴇᴅ ✅*" }, { quoted: msg });
    }
    const buffer = await downloadMediaMessage({ message: rawMsg }, "buffer", {}, { logger: console });
    let sendContent = {};
    if (type === "imageMessage") sendContent = { image: buffer, caption: "> *ᴅʀᴜᴢᴢ xᴅ: ɪᴍᴀɢᴇ sᴀᴠᴇᴅ ✅*" };
    else if (type === "videoMessage") sendContent = { video: buffer, caption: "> *ᴅʀᴜᴢᴢ xᴅ: ᴠɪᴅᴇᴏ sᴀᴠᴇᴅ ✅*" };
    else if (type === "audioMessage") sendContent = { audio: buffer, mimetype: "audio/mpeg", fileName: "audio.mp3" };
    else if (type === "stickerMessage") sendContent = { sticker: buffer };
    else return await natsu.sendMessage(jid, { text: "*❌ ᴜɴsᴜᴘᴘᴏʀᴛᴇᴅ ᴛʏᴘᴇ.*" }, { quoted: msg });
    await natsu.sendMessage(selfJid, sendContent);
    await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: ✅ ᴍᴇᴅɪᴀ sᴀᴠᴇᴅ ᴛᴏ ʏᴏᴜʀ ᴍᴇssᴀɢᴇs.*" }, { quoted: msg });
  } catch (e) {
    await natsu.sendMessage(jid, { text: "*❌ sᴀᴠᴇ ᴇʀʀᴏʀ:* " + e.message }, { quoted: msg });
  }
}
