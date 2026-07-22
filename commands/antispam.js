import { statusProtections } from "../protections.js";

export const name = "antispam";

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  if (!args[0] || !["on", "off"].includes(args[0])) {
    return await natsu.sendMessage(jid, {
      text: `> *ᴅʀᴜᴢᴢ xᴅ: ᴀɴᴛɪsᴘᴀᴍ ɪs ${statusProtections.antiSpam ? "ᴇɴᴀʙʟᴇᴅ" : "ᴅɪsᴀʙʟᴇᴅ"}*\n*ᴜsᴀɢᴇ: .ᴀɴᴛɪsᴘᴀᴍ <on/off>*`,
    }, { quoted: msg });
  }
  statusProtections.antiSpam = args[0] === "on";
  await natsu.sendMessage(jid, { text: `> *ᴅʀᴜᴢᴢ xᴅ: ᴀɴᴛɪ-sᴘᴀᴍ ${args[0] === "on" ? "ᴇɴᴀʙʟᴇᴅ ✅" : "ᴅɪsᴀʙʟᴇᴅ ❌"} !*` }, { quoted: msg });
}
