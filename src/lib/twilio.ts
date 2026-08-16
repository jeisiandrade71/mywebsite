import Twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const apiKeySid = process.env.TWILIO_API_KEY_SID;
const apiKeySecret = process.env.TWILIO_API_KEY_SECRET;

if (!accountSid || !apiKeySid || !apiKeySecret) {
  throw new Error(
    "Missing TWILIO_ACCOUNT_SID / TWILIO_API_KEY_SID / TWILIO_API_KEY_SECRET environment variables"
  );
}

const twilioClient = Twilio(apiKeySid, apiKeySecret, { accountSid });

export default twilioClient;

export async function sendSms(to: string, body: string) {
  const from = process.env.TWILIO_SMS_NUMBER;
  if (!from) {
    throw new Error("Missing TWILIO_SMS_NUMBER environment variable");
  }
  return twilioClient.messages.create({ from, to, body });
}
