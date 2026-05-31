const getOTPEmailTemplate = (otp) => `
  <div style="
    font-family: Georgia, 'Times New Roman', serif;
    max-width: 480px;
    margin: auto;
    padding: 40px 32px;
    border-radius: 16px;
    border: 1px solid #e2e8f0;
    background: #ffffff;
  ">

    <!-- Logo -->
    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 32px;">
      <div style="
        width: 40px;
        height: 40px;
        border-radius: 12px;
        background: rgb(3, 131, 153);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        line-height: 40px;
        text-align: center;
      ">🌿</div>
      <div>
        <div style="
          font-family: Georgia, serif;
          font-size: 20px;
          font-weight: 500;
          letter-spacing: 0.05em;
          color: #1e293b;
          line-height: 1.2;
        ">Moodyfy</div>
        <div style="
          font-family: Arial, sans-serif;
          font-size: 11px;
          font-weight: 300;
          color: #94a3b8;
          letter-spacing: 0.02em;
        ">Emotional wellness journal</div>
      </div>
    </div>

    <!-- Divider -->
    <hr style="border: none; border-top: 1px solid #f1f5f9; margin-bottom: 28px;" />

    <!-- Body -->
    <h2 style="
      font-family: Georgia, serif;
      font-size: 22px;
      font-weight: 500;
      color: #1e293b;
      margin: 0 0 8px;
    ">Verify your email</h2>

    <p style="
      font-family: Arial, sans-serif;
      font-size: 14px;
      color: #64748b;
      font-weight: 300;
      line-height: 1.6;
      margin: 0 0 28px;
    ">
      Welcome to Moodyfy! Use the code below to complete your signup.
      It expires in <strong style="color: #475569;">10 minutes</strong>.
    </p>

    <!-- OTP Box -->
    <div style="text-align: center; margin: 0 0 32px;">
      <div style="
        display: inline-block;
        font-family: 'Courier New', monospace;
        font-size: 38px;
        font-weight: 700;
        letter-spacing: 14px;
        color: rgb(3, 131, 153);
        background: rgba(3, 131, 153, 0.07);
        padding: 18px 28px;
        border-radius: 14px;
        border: 1px solid rgba(3, 131, 153, 0.15);
      ">${otp}</div>
    </div>

  

  </div>
`;

module.exports = { getOTPEmailTemplate };