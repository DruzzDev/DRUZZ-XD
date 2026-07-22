import { statusProtections } from "../protections.js";

export const name = "antibot";

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  if (!args[0] || !["on", "off"].includes(args[0])) {
    return await natsu.sendMessage(jid, {
      text: `> *ᴅʀᴜᴢᴢ xᴅ: ᴀɴᴛɪ-ʙᴏᴛ ${statusProtections.antiBot ? "ᴇɴᴀʙʟᴇᴅ" : "ᴅɪsᴀʙʟᴇᴅ"}*\n*ᴜsᴀɢᴇ: .ᴀɴᴛɪʙᴏᴛ <ᴏɴ/ᴏғғ>*`,
    }, { quoted: msg });
  }
  statusProtections.antiBot = args[0] === "on";
  await natsu.sendMessage(jid, { text: `> *ᴅʀᴜᴢᴢ xᴅ: ᴀɴᴛɪʙᴏᴛ ${args[0] === "ᴏɴ" ? "ᴇɴᴀʙʟᴇᴅ ✅" : "ᴅɪsᴀʙʟᴇᴅ ❌"} !*` }, { quoted: msg });
}
