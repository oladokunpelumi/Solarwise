/**
 * SolarWise — Core Calculation Engine
 * Implements all 8 calculation steps for solar system sizing.
 */

// ─── Constants ───────────────────────────────────────────────────
const DEFAULT_PANEL_WATT = 550;
const SYSTEM_VOLTAGE = 48;
const BATTERY_VOLTAGE = 12;
const BATTERY_AH = 220;
const EFFICIENCY = 0.78;
const AUTONOMY_DAYS = 1.5;
const INVERTER_SAFETY_MARGIN = 1.3;
const DOD = 0.8; // Depth of discharge

// ─── Step 1: Calculate individual appliance energy (kWh/day) ────
export function calcApplianceEnergy(wattage, hours, quantity) {
  return (wattage * hours * quantity) / 1000;
}

// ─── Step 2: Calculate total daily energy (kWh) ─────────────────
export function calcTotalDailyEnergy(appliances) {
  return appliances.reduce((sum, a) => {
    return sum + calcApplianceEnergy(a.watt, a.hours, a.qty);
  }, 0);
}

// ─── Step 3: Calculate peak load (W) ────────────────────────────
export function calcPeakLoad(appliances) {
  return appliances.reduce((sum, a) => sum + a.watt * a.qty, 0);
}

// ─── Step 4: Calculate panel count ──────────────────────────────
export function calcPanelCount(totalEnergy, sunHours, panelWatt = DEFAULT_PANEL_WATT, efficiency = EFFICIENCY) {
  if (sunHours <= 0) return 0;
  const rawPanels = totalEnergy / (panelWatt / 1000 * sunHours * efficiency);
  return Math.ceil(rawPanels);
}

// ─── Step 5: Calculate battery capacity (kWh) ───────────────────
export function calcBatteryCapacity(totalEnergy, autonomyDays = AUTONOMY_DAYS) {
  return totalEnergy * autonomyDays;
}

// ─── Step 6: Calculate battery count ────────────────────────────
export function calcBatteryCount(batteryCapacityKWh, batteryVoltage = BATTERY_VOLTAGE, batteryAh = BATTERY_AH, dod = DOD) {
  const singleBatteryKWh = (batteryVoltage * batteryAh * dod) / 1000;
  if (singleBatteryKWh <= 0) return 0;
  return Math.ceil(batteryCapacityKWh / singleBatteryKWh);
}

// ─── Step 7: Calculate charge controller (A) ────────────────────
export function calcChargeController(panelCount, panelWatt = DEFAULT_PANEL_WATT, systemVoltage = SYSTEM_VOLTAGE) {
  const totalPanelPower = panelCount * panelWatt;
  return Math.ceil(totalPanelPower / systemVoltage);
}

// ─── Step 8: Calculate inverter size (W) ────────────────────────
export function calcInverterSize(peakLoad, safetyMargin = INVERTER_SAFETY_MARGIN) {
  return Math.ceil(peakLoad * safetyMargin);
}

// ─── Helpers ────────────────────────────────────────────────────
function toKVA(watts) {
  return (watts / 1000).toFixed(1);
}

function selectInverterKVA(watts) {
  const kva = watts / 1000;
  const sizes = [1, 1.5, 2, 3, 3.5, 5, 7.5, 10, 15, 20];
  return sizes.find(s => s >= kva) || sizes[sizes.length - 1];
}

function selectPanelWatt(panelCount, totalEnergy, sunHours) {
  // Choose optimal panel size for the system
  const panelOptions = [200, 400, 550, 600];
  // Prefer 550W for most installations
  return DEFAULT_PANEL_WATT;
}

