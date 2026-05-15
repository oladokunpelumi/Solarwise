import React from 'react';
import { Resend } from 'resend';
import InstallerQuoteEmail from '../../emails/InstallerQuoteEmail';

export const runtime = 'nodejs';

const LIMITS = {
  name: 100,
  email: 254,
  phone: 32,
  location: 180,
  systemType: 40,
  message: 1200,
  applianceCount: 40,
  applianceName: 120,
  systemLabel: 100,
  systemDescription: 180,
  systemSpec: 80,
};

function cleanString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function boundedString(value, max, fieldName, errors) {
  const string = cleanString(value);

  if (string.length > max) {
    errors.push(`${fieldName} must be ${max} characters or fewer.`);
  }

  return string;
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function formatMetric(value, suffix = '', maximumFractionDigits = 2) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 'Not provided';
  }

  const formatted = new Intl.NumberFormat('en-US', {
    maximumFractionDigits,
  }).format(number);

  return `${formatted}${suffix}`;
}

function formatKwFromWatts(watts) {
  const number = Number(watts);

  if (!Number.isFinite(number)) {
    return 'Not provided';
  }

  return formatMetric(number / 1000, ' kW', 1);
}

function getLocationLabel(location, errors) {
  if (typeof location === 'string') {
    return boundedString(location, LIMITS.location, 'Location', errors);
  }

  if (!location || typeof location !== 'object') {
    return '';
  }

  const city = cleanString(location.city);
  const country = cleanString(location.country);
  const region = cleanString(location.region);
  const label = [city, region, country].filter(Boolean).join(', ') || cleanString(location.name);

  return boundedString(label, LIMITS.location, 'Location', errors);
}

function normalizeSystem(system, errors) {
  if (!system || typeof system !== 'object') {
    return null;
  }

  return {
    type: boundedString(system.type, LIMITS.systemType, 'System type', errors),
    label: boundedString(system.label, LIMITS.systemLabel, 'System label', errors),
    description: boundedString(system.description, LIMITS.systemDescription, 'System description', errors),
    panelCount: system.panelCount,
    panelWatt: system.panelWatt,
    totalPanelPower: system.totalPanelPower,
    batteryCount: system.batteryCount,
    batterySpec: boundedString(system.batterySpec, LIMITS.systemSpec, 'Battery spec', errors),
    batteryCapacityKWh: system.batteryCapacityKWh,
    inverterKVA: system.inverterKVA,
    chargeController: system.chargeController,
    autonomyDays: system.autonomyDays,
  };
}

function normalizeAppliances(appliances, errors) {
  if (!Array.isArray(appliances)) {
    return [];
  }

  if (appliances.length > LIMITS.applianceCount) {
    errors.push(`Appliance list must include ${LIMITS.applianceCount} items or fewer.`);
    return [];
  }

  return appliances.map((appliance, index) => ({
    name: boundedString(appliance?.name, LIMITS.applianceName, `Appliance ${index + 1} name`, errors) || `Appliance ${index + 1}`,
    watt: appliance?.watt,
    hours: appliance?.hours,
    qty: appliance?.qty,
    energy: appliance?.energy,
  }));
}

function getSummaryRows(summary, lead, appliances) {
  return [
    ['Daily energy', formatMetric(summary?.dailyEnergy, ' kWh/day')],
    ['Peak load', formatKwFromWatts(summary?.peakLoad)],
    ['Peak sun hours', formatMetric(summary?.sunHours, ' hours')],
    ['Appliance count', formatMetric(summary?.applianceCount ?? appliances.length, '')],
    ['Location', lead.location || 'Not provided'],
  ];
}

function getSystemRows(system, systemType) {
  return [
    ['Selected design', cleanString(system?.label) || systemType || 'Unknown'],
    ['Design type', systemType || 'Unknown'],
    ['Description', cleanString(system?.description) || 'Not provided'],
    ['Solar panels', system?.panelCount && system?.panelWatt ? `${system.panelCount} x ${system.panelWatt} W` : 'Not provided'],
    ['Total panel power', formatKwFromWatts(system?.totalPanelPower)],
    ['Batteries', system?.batteryCount && system?.batterySpec ? `${system.batteryCount} x ${system.batterySpec}` : 'Not provided'],
    ['Battery capacity', formatMetric(system?.batteryCapacityKWh, ' kWh')],
    ['Inverter', formatMetric(system?.inverterKVA, ' kVA', 1)],
    ['Charge controller', formatMetric(system?.chargeController, ' A')],
    ['Autonomy', formatMetric(system?.autonomyDays, ' days', 2)],
  ];
}

