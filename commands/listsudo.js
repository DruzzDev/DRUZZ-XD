import { loadSudo } from "../index.js";

export const name = "listsudo";

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  const list = loadSudo();
  if (!list.length) {
    return await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: 📋 ɴᴏ sᴜᴅᴏ ᴜsᴇʀs sᴇᴛ.*" }, { quoted: msg });
  }
  const text = `> *ᴅʀᴜᴢᴢ xᴅ: 📋 sᴜᴅᴏ list:*\n${list.map((n, i) => `${i + 1}. +${n}`).join("\n")}`;
  await natsu.sendMessage(jid, { text }, { quoted: msg });
}
