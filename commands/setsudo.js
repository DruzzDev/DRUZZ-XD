import { addSudo, normalizeNumber } from "../index.js";

export const name = "setsudo";

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
  const raw = mentioned ? mentioned.split("@")[0] : args[0];
  const bare = normalizeNumber(raw);
  if (!bare) {
    return await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: ᴜsᴀɢᴇ: .sᴇᴛsᴜᴅᴏ @ᴍᴇɴᴛɪᴏɴ ᴏʀ .sᴇᴛsᴜᴅᴏ 509 xxx xxx*" }, { quoted: msg });
  }
  const updated = addSudo(bare);
  await natsu.sendMessage(jid, { text: `> *ᴅʀᴜᴢᴢ xᴅ: ✅ ${bare} ᴀᴅᴅᴇᴅ ᴛᴏ sᴜᴅᴏ.\nᴀᴄᴛɪᴠᴇ sᴜᴅᴏ: ${updated.join(", ")}*` }, { quoted: msg });
}
