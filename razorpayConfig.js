const Razorpay = require("razorpay");

let client;

// Created lazily so the app still starts (and the rest of the site works)
// even if the Razorpay keys are missing from .env.
module.exports.getRazorpay = () => {
  const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    const err = new Error(
      "Razorpay keys are missing. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env",
    );
    err.statusCode = 500;
    throw err;
  }
  if (!client) {
    client = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
    });
  }
  return client;
};

// The Key ID is public by design (checkout.js needs it). The Key Secret is not.
module.exports.keyId = () => process.env.RAZORPAY_KEY_ID;

module.exports.isTestMode = () =>
  (process.env.RAZORPAY_KEY_ID || "").startsWith("rzp_test_");
