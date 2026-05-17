const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys")
const readline = require("readline")

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("session")
  const { version } = await fetchLatestBaileysVersion()

  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: false
  })

  sock.ev.on("creds.update", saveCreds)

  // seulement si pas connecté
  if (!sock.authState.creds.registered) {
    rl.question("Entre ton numéro WhatsApp : ", async (num) => {
      const code = await sock.requestPairingCode(num)
      console.log("Pairing code :", code)
      rl.close()
    })
  }

  console.log("Bot lancé")
}

startBot()
