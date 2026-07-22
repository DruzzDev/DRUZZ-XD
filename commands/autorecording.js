export const name = "autorecording";

let autoRecording = false;

export function isAutoRecording() { return autoRecording; }

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  if (!args[0] || !["on", "off"].includes(args[0])) {
    return await natsu.sendMessage(jid, { text: `> *ᴅʀᴜᴢᴢ xᴅ: 🎙️ ᴀᴜᴛᴏʀᴇᴄᴏʀᴅɪɴɢ ɪs ${autoRecording ? "ᴇɴᴀʙʟᴇᴅ" : "disabled"}*\n*ᴜsᴀɢᴇ: .ᴀᴜᴛᴏʀᴇᴄᴏʀᴅɪɴɢ <on/off>*` }, { quoted: msg });
  }
  autoRecording = args[0] === "on";
  await natsu.sendMessage(jid, { text: `> *ᴅʀᴜᴢᴢ xᴅ: 🎙️ ᴀᴜᴛᴏʀᴇᴄᴏʀᴅɪɴɢ ${autoRecording ? "ᴇɴᴀʙʟᴇᴅ ✅" : "ᴅɪsᴀʙʟᴇᴅ ❌"}*` }, { quoted: msg });
}
