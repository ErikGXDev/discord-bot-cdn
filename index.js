require("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const fileUpload = require("express-fileupload");
const Discord = require("discord.js");

const { Client, GatewayIntentBits } = require("discord.js");

function compressNumber(num) {
  num = BigInt(num);
  const base = 26n;
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let compressed = "";

  while (num > 0n) {
    const remainder = num % BigInt(base);
    compressed = letters[Number(remainder)] + compressed;
    num = num / base;
  }

  return compressed;
}

function decompressNumber(compressed) {
  const base = 26n;
  let num = 0n;

  for (let i = 0; i < compressed.length; i++) {
    const digitValue = BigInt(compressed.charCodeAt(i) - "A".charCodeAt(0));
    num = num * base + digitValue;
  }

  return num;
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

const app = express();

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// Set up Express middleware to require password for file uploads
const password = process.env.UPLOAD_PASSWORD;
// Set up Express middleware to handle file uploads
app.use(
  fileUpload({
    limits: { fileSize: 25 * 1024 * 1024 },
  })
);

// Set up Express route to handle file uploads
app.post("/upload", async (req, res) => {
  const auth = req.headers.authorization || req.body.password;

  if (!auth || auth !== password) {
    res.set("Content-Type", "text/plain");
    res.status(401).send("Authentication required || Incorrect password");
    return;
  }

  const file = req.files.file;
  const channelID = process.env.DISCORD_CHANNEL_ID;
  const channel = client.channels.cache.get(channelID);
  if (channel && file) {
    const m = await channel.send({
      content: `${file.name}`,
      files: [
        {
          attachment: file.data,
          name: `${file.name}`,
          description: "File!",
        },
      ],
    });
    const url = m.attachments.first().url;

    const segs = url.split("/");
    console.log(segs);
    const a = compressNumber(segs[4]);
    const b = compressNumber(segs[5]);
    const c = segs[6];

    res.send(
      req.protocol + "://" + req.get("host") + "/" + a + "/" + b + "/" + c
    );
  } else {
    res.status(400).send("Bad Request");
  }
});

app.get("/:a/:b/:c", (req, res) => {
  const { a, b, c } = req.params;
  const path = `${decompressNumber(a)}/${decompressNumber(b)}/${c}`;
  console.log(path);
  const url = "https://cdn.discordapp.com/attachments/" + path;
  console.log(url);
  res.redirect(url);
});

// Start the Express server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});

// Log in the Discord bot
const token = process.env.DISCORD_BOT_TOKEN;
client
  .login(token)
  .then(() => {
    console.log("Discord bot logged in");
  })
  .catch((error) => {
    console.error("Discord bot login error:", error);
  });
