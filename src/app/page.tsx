import LandingContent from "@/components/LandingContent";
import { listActiveServices } from "@/lib/services";

export const revalidate = 60;

export default async function Home() {
  const services = await listActiveServices();
  const phone = process.env.TWILIO_SMS_NUMBER || "";

  return (
    <LandingContent
      phone={phone}
      services={services.map((s) => ({
        id: s._id.toString(),
        name: s.name,
        description: s.description,
        priceCents: s.priceCents,
        durationMinutes: s.durationMinutes,
      }))}
    />
  );
}
