export const name = "listonline";

// BUGFIX: this command used to read natsu.chats, which does not exist unless
// a full Baileys store is attached (this bot doesn't use one), so the result
// was always empty. It now uses the presence tracker set up in index.js
// (global.presenceStore) together with a live presence subscription for each
// group member.
//
// Note: WhatsApp only pushes presence updates for JIDs you're subscribed to,
// and only while the other person is actively using the app (typing,
// recording, etc.) — there is no persistent "online" flag exposed by the
// API, so this is a best-effort snapshot, not a guaranteed real-time list.
export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  if (!jid.endsWith("@g.us")) {
    return await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: ɢʀᴏᴜᴘ-ᴏɴʟʏ ᴄᴏᴍᴍᴀɴᴅ.*" }, { quoted: msg });
  }
  try {
    const meta = await natsu.groupMetadata(jid);
    const botId = natsu.user?.id;

    // Subscribe to presence for every member so WhatsApp starts pushing us updates.
    await Promise.allSettled(
      meta.participants
        .filter((p) => p.id !== botId)
        .map((p) => natsu.presenceSubscribe(p.id).catch(() => {}))
    );

    // Give WhatsApp a moment to push back any presence events.
    await new Promise((resolve) => setTimeout(resolve, 2500));

    const ONLINE_WINDOW_MS = 60_000;
    const now = Date.now();
    const online = meta.participants
      .filter((p) => p.id !== botId)
      .filter((p) => {
        const info = global.presenceStore.get(p.id);
        return info && now - info.updatedAt <= ONLINE_WINDOW_MS && info.lastKnown !== "unavailable";
      })
      .map((p, i) => `*${i + 1}.* @${p.id.split("@")[0]}`)
      .join("\n");

    await natsu.sendMessage(jid, {
      text: `> ╭════𓈃════╮\n> 👤 𝗗𝗥𝗨𝗭𝗭 𝗫𝗗 - 𝗟𝗜𝗦𝗧 𝗢𝗡𝗟𝗜𝗡𝗘\n> ╰════𓈃════╯\n<==================>\n${online || "> *ɴᴏ ᴍᴇᴍʙᴇʀs ᴄᴜʀʀᴇɴᴛʟʏ ᴅᴇᴛᴇᴄᴛᴇᴅ ᴀs ᴏɴʟɪɴᴇ (ᴡʜᴀᴛsᴀᴘᴘ ᴏɴʟʏ ʀᴇᴘᴏʀᴛs ᴘʀᴇsᴇɴᴄᴇ ᴡʜɪʟᴇ sᴏᴍᴇᴏɴᴇ ɪs ᴀᴄᴛɪᴠᴇʟʏ ᴜsɪɴɢ ᴛʜᴇ ᴀᴘᴘ).*"}`,
      mentions: meta.participants.map((p) => p.id),
    }, { quoted: msg });
  } catch (e) {
    await natsu.sendMessage(jid, { text: `> ⚠️ *ᴅʀᴜᴢᴢ xᴅ: ᴜɴᴀʙʟᴇ ᴛᴏ ʀᴇᴛʀɪᴇᴠᴇ ᴛʜᴇ ʟɪsᴛ.*\n*ʀᴇᴀsᴏɴ: ${e.message}*` }, { quoted: msg });
  }
}
