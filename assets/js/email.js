/* ========== EMAIL SERVICE (EmailJS Integration) ========== */
const EmailService = {
  // Get your keys from https://www.emailjs.com/
  SERVICE_ID: 'service_rhencel', // Change this to your EmailJS service ID
  TEMPLATE_ID: 'template_password_reset', // Change this to your template ID
  PUBLIC_KEY: 'YOUR_PUBLIC_KEY_HERE', // Change this to your EmailJS public key

  // Initialize EmailJS (call this once when page loads)
  init() {
    // Check if EmailJS is already loaded, if not load it
    if (typeof emailjs === 'undefined') {
      console.warn('EmailJS library not loaded. Add script: https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/index.min.js');
    } else {
      emailjs.init(this.PUBLIC_KEY);
    }
  },

  // Send password reset email
  async sendResetEmail(email, resetLink) {
    try {
      if (typeof emailjs === 'undefined') {
        console.error('EmailJS not loaded');
        return { success: false, message: 'Email service not available. Please try again later.' };
      }

      const response = await emailjs.send(
        this.SERVICE_ID,
        this.TEMPLATE_ID,
        {
          to_email: email,
          reset_link: resetLink,
          user_email: email,
          from_name: 'Rhencel Coffee Shop'
        },
        this.PUBLIC_KEY
      );

      if (response.status === 200) {
        return { success: true, message: 'Reset link sent to your email' };
      }
    } catch (error) {
      console.error('Email sending error:', error);
      return { success: false, message: 'Failed to send email. Please try again.' };
    }
  }
};

/* ========== DEMO MODE: Email Preview (Development Only) ========== */
const EmailDemo = {
  // For testing/demo purposes - shows email in alert instead of sending
  showEmailPreview(email, resetLink) {
    const preview = `
═════════════════════════════════════════
📧 EMAIL PREVIEW (Development Mode)
═════════════════════════════════════════

TO: ${email}
SUBJECT: Rhencel Coffee - Password Reset Request

─────────────────────────────────────────
Dear User,

Click the link below to reset your password:

${resetLink}

This link will expire in 24 hours.

If you didn't request this, ignore this email.

Best regards,
Rhencel Coffee Shop Team
═════════════════════════════════════════
    `;
    alert(preview);
  }
};
