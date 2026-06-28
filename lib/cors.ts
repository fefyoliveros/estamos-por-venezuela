export const PUBLIC_CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export function corsPreFlight(): Response {
  return new Response(null, { status: 204, headers: PUBLIC_CORS_HEADERS })
}
