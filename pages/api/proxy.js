import axios from 'axios';

export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).send("No URL");

  try {
    const targetUrl = decodeURIComponent(url);
    const response = await axios.get(targetUrl, {
      responseType: 'arraybuffer', // สำคัญ: โหลดรูปมาเป็นไฟล์ดิบ
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': new URL(targetUrl).origin // หลอกว่ามาจากเว็บต้นทาง
      },
      timeout: 15000
    });

    res.setHeader('Content-Type', response.headers['content-type']);
    res.setHeader('Cache-Control', 'public, max-age=86400'); // เก็บ Cache 1 วัน
    return res.send(response.data);
  } catch (err) {
    console.error("Proxy Fail:", err.message);
    return res.status(500).send("Error");
  }
}