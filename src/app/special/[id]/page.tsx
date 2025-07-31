import { notFound } from "next/navigation";
import { getSpecialsById } from "@/lib/special";
import SpecialClient from "./SpecialClient";

export default async function SpecialPage({params}: {params: Promise<{ id: string }>}) {
  const { id } = await params;
  const specialSpecial = await getSpecialsById(id);
  if (!specialSpecial) return notFound();

 return <SpecialClient special={specialSpecial} />;
}
