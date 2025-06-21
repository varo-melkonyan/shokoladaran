import CollectionClientPage from "./CollectionClientPage";

export default async function Page({ params }: {params: Promise<{ slug: string }>}) {
  const { slug } = await params;
  return <CollectionClientPage slug={slug} />;
}