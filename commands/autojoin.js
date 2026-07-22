import { CHANNELS, NEWSLETTER_IDS } from "../index.js";

export const name = "autojoin";

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;

  if (!args[0] || !["on", "off", "status"].includes(args[0])) {
    return await natsu.sendMessage(jid, {
      text: `> 𝗗𝗥𝗨𝗭𝗭 𝗫𝗗: 📡 Auto-join Newsletter\n\nUsage:\n.autojoin on — join the official channels\n.autojoin off — unsubscribe from the channels\n.autojoin status — view the channels\n\n🌐 Channels:\n${CHANNELS.whatsapp1}\n${CHANNELS.whatsapp2}`,
    }, { quoted: msg });
  }

  if (args[0] === "status") {
    return await natsu.sendMessage(jid, {
      text: `> *ᴅʀᴜᴢᴢ xᴅ: 📡 ᴏғғɪᴄɪᴀʟ ᴄᴀɴᴀʟ ᴅʀᴜᴢᴢ*\n\n*🌐 ᴡʜᴀᴛsᴀᴘᴘ 1:*\n${CHANNELS.whatsapp1}\n\n*🌐 WhatsApp 2:*\n${CHANNELS.whatsapp2}\n\n*📱 Telegram:*\n${CHANNELS.telegram1}\n${CHANNELS.telegram2}`,
    }, { quoted: msg });
  }

  const results = [];
  for (const newsletterId of NEWSLETTER_IDS) {
    try {
      if (args[0] === "on") {
        if (typeof natsu.newsletterFollow === "function") {
          await natsu.newsletterFollow(newsletterId);
          results.push(`✅ ʀᴇᴊᴏɪɴᴛ : ${newsletterId}`);
        } else {
          results.push(`⚠️ newsletterFollow not available`);
        }
      } else if (args[0] === "off") {
        if (typeof natsu.newsletterUnfollow === "function") {
          await natsu.newsletterUnfollow(newsletterId);
          results.push(`✅ Left: ${newsletterId}`);
        } else {
          results.push(`⚠️ newsletterUnfollow not available`);
        }
      }
    } catch (e) {
      results.push(`❌ Error for ${newsletterId}: ${e.message}`);
    }
  }

  await natsu.sendMessage(jid, {
    text: `> *ᴅʀᴜᴢᴢ xᴅ: 📡 ᴀᴜᴛᴏ-ᴊᴏɪɴ ʀᴇsᴜʟᴛ:*\n\n${results.join("\n")}`,
  }, { quoted: msg });
}
