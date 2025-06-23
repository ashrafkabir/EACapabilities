import { useQuery } from "@tanstack/react-query";
import DiagramsList from "@/components/diagrams-list";

export default function DiagramsPage() {
  const { data: applications = [] } = useQuery({
    queryKey: ["/api/applications"],
  });

  return (
    <div className="container mx-auto p-6">
      <DiagramsList applications={applications} />
    </div>
  );
}