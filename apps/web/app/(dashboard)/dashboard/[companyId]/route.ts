import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { companyId: string } }
) {
  // Mock KPI data
  const data = {
    companyId: params.companyId,
    activeUsers: 1024,
    new7d: 132,
    churn30d: 4.2,
    mrr: 48200,
    arpu: 47.1,
    minutes: 21600,
    trend: [640, 690, 720, 770, 810, 890, 920],
  };

  return NextResponse.json(data);
}
