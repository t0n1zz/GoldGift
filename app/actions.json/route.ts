import { NextResponse } from "next/server";
import { corsPreflight, withCors } from "@/lib/utils/actions-cors";

/**
 * Solana Blinks discovery: maps website paths to Action API paths.
 * Must be at domain root and return CORS Allow-Origin: *.
 * @see https://solana.com/developers/guides/advanced/actions#actionsjson
 */
export async function GET() {
  const body = {
    rules: [
      { pathPattern: "/create", apiPath: "/api/actions/create-gift" },
      { pathPattern: "/create/**", apiPath: "/api/actions/create-gift" },
      { pathPattern: "/claim/*", apiPath: "/api/actions/claim-gift/*" },
    ],
  };
  return NextResponse.json(body, {
    status: 200,
    headers: withCors() as HeadersInit,
  });
}

export async function OPTIONS() {
  return corsPreflight();
}
