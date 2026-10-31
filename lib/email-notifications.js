const nodemailer = require('nodemailer');

function text(value, max = 500) {
  return String(value == null ? '' : value).trim().slice(0, max);
}

function html(value, max = 500) {
  return text(value, max).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}

function getConfig() {
  const port = Number(process.env.SMTP_PORT || 587);
  return {
    host: text(process.env.SMTP_HOST || 'smtp.gmail.com', 200),
    port: Number.isFinite(port) ? port : 587,
    secure: String(process.env.SMTP_SECURE || '').toLowerCase() === 'true' || port === 465,
    user: text(process.env.SMTP_USER, 320),
    pass: String(process.env.SMTP_PASS || ''),
    to: text(process.env.EMAIL_NOTIFICATION_TO || process.env.SMTP_USER, 320),
    fromName: text(process.env.EMAIL_FROM_NAME || 'Teklimakan', 120)
  };
}

function isConfigured(config = getConfig()) {
  return Boolean(config.host && config.port && config.user && config.pass && config.to);
}

function createTransport(config) {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: { user: config.user, pass: config.pass },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000
  });
}

function buildOrderHtml(order) {
  const customer = order && typeof order.customer === 'object' ? order.customer : {};
  const items = Array.isArray(order?.items) ? order.items.slice(0, 50) : [];
  const rows = items.map((item, index) => `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #e2e8f0">${index + 1}. ${html(item?.name, 200)}</td>
      <td style="padding:8px;border-bottom:1px solid #e2e8f0;text-align:center">${html(item?.quantity, 20)}</td>
      <td style="padding:8px;border-bottom:1px solid #e2e8f0;text-align:right">${html(item?.priceFormatted || item?.price, 50)}</td>
    </tr>`).join('');

  return `<!doctype html><html lang="ug" dir="rtl"><body style="font-family:Arial,sans-serif;color:#0f172a">
    <div style="max-width:640px;margin:auto;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden">
      <div style="background:#0f172a;color:#fff;padding:20px;text-align:center">
        <h2 style="margin:0">تەكلىماكان — يېڭى زاكاز</h2>
        <p style="margin:8px 0 0">#${html(order?.id, 80)}</p>
      </div>
      <div style="padding:20px">
        <p><b>خېرىدار:</b> ${html(customer?.name, 200)}</p>
        <p><b>تېلېفون:</b> ${html(customer?.phone, 50)}</p>
        <p><b>ئادرېس:</b> ${html(customer?.city, 100)} ${html(customer?.district, 100)} ${html(customer?.address, 800)}</p>
        <p><b>چىقىم:</b> ${html(order?.paymentMethod, 200)}</p>
        <table style="width:100%;border-collapse:collapse"><tbody>${rows || '<tr><td>مەھسۇلات ئۇچۇرى يوق</td></tr>'}</tbody></table>
        <p style="font-size:18px"><b>ئومۇمىي:</b> ${html(order?.totalFormatted || order?.totalCny, 80)}</p>
        ${order?.notes ? `<p><b>ئەسكەرتىش:</b> ${html(order.notes, 1000)}</p>` : ''}
      </div>
    </div>
  </body></html>`;
}

async function sendOrderEmail(order) {
  const config = getConfig();
  if (!isConfigured(config)) return { success: false, configured: false };
  const orderId = text(order?.id || 'N/A', 80);
  const total = text(order?.totalFormatted || order?.totalCny || '', 80);
  const info = await createTransport(config).sendMail({
    from: { name: config.fromName, address: config.user },
    to: config.to,
    subject: `[Teklimakan] يېڭى زاكاز #${orderId}${total ? ` — ${total}` : ''}`,
    html: buildOrderHtml(order)
  });
  return { success: true, configured: true, messageId: info.messageId || '' };
}

async function sendTestEmail() {
  const config = getConfig();
  if (!isConfigured(config)) return { success: false, configured: false };
  const info = await createTransport(config).sendMail({
    from: { name: config.fromName, address: config.user },
    to: config.to,
    subject: '[Teklimakan] ئېلخەت ئۇقتۇرۇش ئۇلىنىش سىنىقى',
    text: 'تەكلىماكان server-side ئېلخەت ئۇقتۇرۇشى مۇۋەپپەقىيەتلىك ئۇلاندى.'
  });
  return { success: true, configured: true, messageId: info.messageId || '' };
}

module.exports = { getConfig, isConfigured, sendOrderEmail, sendTestEmail };
