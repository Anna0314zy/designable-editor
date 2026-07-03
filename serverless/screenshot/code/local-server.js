const http = require("http");
const { handler } = require("./index");

const port = Number(process.env.PORT || 9000);
const host = process.env.SERVER_HOST || "0.0.0.0";

if (!process.env.SHOT_URL) {
  process.env.SHOT_URL = "http://127.0.0.1:5173";
}

function createLocalResponse(res) {
  let sent = false;

  return {
    setStatusCode(code) {
      res.statusCode = code;
    },
    setHeader(name, value) {
      res.setHeader(name, value);
    },
    send(body) {
      if (sent) return;
      sent = true;
      res.end(body);
    },
  };
}

const server = http.createServer(async (req, res) => {
  if (req.method === "GET" && req.url === "/health") {
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify({ ok: true, shotUrl: process.env.SHOT_URL }));
    return;
  }

  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify({ success: false, message: "Only POST is supported" }));
    return;
  }

  try {
    await handler(req, createLocalResponse(res), {});
  } catch (error) {
    res.statusCode = 500;
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify({ success: false, message: error.message }));
  }
});

server.listen(port, host, () => {
  console.log(`screenshot server: http://${host}:${port}`);
  console.log(`SHOT_URL: ${process.env.SHOT_URL}`);
  console.log("POST page snapshot JSON to /");
});
