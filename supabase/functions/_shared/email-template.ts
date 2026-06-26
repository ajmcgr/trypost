// Shared branded email template (Rocket-style)
// White card on light-gray background, centered Post logo, blue CTA, muted footer.

const LOGO_URL = "https://trypost.ai/email-logo.png";
const SITE_URL = "https://trypost.ai";

export interface EmailTemplateOptions {
  preheader?: string;
  heading: string;
  body: string; // plain text or simple HTML
  ctaLabel?: string;
  ctaUrl?: string;
  footerNote?: string;
}

export function renderEmail(opts: EmailTemplateOptions): string {
  const {
    preheader = "",
    heading,
    body,
    ctaLabel,
    ctaUrl,
    footerNote = "You're receiving this because you have an account with Post.",
  } = opts;

  const cta = ctaLabel && ctaUrl
    ? `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:24px 0 8px;">
        <tr><td>
          <a href="${ctaUrl}" style="display:inline-block;background:#136ed5;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:12px 22px;border-radius:10px;">${ctaLabel}</a>
        </td></tr>
      </table>`
    : "";

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0f172a;">
  <span style="display:none;visibility:hidden;opacity:0;height:0;width:0;overflow:hidden;">${preheader}</span>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f3f4f6;padding:48px 16px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:16px;border:1px solid #e5e7eb;">
        <tr><td style="padding:36px 40px 24px;text-align:center;">
          <img src="${LOGO_URL}" alt="Post" height="32" style="height:32px;width:auto;display:inline-block;" />
        </td></tr>
        <tr><td style="padding:0 40px;"><div style="height:1px;background:#e5e7eb;"></div></td></tr>
        <tr><td style="padding:28px 40px 8px;">
          <h1 style="margin:0 0 12px;font-size:20px;line-height:1.35;font-weight:700;color:#0f172a;">${heading}</h1>
          <div style="font-size:15px;line-height:1.6;color:#334155;">${body}</div>
          ${cta}
        </td></tr>
        <tr><td style="padding:24px 40px 32px;"><div style="height:1px;background:#e5e7eb;margin-bottom:20px;"></div>
          <p style="margin:0;text-align:center;font-size:13px;color:#94a3b8;">${footerNote}</p>
        </td></tr>
      </table>
      <p style="margin:16px 0 0;font-size:12px;color:#94a3b8;">© Post · <a href="${SITE_URL}" style="color:#94a3b8;text-decoration:none;">trypost.ai</a></p>
    </td></tr>
  </table>
</body></html>`;
}
