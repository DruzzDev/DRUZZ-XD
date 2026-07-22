export const name = "delete";

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  const quoted = msg.message?.extendedTextMessage?.contextInfo;
  if (!quoted?.stanzaId) {
    return await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: ⚠️ ʀᴇᴘʟʏ ᴛᴏ ᴛʜᴇ ᴍᴇssᴀɢᴇ ᴛᴏ ᴅᴇʟᴇᴛᴇ.*" }, { quoted: msg });
  }
  try {
    await natsu.sendMessage(jid, {
      delete: {
        remoteJid: jid,
        fromMe: false,
        id: quoted.stanzaId,
        participant: quoted.participant,
      },
    });
  } catch (e) {
    await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: ❌ ᴜɴᴀʙʟᴇ ᴛᴏ ᴅᴇʟᴇᴛᴇ ᴛʜɪs ᴍᴇssᴀɢᴇ.*" }, { quoted: msg });
  }
}
