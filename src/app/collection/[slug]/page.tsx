import CollectionClientPage from "./CollectionClientPage";

export default function Page({ params }: { params: { slug: string } }) {
  return <CollectionClientPage slug={params.slug} />;
}