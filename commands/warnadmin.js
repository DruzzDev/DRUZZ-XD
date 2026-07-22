import { statusProtections } from "../protections.js";

export const name = "warnadmin";

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  if (!args[0] || !["on", "off"].includes(args[0])) {
    return await natsu.sendMessage(jid, {
      text: `> *ᴅʀᴜᴢᴢ xᴅ: ᴡᴀʀɴᴀᴅᴍɪɴ ɪs ${statusProtections.warnAdmin ? "ᴇɴᴀʙʟᴇᴅ" : "ᴅɪsᴀʙʟᴇᴅ"}\nᴜsᴀɢᴇ: .ᴡᴀʀɴᴀᴅᴍɪɴ <ᴏɴ/ᴏғғ>*`,
    }, { quoted: msg });
  }
  statusProtections.warnAdmin = args[0] === "on";
  await natsu.sendMessage(jid, { text: `> *ᴅʀᴜᴢᴢ xᴅ: ᴡᴀʀɴᴀᴅᴍɪɴ ${args[0] === "ᴏɴ" ? "ᴇɴᴀʙʟᴇᴅ ✅" : "ᴅɪsᴀʙʟᴇᴅ ❌"} !*` }, { quoted: msg });
}
