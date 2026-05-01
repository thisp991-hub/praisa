import { getBusinessProfile } from "@/app/actions/business";
import { QRCodeGenerator } from "./qr-generator";

export default async function QRCodePage() {
  const profile = await getBusinessProfile();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">QR Code</h1>
      <p className="mt-2 text-gray-600">
        Generate a QR code that links to your feedback page.
      </p>

      {profile ? (
        <QRCodeGenerator
          businessSlug={profile.business_slug}
          businessName={profile.business_name}
        />
      ) : (
        <div className="mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-6">
          <h2 className="text-lg font-semibold text-yellow-800">
            Set up your business first
          </h2>
          <p className="mt-2 text-sm text-yellow-700">
            Go to{" "}
            <a
              href="/dashboard/settings"
              className="font-medium underline hover:no-underline"
            >
              Settings
            </a>{" "}
            and enter your business name to generate a QR code.
          </p>
        </div>
      )}
    </div>
  );
}
