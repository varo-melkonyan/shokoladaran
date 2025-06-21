import VendorClientPage from "./VendorClientPage";

export default async function Page({params}: {params: Promise<{ id: string }>}) {
    const { id } = await params;
    return <VendorClientPage slug={id} />;
}