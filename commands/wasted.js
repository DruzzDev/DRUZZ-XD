import axios from "axios";

export const name = "wasted";

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  try {
    const isGroup = jid.endsWith("@g.us");
    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
    const participant = msg.message?.extendedTextMessage?.contextInfo?.participant;
    let userToWaste = mentioned?.length ? mentioned[0] : participant || null;
    if (!userToWaste) {
      return await natsu.sendMessage(jid, { text: "*⚠️ ᴍᴇɴᴛɪᴏɴ sᴏᴍᴇᴏɴᴇ ᴏʀ ʀᴇᴘʟʏ ᴛᴏ ᴛʜᴇɪʀ ᴍᴇssᴀɢᴇ ᴛᴏ ᴜsᴇ .ᴡᴀsᴛᴇᴅ*" }, { quoted: msg });
    }
    let profilePic;
    try { profilePic = await natsu.profilePictureUrl(userToWaste, "image"); }
    catch { profilePic = "https://i.imgur.com/2wzGhpF.jpeg"; }
    // BUGFIX: this was pointing at "some-random-api.com" (the docs/marketing
    // site), not the actual REST API host "api.some-random-api.com", so the
    // request always failed and the command always fell through to the
    // generic error message below.
    const apiUrl = `https://api.some-random-api.com/canvas/overlay/wasted?avatar=${encodeURIComponent(profilePic)}`;
    const response = await axios.get(apiUrl, { responseType: "arraybuffer" });
    await natsu.sendMessage(jid, { image: Buffer.from(response.data), caption: `*⚰️ Wasted : ${userToWaste.split("@")[0]} 💀\n\nʀᴇsᴛ ɪɴ ᴘᴇᴀᴄᴇ…*` }, { quoted: msg });
    if (isGroup) {
      try {
        await natsu.groupParticipantsUpdate(jid, [userToWaste], "remove");
        await natsu.sendMessage(jid, { text: `*🚨 ${userToWaste.split("@")[0]} ᴡᴀs ʀᴇᴍᴏᴠᴇᴅ ғʀᴏᴍ ᴛʜᴇ ɢʀᴏᴜᴘ!*` });
      } catch {}
    }
  } catch (e) {
    await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: ❌ ᴜɴᴀʙʟᴇ ᴛᴏ ᴄʀᴇᴀᴛᴇ ᴛʜᴇ ᴡᴀsᴛᴇᴅ ɪᴍᴀɢᴇ. ᴛʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ. (" + (e?.message ?? e) + ")*" }, { quoted: msg });
  }
}
