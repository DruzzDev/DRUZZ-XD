export const name = "purge";

// BUGFIX: this command used to just print "Purging..." and delete nothing at
// all. It now actually deletes the last N tracked messages in the chat,
// using the per-chat message history collected in index.js
// (global.recentByChat). Deleting other members' messages for everyone
// requires the bot to be a group admin; the bot's own messages can always
// be deleted for everyone.
export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  const count = parseInt(args[0]) || 10;
  if (count > 50) return await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: ᴍᴀxɪᴍᴜᴍ 50 ᴍᴇssᴀɢᴇs ᴀᴛ ᴀ ᴛɪᴍᴇ.*" }, { quoted: msg });

  try {
    const history = global.recentByChat?.get(jid) || [];
    if (!history.length) {
      return await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: ⚠️ ɴᴏ ᴛʀᴀᴄᴋᴇᴅ ᴍᴇssᴀɢᴇs ᴛᴏ ᴘᴜʀɢᴇ ɪɴ ᴛʜɪs ᴄʜᴀᴛ ʏᴇᴛ.*" }, { quoted: msg });
    }

    // Take the most recent `count` messages (excluding the purge command itself).
    const targets = history.filter((m) => m.id !== msg.key.id).slice(-count);

    const results = await Promise.allSettled(
      targets.map((t) =>
        natsu.sendMessage(jid, {
          delete: { remoteJid: jid, id: t.id, participant: t.fromMe ? undefined : t.participant, fromMe: t.fromMe },
        })
      )
    );
    const ok = results.filter((r) => r.status === "fulfilled").length;

    // Remove purged entries from the tracked history so they aren't purged twice.
    const remaining = history.filter((m) => !targets.some((t) => t.id === m.id));
    global.recentByChat.set(jid, remaining);

    await natsu.sendMessage(jid, {
      text: `> *ᴅʀᴜᴢᴢ xᴅ: ⚜️ ᴘᴜʀɢᴇᴅ ${ok}/${targets.length} ᴍᴇssᴀɢᴇs.${ok < targets.length ? " (sᴏᴍᴇ ᴍᴇssᴀɢᴇs ᴄᴏᴜʟᴅ ɴᴏᴛ ʙᴇ ᴅᴇʟᴇᴛᴇᴅ — ɪ ᴍᴀʏ ɴᴇᴇᴅ ᴛᴏ ʙᴇ ᴀ ɢʀᴏᴜᴘ ᴀᴅᴍɪɴ ᴛᴏ ᴅᴇʟᴇᴛᴇ ᴏᴛʜᴇʀ ᴍᴇᴍʙᴇʀs' ᴍᴇssᴀɢᴇs)" : ""}`,
    });
  } catch (e) {
    await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: ❌ ᴇʀʀᴏʀ ᴅᴜʀɪɴɢ ᴘᴜʀɢᴇ:* " + (e?.message ?? e) }, { quoted: msg });
  }
}
