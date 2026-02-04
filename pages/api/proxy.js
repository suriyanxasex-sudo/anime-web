import axios from 'axios';

export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).send("No URL provided");

  try {
    const targetUrl = decodeURIComponent(url);
    const response = await axios.get(targetUrl, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
        'Referer': new URL(targetUrl).origin,
      },
      timeout: 10000
    });

    res.setHeader('Content-Type', response.headers['content-type'] || 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.send(response.data);
  } catch (err) {
    console.error("Proxy Error:", err.message);
    return res.status(500).send("Proxy failed to fetch image");
  }
}