export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, location, systemType, message } = body;

    if (!name || !phone) {
      return Response.json(
        { error: 'Name and phone are required' },
        { status: 400 }
      );
    }

    // In MVP, log the lead and return success
    // In production, this would save to PostgreSQL
    const lead = {
      id: Date.now(),
      name,
      email: email || '',
      phone,
      location: location || '',
      systemType: systemType || 'unknown',
      message: message || '',
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    console.log('📧 New Lead Submitted:', lead);

    return Response.json({
      success: true,
      message: 'Your request has been submitted! An installer will contact you shortly.',
      leadId: lead.id,
    });
  } catch (error) {
    console.error('Lead submission error:', error);
    return Response.json(
      { error: 'Failed to submit your request. Please try again.' },
      { status: 500 }
    );
  }
}
