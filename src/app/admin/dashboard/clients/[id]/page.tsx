import { UnderConstruction } from "@/components/ui/under-construction";

interface ClientDetailsPageProps {
  params: {
    id: string;
  };
}

export default function ClientDetailsPage({ params }: ClientDetailsPageProps) {
  return (
    <UnderConstruction
      title="Client Details"
      description="The detailed client view is currently being developed. You'll be able to view comprehensive client information, edit details, and manage client-specific settings here soon."
    />
  );
}
