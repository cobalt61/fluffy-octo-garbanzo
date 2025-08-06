const express = require("express");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
