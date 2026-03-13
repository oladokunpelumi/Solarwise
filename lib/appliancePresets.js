/**
 * SolarWise — Appliance Presets Database
 * Categorized preset appliances with default wattages.
 */

const appliancePresets = [
  // ── Cooling ──
  { id: 'ac-1hp', name: 'Air Conditioner (1HP)', watt: 746, category: 'Cooling', icon: '❄️' },
  { id: 'ac-1.5hp', name: 'Air Conditioner (1.5HP)', watt: 1119, category: 'Cooling', icon: '❄️' },
  { id: 'ac-2hp', name: 'Air Conditioner (2HP)', watt: 1492, category: 'Cooling', icon: '❄️' },
  { id: 'fan-ceiling', name: 'Ceiling Fan', watt: 70, category: 'Cooling', icon: '🌀' },
  { id: 'fan-standing', name: 'Standing Fan', watt: 55, category: 'Cooling', icon: '🌀' },

  // ── Kitchen ──
  { id: 'fridge', name: 'Refrigerator', watt: 150, category: 'Kitchen', icon: '🧊' },
  { id: 'fridge-large', name: 'Large Refrigerator', watt: 250, category: 'Kitchen', icon: '🧊' },
  { id: 'freezer', name: 'Deep Freezer', watt: 200, category: 'Kitchen', icon: '🧊' },
  { id: 'microwave', name: 'Microwave', watt: 1000, category: 'Kitchen', icon: '📡' },
  { id: 'blender', name: 'Blender', watt: 350, category: 'Kitchen', icon: '🍹' },
  { id: 'electric-kettle', name: 'Electric Kettle', watt: 1500, category: 'Kitchen', icon: '☕' },
  { id: 'toaster', name: 'Toaster', watt: 800, category: 'Kitchen', icon: '🍞' },

  // ── Lighting ──
  { id: 'led-bulb', name: 'LED Bulb', watt: 10, category: 'Lighting', icon: '💡' },
  { id: 'led-bulb-15w', name: 'LED Bulb (15W)', watt: 15, category: 'Lighting', icon: '💡' },
  { id: 'fluorescent', name: 'Fluorescent Tube', watt: 40, category: 'Lighting', icon: '💡' },
  { id: 'security-light', name: 'Security Light', watt: 30, category: 'Lighting', icon: '🔦' },

  // ── Entertainment ──
  { id: 'tv-led', name: 'LED TV (43")', watt: 80, category: 'Entertainment', icon: '📺' },
  { id: 'tv-large', name: 'LED TV (55"+)', watt: 120, category: 'Entertainment', icon: '📺' },
  { id: 'decoder', name: 'Cable Decoder', watt: 25, category: 'Entertainment', icon: '📡' },
  { id: 'sound-system', name: 'Sound System', watt: 100, category: 'Entertainment', icon: '🔊' },
  { id: 'gaming-console', name: 'Gaming Console', watt: 150, category: 'Entertainment', icon: '🎮' },

  // ── Computing ──
  { id: 'laptop', name: 'Laptop', watt: 60, category: 'Computing', icon: '💻' },
  { id: 'desktop', name: 'Desktop Computer', watt: 200, category: 'Computing', icon: '🖥️' },
  { id: 'router', name: 'Wi-Fi Router', watt: 10, category: 'Computing', icon: '📶' },
  { id: 'printer', name: 'Printer', watt: 50, category: 'Computing', icon: '🖨️' },
  { id: 'phone-charger', name: 'Phone Charger', watt: 10, category: 'Computing', icon: '📱' },

  // ── Laundry ──
  { id: 'washing-machine', name: 'Washing Machine', watt: 500, category: 'Laundry', icon: '👕' },
  { id: 'iron', name: 'Pressing Iron', watt: 1200, category: 'Laundry', icon: '👔' },
  { id: 'dryer', name: 'Clothes Dryer', watt: 2500, category: 'Laundry', icon: '👗' },

  // ── Water ──
  { id: 'water-pump', name: 'Water Pump (1HP)', watt: 746, category: 'Water', icon: '💧' },
  { id: 'water-heater', name: 'Water Heater', watt: 2000, category: 'Water', icon: '🚿' },
  { id: 'water-dispenser', name: 'Water Dispenser', watt: 100, category: 'Water', icon: '🚰' },
];

/**
 * Get all categories for filtering
 */
export function getCategories() {
  return [...new Set(appliancePresets.map(a => a.category))];
}

/**
 * Get appliances by category
 */
export function getByCategory(category) {
  return appliancePresets.filter(a => a.category === category);
}

export default appliancePresets;
