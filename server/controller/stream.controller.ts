import axios from "axios";
import type { Request, Response } from "express";

export const streamController = async (req: Request, res: Response) => {
  try {
    const url = req.query.url as string;
    if (!url) return res.status(400).json({ message: "url required" });

    const response = await axios.get(url, { responseType: "text" });

    console.log("=== RAW M3U8 ===");
    console.log(response.data); // ← shu nima chiqaradi?

    const baseUrl = url.substring(0, url.lastIndexOf("/") + 1);
    const modified = (response.data as string)
      .split("\n")
      .map((line: string) => {
        const trimmed = line.trim();
        if (trimmed.startsWith("#") || trimmed === "") return line;
        const absoluteUrl = trimmed.startsWith("http")
          ? trimmed
          : baseUrl + trimmed;
        const proxied = `/api/proxy/segment?url=${encodeURIComponent(absoluteUrl)}`;
        console.log(`segment: ${trimmed} → ${proxied}`); // ← mapping tekshirish
        return proxied;
      })
      .join("\n");

    res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.send(modified);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Proxy error" });
  }
};
