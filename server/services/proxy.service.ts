import axios from "axios";
import type { Request, Response } from "express";

const rewriteM3U8 = (content: string, baseUrl: string): string => {
  return content
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      if (trimmed === "" || trimmed.startsWith("#")) return line;

      const absoluteUrl = trimmed.startsWith("http")
        ? trimmed
        : baseUrl + trimmed;

      if (absoluteUrl.includes(".m3u8")) {
        return `/api/proxy?url=${encodeURIComponent(absoluteUrl)}`;
      }
      return `/api/proxy/segment?url=${encodeURIComponent(absoluteUrl)}`;
    })
    .join("\n");
};

export const proxyStream = async (req: Request, res: Response) => {
  try {
    const url = req.query.url as string;
    if (!url) return res.status(400).json({ message: "url required" });

    const response = await axios.get<string>(url, { responseType: "text" });
    const baseUrl = url.substring(0, url.lastIndexOf("/") + 1);
    const modified = rewriteM3U8(response.data, baseUrl);

    res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.send(modified);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Proxy error" });
  }
};

export const proxySegment = async (req: Request, res: Response) => {
  try {
    const url = req.query.url as string;
    if (!url) return res.status(400).json({ message: "url required" });

    const response = await axios.get(url, { responseType: "stream" });

    res.setHeader(
      "Content-Type",
      (response.headers["content-type"] as string) ?? "video/MP2T",
    );
    res.setHeader("Access-Control-Allow-Origin", "*");
    response.data.pipe(res);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Segment error" });
  }
};
