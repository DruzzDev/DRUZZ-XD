import { BOT_NAME, OWNER_NUMBERS, CHANNELS } from "../index.js";

export const name = "owner";

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;

  const text = `╔═══•❥🔷•❥═══•❥🔷•❥═══╗
        ㉿ ${BOT_NAME} ㉿
╚═══•❥🔷•❥═══•❥🔷•❥═══╝

╔══════•⊰•••⊱•══════╗
   ㉿ 𝗗𝗘𝗩 : 𝗗𝗥𝗨𝗭𝗭 ㉿
╚══════•⊰•••⊱•══════╝

│ ❤ *ᴊᴏɪɴ ᴛʜᴇ ${BOT_NAME} ᴄᴏᴍᴍᴜɴɪᴛʏ*
│ 
│ *𒑡  ᴏᴡɴᴇʀ 1 : +${OWNER_NUMBERS[0]}*
│ *𒑡  ᴏᴡɴᴇʀ 2   : +${OWNER_NUMBERS[1]}*
│ *𒑡  ᴛᴇʟᴇɢʀᴀᴍ : ${CHANNELS.telegram1}*

╭─•⊰㉿ ᴏғғɪᴄɪᴀʟ ᴄʜᴀɴɴᴇʟs ㉿⊱•─╮
│ *𒑡 ᴡʜᴀᴛsᴀᴘᴘ :*  
│ ${CHANNELS.whatsapp1}  
│
│ *𒑡 ᴡʜᴀᴛsᴀᴘᴘ 2 :*
│ ${CHANNELS.whatsapp2}
│
│ *𒑡 ᴛᴇʟᴇɢʀᴀᴍ :* 
│ ${CHANNELS.telegram2}  
╰━━━━━━━•⊰••••⊱•━━━━━━━╯`;

  await natsu.sendMessage(jid, { text }, { quoted: msg });
}
