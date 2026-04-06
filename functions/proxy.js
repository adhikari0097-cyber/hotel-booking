const GAS_URL = "https://script.google.com/macros/s/AKfycbypc1C0YynLPOpXZo6RtSmeOlq3rXWWbp6cGT_RM0c2CJSJV8AKCBFAFpLJv04X-uc-/exec";

function buildHeaders(contentType) {
  return {
    "content-type": contentType || "application/json",
    "access-control-allow-origin": "*",
  };
}

exports.handler = async (event) => {
  try {
    const method = event.httpMethod || "GET";

    if (method === "GET") {
      const params = new URLSearchParams(event.queryStringParameters || {});
      const url = `${GAS_URL}?${params.toString()}`;
      const response = await fetch(url, { method: "GET" });
      const text = await response.text();
      return {
        statusCode: response.status,
        headers: buildHeaders(response.headers.get("content-type")),
        body: text,
      };
    }

    if (method === "POST") {
      const contentType =
        event.headers["content-type"] ||
        event.headers["Content-Type"] ||
        "application/x-www-form-urlencoded";

      const response = await fetch(GAS_URL, {
        method: "POST",
        headers: { "Content-Type": contentType },
        body: event.body || "",
      });
      const text = await response.text();
      return {
        statusCode: response.status,
        headers: buildHeaders(response.headers.get("content-type")),
        body: text,
      };
    }

    return {
      statusCode: 405,
      headers: buildHeaders(),
      body: JSON.stringify({ success: false, message: "Method not allowed" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: buildHeaders(),
      body: JSON.stringify({ success: false, message: error.message }),
    };
  }
};
