import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

const colors = {
  background: '#f7f4ee',
  surface: '#fffdfa',
  ink: '#17171b',
  muted: '#6a665e',
  soft: '#f2eee8',
  line: '#e2d9cc',
  accent: '#b74f2d',
  warm: '#d7a077',
  white: '#fffdfa',
};

const page = {
  margin: 0,
  backgroundColor: colors.background,
  color: colors.ink,
  fontFamily: 'Arial, Helvetica, sans-serif',
};

const container = {
  maxWidth: '760px',
  margin: '0 auto',
  backgroundColor: colors.surface,
  border: `1px solid ${colors.line}`,
  borderRadius: '22px',
  overflow: 'hidden',
};

const shell = {
  backgroundColor: colors.background,
  padding: '28px 14px',
};

const hero = {
  padding: '34px 34px 24px',
  backgroundColor: colors.ink,
  color: colors.white,
};

const label = {
  margin: '0 0 12px',
  color: colors.warm,
  fontSize: '12px',
  fontWeight: 700,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
};

const heroTitle = {
  margin: 0,
  color: colors.white,
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: '34px',
  lineHeight: '1.05',
  fontWeight: 400,
};

const heroText = {
  margin: '14px 0 0',
  color: '#d8d3ca',
  fontSize: '16px',
  lineHeight: '1.55',
};

const block = {
  padding: '28px 34px',
};

const title = {
  margin: '0 0 18px',
  color: colors.ink,
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: '24px',
  lineHeight: '1.1',
  fontWeight: 400,
};

const noteBox = {
  marginTop: '24px',
  padding: '18px',
  backgroundColor: colors.soft,
  border: `1px solid ${colors.line}`,
  borderRadius: '16px',
};

const noteLabel = {
  margin: '0 0 8px',
  color: colors.muted,
  fontSize: '12px',
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
};

const noteText = {
  margin: 0,
  color: colors.ink,
  fontSize: '15px',
  lineHeight: '1.6',
};

const table = {
  width: '100%',
  borderCollapse: 'collapse',
};

const keyCell = {
  padding: '12px 0',
  borderBottom: `1px solid ${colors.line}`,
  color: colors.muted,
  fontSize: '14px',
};

const valueCell = {
  padding: '12px 0',
  borderBottom: `1px solid ${colors.line}`,
  color: colors.ink,
  fontSize: '14px',
  fontWeight: 700,
  textAlign: 'right',
};

const applianceTable = {
  width: '100%',
  border: `1px solid ${colors.line}`,
  borderRadius: '14px',
  borderCollapse: 'separate',
  borderSpacing: 0,
  overflow: 'hidden',
};

const applianceHead = {
  backgroundColor: colors.ink,
};

const th = {
  padding: '12px 10px',
  color: colors.white,
  fontSize: '12px',
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
};

const td = {
  padding: '12px 10px',
  borderBottom: `1px solid ${colors.line}`,
  color: colors.muted,
  fontSize: '14px',
};

function Row({ label: rowLabel, value }) {
  return (
    <tr>
      <td style={keyCell}>{rowLabel}</td>
      <td style={valueCell}>{value}</td>
    </tr>
  );
}

function KeyValueTable({ rows }) {
  return (
    <table role="presentation" width="100%" cellSpacing="0" cellPadding="0" style={table}>
      <tbody>
        {rows.map(([rowLabel, value]) => (
          <Row key={rowLabel} label={rowLabel} value={value} />
        ))}
      </tbody>
    </table>
  );
}

function formatCell(value, suffix = '', maximumFractionDigits = 2) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 'Not provided';
  }

  const formatted = new Intl.NumberFormat('en-US', {
    maximumFractionDigits,
  }).format(number);

  return `${formatted}${suffix}`;
}

function ApplianceTable({ appliances }) {
  return (
    <table role="presentation" width="100%" cellSpacing="0" cellPadding="0" style={applianceTable}>
      <thead>
        <tr style={applianceHead}>
          <th align="left" style={th}>Appliance</th>
          <th align="right" style={th}>Wattage</th>
          <th align="right" style={th}>Hours</th>
          <th align="right" style={th}>Qty</th>
          <th align="right" style={th}>Energy</th>
        </tr>
      </thead>
      <tbody>
        {appliances.length ? appliances.map((appliance, index) => (
          <tr key={`${appliance.name}-${index}`}>
            <td style={{ ...td, color: colors.ink, fontWeight: 700 }}>{appliance.name}</td>
            <td align="right" style={td}>{formatCell(appliance.watt, ' W', 0)}</td>
            <td align="right" style={td}>{formatCell(appliance.hours, ' h')}</td>
            <td align="right" style={td}>{formatCell(appliance.qty, '', 0)}</td>
            <td align="right" style={{ ...td, color: colors.accent, fontWeight: 700 }}>{formatCell(appliance.energy, ' kWh', 3)}</td>
          </tr>
        )) : (
          <tr>
            <td colSpan="5" style={{ ...td, padding: '18px', textAlign: 'center' }}>
              No appliance breakdown was included.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default function InstallerQuoteEmail({
  lead,
  systemRows,
  summaryRows,
  appliances,
}) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{`New SolarWise quote request from ${lead.name}`}</Preview>
      <Body style={page}>
        <Section style={shell}>
          <Container style={container}>
            <Section style={hero}>
              <Text style={label}>SolarWise</Text>
              <Heading as="h1" style={heroTitle}>Installer quote request</Heading>
              <Text style={heroText}>
                A customer submitted contact details with a selected solar design and appliance sizing context.
              </Text>
            </Section>

            <Section style={block}>
              <Heading as="h2" style={title}>Customer details</Heading>
              <KeyValueTable rows={[
                ['Name', lead.name],
                ['Phone', lead.phone],
                ['Email', lead.email || 'Not provided'],
                ['Location', lead.location || 'Not provided'],
                ['Submitted at', lead.createdAt],
              ]}
              />
              <Section style={noteBox}>
                <Text style={noteLabel}>Project notes</Text>
                <Text style={noteText}>{lead.message || 'No project notes provided.'}</Text>
              </Section>
            </Section>

            <Section style={{ padding: '0 34px 28px' }}>
              <Heading as="h2" style={title}>Selected system</Heading>
              <KeyValueTable rows={systemRows} />
            </Section>

            <Section style={{ padding: '0 34px 28px' }}>
              <Heading as="h2" style={title}>Energy summary</Heading>
              <KeyValueTable rows={summaryRows} />
            </Section>

            <Section style={{ padding: '0 34px 34px' }}>
              <Heading as="h2" style={title}>Appliance breakdown</Heading>
              <ApplianceTable appliances={appliances} />
              <Hr style={{ borderColor: colors.line, margin: '24px 0 0' }} />
              <Text style={{ color: colors.muted, fontSize: '12px', lineHeight: '1.5' }}>
                This estimate is based on the submitted SolarWise calculator payload and should be confirmed during installer site assessment.
              </Text>
            </Section>
          </Container>
        </Section>
      </Body>
    </Html>
  );
}
