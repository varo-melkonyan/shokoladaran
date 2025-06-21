import VendorClientPage from "./VendorClientPage";

export default function Page({ params }: { params: { _id: string } }) {
  return <VendorClientPage slug={params._id} />;
}