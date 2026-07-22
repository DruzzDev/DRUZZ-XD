export const name = "device";

// BUGFIX: this command used to send a real, visible "check" text message to
// 3 device-suffixed JIDs for the target number. In practice WhatsApp routes
// those to the person's actual chat regardless of the device suffix, so it
// silently spammed the target with "check" messages instead of doing any
// real device detection. WhatsApp also doesn't expose a linked-device count
// for other accounts through the API, so there is no reliable way to answer
// "how many devices does this number have". Instead, this now does a
// non-intrusive check of whether the number is registered on WhatsApp at all
// (via onWhatsApp), which sends nothing visible to the target.
export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
  const target = mentioned || (jid.endsWith("@g.us") ? msg.key.participant : jid);
  const num = target?.split("@")[0];
  if (!num) return await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: ᴜɴᴀʙʟᴇ ᴛᴏ ᴅᴇᴛᴇʀᴍɪɴᴇ ᴛʜᴇ ᴜsᴇʀ.*" }, { quoted: msg });

  try {
    const [result] = await natsu.onWhatsApp(num);
    if (!result?.exists) {
      return await natsu.sendMessage(jid, {
        text: `> *ᴅʀᴜᴢᴢ xᴅ: 📱 @${num} ᴅᴏᴇs ɴᴏᴛ ᴀᴘᴘᴇᴀʀ ᴛᴏ ʙᴇ ʀᴇɢɪsᴛᴇʀᴇᴅ ᴏɴ ᴡʜᴀᴛsᴀᴘᴘ.*`,
        mentions: [target],
      }, { quoted: msg });
    }
    await natsu.sendMessage(jid, {
      text: `> *ᴅʀᴜᴢᴢ xᴅ: 📱 @${num} ɪs ʀᴇɢɪsᴛᴇʀᴇᴅ ᴏɴ ᴡʜᴀᴛsᴀᴘᴘ.*\n*ɴᴏᴛᴇ: ᴡʜᴀᴛsᴀᴘᴘ ᴅᴏᴇs ɴᴏᴛ ᴇxᴘᴏsᴇ ʜᴏᴡ ᴍᴀɴʏ ᴅᴇᴠɪᴄᴇs ᴀʀᴇ ʟɪɴᴋᴇᴅ ᴛᴏ ᴀɴᴏᴛʜᴇʀ ᴀᴄᴄᴏᴜɴᴛ, sᴏ ᴀ ᴅᴇᴠɪᴄᴇ ᴄᴏᴜɴᴛ ᴄᴀɴɴᴏᴛ ʙᴇ sʜᴏᴡɴ ʜᴇʀᴇ.*`,
      mentions: [target],
    }, { quoted: msg });
  } catch (e) {
    await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: ❌ ᴜɴᴀʙʟᴇ ᴛᴏ ᴄʜᴇᴄᴋ ᴛʜᴀᴛ ɴᴜᴍʙᴇʀ:* " + (e?.message ?? e) }, { quoted: msg });
  }
}
