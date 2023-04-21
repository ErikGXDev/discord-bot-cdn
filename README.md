# Discord Bot CDN

Discord Bot CDN is a Node.js program that allows you to store files up to 25mb using Discord's CDN and a Discord bot. It works by having a web server that allows file uploads, which then get uploaded by a bot to the Discord CDN. The CDN links get shortened using a base26 encoding (all letters from a to z).

## Installation

1. Create a bot using the Discord Developer Portal.
2. (recommended) Create a new Discord server.
3. Create a channel in said Discord server.
4. Clone the repository.
5. Run `npm install` to install the necessary packages.
6. Create a `.env` file with the following keys:
   - `UPLOAD_PASSWORD`: An upload password to prevent abuse.
   - `DISCORD_BOT_TOKEN`: Your bot token.
   - `DISCORD_CHANNEL_ID`: The channel ID of the channel.
   - `RETURN_ORIGINAL_URL`: set to `false` if you want to get the original Discord CDN URL.
7. Run `node index.js` to start the program.

## How it Works

1. A user uploads a file to the web server.
2. The web server checks the password and file size limit.
3. The file is uploaded to Discord's CDN using the Discord API and a bot token.
4. The bot retrieves the CDN URL and encodes it using base26.
5. The encoded URL is returned to the user.

## Example Usage

1. User visits the web server.
2. User enters the upload password.
3. User selects a file to upload.
4. The file is uploaded and a shortened URL is returned to the user.
5. The user shares the shortened URL with others to access the file.

## Conclusion

Discord Bot CDN is a simple and efficient way to store and share files up to 25mb using Discord's CDN and a Discord bot. With this CDN, you can easily upload and share files with your friends and community without having to worry about storage limits. Use the steps above to install and start using Discord Bot CDN today!
