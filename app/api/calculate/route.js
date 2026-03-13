import { generateSolarDesigns } from '../../../lib/solarCalculations';
import { lookupSunHours } from '../../../lib/solarData';

export async function POST(request) {
  try {
    const body = await request.json();
    const { location, appliances } = body;

    if (!appliances || !Array.isArray(appliances) || appliances.length === 0) {
      return Response.json(
        { error: 'Please provide at least one appliance' },
        { status: 400 }
      );
    }

    // Validate appliances
    for (const a of appliances) {
      if (!a.name || !a.watt || !a.hours || !a.qty) {
        return Response.json(
          { error: `Invalid appliance data: ${JSON.stringify(a)}` },
          { status: 400 }
        );
      }
      if (a.watt <= 0 || a.hours <= 0 || a.qty <= 0) {
        return Response.json(
          { error: 'Wattage, hours, and quantity must be positive numbers' },
          { status: 400 }
        );
      }
    }

    // Lookup solar data
    const locationData = lookupSunHours(location || 'Lagos');

    // Run calculation engine
    const results = generateSolarDesigns(appliances, locationData.sunHours);

    return Response.json({
      success: true,
      location: locationData,
      ...results,
    });
  } catch (error) {
    console.error('Calculation error:', error);
    return Response.json(
      { error: 'Failed to calculate solar system. Please try again.' },
      { status: 500 }
    );
  }
}
