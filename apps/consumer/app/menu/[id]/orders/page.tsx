import { redirect } from "next/navigation";

export default async function OrdersRedirectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  // They hit /orders without an ID. We can redirect them back to the menu
  // Or render a dedicated page. Redirecting to menu is safer if it's meant to be a drawer.
  redirect(`/menu/${id}`);
}
