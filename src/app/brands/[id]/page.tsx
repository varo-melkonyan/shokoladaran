import VendorClientPage from "./VendorClientPage";

export default function Page({ params }: { params: { id: string } }) {
  return <VendorClientPage slug={params.id} />;
}