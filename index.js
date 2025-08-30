const express = require("express");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

// Thumbnail endpoint (your original)
app.get("/thumbnail/:userid", async (req, res) => {
  const userId = req.params.userid;
  const robloxApi = `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=420x420&format=Png&isCircular=false`;

  try {
    const response = await fetch(robloxApi);
    const data = await response.json();

    if (data.data && data.data[0] && data.data[0].imageUrl) {
      res.json({ url: data.data[0].imageUrl });
    } else {
      res.status(404).json({ error: "No image found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// New: Fetch small servers for a game
app.get("/small-server/:placeId", async (req, res) => {
  const placeId = req.params.placeId;
  const robloxApi = `https://games.roblox.com/v1/games/${placeId}/servers/Public?limit=100&sortOrder=Asc`;

  try {
    const response = await fetch(robloxApi);
    const data = await response.json();

    if (!data.data) return res.status(404).json({ error: "No servers found" });

    // Filter for servers with 1 player
    // Filter for small PUBLIC servers
const smallServers = data.data.filter(server => 
    server.playing === 1 && !server.privateServerId
);


    if (smallServers.length === 0) return res.json({ message: "No small servers right now" });

    res.json({ servers: smallServers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