// ─── Main: Generate 3 System Designs ────────────────────────────
export function generateSolarDesigns(appliances, sunHours) {
  const totalEnergy = calcTotalDailyEnergy(appliances);
  const peakLoad = calcPeakLoad(appliances);

  // ── Off-Grid System (full independence) ──
  const offgridPanels = calcPanelCount(totalEnergy, sunHours);
  const offgridBatteryKWh = calcBatteryCapacity(totalEnergy, AUTONOMY_DAYS);
  const offgridBatteries = calcBatteryCount(offgridBatteryKWh);
  const offgridInverterW = calcInverterSize(peakLoad);
  const offgridController = calcChargeController(offgridPanels);

  const offgrid = {
    type: 'offgrid',
    label: 'Off-Grid System',
    description: 'Complete energy independence from the grid',
    panelCount: offgridPanels,
    panelWatt: DEFAULT_PANEL_WATT,
    totalPanelPower: offgridPanels * DEFAULT_PANEL_WATT,
    batteryCount: offgridBatteries,
    batterySpec: `${BATTERY_VOLTAGE}V ${BATTERY_AH}Ah`,
    batteryCapacityKWh: parseFloat(offgridBatteryKWh.toFixed(2)),
    inverterSize: offgridInverterW,
    inverterKVA: selectInverterKVA(offgridInverterW),
    chargeController: offgridController,
    autonomyDays: AUTONOMY_DAYS,
  };

  // ── Hybrid System (solar + grid) ──
  const hybridFactor = 0.6;
  const hybridPanels = Math.ceil(offgridPanels * hybridFactor);
  const hybridBatteryKWh = calcBatteryCapacity(totalEnergy, 0.75);
  const hybridBatteries = calcBatteryCount(hybridBatteryKWh);
  const hybridInverterW = calcInverterSize(peakLoad);
  const hybridController = calcChargeController(hybridPanels);

  const hybrid = {
    type: 'hybrid',
    label: 'Hybrid System',
    description: 'Solar + grid backup for reliability',
    panelCount: hybridPanels,
    panelWatt: DEFAULT_PANEL_WATT,
    totalPanelPower: hybridPanels * DEFAULT_PANEL_WATT,
    batteryCount: hybridBatteries,
    batterySpec: `${BATTERY_VOLTAGE}V ${BATTERY_AH}Ah`,
    batteryCapacityKWh: parseFloat(hybridBatteryKWh.toFixed(2)),
    inverterSize: hybridInverterW,
    inverterKVA: selectInverterKVA(hybridInverterW),
    chargeController: hybridController,
    autonomyDays: 0.75,
  };

  // ── Budget Starter System ──
  const budgetFactor = 0.35;
  const budgetPanels = Math.max(2, Math.ceil(offgridPanels * budgetFactor));
  const budgetBatteryKWh = calcBatteryCapacity(totalEnergy, 0.5);
  const budgetBatteries = Math.max(1, calcBatteryCount(budgetBatteryKWh));
  const budgetInverterW = calcInverterSize(peakLoad * 0.6);
  const budgetController = calcChargeController(budgetPanels);

  const budget = {
    type: 'budget',
    label: 'Budget Starter',
    description: 'Affordable entry point for essential backup',
    panelCount: budgetPanels,
    panelWatt: DEFAULT_PANEL_WATT,
    totalPanelPower: budgetPanels * DEFAULT_PANEL_WATT,
    batteryCount: budgetBatteries,
    batterySpec: `${BATTERY_VOLTAGE}V ${BATTERY_AH}Ah`,
    batteryCapacityKWh: parseFloat(budgetBatteryKWh.toFixed(2)),
    inverterSize: budgetInverterW,
    inverterKVA: selectInverterKVA(budgetInverterW),
    chargeController: budgetController,
    autonomyDays: 0.5,
  };

  return {
    dailyEnergy: parseFloat(totalEnergy.toFixed(2)),
    peakLoad,
    sunHours,
    appliances: appliances.map(a => ({
      ...a,
      energy: parseFloat(calcApplianceEnergy(a.watt, a.hours, a.qty).toFixed(3)),
    })),
    systems: [offgrid, hybrid, budget],
  };
}
