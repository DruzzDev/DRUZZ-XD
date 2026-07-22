import { statusProtections } from "../protections.js";

export const name = "antidemote";

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  if (!args[0] || !["on", "off"].includes(args[0])) {
    return await natsu.sendMessage(jid, {
      text: `> *ᴅʀᴜᴢᴢ xᴅ: ᴀɴᴛɪ-ᴅᴇᴍᴏᴛᴇ ${statusProtections.antiDemote ? "ᴇɴᴀʙʟᴇᴅ" : "ᴅɪsᴀʙʟᴇᴅ"}*\n*ᴜsᴀɢᴇ: .ᴀɴᴛɪᴅᴇᴍᴏᴛᴇ <ᴏɴ/ᴏғғ>*`,
    }, { quoted: msg });
  }
  statusProtections.antiDemote = args[0] === "on";
  await natsu.sendMessage(jid, { text: `> *ᴅʀᴜᴢᴢ xᴅ: ᴀɴᴛɪᴅᴇᴍᴏᴛᴇ ${args[0] === "on" ? "ᴇɴᴀʙʟᴇᴅ ✅" : "ᴅɪsᴀʙʟᴇᴅ ❌"} !*` }, { quoted: msg });
}
