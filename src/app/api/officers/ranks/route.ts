import { prisma } from "@/lib/db";

export async function GET() {
  const rows = await prisma.officer.findMany({
    where: { is_active: true, rank: { not: "" } },
    select: { rank: true },
    distinct: ["rank"],
    orderBy: { rank: "asc" },
  });
  return Response.json(rows.map((r) => r.rank));
}
