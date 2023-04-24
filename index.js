require("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const fileUpload = require("express-fileupload");
const Discord = require("discord.js");
const { compressNumber, decompressNumber } = require("./compress");
const { Client, GatewayIntentBits } = require("discord.js");

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

  res.set("Content-Type", "text/plain");

  if (!auth || auth !== password) {
    res.status(401).send("Authentication required || Incorrect password");
    return;
  }

  const file = req.files.file;
  const channelID = process.env.DISCORD_CHANNEL_ID;
  const channel = client.channels.cache.get(channelID);
  try {
    let ext = file.name.split(".").pop() || "nofile";
    const m = await channel.send({
      content: `${file.name}`,
      files: [
        {
          attachment: file.data,
          name: `f.${ext}`,
          description: "File!",
        },
      ],
    });
    const url = m.attachments.first().url;

    if (process.env.RETURN_ORIGINAL_URL == false) {
      res.send(url);
      return;
    }

    const segs = url.split("/");
    console.log(segs);
    const a = compressNumber(segs[4]);
    const b = compressNumber(segs[5]);
    const c = segs[6];

    res.send(
      req.protocol + "://" + req.get("host") + "/" + a + "/" + b + "/" + ext
    );
  } catch (e) {
    res.status(400).send(e.toString());
  }
});

app.get("/:a/:b/:c", (req, res) => {
  const { a, b, c } = req.params;
  const path = `${decompressNumber(a)}/${decompressNumber(b)}/f.${c}`;
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
