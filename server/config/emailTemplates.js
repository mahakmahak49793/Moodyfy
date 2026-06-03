const getOTPEmailTemplate = (otp) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#f4f4f0;font-family:Georgia,serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f0;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;background:#ffffff;border-radius:16px;border:1px solid #e2e8f0;overflow:hidden;">

          <!-- Top accent bar -->
          <tr>
            <td style="height:4px;background:rgb(3,131,153);"></td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px 40px;">

              <!-- Logo -->
              <table cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="vertical-align:middle;">
                    <div style="width:42px;height:42px;background:rgb(3,131,153);border-radius:10px;text-align:center;line-height:42px;font-size:20px;display:inline-block;">
                      🌿
                    </div>
                  </td>
                  <td style="vertical-align:middle;padding-left:12px;">
                    <div style="font-family:Georgia,serif;font-size:19px;font-weight:600;color:#1e293b;letter-spacing:0.03em;line-height:1.2;">
                      Moodyfy
                    </div>
                    <div style="font-family:Arial,sans-serif;font-size:11px;color:#94a3b8;font-weight:300;letter-spacing:0.02em;">
                      Emotional wellness journal
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <div style="height:1px;background:#f1f5f9;margin-bottom:28px;"></div>

              <!-- Heading -->
              <h2 style="font-family:Georgia,serif;font-size:22px;font-weight:600;color:#1e293b;margin:0 0 10px 0;line-height:1.3;">
                Verify your email
              </h2>

              <!-- Subtext -->
              <p style="font-family:Arial,sans-serif;font-size:14px;color:#64748b;font-weight:300;line-height:1.7;margin:0 0 28px 0;">
                Welcome to Moodyfy! Use the code below to complete your signup.
                It expires in <strong style="color:#475569;font-weight:600;">10 minutes</strong>.
              </p>

              <!-- OTP Box -->
              <div style="text-align:center;margin-bottom:32px;">
                <div style="display:inline-block;font-family:'Courier New',monospace;font-size:38px;font-weight:700;letter-spacing:0.35em;color:rgb(3,131,153);background:rgba(3,131,153,0.07);padding:18px 32px;border-radius:12px;border:1px solid rgba(3,131,153,0.18);">
                  ${otp}
                </div>
              </div>

              <!-- Warning note -->
              <div style="background:#f8fafc;border-radius:10px;padding:14px 18px;margin-bottom:28px;">
                <p style="font-family:Arial,sans-serif;font-size:12px;color:#94a3b8;margin:0;line-height:1.6;">
                  🔒 If you didn't request this, you can safely ignore this email. Never share this code with anyone.
                </p>
              </div>

              <!-- Divider -->
              <div style="height:1px;background:#f1f5f9;margin-bottom:24px;"></div>

              <!-- Footer -->
              <p style="font-family:Arial,sans-serif;font-size:11px;color:#cbd5e1;text-align:center;margin:0;line-height:1.6;">
                © 2026 Moodyfy · Made with care for your inner world
              </p>

            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
`;

module.exports = { getOTPEmailTemplate };