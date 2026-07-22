import { removeSudo, normalizeNumber } from "../index.js";

export const name = "delsudo";

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
  const raw = mentioned ? mentioned.split("@")[0] : args[0];
  const bare = normalizeNumber(raw);
  if (!bare) {
    return await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: ᴜsᴀɢᴇ: .ᴅᴇʟsᴜᴅᴏ @ᴍᴇɴᴛɪᴏɴ ᴏʀ .ᴅᴇʟsᴜᴅᴏ 509 xxx xxx*" }, { quoted: msg });
  }
  const updated = removeSudo(bare);
  if (updated !== false) {
    await natsu.sendMessage(jid, { text: `> *ᴅʀᴜᴢᴢ xᴅ: 🗑️ ɴᴜᴍʙᴇʀ ${bare} ʜᴀs ʙᴇᴇɴ ʀᴇᴍᴏᴠᴇᴅ ғʀᴏᴍ sᴜᴅᴏ.*` }, { quoted: msg });
  } else {
    await natsu.sendMessage(jid, { text: `> *ᴅʀᴜᴢᴢ xᴅ: ⚠️ ɴᴜᴍʙᴇʀ ${bare} ᴡᴀs ɴᴏᴛ ɪɴ ᴛʜᴇ sᴜᴅᴏ ʟɪsᴛ.*` }, { quoted: msg });
  }
}
