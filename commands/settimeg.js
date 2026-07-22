export const name = "settimeg";

const groupSchedules = {};

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  if (!jid.endsWith("@g.us")) {
    return await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: ɢʀᴏᴜᴘ-ᴏɴʟʏ ᴄᴏᴍᴍᴀɴᴅ.*" }, { quoted: msg });
  }
  if (args.length < 2) {
    return await natsu.sendMessage(jid, {
      text: "> *ᴅʀᴜᴢᴢ xᴅ: ᴜsᴀɢᴇ: .sᴇᴛᴛɪᴍᴇɢ ʜʜ:ᴍᴍ <ᴏᴘᴇɴ/ᴄʟᴏsᴇ>\nᴇxᴀᴍᴘʟᴇ: .sᴇᴛᴛɪᴍᴇɢ 08:00 ᴏᴘᴇɴ*",
    }, { quoted: msg });
  }
  const [time, action] = args;
  if (!["open", "close"].includes(action)) {
    return await natsu.sendMessage(jid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: ᴀᴄᴛɪᴏɴ ᴍᴜsᴛ ʙᴇ 'open' ᴏʀ 'close'.*" }, { quoted: msg });
  }
  if (!groupSchedules[jid]) groupSchedules[jid] = [];
  groupSchedules[jid].push({ time, action });

  if (!groupSchedules._interval) {
    groupSchedules._interval = setInterval(async () => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      for (const [gid, tasks] of Object.entries(groupSchedules)) {
        if (gid === "_interval") continue;
        for (const task of tasks) {
          if (task.time === currentTime) {
            try {
              if (task.action === "open") {
                await natsu.groupSettingUpdate(gid, "not_announcement");
                await natsu.sendMessage(gid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: 🟢 ᴛʜᴇ ɢʀᴏᴜᴘ ɪs ɴᴏᴡ ᴏᴘᴇɴ!*" });
              } else {
                await natsu.groupSettingUpdate(gid, "announcement");
                await natsu.sendMessage(gid, { text: "> *ᴅʀᴜᴢᴢ xᴅ: 🔴 ᴛʜᴇ ɢʀᴏᴜᴘ ɪs ɴᴏᴡ ᴄʟᴏsᴇᴅ!*" });
              }
            } catch (e) { console.error("settimeg error:", e); }
          }
        }
      }
    }, 60 * 1000);
  }
  await natsu.sendMessage(jid, { text: `> *ᴅʀᴜᴢᴢ xᴅ: ✅ sᴄʜᴇᴅᴜʟᴇᴅ: ${action} ᴀᴛ ${time}!*` }, { quoted: msg });
}
