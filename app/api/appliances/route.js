import appliancePresets, { getCategories } from '../../../lib/appliancePresets';

export async function GET() {
  return Response.json({
    success: true,
    categories: getCategories(),
    appliances: appliancePresets,
  });
}
