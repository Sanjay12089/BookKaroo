import { PartnerLayout } from '../components/PartnerLayout';

interface PartnerComingSoonPageProps {
  title: string;
  description?: string;
}

export default function PartnerComingSoonPage({ title, description }: PartnerComingSoonPageProps) {
  return (
    <PartnerLayout>
      <div className="max-w-[1280px] mx-auto px-6 py-12">
        <h1 className="text-2xl font-display font-bold text-text-primary">{title}</h1>
        <p className="text-sm text-text-secondary mt-2">
          {description ?? 'This section is coming soon. The backend endpoints are already live — UI is being finalised.'}
        </p>
      </div>
    </PartnerLayout>
  );
}
