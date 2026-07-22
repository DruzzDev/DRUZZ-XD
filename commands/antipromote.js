import { statusProtections } from "../protections.js";

export const name = "antipromote";

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  if (!args[0] || !["on", "off"].includes(args[0])) {
    return await natsu.sendMessage(jid, {
      text: `> *ᴅʀᴜᴢᴢ xᴅ: ᴀɴᴛɪ-ᴘʀᴏᴍᴏᴛᴇ ɪs ${statusProtections.antiPromote ? "ᴇɴᴀʙʟᴇᴅ" : "ᴅɪsᴀʙʟᴇᴅ"}*\n*ᴜsᴀɢᴇ: .ᴀɴᴛɪᴘʀᴏᴍᴏᴛᴇ <on/off>*`,
    }, { quoted: msg });
  }
  statusProtections.antiPromote = args[0] === "on";
  await natsu.sendMessage(jid, { text: `> *ᴅʀᴜᴢᴢ xᴅ: ᴀɴᴛɪ-ᴘʀᴏᴍᴏᴛᴇ ${args[0] === "on" ? "ᴇɴᴀʙʟᴇᴅ ✅" : "ᴅɪsᴀʙʟᴇᴅ ❌"} !*` }, { quoted: msg });
}
