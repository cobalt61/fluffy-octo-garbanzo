const express = require("express");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

// Thumbnail endpoint
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

// Small-server endpoint (always fetches fresh data)
app.get("/small-server/:placeId", async (req, res) => {
  const placeId = req.params.placeId;
  const robloxApi = `https://games.roblox.com/v1/games/${placeId}/servers/Public?limit=100&sortOrder=Asc`;

  try {
    const response = await fetch(robloxApi);
    const data = await response.json();

    if (!data.data) return res.status(404).json({ error: "No servers found" });

    // Filter for small PUBLIC servers (1 player, not private)
    const smallServers = data.data.filter(server => 
      server.playing === 1 && !server.privateServerId
    );

    if (smallServers.length === 0) return res.json({ message: "No small servers right now" });

    // Pick a random index between 5 and 15, capped by array length
    const minIndex = 5;
    const maxIndex = 15;
    const index = Math.min(
      Math.floor(Math.random() * (maxIndex - minIndex + 1)) + minIndex,
      smallServers.length - 1
    );

    const chosenServer = smallServers[index];

    res.json({ server: chosenServer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
