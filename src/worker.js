import { EmailMessage } from "cloudflare:email";

const DEST = "matthew@porterhome.com";
const FROM = "contact@mostest.com";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/contact" && request.method === "POST") {
      return handleContact(request, env);
    }
    return env.ASSETS.fetch(request);
  },
};

async function handleContact(request, env) {
  const form = await request.formData();
  const name = (form.get("name") || "").toString().trim().slice(0, 200);
  const email = (form.get("email") || "").toString().trim().slice(0, 200);
  const message = (form.get("message") || "").toString().trim().slice(0, 5000);

  // ponytail: honeypot is the whole spam strategy; add Turnstile if bots find it
  if (form.get("website")) return json({ ok: true });

  if (!name || !message || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return json({ ok: false, error: "All three fields are required." }, 400);
  }

  const raw = [
    `From: Mostest Contact <${FROM}>`,
    `Reply-To: ${name.replace(/[\r\n"]/g, "")} <${email}>`,
    `To: ${DEST}`,
    `Subject: mostest.com contact from ${name.replace(/[\r\n]/g, "")}`,
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: <${crypto.randomUUID()}@mostest.com>`,
    `MIME-Version: 1.0`,
    `Content-Type: text/plain; charset=utf-8`,
    ``,
    `Name: ${name}`,
    `Email: ${email}`,
    ``,
    message,
  ].join("\r\n");

  try {
    await env.CONTACT_EMAIL.send(new EmailMessage(FROM, DEST, raw));
  } catch (err) {
    console.log("send failed:", err.message);
    return json({ ok: false, error: "Could not send right now. Email matthew@porterhome.com directly." }, 502);
  }
  return json({ ok: true });
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
