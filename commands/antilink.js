import { statusProtections } from "../protections.js";

export const name = "antilink";

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  if (!args[0] || !["on", "off"].includes(args[0])) {
    return await natsu.sendMessage(jid, {
      text: `> *ᴅʀᴜᴢᴢ xᴅ: ᴀɴᴛɪ-ʟɪɴᴋ ɪs ${statusProtections.antiLink ? "ᴇɴᴀʙʟᴇᴅ" : "ᴅɪsᴀʙʟᴇᴅ"}*\n*ᴜsᴀɢᴇ: .ᴀɴᴛɪʟɪɴᴋ <ᴏɴ/ᴏғғ>*`,
    }, { quoted: msg });
  }
  statusProtections.antiLink = args[0] === "on";
  await natsu.sendMessage(jid, { text: `> *ᴅʀᴜᴢᴢ xᴅ: ᴀɴᴛɪ-ʟɪɴᴋ ${args[0] === "on" ? "ᴇɴᴀʙʟᴇᴅ ✅" : "ᴅɪsᴀʙʟᴇᴅ ❌"} !*` }, { quoted: msg });
}
