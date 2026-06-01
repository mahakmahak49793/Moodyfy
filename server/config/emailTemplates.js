const getOTPEmailTemplate = (otp) => `
  <div class="font-serif max-w-[480px] mx-auto py-10 px-8 rounded-2xl border border-slate-200 bg-white">

    <!-- Logo -->
    <div class="flex items-center gap-3 mb-8">
      <div class="w-10 h-10 rounded-xl bg-[rgb(3,131,153)] flex items-center justify-center text-[20px] leading-10 text-center">
        🌿
      </div>
      <div>
        <div class="font-serif text-[20px] font-medium tracking-[0.05em] text-slate-800 leading-tight">
          Moodyfy
        </div>
        <div class="font-sans text-[11px] font-light tracking-[0.02em] text-slate-400">
          Emotional wellness journal
        </div>
      </div>
    </div>

    <!-- Divider -->
    <hr class="border-none border-t border-slate-100 mb-7" />

    <!-- Body -->
    <h2 class="font-serif text-[22px] font-medium text-slate-800 m-0 mb-2">
      Verify your email
    </h2>

    <p class="font-sans text-sm text-slate-500 font-light leading-relaxed m-0 mb-7">
      Welcome to Moodyfy! Use the code below to complete your signup.
      It expires in <strong class="text-slate-600">10 minutes</strong>.
    </p>

    <!-- OTP Box -->
    <div class="text-center mb-8">
      <div class="inline-block font-mono text-[38px] font-bold tracking-[0.35em] text-[rgb(3,131,153)] bg-[rgba(3,131,153,0.07)] py-[18px] px-7 rounded-xl border border-[rgba(3,131,153,0.15)]">
        ${otp}
      </div>
    </div>

  </div>
`;

module.exports = { getOTPEmailTemplate };