function createEmailText({ lead, systemRows, summaryRows, appliances }) {
  const applianceLines = appliances.length
    ? appliances.map((appliance, index) => (
      `${index + 1}. ${appliance.name} - ${formatMetric(appliance.watt, ' W', 0)}, ${formatMetric(appliance.hours, ' h')}/day, qty ${formatMetric(appliance.qty, '', 0)}, ${formatMetric(appliance.energy, ' kWh', 3)}`
    ))
    : ['No appliance breakdown was included.'];

  return [
    'SolarWise installer quote request',
    '',
    'Customer details',
    `Name: ${lead.name}`,
    `Phone: ${lead.phone}`,
    `Email: ${lead.email || 'Not provided'}`,
    `Location: ${lead.location || 'Not provided'}`,
    `Submitted at: ${lead.createdAt}`,
    '',
    'Project notes',
    lead.message || 'No project notes provided.',
    '',
    'Selected system',
    ...systemRows.map(([label, value]) => `${label}: ${value}`),
    '',
    'Energy summary',
    ...summaryRows.map(([label, value]) => `${label}: ${value}`),
    '',
    'Appliance breakdown',
    ...applianceLines,
  ].join('\n');
}

export async function POST(request) {
  try {
    const body = await request.json();
    const errors = [];

    if (!body || typeof body !== 'object') {
      return Response.json(
        { error: 'Invalid quote payload.' },
        { status: 400 }
      );
    }

    if (cleanString(body.company)) {
      return Response.json(
        { error: 'Submission rejected.' },
        { status: 400 }
      );
    }

    const selectedSystem = normalizeSystem(body.selectedSystem, errors);
    const appliances = normalizeAppliances(body.appliances, errors);
    const lead = {
      id: Date.now(),
      name: boundedString(body.name, LIMITS.name, 'Name', errors),
      email: boundedString(body.email, LIMITS.email, 'Email', errors),
      phone: boundedString(body.phone, LIMITS.phone, 'Phone', errors),
      location: getLocationLabel(body.location, errors),
      systemType: boundedString(body.systemType, LIMITS.systemType, 'System type', errors)
        || cleanString(selectedSystem?.type)
        || 'unknown',
      message: boundedString(body.message, LIMITS.message, 'Project notes', errors),
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    const phoneDigits = lead.phone.replace(/\D/g, '');

    if (!lead.name || !lead.phone) {
      errors.push('Name and phone are required.');
    }

    if (phoneDigits.length < 7) {
      errors.push('Enter a valid phone number with country code.');
    }

    if (lead.email && !isEmail(lead.email)) {
      errors.push('Enter a valid email address.');
    }

    if (errors.length) {
      return Response.json(
        { error: errors[0] },
        { status: 400 }
      );
    }

    const resendApiKey = cleanString(process.env.RESEND_API_KEY);
    const adminEmail = cleanString(process.env.ADMIN_EMAIL);
    const quoteFromEmail = cleanString(process.env.QUOTE_FROM_EMAIL);

    if (!resendApiKey || !adminEmail || !quoteFromEmail) {
      return Response.json(
        { error: 'Installer quote email is not configured. Add RESEND_API_KEY, ADMIN_EMAIL, and QUOTE_FROM_EMAIL.' },
        { status: 500 }
      );
    }

    if (!isEmail(adminEmail)) {
      return Response.json(
        { error: 'Installer quote email is not configured. ADMIN_EMAIL must be a valid email address.' },
        { status: 500 }
      );
    }

    const systemRows = getSystemRows(selectedSystem, lead.systemType);
    const summaryRows = getSummaryRows(body.summary || {}, lead, appliances);
    const mailPayload = {
      lead,
      systemRows,
      summaryRows,
      appliances,
    };
    const resend = new Resend(resendApiKey);
    const subjectLocation = lead.location || 'Unknown location';
    const { data, error } = await resend.emails.send(
      {
        from: quoteFromEmail,
        to: [adminEmail],
        replyTo: lead.email || undefined,
        subject: `SolarWise quote request - ${lead.name} - ${subjectLocation}`,
        text: createEmailText(mailPayload),
        react: React.createElement(InstallerQuoteEmail, mailPayload),
        tags: [
          { name: 'category', value: 'installer_quote' },
        ],
      },
      {
        idempotencyKey: `lead-${lead.id}`,
      }
    );

    if (error) {
      console.error('Resend quote email error:', error);
      return Response.json(
        { error: 'Failed to email your installer quote request. Please try again.' },
        { status: 502 }
      );
    }

    console.log('Installer quote email sent:', {
      leadId: lead.id,
      messageId: data?.id,
    });

    return Response.json({
      success: true,
      message: 'Your installer quote request has been emailed. An installer can now follow up with the selected design.',
      leadId: lead.id,
      emailSent: true,
    });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return Response.json(
        { error: 'Invalid quote payload.' },
        { status: 400 }
      );
    }

    console.error('Lead submission error:', error);
    return Response.json(
      { error: 'Failed to email your installer quote request. Please try again.' },
      { status: 500 }
    );
  }
}
