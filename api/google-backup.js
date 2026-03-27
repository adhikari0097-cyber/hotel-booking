const GAS_URL = "https://script.google.com/macros/s/AKfycbzS5RnKirIjPyf0-5Ky5kktbmo3ecSlwpo6c21ur9Ey6zTIxmEFEUCCR8ngujmDJarZYw/exec";

function setCorsHeaders(res, contentType = "application/json") {
  res.setHeader("Content-Type", contentType);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

module.exports = async (req, res) => {
  try {
    if (req.method === "OPTIONS") {
      setCorsHeaders(res);
      res.status(200).end();
      return;
    }

    if (req.method === "GET") {
      const search = new URLSearchParams(req.query || {});
      const response = await fetch(`${GAS_URL}?${search.toString()}`, { method: "GET" });
      const text = await response.text();
      setCorsHeaders(res, response.headers.get("content-type") || "application/json");
      res.status(response.status).send(text);
      return;
    }

    if (req.method === "POST") {
      const contentType = req.headers["content-type"] || "application/x-www-form-urlencoded";
      const body = typeof req.body === "string"
        ? req.body
        : contentType.includes("application/x-www-form-urlencoded")
          ? new URLSearchParams(req.body || {}).toString()
          : JSON.stringify(req.body || {});

      const response = await fetch(GAS_URL, {
        method: "POST",
        headers: { "Content-Type": contentType },
        body,
      });
      const text = await response.text();
      setCorsHeaders(res, response.headers.get("content-type") || "application/json");
      res.status(response.status).send(text);
      return;
    }

    setCorsHeaders(res);
    res.status(405).json({ success: false, message: "Method not allowed" });
  } catch (error) {
    setCorsHeaders(res);
    res.status(500).json({ success: false, message: error.message || "Proxy failed" });
  }
};
