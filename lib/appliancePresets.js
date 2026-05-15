/**
 * SolarWise - Appliance Presets Database
 * Categorized preset appliances with default wattages.
 */

const appliancePresets = [
  { id: 'ac-1hp', name: 'Air Conditioner (1HP)', watt: 746, category: 'Cooling', iconKey: 'airVent' },
  { id: 'ac-1.5hp', name: 'Air Conditioner (1.5HP)', watt: 1119, category: 'Cooling', iconKey: 'airVent' },
  { id: 'ac-2hp', name: 'Air Conditioner (2HP)', watt: 1492, category: 'Cooling', iconKey: 'airVent' },
  { id: 'fan-ceiling', name: 'Ceiling Fan', watt: 70, category: 'Cooling', iconKey: 'fan' },
  { id: 'fan-standing', name: 'Standing Fan', watt: 55, category: 'Cooling', iconKey: 'fan' },

  { id: 'fridge', name: 'Refrigerator', watt: 150, category: 'Kitchen', iconKey: 'refrigerator' },
  { id: 'fridge-large', name: 'Large Refrigerator', watt: 250, category: 'Kitchen', iconKey: 'refrigerator' },
  { id: 'freezer', name: 'Deep Freezer', watt: 200, category: 'Kitchen', iconKey: 'refrigerator' },
  { id: 'microwave', name: 'Microwave', watt: 1000, category: 'Kitchen', iconKey: 'microwave' },
  { id: 'blender', name: 'Blender', watt: 350, category: 'Kitchen', iconKey: 'blend' },
  { id: 'electric-kettle', name: 'Electric Kettle', watt: 1500, category: 'Kitchen', iconKey: 'cup' },
  { id: 'toaster', name: 'Toaster', watt: 800, category: 'Kitchen', iconKey: 'cookingPot' },

  { id: 'led-bulb', name: 'LED Bulb', watt: 10, category: 'Lighting', iconKey: 'lightbulb' },
  { id: 'led-bulb-15w', name: 'LED Bulb (15W)', watt: 15, category: 'Lighting', iconKey: 'lightbulb' },
  { id: 'fluorescent', name: 'Fluorescent Tube', watt: 40, category: 'Lighting', iconKey: 'lightbulb' },
  { id: 'security-light', name: 'Security Light', watt: 30, category: 'Lighting', iconKey: 'flashlight' },

  { id: 'tv-led', name: 'LED TV (43")', watt: 80, category: 'Entertainment', iconKey: 'tv' },
  { id: 'tv-large', name: 'LED TV (55"+)', watt: 120, category: 'Entertainment', iconKey: 'tv' },
  { id: 'decoder', name: 'Cable Decoder', watt: 25, category: 'Entertainment', iconKey: 'monitor' },
  { id: 'sound-system', name: 'Sound System', watt: 100, category: 'Entertainment', iconKey: 'speaker' },
  { id: 'gaming-console', name: 'Gaming Console', watt: 150, category: 'Entertainment', iconKey: 'monitor' },

  { id: 'laptop', name: 'Laptop', watt: 60, category: 'Computing', iconKey: 'laptop' },
  { id: 'desktop', name: 'Desktop Computer', watt: 200, category: 'Computing', iconKey: 'monitor' },
  { id: 'router', name: 'Wi-Fi Router', watt: 10, category: 'Computing', iconKey: 'wifi' },
  { id: 'printer', name: 'Printer', watt: 50, category: 'Computing', iconKey: 'printer' },
  { id: 'phone-charger', name: 'Phone Charger', watt: 10, category: 'Computing', iconKey: 'smartphone' },

  { id: 'washing-machine', name: 'Washing Machine', watt: 500, category: 'Laundry', iconKey: 'washingMachine' },
  { id: 'iron', name: 'Pressing Iron', watt: 1200, category: 'Laundry', iconKey: 'shirt' },
  { id: 'dryer', name: 'Clothes Dryer', watt: 2500, category: 'Laundry', iconKey: 'shirt' },

  { id: 'water-pump', name: 'Water Pump (1HP)', watt: 746, category: 'Water', iconKey: 'water' },
  { id: 'water-heater', name: 'Water Heater', watt: 2000, category: 'Water', iconKey: 'shower' },
  { id: 'water-dispenser', name: 'Water Dispenser', watt: 100, category: 'Water', iconKey: 'water' },
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
