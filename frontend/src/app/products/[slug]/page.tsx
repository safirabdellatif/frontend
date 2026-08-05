import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PRODUCT_LIST } from "@/content/products";
import { ProductPageClient } from "./ProductPageClient";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return PRODUCT_LIST.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = PRODUCT_LIST.find((p) => p.slug === params.slug);
  if (!product) return {};
  return {
    title: product.nameAr,
    description: product.heroSubheading,
  };
}

export default function ProductPage({ params }: Props) {
  const product = PRODUCT_LIST.find((p) => p.slug === params.slug);
  if (!product) notFound();
  return <ProductPageClient product={product} />;
}
