import { MedicineProduct, VerifiedCustomerReview, CouponDiscount, LoyaltyTier } from '../types';

export const REST_EASY_PRODUCTS: MedicineProduct[] = [
  // ==========================================
  // 1. DIAZEPAM (Sedil 5mg, Esium Diaz 5mg, Bensedin 10mg)
  // ==========================================
  {
    id: 'rem-sedil-diazepam',
    name: 'Sedil 5mg Tablets (Diazepam)',
    brand: 'Sedil (Square Pharmaceuticals)',
    genericName: 'Diazepam',
    category: 'Anxiety & Calm',
    legalCategory: 'CD',
    basePrice: 18.00,
    originalPrice: 18.00,
    rating: 4.91,
    reviewCount: 412,
    inStock: true,
    stockCount: 650,
    strength: '5mg',
    format: 'Tablets',
    unitsPerStrip: 20,
    stripSize: '20 Tablets / Blister Strip',
    activeIngredient: 'Diazepam 5mg (Pure Ph. Eur)',
    badge: 'Fast-Acting Anxiolytic',
    sku: 'REM-SEDIL-DIAZ-5',
    deliveryEstimate: 'Guaranteed Next-Day Delivery (Discreet Plain Box)',
    prescriptionRequired: false,
    bnfIndication: 'Short-term relief of severe anxiety, acute muscle spasm, panic disorder, and agitation',
    dosageAdult: 'Take 5mg orally with water two to three times daily as required.',
    usageInstructions: [
      'Take orally with a glass of water, with or without food.',
      'Allow 20-40 minutes for complete calming and muscle relaxation onset.',
      'Do not consume alcohol while taking Diazepam.',
      'Store below 25°C in original blister packaging away from moisture.'
    ],
    cautions: [
      'May cause drowsiness or slowed reflexes; do not drive or operate heavy machinery if sedated.',
      'Intended for short-term or intermittent use to prevent physical tolerance.',
      'Do not combine with opioids, central nervous system depressants, or sleeping tablets without medical supervision.'
    ],
    commonSideEffects: [
      'Drowsiness and sedation',
      'Muscle weakness or lightheadedness',
      'Mild ataxia or unsteadiness'
    ],
    description: 'Sedil is a premium pharmaceutical preparation of genuine Diazepam 5mg manufactured by Square Pharmaceuticals. Priced per blister strip (20 tablets per strip). Acts swiftly on GABA-A neuroreceptors to relieve acute psychological distress, somatic tension, panic attacks, and severe muscle spasms.',
    packOptions: [
      { id: 'sedil-1strip', label: '1 Strip (20 Tablets)', stripsCount: 1, tabletsCount: 20, price: 18.00, originalPrice: 18.00, discountPercentage: 0 },
      { id: 'sedil-2strips', label: '2 Strips (40 Tablets)', stripsCount: 2, tabletsCount: 40, price: 35.00, originalPrice: 36.00, discountPercentage: 3 },
      { id: 'sedil-3strips', label: '3 Strips (60 Tablets)', stripsCount: 3, tabletsCount: 60, price: 50.00, originalPrice: 54.00, discountPercentage: 7, popular: true },
      { id: 'sedil-5strips', label: '5 Strips (100 Tablets)', stripsCount: 5, tabletsCount: 100, price: 80.00, originalPrice: 90.00, discountPercentage: 11 },
      { id: 'sedil-10strips', label: '10 Strips (200 Tablets)', stripsCount: 10, tabletsCount: 200, price: 140.00, originalPrice: 180.00, discountPercentage: 22 },
      { id: 'sedil-20strips', label: '20 Strips (400 Tablets)', stripsCount: 20, tabletsCount: 400, price: 240.00, originalPrice: 360.00, discountPercentage: 33 },
      { id: 'sedil-25strips', label: '25 Strips (1 Box) (500 Tablets - Free Delivery)', stripsCount: 25, tabletsCount: 500, price: 290.00, originalPrice: 450.00, discountPercentage: 36, freeDelivery: true },
      { id: 'sedil-50strips', label: '50 Strips (2 Boxes) (1000 Tablets - Free Delivery)', stripsCount: 50, tabletsCount: 1000, price: 500.00, originalPrice: 900.00, discountPercentage: 44, freeDelivery: true }
    ]
  },
  {
    id: 'rem-esium-5',
    name: 'Esium Diaz 5mg Tablets (Diazepam)',
    brand: 'Esium Diaz (Opsonin Pharma)',
    genericName: 'Diazepam',
    category: 'Anxiety & Calm',
    legalCategory: 'CD',
    basePrice: 33.00,
    originalPrice: 33.00,
    rating: 4.88,
    reviewCount: 320,
    inStock: true,
    stockCount: 540,
    strength: '5mg',
    format: 'Tablets',
    unitsPerStrip: 40,
    stripSize: '40 Tablets / Blister Strip',
    activeIngredient: 'Diazepam 5mg',
    badge: 'Muscle Relaxant & Calm',
    sku: 'REM-ESIUM-5',
    deliveryEstimate: 'Next-Day Royal Mail Tracked 24 Discreet Delivery',
    prescriptionRequired: false,
    bnfIndication: 'Management of acute anxiety states, tension headaches, insomnia associated with anxiety, and skeletal muscle spasticity',
    dosageAdult: 'Take 5mg orally with water one to three times daily depending on anxiety severity. For sleep induction: 5mg to 10mg at bedtime.',
    usageInstructions: [
      'Swallow tablet whole with water.',
      'Take 30 minutes prior to stressful events or bedtime.',
      'Maintain regular hydration.'
    ],
    cautions: [
      'Do not abruptly discontinue after prolonged daily usage; taper under pharmacist advice.',
      'Avoid grapefruit juice and central nervous system depressants.'
    ],
    commonSideEffects: ['Calmness/sedation', 'Fatigue', 'Dizziness'],
    description: 'Esium Diaz 5mg delivers reliable, high-grade Diazepam with superior bioavailability. Sourced in 40-tablet blister strips. Renowned for its rapid muscle-relaxing action and sustained relief from acute panic and muscular tightness.',
    packOptions: [
      { id: 'esium-1strip', label: '1 Strip (40 Tablets)', stripsCount: 1, tabletsCount: 40, price: 33.00, originalPrice: 33.00, discountPercentage: 0 },
      { id: 'esium-2strips', label: '2 Strips (80 Tablets)', stripsCount: 2, tabletsCount: 80, price: 62.00, originalPrice: 66.00, discountPercentage: 6 },
      { id: 'esium-3strips', label: '3 Strips (120 Tablets)', stripsCount: 3, tabletsCount: 120, price: 90.00, originalPrice: 99.00, discountPercentage: 9, popular: true },
      { id: 'esium-5strips', label: '5 Strips (200 Tablets)', stripsCount: 5, tabletsCount: 200, price: 135.00, originalPrice: 165.00, discountPercentage: 18 },
      { id: 'esium-10strips', label: '10 Strips (400 Tablets)', stripsCount: 10, tabletsCount: 400, price: 250.00, originalPrice: 330.00, discountPercentage: 24 },
      { id: 'esium-20strips', label: '20 Strips (800 Tablets)', stripsCount: 20, tabletsCount: 800, price: 350.00, originalPrice: 660.00, discountPercentage: 47 }
    ]
  },
  {
    id: 'rem-bensedin-10',
    name: 'Bensedin 10mg Tablets (Diazepam)',
    brand: 'Bensedin (Galenika / Genuine Brand)',
    genericName: 'Diazepam',
    category: 'Anxiety & Calm',
    legalCategory: 'CD',
    basePrice: 21.00,
    originalPrice: 21.00,
    rating: 4.95,
    reviewCount: 460,
    inStock: true,
    stockCount: 780,
    strength: '10mg',
    format: 'Tablets',
    unitsPerStrip: 15,
    stripSize: '15 Tablets / Blister Strip',
    activeIngredient: 'Diazepam 10mg (Galenika Formula)',
    badge: 'Galenika Gold Standard Diazepam',
    sku: 'REM-BENSEDIN-10',
    deliveryEstimate: 'Next-Day Delivery via Royal Mail Tracked 24',
    prescriptionRequired: false,
    bnfIndication: 'Severe anxiety disorders, acute muscle spasms, panic episodes, and nocturnal tension',
    dosageAdult: 'Take 5mg to 10mg orally with water as needed, up to a maximum of 30mg daily in divided doses.',
    usageInstructions: [
      'Take orally with a glass of water, with or without food.',
      'Fast muscle relaxant and calming onset within 20-40 minutes.',
      'Store below 25°C in original blister packaging away from moisture.'
    ],
    cautions: [
      'May cause drowsiness or slowed reflexes; avoid driving if sedated.',
      'Do not consume alcohol while taking Diazepam.',
      'Intended for short-term or intermittent use.'
    ],
    commonSideEffects: ['Calmness', 'Muscle relaxation', 'Mild drowsiness'],
    description: 'Bensedin 10mg (Diazepam) manufactured by Galenika is the globally renowned gold standard in fast-acting anxiolytic and muscle-relaxant therapy. Sourced in 15-tablet blister strips.',
    packOptions: [
      { id: 'bensedin-1strip', label: '1 Strip (15 Tablets)', stripsCount: 1, tabletsCount: 15, price: 21.00, originalPrice: 21.00, discountPercentage: 0 },
      { id: 'bensedin-2strips', label: '2 Strips (30 Tablets)', stripsCount: 2, tabletsCount: 30, price: 42.00, originalPrice: 42.00, discountPercentage: 0 },
      { id: 'bensedin-3strips', label: '3 Strips (45 Tablets)', stripsCount: 3, tabletsCount: 45, price: 60.00, originalPrice: 63.00, discountPercentage: 5, popular: true },
      { id: 'bensedin-5strips', label: '5 Strips (75 Tablets)', stripsCount: 5, tabletsCount: 75, price: 100.00, originalPrice: 105.00, discountPercentage: 5 },
      { id: 'bensedin-10strips', label: '10 Strips (150 Tablets)', stripsCount: 10, tabletsCount: 150, price: 190.00, originalPrice: 210.00, discountPercentage: 10 },
      { id: 'bensedin-20strips', label: '20 Strips (300 Tablets - Free Delivery)', stripsCount: 20, tabletsCount: 300, price: 330.00, originalPrice: 420.00, discountPercentage: 21, freeDelivery: true },
      { id: 'bensedin-30strips', label: '30 Strips (450 Tablets - Free Delivery)', stripsCount: 30, tabletsCount: 450, price: 430.00, originalPrice: 630.00, discountPercentage: 32, freeDelivery: true },
      { id: 'bensedin-40strips', label: '40 Strips (600 Tablets - Free Delivery + 1 Free Strip)', stripsCount: 40, tabletsCount: 600, price: 510.00, originalPrice: 840.00, discountPercentage: 39, freeDelivery: true },
      { id: 'bensedin-50strips', label: '50 Strips (750 Tablets - Free Delivery + 1 Free Strip)', stripsCount: 50, tabletsCount: 750, price: 590.00, originalPrice: 1050.00, discountPercentage: 44, freeDelivery: true }
    ]
  },

  // ==========================================
  // 2. CLONAZEPAM (Pase 2 mg, Rivotril 2 mg)
  // ==========================================
  {
    id: 'rem-pase-2',
    name: 'Pase 2mg Tablets (Clonazepam)',
    brand: 'Pase (Incepta Pharmaceuticals)',
    genericName: 'Clonazepam',
    category: 'Anxiety & Calm',
    legalCategory: 'CD',
    basePrice: 16.00,
    originalPrice: 16.00,
    rating: 4.89,
    reviewCount: 290,
    inStock: true,
    stockCount: 480,
    strength: '2mg',
    format: 'Tablets',
    unitsPerStrip: 15,
    stripSize: '15 Tablets / Blister Strip',
    activeIngredient: 'Clonazepam 2mg',
    badge: 'Long-Acting Panic Control',
    sku: 'REM-PASE-2',
    deliveryEstimate: 'Next-Day Guaranteed 1pm Special Delivery',
    prescriptionRequired: false,
    bnfIndication: 'Panic disorder with or without agoraphobia, nocturnal panic, severe social phobia, refractory anxiety',
    dosageAdult: 'Initial dose 0.5mg to 1mg at bedtime, gradually titrated to 2mg daily as recommended.',
    usageInstructions: [
      'Take orally with water at the same time each day.',
      'Long elimination half-life provides seamless 24-hour anxiety protection.'
    ],
    cautions: [
      'Do not consume with alcoholic beverages.',
      'Do not abruptly halt medication; gradual dose reduction is advised.'
    ],
    commonSideEffects: ['Drowsiness', 'Motor uncoordination', 'Mild fatigue'],
    description: 'Pase 2mg is a high-potency, long-duration benzodiazepine produced by Incepta. Calculated per strip of 15 tablets. Ideal for round-the-clock anticipatory anxiety and panic episodes.',
    packOptions: [
      { id: 'pase-1strip', label: '1 Strip (15 Tablets)', stripsCount: 1, tabletsCount: 15, price: 16.00, originalPrice: 16.00, discountPercentage: 0 },
      { id: 'pase-2strips', label: '2 Strips (30 Tablets)', stripsCount: 2, tabletsCount: 30, price: 30.00, originalPrice: 32.00, discountPercentage: 6 },
      { id: 'pase-3strips', label: '3 Strips (45 Tablets)', stripsCount: 3, tabletsCount: 45, price: 45.00, originalPrice: 48.00, discountPercentage: 6, popular: true },
      { id: 'pase-5strips', label: '5 Strips (75 Tablets)', stripsCount: 5, tabletsCount: 75, price: 70.00, originalPrice: 80.00, discountPercentage: 12 },
      { id: 'pase-10strips', label: '10 Strips (150 Tablets)', stripsCount: 10, tabletsCount: 150, price: 130.00, originalPrice: 160.00, discountPercentage: 19 },
      { id: 'pase-20strips', label: '20 Strips (300 Tablets)', stripsCount: 20, tabletsCount: 300, price: 230.00, originalPrice: 320.00, discountPercentage: 28 },
      { id: 'pase-30strips', label: '30 Strips (450 Tablets - Free Delivery)', stripsCount: 30, tabletsCount: 450, price: 310.00, originalPrice: 480.00, discountPercentage: 35, freeDelivery: true },
      { id: 'pase-40strips', label: '40 Strips (600 Tablets - Free Delivery)', stripsCount: 40, tabletsCount: 600, price: 390.00, originalPrice: 640.00, discountPercentage: 39, freeDelivery: true },
      { id: 'pase-50strips', label: '50 Strips (750 Tablets - Free Delivery)', stripsCount: 50, tabletsCount: 750, price: 450.00, originalPrice: 800.00, discountPercentage: 44, freeDelivery: true }
    ]
  },
  {
    id: 'rem-rivotril-2',
    name: 'Rivotril 2mg Tablets (Clonazepam)',
    brand: 'Rivotril (Roche / Genuine Brand)',
    genericName: 'Clonazepam',
    category: 'Anxiety & Calm',
    legalCategory: 'CD',
    basePrice: 13.00,
    originalPrice: 13.00,
    rating: 4.96,
    reviewCount: 540,
    inStock: true,
    stockCount: 620,
    strength: '2mg',
    format: 'Tablets',
    unitsPerStrip: 10,
    stripSize: '10 Tablets / Cross-Scored Blister Strip',
    activeIngredient: 'Clonazepam 2mg (Roche Formula)',
    badge: 'Original Roche Cross-Score',
    sku: 'REM-RIVOTRIL-2',
    deliveryEstimate: 'Royal Mail Tracked 24 Discreet Letterbox Packaging',
    prescriptionRequired: false,
    bnfIndication: 'Panic disorders, acute anxiety states, epilepsy maintenance, and nocturnal myoclonus',
    dosageAdult: 'Take 1mg to 2mg once daily in the evening or in divided doses as prescribed.',
    usageInstructions: [
      'Tablets feature a quad-break scoreline allowing effortless division into 0.5mg or 1mg increments.',
      'Take with water with or without meals.'
    ],
    cautions: [
      'High-potency compound; start with low dosage.',
      'Avoid mixing with sedatives or antihistamines.'
    ],
    commonSideEffects: ['Sedation', 'Dizziness', 'Muscle relaxation'],
    description: 'Original Roche Rivotril 2mg with iconic cross-scored tablets. Sourced and priced per strip of 10 tablets. International gold standard in long-acting anxiolytic therapy.',
    packOptions: [
      { id: 'rivo-1strip', label: '1 Strip (10 Tablets)', stripsCount: 1, tabletsCount: 10, price: 13.00, originalPrice: 13.00, discountPercentage: 0 },
      { id: 'rivo-2strips', label: '2 Strips (20 Tablets)', stripsCount: 2, tabletsCount: 20, price: 25.00, originalPrice: 26.00, discountPercentage: 4 },
      { id: 'rivo-3strips', label: '3 Strips (30 Tablets)', stripsCount: 3, tabletsCount: 30, price: 36.00, originalPrice: 39.00, discountPercentage: 8, popular: true },
      { id: 'rivo-5strips', label: '5 Strips (50 Tablets)', stripsCount: 5, tabletsCount: 50, price: 58.00, originalPrice: 65.00, discountPercentage: 11 },
      { id: 'rivo-10strips', label: '10 Strips (100 Tablets - Full Box)', stripsCount: 10, tabletsCount: 100, price: 110.00, originalPrice: 130.00, discountPercentage: 15 },
      { id: 'rivo-20strips', label: '20 Strips (200 Tablets - Bulk Pack)', stripsCount: 20, tabletsCount: 200, price: 200.00, originalPrice: 260.00, discountPercentage: 23 },
      { id: 'rivo-30strips', label: '30 Strips (300 Tablets - Wholesale)', stripsCount: 30, tabletsCount: 300, price: 270.00, originalPrice: 390.00, discountPercentage: 31 },
      { id: 'rivo-50strips', label: '50 Strips (500 Tablets - Free Delivery)', stripsCount: 50, tabletsCount: 500, price: 400.00, originalPrice: 650.00, discountPercentage: 38, freeDelivery: true }
    ]
  },

  // ==========================================
  // 3. NITRAZEPAM (Nitraz, Nitraz 10)
  // ==========================================
  {
    id: 'rem-nitraz-5',
    name: 'Nitraz 5mg Tablets (Nitrazepam)',
    brand: 'Nitraz (Square Pharmaceuticals)',
    genericName: 'Nitrazepam',
    category: 'Sleep Aids',
    legalCategory: 'CD',
    basePrice: 10.00,
    originalPrice: 10.00,
    rating: 4.87,
    reviewCount: 310,
    inStock: true,
    stockCount: 510,
    strength: '5mg',
    format: 'Tablets',
    unitsPerStrip: 10,
    stripSize: '10 Tablets / Blister Strip',
    activeIngredient: 'Nitrazepam 5mg',
    badge: 'Sustained Sleep Duration',
    sku: 'REM-NITRAZ-5',
    deliveryEstimate: 'Next-Day Delivery via Royal Mail Tracked 24',
    prescriptionRequired: false,
    bnfIndication: 'Short-term treatment of severe, disabling insomnia and chronic nocturnal awakenings',
    dosageAdult: 'Take 5mg orally 30 minutes before retiring to bed. May increase to 10mg in severe chronic insomnia.',
    usageInstructions: [
      'Take 30 minutes before going to bed with water.',
      'Ensure at least 7 to 8 hours of dedicated sleep time.'
    ],
    cautions: [
      'May produce morning residual sedation during early days of therapy.',
      'Avoid combining with alcohol or CNS depressants.'
    ],
    commonSideEffects: ['Morning drowsiness', 'Muscle relaxation', 'Dry mouth'],
    description: 'Nitraz 5mg is an intermediate-acting hypnotic benzodiazepine specially indicated for patients struggling with frequent nocturnal waking. Unit basis: 1 strip (10 tablets).',
    packOptions: [
      { id: 'nitraz5-1strip', label: '1 Strip (10 Tablets)', stripsCount: 1, tabletsCount: 10, price: 10.00, originalPrice: 10.00, discountPercentage: 0 },
      { id: 'nitraz5-2strips', label: '2 Strips (20 Tablets)', stripsCount: 2, tabletsCount: 20, price: 20.00, originalPrice: 20.00, discountPercentage: 0 },
      { id: 'nitraz5-3strips', label: '3 Strips (30 Tablets)', stripsCount: 3, tabletsCount: 30, price: 28.00, originalPrice: 30.00, discountPercentage: 7, popular: true },
      { id: 'nitraz5-5strips', label: '5 Strips (50 Tablets)', stripsCount: 5, tabletsCount: 50, price: 45.00, originalPrice: 50.00, discountPercentage: 10 },
      { id: 'nitraz5-10strips', label: '10 Strips (100 Tablets)', stripsCount: 10, tabletsCount: 100, price: 85.00, originalPrice: 100.00, discountPercentage: 15 },
      { id: 'nitraz5-20strips', label: '20 Strips (200 Tablets)', stripsCount: 20, tabletsCount: 200, price: 140.00, originalPrice: 200.00, discountPercentage: 30 },
      { id: 'nitraz5-30strips', label: '30 Strips (300 Tablets - Free Delivery)', stripsCount: 30, tabletsCount: 300, price: 190.00, originalPrice: 300.00, discountPercentage: 37, freeDelivery: true },
      { id: 'nitraz5-50strips', label: '50 Strips (500 Tablets - Free Delivery)', stripsCount: 50, tabletsCount: 500, price: 250.00, originalPrice: 500.00, discountPercentage: 50, freeDelivery: true }
    ]
  },
  {
    id: 'rem-nitraz-10',
    name: 'Nitraz 10mg Tablets (Nitrazepam)',
    brand: 'Nitraz 10 (Square Pharmaceuticals / Mogadon Generic)',
    genericName: 'Nitrazepam',
    category: 'Sleep Aids',
    legalCategory: 'CD',
    basePrice: 13.00,
    originalPrice: 13.00,
    rating: 4.92,
    reviewCount: 375,
    inStock: true,
    stockCount: 430,
    strength: '10mg',
    format: 'Tablets',
    unitsPerStrip: 10,
    stripSize: '10 Tablets / Blister Strip',
    activeIngredient: 'Nitrazepam 10mg',
    badge: 'Maximum Potency Hypnotic',
    sku: 'REM-NITRAZ-10',
    deliveryEstimate: 'Next-Day Guaranteed 1pm Special Delivery',
    prescriptionRequired: false,
    bnfIndication: 'Chronic refractory insomnia, profound sleep fragmentation, and severe nocturnal restlessness',
    dosageAdult: 'Take one 10mg tablet orally at night immediately before bed.',
    usageInstructions: [
      'Take with water directly before lying down.',
      'Allow full 8 hours for complete restorative sleep cycle.'
    ],
    cautions: [
      'Do not operate machinery or drive early in the morning if feeling drowsy.',
      'Not recommended for long continuous periods without intermittent breaks.'
    ],
    commonSideEffects: ['Deep sedation', 'Next-morning calmness', 'Lightheadedness'],
    description: 'Nitraz 10mg is a maximum-strength hypnotic formulation for individuals with severe sleep disruption. Unit basis: 1 strip (10 tablets).',
    packOptions: [
      { id: 'nitraz10-1strip', label: '1 Strip (10 Tablets)', stripsCount: 1, tabletsCount: 10, price: 13.00, originalPrice: 13.00, discountPercentage: 0 },
      { id: 'nitraz10-2strips', label: '2 Strips (20 Tablets)', stripsCount: 2, tabletsCount: 20, price: 25.00, originalPrice: 26.00, discountPercentage: 4 },
      { id: 'nitraz10-3strips', label: '3 Strips (30 Tablets)', stripsCount: 3, tabletsCount: 30, price: 36.00, originalPrice: 39.00, discountPercentage: 8, popular: true },
      { id: 'nitraz10-5strips', label: '5 Strips (50 Tablets)', stripsCount: 5, tabletsCount: 50, price: 63.00, originalPrice: 65.00, discountPercentage: 3 },
      { id: 'nitraz10-10strips', label: '10 Strips (100 Tablets)', stripsCount: 10, tabletsCount: 100, price: 115.00, originalPrice: 130.00, discountPercentage: 12 },
      { id: 'nitraz10-20strips', label: '20 Strips (200 Tablets)', stripsCount: 20, tabletsCount: 200, price: 200.00, originalPrice: 260.00, discountPercentage: 23 },
      { id: 'nitraz10-30strips', label: '30 Strips (300 Tablets)', stripsCount: 30, tabletsCount: 300, price: 250.00, originalPrice: 390.00, discountPercentage: 36 },
      { id: 'nitraz10-50strips', label: '50 Strips (500 Tablets - Free Delivery)', stripsCount: 50, tabletsCount: 500, price: 330.00, originalPrice: 650.00, discountPercentage: 49, freeDelivery: true }
    ]
  },

  // ==========================================
  // 4. ALPRAZOLAM (Xanax 0.5mg, Alprax 1 mg, Alprax 2 mg)
  // ==========================================
  {
    id: 'rem-xanax-05',
    name: 'Xanax 0.5mg Tablets (Alprazolam)',
    brand: 'Xanax (Pfizer / Upjohn)',
    genericName: 'Alprazolam',
    category: 'Anxiety & Calm',
    legalCategory: 'CD',
    basePrice: 13.99,
    originalPrice: 18.00,
    rating: 4.94,
    reviewCount: 610,
    inStock: false,
    stockCount: 0,
    strength: '0.5mg',
    format: 'Tablets',
    unitsPerStrip: 10,
    stripSize: '10 Tablets / Blister Strip',
    activeIngredient: 'Alprazolam 0.5mg',
    badge: 'Rapid 10-Min Panic Relief',
    sku: 'REM-XANAX-05',
    deliveryEstimate: 'Next-Day Delivery via Royal Mail Tracked 24',
    prescriptionRequired: false,
    bnfIndication: 'Acute management of severe panic attacks, intense agoraphobia, and anticipatory anxiety states',
    dosageAdult: 'Take 0.25mg to 0.5mg orally as needed for acute panic episodes, up to three times daily. Maximum daily dose 3mg.',
    usageInstructions: [
      'Swallow tablet with a sip of water or place under tongue for rapid sublingual absorption.',
      'Acts within 10-15 minutes to extinguish acute panic and chest tightness.'
    ],
    cautions: [
      'High potency; strictly adhere to recommended dosage.',
      'Do not combine with alcohol or sedating medications.'
    ],
    commonSideEffects: ['Rapid relaxation', 'Mild drowsiness', 'Lightheadedness'],
    description: 'Authentic Pfizer Xanax 0.5mg peach football tablets. Unit basis: 1 strip (10 tablets). Premier rapid-acting triazolobenzodiazepine for aborting acute panic attacks.',
    packOptions: [
      { id: 'xan-1strip', label: '1 Strip (10 Tablets)', stripsCount: 1, tabletsCount: 10, price: 13.99, originalPrice: 18.00, discountPercentage: 0 },
      { id: 'xan-2strips', label: '2 Strips (20 Tablets)', stripsCount: 2, tabletsCount: 20, price: 25.99, originalPrice: 36.00, discountPercentage: 8 },
      { id: 'xan-3strips', label: '3 Strips (30 Tablets)', stripsCount: 3, tabletsCount: 30, price: 36.99, originalPrice: 54.00, discountPercentage: 15, popular: true },
      { id: 'xan-5strips', label: '5 Strips (50 Tablets)', stripsCount: 5, tabletsCount: 50, price: 55.99, originalPrice: 90.00, discountPercentage: 22 },
      { id: 'xan-10strips', label: '10 Strips (100 Tablets - Bulk Pack)', stripsCount: 10, tabletsCount: 100, price: 99.99, originalPrice: 180.00, discountPercentage: 30 }
    ]
  },
  {
    id: 'rem-alprax-1',
    name: 'Alprax 1mg Tablets (Alprazolam)',
    brand: 'Alprax (Torrent Pharmaceuticals)',
    genericName: 'Alprazolam',
    category: 'Anxiety & Calm',
    legalCategory: 'CD',
    basePrice: 13.00,
    originalPrice: 13.00,
    rating: 4.90,
    reviewCount: 480,
    inStock: true,
    stockCount: 690,
    strength: '1mg',
    format: 'Tablets',
    unitsPerStrip: 10,
    stripSize: '10 Tablets / Blister Strip',
    activeIngredient: 'Alprazolam 1mg',
    badge: 'High Potency Anxiolytic',
    sku: 'REM-ALPRAX-1',
    deliveryEstimate: 'Guaranteed Next-Day 1pm Special Delivery',
    prescriptionRequired: false,
    bnfIndication: 'Panic disorder with or without agoraphobia, acute anxiety attacks, severe anxiety with depression',
    dosageAdult: 'Take 0.5mg (half tablet) to 1mg orally up to three times daily. Max 4mg daily.',
    usageInstructions: [
      'Take with water during acute episodes of extreme tension or panic.',
      'Scored tablet enables precise 0.5mg splitting.'
    ],
    cautions: [
      'Do not drive if feeling overly sedated.',
      'Taper gradually under guidance when ceasing treatment.'
    ],
    commonSideEffects: ['Profound calming', 'Sedation', 'Decreased alertness'],
    description: 'Alprax 1mg manufactured by Torrent Pharma offers dependable, fast-acting alprazolam in convenient 10-tablet blister packaging.',
    packOptions: [
      { id: 'alprax1-1strip', label: '1 Strip (10 Tablets)', stripsCount: 1, tabletsCount: 10, price: 13.00, originalPrice: 13.00, discountPercentage: 0 },
      { id: 'alprax1-2strips', label: '2 Strips (20 Tablets)', stripsCount: 2, tabletsCount: 20, price: 25.00, originalPrice: 26.00, discountPercentage: 4 },
      { id: 'alprax1-3strips', label: '3 Strips (30 Tablets)', stripsCount: 3, tabletsCount: 30, price: 36.00, originalPrice: 39.00, discountPercentage: 8, popular: true },
      { id: 'alprax1-5strips', label: '5 Strips (50 Tablets)', stripsCount: 5, tabletsCount: 50, price: 58.00, originalPrice: 65.00, discountPercentage: 11 },
      { id: 'alprax1-10strips', label: '10 Strips (100 Tablets)', stripsCount: 10, tabletsCount: 100, price: 110.00, originalPrice: 130.00, discountPercentage: 15 },
      { id: 'alprax1-20strips', label: '20 Strips (200 Tablets)', stripsCount: 20, tabletsCount: 200, price: 190.00, originalPrice: 260.00, discountPercentage: 27 },
      { id: 'alprax1-30strips', label: '30 Strips (300 Tablets)', stripsCount: 30, tabletsCount: 300, price: 260.00, originalPrice: 390.00, discountPercentage: 33 },
      { id: 'alprax1-50strips', label: '50 Strips (500 Tablets - Free Delivery)', stripsCount: 50, tabletsCount: 500, price: 350.00, originalPrice: 650.00, discountPercentage: 46, freeDelivery: true }
    ]
  },
  {
    id: 'rem-alprax-2',
    name: 'Alprax 2mg Tablets (Alprazolam)',
    brand: 'Alprax 2 (Torrent Pharmaceuticals)',
    genericName: 'Alprazolam',
    category: 'Anxiety & Calm',
    legalCategory: 'CD',
    basePrice: 16.00,
    originalPrice: 16.00,
    rating: 4.97,
    reviewCount: 640,
    inStock: true,
    stockCount: 820,
    strength: '2mg',
    format: 'Tablets',
    unitsPerStrip: 10,
    stripSize: '10 Tablets / Blister Strip',
    activeIngredient: 'Alprazolam 2mg',
    badge: 'Multi-Score 2mg Maximum Strength',
    sku: 'REM-ALPRAX-2',
    deliveryEstimate: 'Royal Mail Tracked 24 Discreet Plain Box Delivery',
    prescriptionRequired: false,
    bnfIndication: 'Severe disabling panic disorders, crisis anxiolytic intervention, severe anxiety with agoraphobia',
    dosageAdult: 'Take 0.5mg to 1mg (quarter to half tablet) or 2mg full tablet as clinically advised.',
    usageInstructions: [
      'Features 4-way multi-score break lines allowing exact 0.5mg, 1.0mg, or 2.0mg dosing.',
      'Take orally with water.'
    ],
    cautions: [
      'Very high potency formulation; strictly for experienced patients.',
      'Do not mix with alcohol or other central nervous system depressants.'
    ],
    commonSideEffects: ['Heavy sedation', 'Intense muscular relaxation', 'Calmness'],
    description: 'Alprax 2mg quad-scored tablets (Alprazolam). Calculated per strip of 10 tablets. The ultimate clinical solution for severe panic disorder.',
    packOptions: [
      { id: 'alprax2-1strip', label: '1 Strip (10 Tablets)', stripsCount: 1, tabletsCount: 10, price: 16.00, originalPrice: 16.00, discountPercentage: 0 },
      { id: 'alprax2-2strips', label: '2 Strips (20 Tablets)', stripsCount: 2, tabletsCount: 20, price: 31.00, originalPrice: 32.00, discountPercentage: 3 },
      { id: 'alprax2-3strips', label: '3 Strips (30 Tablets)', stripsCount: 3, tabletsCount: 30, price: 45.00, originalPrice: 48.00, discountPercentage: 6, popular: true },
      { id: 'alprax2-5strips', label: '5 Strips (50 Tablets)', stripsCount: 5, tabletsCount: 50, price: 73.00, originalPrice: 80.00, discountPercentage: 9 },
      { id: 'alprax2-10strips', label: '10 Strips (100 Tablets)', stripsCount: 10, tabletsCount: 100, price: 140.00, originalPrice: 160.00, discountPercentage: 13 },
      { id: 'alprax2-20strips', label: '20 Strips (200 Tablets - Free Delivery)', stripsCount: 20, tabletsCount: 200, price: 250.00, originalPrice: 320.00, discountPercentage: 22, freeDelivery: true },
      { id: 'alprax2-30strips', label: '30 Strips (300 Tablets - Free Delivery)', stripsCount: 30, tabletsCount: 300, price: 320.00, originalPrice: 480.00, discountPercentage: 33, freeDelivery: true },
      { id: 'alprax2-50strips', label: '50 Strips (500 Tablets - Free Delivery)', stripsCount: 50, tabletsCount: 500, price: 430.00, originalPrice: 800.00, discountPercentage: 46, freeDelivery: true }
    ]
  },

  // ==========================================
  // 5. LORAZEPAM (Loraz 2 mg, Loraz 3 mg)
  // ==========================================
  {
    id: 'rem-loraz-2',
    name: 'Lorazepam 2mg Tablets (Loraz / Generic)',
    brand: 'Loraz (Square Pharmaceuticals / Ativan Generic)',
    genericName: 'Lorazepam',
    category: 'Anxiety & Calm',
    legalCategory: 'CD',
    basePrice: 12.00,
    originalPrice: 12.00,
    rating: 4.90,
    reviewCount: 345,
    inStock: true,
    stockCount: 560,
    strength: '2mg',
    format: 'Tablets',
    unitsPerStrip: 10,
    stripSize: '10 Tablets / Blister Strip',
    activeIngredient: 'Lorazepam 2mg',
    badge: 'Clean Anxiolytic (No Active Metabolites)',
    sku: 'REM-LORAZ-2',
    deliveryEstimate: 'Next-Day Delivery via Royal Mail Tracked 24',
    prescriptionRequired: false,
    bnfIndication: 'Short-term management of severe anxiety states, acute agitation, insomnia associated with anxiety, and panic',
    dosageAdult: 'Take 1mg to 2mg orally two to three times daily as required.',
    usageInstructions: [
      'Take with water with or without meals.',
      'Clean metabolic pathway via glucuronidation makes it safe for patients with mild hepatic variance.'
    ],
    cautions: [
      'Do not consume alcohol.',
      'Do not abruptly discontinue long-term usage.'
    ],
    commonSideEffects: ['Sedation', 'Mild dizziness', 'Emotional calmness'],
    description: 'Lorazepam 2mg (Loraz / Ativan generic). Sourced in 10-tablet foil blister strips. Unit basis: 1 strip (10 tablets). Pure intermediate-acting anxiolytic with clean glucuronidation metabolism for rapid acute anxiety and panic relief.',
    packOptions: [
      { id: 'loraz2-1strip', label: '1 Strip (10 Tablets)', stripsCount: 1, tabletsCount: 10, price: 12.00, originalPrice: 12.00, discountPercentage: 0 },
      { id: 'loraz2-2strips', label: '2 Strips (20 Tablets)', stripsCount: 2, tabletsCount: 20, price: 24.00, originalPrice: 24.00, discountPercentage: 0 },
      { id: 'loraz2-3strips', label: '3 Strips (30 Tablets)', stripsCount: 3, tabletsCount: 30, price: 33.00, originalPrice: 36.00, discountPercentage: 8, popular: true },
      { id: 'loraz2-5strips', label: '5 Strips (50 Tablets)', stripsCount: 5, tabletsCount: 50, price: 53.00, originalPrice: 60.00, discountPercentage: 12 },
      { id: 'loraz2-10strips', label: '10 Strips (100 Tablets)', stripsCount: 10, tabletsCount: 100, price: 100.00, originalPrice: 120.00, discountPercentage: 17 },
      { id: 'loraz2-20strips', label: '20 Strips (200 Tablets - 1 Strip Free)', stripsCount: 20, tabletsCount: 200, price: 170.00, originalPrice: 240.00, discountPercentage: 29, bonusStrips: 1, bonusLabel: '+1 Free Strip' },
      { id: 'loraz2-30strips', label: '30 Strips (300 Tablets - 3 Strips Free)', stripsCount: 30, tabletsCount: 300, price: 230.00, originalPrice: 360.00, discountPercentage: 36, bonusStrips: 3, bonusLabel: '+3 Free Strips' },
      { id: 'loraz2-50strips', label: '50 Strips (500 Tablets - Free Delivery & 5 Strips Free)', stripsCount: 50, tabletsCount: 500, price: 300.00, originalPrice: 600.00, discountPercentage: 50, freeDelivery: true, bonusStrips: 5, bonusLabel: '+5 Free Strips' }
    ]
  },
  {
    id: 'rem-loraz-3',
    name: 'Lorazepam 3mg Tablets (Loraz / Generic)',
    brand: 'Loraz 3 (Square Pharmaceuticals)',
    genericName: 'Lorazepam',
    category: 'Anxiety & Calm',
    legalCategory: 'CD',
    basePrice: 14.00,
    originalPrice: 14.00,
    rating: 4.95,
    reviewCount: 420,
    inStock: true,
    stockCount: 490,
    strength: '3mg',
    format: 'Tablets',
    unitsPerStrip: 10,
    stripSize: '10 Tablets / Blister Strip',
    activeIngredient: 'Lorazepam 3mg',
    badge: 'Maximum Potency Lorazepam',
    sku: 'REM-LORAZ-3',
    deliveryEstimate: 'Next-Day Guaranteed 1pm Special Delivery',
    prescriptionRequired: false,
    bnfIndication: 'Severe treatment-resistant panic disorders, intense phobic states, and nocturnal agitation',
    dosageAdult: 'Take 1.5mg to 3mg once or twice daily as recommended by medical consultation.',
    usageInstructions: [
      'Take orally with water.',
      'Scored tablet for precise splitting into 1.5mg doses.'
    ],
    cautions: [
      'High-strength tablet; avoid combining with CNS depressants.',
      'Keep securely stored away from unauthorized access.'
    ],
    commonSideEffects: ['Profound calming', 'Sedation', 'Muscle relaxation'],
    description: 'Loraz 3mg high-potency Lorazepam from Square Pharma. Packaged in blister strips of 10 tablets.',
    packOptions: [
      { id: 'loraz3-1strip', label: '1 Strip (10 Tablets)', stripsCount: 1, tabletsCount: 10, price: 14.00, originalPrice: 14.00, discountPercentage: 0 },
      { id: 'loraz3-2strips', label: '2 Strips (20 Tablets)', stripsCount: 2, tabletsCount: 20, price: 28.00, originalPrice: 28.00, discountPercentage: 0 },
      { id: 'loraz3-3strips', label: '3 Strips (30 Tablets)', stripsCount: 3, tabletsCount: 30, price: 40.00, originalPrice: 42.00, discountPercentage: 5, popular: true },
      { id: 'loraz3-5strips', label: '5 Strips (50 Tablets)', stripsCount: 5, tabletsCount: 50, price: 65.00, originalPrice: 70.00, discountPercentage: 7 },
      { id: 'loraz3-10strips', label: '10 Strips (100 Tablets)', stripsCount: 10, tabletsCount: 100, price: 120.00, originalPrice: 140.00, discountPercentage: 14 },
      { id: 'loraz3-20strips', label: '20 Strips (200 Tablets - 1 Strip Free)', stripsCount: 20, tabletsCount: 200, price: 210.00, originalPrice: 280.00, discountPercentage: 25, bonusStrips: 1, bonusLabel: '+1 Free Strip' },
      { id: 'loraz3-30strips', label: '30 Strips (300 Tablets - 2 Strips Free)', stripsCount: 30, tabletsCount: 300, price: 290.00, originalPrice: 420.00, discountPercentage: 31, bonusStrips: 2, bonusLabel: '+2 Free Strips' },
      { id: 'loraz3-50strips', label: '50 Strips (500 Tablets - Free Delivery & 3 Strips Free)', stripsCount: 50, tabletsCount: 500, price: 400.00, originalPrice: 700.00, discountPercentage: 43, freeDelivery: true, bonusStrips: 3, bonusLabel: '+3 Free Strips' }
    ]
  },

  // ==========================================
  // 6. BROMAZEPAM & MIDAZOLAM & ETIZOLAM
  // ==========================================
  {
    id: 'rem-bromazepam-3',
    name: 'Bromazepam Tablets (Lexotan / Generic)',
    brand: 'Bromazepam (Roche / Square Pharma)',
    genericName: 'Bromazepam',
    category: 'Anxiety & Calm',
    legalCategory: 'CD',
    basePrice: 11.00,
    originalPrice: 11.00,
    rating: 4.88,
    reviewCount: 275,
    inStock: true,
    stockCount: 460,
    strength: '3mg',
    format: 'Tablets',
    unitsPerStrip: 10,
    stripSize: '10 Tablets / Blister Strip',
    activeIngredient: 'Bromazepam 3mg',
    badge: 'Targeted Emotional Balance',
    sku: 'REM-BROM-3',
    deliveryEstimate: 'Royal Mail Tracked 24 Discreet Express Delivery',
    prescriptionRequired: false,
    bnfIndication: 'Emotional disturbances, obsessive tension, acute social anxiety, and somatic anxiety manifestations',
    dosageAdult: 'Take 3mg to 6mg in divided doses throughout the day (usually 3mg in the morning, 3mg in the evening).',
    usageInstructions: [
      'Take with water.',
      'Smooth onset of calm without heavy grogginess.'
    ],
    cautions: [
      'Avoid alcohol consumption.',
      'Do not exceed 18mg daily in non-hospitalized patients.'
    ],
    commonSideEffects: ['Relaxation', 'Gentle sedation', 'Reduced physical tension'],
    description: 'Bromazepam (Lexotan generic) provides targeted relief from emotional distress, obsessive rumination, and somatic anxiety symptoms without disabling day-time fog. Unit basis: 1 strip (10 tablets).',
    packOptions: [
      { id: 'brom-1strip', label: '1 Strip (10 Tablets)', stripsCount: 1, tabletsCount: 10, price: 11.00, originalPrice: 11.00, discountPercentage: 0 },
      { id: 'brom-2strips', label: '2 Strips (20 Tablets)', stripsCount: 2, tabletsCount: 20, price: 20.00, originalPrice: 22.00, discountPercentage: 9 },
      { id: 'brom-3strips', label: '3 Strips (30 Tablets)', stripsCount: 3, tabletsCount: 30, price: 30.00, originalPrice: 33.00, discountPercentage: 9, popular: true },
      { id: 'brom-5strips', label: '5 Strips (50 Tablets)', stripsCount: 5, tabletsCount: 50, price: 50.00, originalPrice: 55.00, discountPercentage: 9 },
      { id: 'brom-10strips', label: '10 Strips (100 Tablets)', stripsCount: 10, tabletsCount: 100, price: 95.00, originalPrice: 110.00, discountPercentage: 14 },
      { id: 'brom-20strips', label: '20 Strips (200 Tablets)', stripsCount: 20, tabletsCount: 200, price: 170.00, originalPrice: 220.00, discountPercentage: 23 },
      { id: 'brom-30strips', label: '30 Strips (300 Tablets)', stripsCount: 30, tabletsCount: 300, price: 210.00, originalPrice: 330.00, discountPercentage: 36 },
      { id: 'brom-50strips', label: '50 Strips (500 Tablets - Free Delivery)', stripsCount: 50, tabletsCount: 500, price: 270.00, originalPrice: 550.00, discountPercentage: 51, freeDelivery: true }
    ]
  },
  {
    id: 'rem-midazolam-75',
    name: 'Milam 7.5mg Tablets (Midazolam)',
    brand: 'Milam (Midazolam)',
    genericName: 'Midazolam',
    category: 'Sleep Aids',
    legalCategory: 'CD',
    basePrice: 13.00,
    originalPrice: 13.00,
    rating: 4.93,
    reviewCount: 360,
    inStock: true,
    stockCount: 390,
    strength: '7.5mg',
    format: 'Tablets',
    unitsPerStrip: 10,
    stripSize: '10 Tablets / Blister Strip',
    activeIngredient: 'Midazolam 7.5mg',
    badge: 'Ultra-Rapid Sleep Induction',
    sku: 'REM-MILAM-75',
    deliveryEstimate: 'Next-Day Guaranteed 1pm Special Delivery',
    prescriptionRequired: false,
    bnfIndication: 'Severe sleep-onset insomnia, pre-procedural sedation, and acute nocturnal crisis',
    dosageAdult: 'Take 7.5mg orally with water immediately before going to bed. Onset occurs within 10-15 minutes.',
    usageInstructions: [
      'Take only when already in bed and prepared for immediate sleep.',
      'Ensures rapid knock-out with short 2-4 hour half-life for zero morning hangover.'
    ],
    cautions: [
      'Extremely rapid onset; do not take before driving or walking.',
      'Must allocate at least 6-7 hours in bed.'
    ],
    commonSideEffects: ['Instant sleepiness', 'Amnesia of pre-sleep period', 'Deep relaxation'],
    description: 'Milam 7.5mg (Midazolam) is the fastest-acting sleep inducer in modern pharmacology. Sourced in genuine 10-tablet foil blister strips.',
    packOptions: [
      { id: 'milam-1strip', label: '1 Strip (10 Tablets)', stripsCount: 1, tabletsCount: 10, price: 13.00, originalPrice: 13.00, discountPercentage: 0 },
      { id: 'milam-2strips', label: '2 Strips (20 Tablets)', stripsCount: 2, tabletsCount: 20, price: 25.00, originalPrice: 26.00, discountPercentage: 4 },
      { id: 'milam-3strips', label: '3 Strips (30 Tablets)', stripsCount: 3, tabletsCount: 30, price: 36.00, originalPrice: 39.00, discountPercentage: 8, popular: true },
      { id: 'milam-5strips', label: '5 Strips (50 Tablets)', stripsCount: 5, tabletsCount: 50, price: 58.00, originalPrice: 65.00, discountPercentage: 11 },
      { id: 'milam-10strips', label: '10 Strips (100 Tablets)', stripsCount: 10, tabletsCount: 100, price: 110.00, originalPrice: 130.00, discountPercentage: 15 },
      { id: 'milam-20strips', label: '20 Strips (200 Tablets)', stripsCount: 20, tabletsCount: 200, price: 190.00, originalPrice: 260.00, discountPercentage: 27 },
      { id: 'milam-30strips', label: '30 Strips (300 Tablets)', stripsCount: 30, tabletsCount: 300, price: 260.00, originalPrice: 390.00, discountPercentage: 33 },
      { id: 'milam-50strips', label: '50 Strips (500 Tablets - Free Delivery)', stripsCount: 50, tabletsCount: 500, price: 350.00, originalPrice: 650.00, discountPercentage: 46, freeDelivery: true }
    ]
  },
  {
    id: 'rem-etizolam-1',
    name: 'Etizolam 1mg Tablets (Etilaam / Etizex)',
    brand: 'Etilaam (Intas Pharmaceuticals)',
    genericName: 'Etizolam',
    category: 'Anxiety & Calm',
    legalCategory: 'CD',
    basePrice: 13.00,
    originalPrice: 13.00,
    rating: 4.89,
    reviewCount: 430,
    inStock: true,
    stockCount: 580,
    strength: '1mg',
    format: 'Tablets',
    unitsPerStrip: 10,
    stripSize: '10 Tablets / Blister Strip',
    activeIngredient: 'Etizolam 1mg',
    badge: 'Thienodiazepine Anxiolytic',
    sku: 'REM-ETIZ-1',
    deliveryEstimate: 'Next-Day Delivery via Royal Mail Tracked 24',
    prescriptionRequired: false,
    bnfIndication: 'Panic disorder, generalized anxiety disorder, tension headaches, and sleep onset difficulties',
    dosageAdult: 'Take 0.5mg to 1mg orally twice or three times daily as required.',
    usageInstructions: [
      'Take with water.',
      'Provides smooth anxiolytic relief without excessive muscle flaccidity.'
    ],
    cautions: [
      'Do not combine with alcohol or sedatives.',
      'Keep away from heat and direct sunlight.'
    ],
    commonSideEffects: ['Sedation', 'Mild fatigue', 'Calm mood'],
    description: 'Etilaam 1mg (Etizolam) manufactured by Intas Pharma. Potent thienodiazepine offering rapid reduction of anxiety with low risk of day-time cognitive impairment. Unit basis: 1 strip (10 tablets).',
    packOptions: [
      { id: 'etiz-1strip', label: '1 Strip (10 Tablets)', stripsCount: 1, tabletsCount: 10, price: 13.00, originalPrice: 13.00, discountPercentage: 0 },
      { id: 'etiz-2strips', label: '2 Strips (20 Tablets)', stripsCount: 2, tabletsCount: 20, price: 25.00, originalPrice: 26.00, discountPercentage: 4 },
      { id: 'etiz-3strips', label: '3 Strips (30 Tablets)', stripsCount: 3, tabletsCount: 30, price: 35.00, originalPrice: 39.00, discountPercentage: 10, popular: true },
      { id: 'etiz-5strips', label: '5 Strips (50 Tablets)', stripsCount: 5, tabletsCount: 50, price: 63.00, originalPrice: 65.00, discountPercentage: 3 },
      { id: 'etiz-10strips', label: '10 Strips (100 Tablets - Full Box)', stripsCount: 10, tabletsCount: 100, price: 118.00, originalPrice: 130.00, discountPercentage: 9 },
      { id: 'etiz-20strips', label: '20 Strips (200 Tablets - Bulk Pack)', stripsCount: 20, tabletsCount: 200, price: 210.00, originalPrice: 260.00, discountPercentage: 19 },
      { id: 'etiz-30strips', label: '30 Strips (300 Tablets - Free Delivery)', stripsCount: 30, tabletsCount: 300, price: 288.00, originalPrice: 390.00, discountPercentage: 26, freeDelivery: true },
      { id: 'etiz-50strips', label: '50 Strips (500 Tablets - Free Delivery)', stripsCount: 50, tabletsCount: 500, price: 350.00, originalPrice: 650.00, discountPercentage: 46, freeDelivery: true }
    ]
  },

  // ==========================================
  // 7. Z-DRUGS (Zopiclone 7.5mg, 20mg, Zopi 10, Zolpidem 10)
  // ==========================================
  {
    id: 'rem-zopiclone-75',
    name: 'Zopiclone 7.5mg Tablets',
    brand: 'Zopiclone (Zimovane / Sanofi / Generic UK)',
    genericName: 'Zopiclone',
    category: 'Sleep Aids',
    legalCategory: 'POM',
    basePrice: 10.00,
    originalPrice: 10.00,
    rating: 4.95,
    reviewCount: 780,
    inStock: true,
    stockCount: 950,
    strength: '7.5mg',
    format: 'Tablets',
    unitsPerStrip: 10,
    stripSize: '10 Tablets / Blister Strip',
    activeIngredient: 'Zopiclone 7.5mg',
    badge: 'UK #1 Sleep Aid',
    sku: 'REM-ZOPIC-75',
    deliveryEstimate: 'Next-Day Royal Mail Tracked 24 Express Delivery',
    prescriptionRequired: false,
    bnfIndication: 'Short-term treatment of debilitating insomnia, including difficulty falling asleep, nocturnal awakenings, and unrefreshing sleep',
    dosageAdult: 'Take one 7.5mg tablet orally immediately before bedtime with water. Do not exceed 7.5mg in a 24-hour period.',
    usageInstructions: [
      'Take right before retiring to bed with a glass of water.',
      'Acts within 15-30 minutes to facilitate rapid, natural sleep architecture.',
      'Ensure 7-8 hours uninterrupted time in bed before needing to be active.'
    ],
    cautions: [
      'Do not consume alcohol while taking Zopiclone.',
      'May produce a mild bitter or metallic taste in the mouth upon waking.',
      'Do not drive or operate machinery if you feel drowsy the following morning.'
    ],
    commonSideEffects: ['Mild metallic/bitter taste', 'Morning drowsiness', 'Dry mouth'],
    description: 'Genuine UK standard Zopiclone 7.5mg blister-sealed in 10-tablet strips. The premier cyclopyrrolone hypnotic prescribed across the NHS for fast sleep onset and unbroken night-time sleep.',
    packOptions: [
      { id: 'zop75-1strip', label: '1 Strip (10 Tablets)', stripsCount: 1, tabletsCount: 10, price: 10.00, originalPrice: 10.00, discountPercentage: 0 },
      { id: 'zop75-2strips', label: '2 Strips (20 Tablets)', stripsCount: 2, tabletsCount: 20, price: 20.00, originalPrice: 20.00, discountPercentage: 0 },
      { id: 'zop75-3strips', label: '3 Strips (30 Tablets)', stripsCount: 3, tabletsCount: 30, price: 27.00, originalPrice: 30.00, discountPercentage: 10, popular: true },
      { id: 'zop75-5strips', label: '5 Strips (50 Tablets)', stripsCount: 5, tabletsCount: 50, price: 42.00, originalPrice: 50.00, discountPercentage: 16 },
      { id: 'zop75-10strips', label: '10 Strips (100 Tablets - Full Box)', stripsCount: 10, tabletsCount: 100, price: 72.00, originalPrice: 100.00, discountPercentage: 28 },
      { id: 'zop75-20strips', label: '20 Strips (200 Tablets - Bulk Value)', stripsCount: 20, tabletsCount: 200, price: 120.00, originalPrice: 200.00, discountPercentage: 40 },
      { id: 'zop75-30strips', label: '30 Strips (300 Tablets - Wholesale)', stripsCount: 30, tabletsCount: 300, price: 175.00, originalPrice: 300.00, discountPercentage: 42 },
      { id: 'zop75-50strips', label: '50 Strips (500 Tablets - Mega Bulk)', stripsCount: 50, tabletsCount: 500, price: 230.00, originalPrice: 500.00, discountPercentage: 54 }
    ]
  },
  {
    id: 'rem-zopiclone-20',
    name: 'Zopiclone 20mg High-Potency Tablets',
    brand: 'Zopiclone 20 (Specialist Formulation)',
    genericName: 'Zopiclone',
    category: 'Sleep Aids',
    legalCategory: 'POM',
    basePrice: 13.00,
    originalPrice: 13.00,
    rating: 4.96,
    reviewCount: 490,
    inStock: true,
    stockCount: 510,
    strength: '20mg',
    format: 'Tablets',
    unitsPerStrip: 10,
    stripSize: '10 Tablets / High-Potency Strip',
    activeIngredient: 'Zopiclone 20mg',
    badge: 'Extra Strength Knockout',
    sku: 'REM-ZOPIC-20',
    deliveryEstimate: 'Next-Day Guaranteed 1pm Special Delivery',
    prescriptionRequired: false,
    bnfIndication: 'Severe chronic insomnia resistant to standard hypnotics, high tolerance sleep disorders',
    dosageAdult: 'Take half (10mg) to one full (20mg) tablet directly before bed. Scored for easy splitting.',
    usageInstructions: [
      'Take only when in bed.',
      'Provides deep 8-10 hour knockout sleep for severe insomnia.'
    ],
    cautions: [
      'Very strong hypnotic; allow at least 8 full hours of rest.',
      'Never mix with alcohol or sedatives.'
    ],
    commonSideEffects: ['Deep sleepiness', 'Bitter taste', 'Next-morning sedation'],
    description: 'High-potency Zopiclone 20mg with scored breakline. Priced per 10-tablet strip. Engineered for severe insomnia cases requiring maximum hypnotic efficacy.',
    packOptions: [
      { id: 'zop20-1strip', label: '1 Strip (10 Tablets)', stripsCount: 1, tabletsCount: 10, price: 13.00, originalPrice: 13.00, discountPercentage: 0 },
      { id: 'zop20-2strips', label: '2 Strips (20 Tablets)', stripsCount: 2, tabletsCount: 20, price: 25.00, originalPrice: 26.00, discountPercentage: 4 },
      { id: 'zop20-3strips', label: '3 Strips (30 Tablets)', stripsCount: 3, tabletsCount: 30, price: 37.00, originalPrice: 39.00, discountPercentage: 5, popular: true },
      { id: 'zop20-5strips', label: '5 Strips (50 Tablets)', stripsCount: 5, tabletsCount: 50, price: 58.00, originalPrice: 65.00, discountPercentage: 11 },
      { id: 'zop20-10strips', label: '10 Strips (100 Tablets - Full Box)', stripsCount: 10, tabletsCount: 100, price: 115.00, originalPrice: 130.00, discountPercentage: 12 },
      { id: 'zop20-20strips', label: '20 Strips (200 Tablets - Bulk Value)', stripsCount: 20, tabletsCount: 200, price: 210.00, originalPrice: 260.00, discountPercentage: 19 }
    ]
  },
  {
    id: 'rem-zopi-10',
    name: 'Zopiclone 10mg Tablets (Zopi / Generic UK)',
    brand: 'Zopi (Hab Pharma / UK Generic)',
    genericName: 'Zopiclone',
    category: 'Sleep Aids',
    legalCategory: 'POM',
    basePrice: 12.00,
    originalPrice: 12.00,
    rating: 4.90,
    reviewCount: 390,
    inStock: true,
    stockCount: 680,
    strength: '10mg',
    format: 'Tablets',
    unitsPerStrip: 14,
    stripSize: '14 Tablets / Blister Strip',
    activeIngredient: 'Zopiclone 10mg',
    badge: 'Enhanced Sleep Formula',
    sku: 'REM-ZOPI-10',
    deliveryEstimate: 'Next-Day Royal Mail Tracked 24 Discreet Packaging',
    prescriptionRequired: false,
    bnfIndication: 'Moderate to severe insomnia, nocturnal awakenings, non-restorative sleep',
    dosageAdult: 'Take one 10mg tablet orally at night right before bed.',
    usageInstructions: [
      'Take 20 minutes before sleeping with a glass of water.',
      'Promotes rapid sleep induction and maintains deep sleep stages 3 and 4.'
    ],
    cautions: [
      'Avoid driving or heavy machinery if sedated.',
      'Do not consume alcohol.'
    ],
    commonSideEffects: ['Mild metallic taste', 'Dry mouth', 'Calmness'],
    description: 'Zopiclone 10mg delivers an optimal therapeutic dose of pure zopiclone in convenient blister strips of 14 tablets.',
    packOptions: [
      { id: 'zopi10-1strip', label: '1 Strip (14 Tablets)', stripsCount: 1, tabletsCount: 14, price: 12.00, originalPrice: 12.00, discountPercentage: 0 },
      { id: 'zopi10-2strips', label: '2 Strips (28 Tablets)', stripsCount: 2, tabletsCount: 28, price: 24.00, originalPrice: 24.00, discountPercentage: 0 },
      { id: 'zopi10-3strips', label: '3 Strips (42 Tablets)', stripsCount: 3, tabletsCount: 42, price: 33.00, originalPrice: 36.00, discountPercentage: 8, popular: true },
      { id: 'zopi10-5strips', label: '5 Strips (70 Tablets)', stripsCount: 5, tabletsCount: 70, price: 50.00, originalPrice: 60.00, discountPercentage: 17 },
      { id: 'zopi10-10strips', label: '10 Strips (140 Tablets)', stripsCount: 10, tabletsCount: 140, price: 100.00, originalPrice: 120.00, discountPercentage: 17 },
      { id: 'zopi10-20strips', label: '20 Strips (280 Tablets)', stripsCount: 20, tabletsCount: 280, price: 180.00, originalPrice: 240.00, discountPercentage: 25 },
      { id: 'zopi10-30strips', label: '30 Strips (420 Tablets)', stripsCount: 30, tabletsCount: 420, price: 230.00, originalPrice: 360.00, discountPercentage: 36 },
      { id: 'zopi10-40strips', label: '40 Strips (560 Tablets - Free Delivery)', stripsCount: 40, tabletsCount: 560, price: 260.00, originalPrice: 480.00, discountPercentage: 46, freeDelivery: true },
      { id: 'zopi10-50strips', label: '50 Strips (700 Tablets - Free Delivery)', stripsCount: 50, tabletsCount: 700, price: 280.00, originalPrice: 600.00, discountPercentage: 53, freeDelivery: true }
    ]
  },
  {
    id: 'rem-zolpidem-10',
    name: 'Zolpidem Tartrate 10mg Tablets (Stilnoct / Ambien)',
    brand: 'Zolpidem (Sanofi / Ambien / Generic UK)',
    genericName: 'Zolpidem Tartrate',
    category: 'Sleep Aids',
    legalCategory: 'POM',
    basePrice: 16.50,
    originalPrice: 21.00,
    rating: 4.94,
    reviewCount: 650,
    inStock: true,
    stockCount: 880,
    strength: '10mg',
    format: 'Tablets',
    unitsPerStrip: 14,
    stripSize: '14 Tablets / Strip (UK Standard)',
    activeIngredient: 'Zolpidem Tartrate 10mg',
    badge: 'Rapid 15-Min Sleep Onset',
    sku: 'REM-ZOLPIDEM-10',
    deliveryEstimate: 'Next-Day Delivery via Royal Mail Tracked 24',
    prescriptionRequired: false,
    bnfIndication: 'Short-term treatment of debilitating insomnia characterized by difficulty initiating sleep',
    dosageAdult: 'Take 10mg orally immediately before going to bed. For elderly patients or first-time users, 5mg (half tablet) is recommended.',
    usageInstructions: [
      'Take only when already in bed ready to sleep.',
      'Acts within 15 minutes to induce deep restorative sleep.',
      'Zero residual morning drowsiness due to ultra-clean metabolic clearance.'
    ],
    cautions: [
      'Do not take unless you can get a full 7-8 hours of sleep.',
      'Never combine with alcohol or sedatives.'
    ],
    commonSideEffects: ['Rapid drowsiness', 'Dizziness', 'Mild headache'],
    description: 'Zolpidem 10mg (Ambien / Stilnoct) is the gold standard for rapid sleep induction without next-day hangover. Blister sealed in UK 14-tablet strips.',
    packOptions: [
      { id: 'zolp-1strip', label: '1 Strip (14 Tablets)', stripsCount: 1, tabletsCount: 14, price: 16.50, originalPrice: 21.00, discountPercentage: 0 },
      { id: 'zolp-2strips', label: '2 Strips (28 Tablets - 1 Month Supply)', stripsCount: 2, tabletsCount: 28, price: 30.99, originalPrice: 42.00, discountPercentage: 8 },
      { id: 'zolp-4strips', label: '4 Strips (56 Tablets - 2 Month Value Pack)', stripsCount: 4, tabletsCount: 56, price: 56.99, originalPrice: 84.00, discountPercentage: 15, popular: true },
      { id: 'zolp-8strips', label: '8 Strips (112 Tablets - Bulk Saver)', stripsCount: 8, tabletsCount: 112, price: 99.99, originalPrice: 168.00, discountPercentage: 22 },
      { id: 'zolp-16strips', label: '16 Strips (224 Tablets - Full Box)', stripsCount: 16, tabletsCount: 224, price: 184.99, originalPrice: 336.00, discountPercentage: 30 }
    ]
  },

  // ==========================================
  // 8. PREGABALIN (300mg, 450mg)
  // ==========================================
  {
    id: 'rem-pregabalin-300',
    name: 'Pregabalin 300mg Tablets / Capsules (Lyrica Formula)',
    brand: 'Pregabalin (Pfizer / Lyrica / Generic UK)',
    genericName: 'Pregabalin',
    category: 'Pain Relief',
    legalCategory: 'CD',
    basePrice: 14.00,
    originalPrice: 14.00,
    rating: 4.93,
    reviewCount: 510,
    inStock: true,
    stockCount: 740,
    strength: '300mg',
    format: 'Tablets',
    unitsPerStrip: 15,
    stripSize: '15 Tablets / Blister Strip',
    activeIngredient: 'Pregabalin 300mg',
    badge: 'Neuropathic Pain & Severe GAD',
    sku: 'REM-PREGAB-300',
    deliveryEstimate: 'Guaranteed Next-Day 1pm Special Delivery',
    prescriptionRequired: false,
    bnfIndication: 'Peripheral and central neuropathic pain, generalized anxiety disorder (GAD), fibromyalgia, and adjunctive therapy for partial seizures',
    dosageAdult: 'Take 150mg to 300mg daily in two divided doses. May increase to 600mg maximum daily as tolerated.',
    usageInstructions: [
      'Swallow whole with a glass of water, with or without food.',
      'Modulates voltage-gated calcium channels to dampen hyperactive pain and anxiety pathways.'
    ],
    cautions: [
      'Do not abruptly discontinue; taper over at least 1 week.',
      'May cause dizziness or weight gain with prolonged daily therapy.'
    ],
    commonSideEffects: ['Dizziness', 'Somnolence', 'Increased appetite'],
    description: 'Pregabalin 300mg high-potency formulation. Priced per 15-tablet blister strip. Potent dual action for burning nerve pain, sciatica, fibromyalgia, and chronic refractory anxiety.',
    packOptions: [
      { id: 'preg300-1strip', label: '1 Strip (15 Tablets)', stripsCount: 1, tabletsCount: 15, price: 14.00, originalPrice: 14.00, discountPercentage: 0 },
      { id: 'preg300-2strips', label: '2 Strips (30 Tablets)', stripsCount: 2, tabletsCount: 30, price: 28.00, originalPrice: 28.00, discountPercentage: 0 },
      { id: 'preg300-3strips', label: '3 Strips (45 Tablets)', stripsCount: 3, tabletsCount: 45, price: 40.00, originalPrice: 42.00, discountPercentage: 5, popular: true },
      { id: 'preg300-5strips', label: '5 Strips (75 Tablets)', stripsCount: 5, tabletsCount: 75, price: 65.00, originalPrice: 70.00, discountPercentage: 7 },
      { id: 'preg300-10strips', label: '10 Strips (150 Tablets)', stripsCount: 10, tabletsCount: 150, price: 120.00, originalPrice: 140.00, discountPercentage: 14 },
      { id: 'preg300-20strips', label: '20 Strips (300 Tablets)', stripsCount: 20, tabletsCount: 300, price: 215.00, originalPrice: 280.00, discountPercentage: 23 },
      { id: 'preg300-30strips', label: '30 Strips (450 Tablets)', stripsCount: 30, tabletsCount: 450, price: 280.00, originalPrice: 420.00, discountPercentage: 33 },
      { id: 'preg300-40strips', label: '40 Strips (600 Tablets)', stripsCount: 40, tabletsCount: 600, price: 330.00, originalPrice: 560.00, discountPercentage: 41 },
      { id: 'preg300-50strips', label: '50 Strips (750 Tablets - Free Delivery)', stripsCount: 50, tabletsCount: 750, price: 370.00, originalPrice: 700.00, discountPercentage: 47, freeDelivery: true }
    ]
  },
  {
    id: 'rem-pregabalin-450',
    name: 'Pregabalin 450mg Maximum Strength Tablets / Capsules',
    brand: 'Pregabalin 450 (High-Dose Specialist)',
    genericName: 'Pregabalin',
    category: 'Pain Relief',
    legalCategory: 'CD',
    basePrice: 17.00,
    originalPrice: 17.00,
    rating: 4.96,
    reviewCount: 380,
    inStock: true,
    stockCount: 420,
    strength: '450mg',
    format: 'Tablets',
    unitsPerStrip: 15,
    stripSize: '15 Tablets / Blister Strip',
    activeIngredient: 'Pregabalin 450mg',
    badge: 'Maximum Clinical Strength',
    sku: 'REM-PREGAB-450',
    deliveryEstimate: 'Next-Day Delivery via Royal Mail Tracked 24',
    prescriptionRequired: false,
    bnfIndication: 'Severe refractory neuropathic pain, acute nerve trauma, intense chronic generalized anxiety disorder',
    dosageAdult: 'Take one 450mg tablet/capsule once daily in the evening or as directed by specialist.',
    usageInstructions: [
      'Take with water with or without food.',
      'Sustained 24-hour nerve pain relief.'
    ],
    cautions: [
      'Very high dose; intended for patients with established pregabalin tolerance.',
      'Avoid operating machinery until response is established.'
    ],
    commonSideEffects: ['Sedation', 'Dizziness', 'Muscle relaxation'],
    description: 'Pregabalin 450mg maximum strength formulation in 15-tablet blister strips. Engineered for patients requiring high-dose neuropathic blockade.',
    packOptions: [
      { id: 'preg450-1strip', label: '1 Strip (15 Tablets)', stripsCount: 1, tabletsCount: 15, price: 17.00, originalPrice: 17.00, discountPercentage: 0 },
      { id: 'preg450-2strips', label: '2 Strips (30 Tablets)', stripsCount: 2, tabletsCount: 30, price: 34.00, originalPrice: 34.00, discountPercentage: 0 },
      { id: 'preg450-3strips', label: '3 Strips (45 Tablets)', stripsCount: 3, tabletsCount: 45, price: 48.00, originalPrice: 51.00, discountPercentage: 6, popular: true },
      { id: 'preg450-5strips', label: '5 Strips (75 Tablets)', stripsCount: 5, tabletsCount: 75, price: 78.00, originalPrice: 85.00, discountPercentage: 8 },
      { id: 'preg450-10strips', label: '10 Strips (150 Tablets)', stripsCount: 10, tabletsCount: 150, price: 145.00, originalPrice: 170.00, discountPercentage: 15 },
      { id: 'preg450-20strips', label: '20 Strips (300 Tablets)', stripsCount: 20, tabletsCount: 300, price: 255.00, originalPrice: 340.00, discountPercentage: 25 },
      { id: 'preg450-30strips', label: '30 Strips (450 Tablets)', stripsCount: 30, tabletsCount: 450, price: 340.00, originalPrice: 510.00, discountPercentage: 33 },
      { id: 'preg450-40strips', label: '40 Strips (600 Tablets - Free Delivery)', stripsCount: 40, tabletsCount: 600, price: 390.00, originalPrice: 680.00, discountPercentage: 43, freeDelivery: true },
      { id: 'preg450-50strips', label: '50 Strips (750 Tablets - Free Delivery)', stripsCount: 50, tabletsCount: 750, price: 425.00, originalPrice: 850.00, discountPercentage: 50, freeDelivery: true }
    ]
  },

  // ==========================================
  // 9. NOOTROPICS & FOCUS (Modafinil 200mg, Ritalin 20mg)
  // ==========================================
  {
    id: 'rem-modafinil-200',
    name: 'Modafinil 200mg Tablets (Modalert / Provigil)',
    brand: 'Modalert (Sun Pharma / Provigil)',
    genericName: 'Modafinil',
    category: 'Nootropics & Focus',
    legalCategory: 'POM',
    basePrice: 11.00,
    originalPrice: 11.00,
    rating: 4.97,
    reviewCount: 920,
    inStock: true,
    stockCount: 940,
    strength: '200mg',
    format: 'Tablets',
    unitsPerStrip: 10,
    stripSize: '10 Tablets / Blister Strip',
    activeIngredient: 'Modafinil 200mg',
    badge: '12-Hour Focus & Wakefulness',
    sku: 'REM-MODAF-200',
    deliveryEstimate: 'Next-Day Delivery via Royal Mail Tracked 24',
    prescriptionRequired: false,
    bnfIndication: 'Excessive daytime sleepiness associated with narcolepsy, shift work sleep disorder, and cognitive fatigue',
    dosageAdult: 'Take 100mg (half tablet) to 200mg (one tablet) orally in the morning with water. For shift workers: take 1 hour prior to commencing work.',
    usageInstructions: [
      'Take in the morning upon waking. Avoid taking after 1pm to prevent evening insomnia.',
      'Provides 10-14 hours of clean, non-jittery cognitive clarity and fatigue resistance.'
    ],
    cautions: [
      'Maintain proper hydration throughout the day.',
      'May reduce effectiveness of hormonal contraceptives.'
    ],
    commonSideEffects: ['Heightened alertness', 'Mild headache if dehydrated', 'Appetite reduction'],
    description: 'Original Sun Pharma Modalert 200mg (Modafinil). Dispensed per 10-tablet foil strip. The premier wakefulness and cognitive performance compound for deep work and fatigue elimination.',
    packOptions: [
      { id: 'mod-1strip', label: '1 Strip (10 Tablets)', stripsCount: 1, tabletsCount: 10, price: 11.00, originalPrice: 11.00, discountPercentage: 0 },
      { id: 'mod-2strips', label: '2 Strips (20 Tablets)', stripsCount: 2, tabletsCount: 20, price: 22.00, originalPrice: 22.00, discountPercentage: 0 },
      { id: 'mod-3strips', label: '3 Strips (30 Tablets)', stripsCount: 3, tabletsCount: 30, price: 31.00, originalPrice: 33.00, discountPercentage: 6, popular: true },
      { id: 'mod-5strips', label: '5 Strips (50 Tablets)', stripsCount: 5, tabletsCount: 50, price: 50.00, originalPrice: 55.00, discountPercentage: 9 },
      { id: 'mod-10strips', label: '10 Strips (100 Tablets)', stripsCount: 10, tabletsCount: 100, price: 90.00, originalPrice: 110.00, discountPercentage: 18 },
      { id: 'mod-20strips', label: '20 Strips (200 Tablets)', stripsCount: 20, tabletsCount: 200, price: 150.00, originalPrice: 220.00, discountPercentage: 32 },
      { id: 'mod-30strips', label: '30 Strips (300 Tablets)', stripsCount: 30, tabletsCount: 300, price: 200.00, originalPrice: 330.00, discountPercentage: 39 },
      { id: 'mod-50strips', label: '50 Strips (500 Tablets - Free Delivery)', stripsCount: 50, tabletsCount: 500, price: 270.00, originalPrice: 550.00, discountPercentage: 51, freeDelivery: true }
    ]
  },
  {
    id: 'rem-ritalin-10',
    name: 'Ritalin 10mg Tablets (Methylphenidate Hydrochloride)',
    brand: 'Ritalin (Novartis / Genuine Brand)',
    genericName: 'Methylphenidate Hydrochloride',
    category: 'Nootropics & Focus',
    legalCategory: 'CD',
    basePrice: 25.00,
    originalPrice: 25.00,
    rating: 4.98,
    reviewCount: 680,
    inStock: false,
    stockCount: 0,
    strength: '10mg',
    format: 'Tablets',
    unitsPerStrip: 10,
    stripSize: '10 Tablets / Blister Strip',
    activeIngredient: 'Methylphenidate Hydrochloride 10mg',
    badge: 'Novartis Executive Focus',
    sku: 'REM-RITALIN-10',
    deliveryEstimate: 'Next-Day Guaranteed 1pm Special Delivery',
    prescriptionRequired: false,
    bnfIndication: 'Attention Deficit Hyperactivity Disorder (ADHD), executive dysfunction, and severe cognitive fatigue',
    dosageAdult: 'Take 10mg in the morning, with an optional second 10mg dose at midday if required.',
    usageInstructions: [
      'Take with or without food in the morning.',
      'Immediate release formulation unlocks instant dopamine reuptake inhibition for laser focus.'
    ],
    cautions: [
      'Avoid taking late in the evening to prevent insomnia.',
      'Monitor blood pressure and stay hydrated.'
    ],
    commonSideEffects: ['Increased concentration and drive', 'Mild appetite suppression', 'Alertness'],
    description: 'Original Ritalin 10mg (Methylphenidate Hydrochloride) manufactured by Novartis. Sourced in 10-tablet foil strips. Extensively validated for executive focus, ADHD treatment, and cognitive productivity.',
    packOptions: [
      { id: 'ritalin-1strip', label: '1 Strip (10 Tablets)', stripsCount: 1, tabletsCount: 10, price: 25.00, originalPrice: 25.00, discountPercentage: 0 },
      { id: 'ritalin-2strips', label: '2 Strips (20 Tablets)', stripsCount: 2, tabletsCount: 20, price: 50.00, originalPrice: 50.00, discountPercentage: 0 },
      { id: 'ritalin-3strips', label: '3 Strips (30 Tablets)', stripsCount: 3, tabletsCount: 30, price: 70.00, originalPrice: 75.00, discountPercentage: 7, popular: true },
      { id: 'ritalin-5strips', label: '5 Strips (50 Tablets)', stripsCount: 5, tabletsCount: 50, price: 115.00, originalPrice: 125.00, discountPercentage: 8 },
      { id: 'ritalin-10strips', label: '10 Strips (100 Tablets - Full Box)', stripsCount: 10, tabletsCount: 100, price: 215.00, originalPrice: 250.00, discountPercentage: 14 },
      { id: 'ritalin-20strips', label: '20 Strips (200 Tablets - Bulk Value)', stripsCount: 20, tabletsCount: 200, price: 410.00, originalPrice: 500.00, discountPercentage: 18 }
    ]
  },

  // ==========================================
  // 10. PAIN RELIEF (OxyContin, Tramadol, Pain O Soma)
  // ==========================================
  {
    id: 'rem-oxycontin-80',
    name: 'OxyContin 80mg Prolonged-Release Tablets (Oxycodone HCl)',
    brand: 'OxyContin (Mundipharma / Napp / Generic)',
    genericName: 'Oxycodone Hydrochloride',
    category: 'Pain Relief',
    legalCategory: 'CD',
    basePrice: 35.00,
    originalPrice: 35.00,
    rating: 4.96,
    reviewCount: 428,
    inStock: false,
    stockCount: 0,
    strength: '80mg',
    format: 'Tablets',
    unitsPerStrip: 10,
    stripSize: '10 Tablets / Blister Strip',
    activeIngredient: 'Oxycodone Hydrochloride 80mg',
    badge: 'Extended-Release Opioid Analgesic',
    sku: 'REM-OXY-80',
    deliveryEstimate: 'Next-Day Royal Mail Tracked 24 Discreet Delivery',
    prescriptionRequired: false,
    bnfIndication: 'Severe intractable chronic pain, palliative pain management, postoperative relief where other opioid analgesics are inadequate',
    dosageAdult: 'Take one 80mg tablet swallowed whole every 12 hours with water. Do not crush, chew or break prolonged-release matrix.',
    usageInstructions: [
      'Swallow the tablet whole with a glass of water every 12 hours.',
      'Do not crush, chew, or divide tablets, as this destroys the controlled-release mechanism.',
      'Maintain consistent 12-hour dosing intervals for continuous analgesic coverage.'
    ],
    cautions: [
      'Do not consume with alcohol or other central nervous system depressants.',
      'Strictly avoid crushing or breaking tablets.'
    ],
    commonSideEffects: ['Profound pain relief', 'Mild sedation', 'Constipation', 'Dry mouth'],
    description: 'Genuine OxyContin 80mg (Oxycodone Hydrochloride) prolonged-release tablets. Sourced in 10-tablet foil blister strips. Engineered with advanced modified-release technology providing 12-hour continuous relief for severe acute and chronic pain conditions.',
    packOptions: [
      { id: 'oxy80-1strip', label: '1 Strip (10 Tablets)', stripsCount: 1, tabletsCount: 10, price: 35.00, originalPrice: 35.00, discountPercentage: 0 },
      { id: 'oxy80-2strips', label: '2 Strips (20 Tablets)', stripsCount: 2, tabletsCount: 20, price: 68.00, originalPrice: 70.00, discountPercentage: 3 },
      { id: 'oxy80-3strips', label: '3 Strips (30 Tablets)', stripsCount: 3, tabletsCount: 30, price: 100.00, originalPrice: 105.00, discountPercentage: 5, popular: true },
      { id: 'oxy80-5strips', label: '5 Strips (50 Tablets)', stripsCount: 5, tabletsCount: 50, price: 165.00, originalPrice: 175.00, discountPercentage: 6 },
      { id: 'oxy80-10strips', label: '10 Strips (100 Tablets - Full Box)', stripsCount: 10, tabletsCount: 100, price: 310.00, originalPrice: 350.00, discountPercentage: 11 }
    ]
  },
  {
    id: 'rem-tramadol-100',
    name: 'Tramadol 100mg Tablets (Ultram / Generic UK)',
    brand: 'Tramadol (Grünenthal / UK Generic)',
    genericName: 'Tramadol Hydrochloride',
    category: 'Pain Relief',
    legalCategory: 'CD',
    basePrice: 15.00,
    originalPrice: 15.00,
    rating: 4.92,
    reviewCount: 590,
    inStock: true,
    stockCount: 710,
    strength: '100mg',
    format: 'Tablets',
    unitsPerStrip: 10,
    stripSize: '10 Tablets / Blister Strip',
    activeIngredient: 'Tramadol HCl 100mg',
    badge: 'Dual-Action Opioid & SNRI Analgesic',
    sku: 'REM-TRAMADOL-100',
    deliveryEstimate: 'Next-Day Delivery via Royal Mail Tracked 24',
    prescriptionRequired: false,
    bnfIndication: 'Moderate to severe acute and chronic pain, postoperative pain, trauma, musculoskeletal and neuropathic pain',
    dosageAdult: 'Take 50mg to 100mg (1/2 to 1 tablet) orally every 4 to 6 hours as needed for pain. Maximum 400mg in 24 hours.',
    usageInstructions: [
      'Swallow with water with or without food.',
      'Provides rapid dual-action pain relief via mu-opioid activation and serotonin-noradrenaline reuptake inhibition.'
    ],
    cautions: [
      'Do not combine with MAOIs or excessive serotonergic medications.',
      'Do not consume alcohol.'
    ],
    commonSideEffects: ['Pain relief', 'Mild nausea', 'Drowsiness', 'Constipation'],
    description: 'Tramadol 100mg (Ultram generic) in 10-tablet blister strips. Trusted dual-action analgesic for severe post-op pain, sciatica, and chronic musculoskeletal conditions.',
    packOptions: [
      { id: 'tram-1strip', label: '1 Strip (10 Tablets)', stripsCount: 1, tabletsCount: 10, price: 15.00, originalPrice: 15.00, discountPercentage: 0 },
      { id: 'tram-2strips', label: '2 Strips (20 Tablets)', stripsCount: 2, tabletsCount: 20, price: 30.00, originalPrice: 30.00, discountPercentage: 0 },
      { id: 'tram-3strips', label: '3 Strips (30 Tablets)', stripsCount: 3, tabletsCount: 30, price: 43.00, originalPrice: 45.00, discountPercentage: 4, popular: true },
      { id: 'tram-5strips', label: '5 Strips (50 Tablets)', stripsCount: 5, tabletsCount: 50, price: 70.00, originalPrice: 75.00, discountPercentage: 7 },
      { id: 'tram-10strips', label: '10 Strips (100 Tablets)', stripsCount: 10, tabletsCount: 100, price: 135.00, originalPrice: 150.00, discountPercentage: 10 },
      { id: 'tram-20strips', label: '20 Strips (200 Tablets)', stripsCount: 20, tabletsCount: 200, price: 255.00, originalPrice: 300.00, discountPercentage: 15 },
      { id: 'tram-30strips', label: '30 Strips (300 Tablets - Free Delivery)', stripsCount: 30, tabletsCount: 300, price: 320.00, originalPrice: 450.00, discountPercentage: 29, freeDelivery: true },
      { id: 'tram-50strips', label: '50 Strips (500 Tablets - Free Delivery + 2 Free Strips)', stripsCount: 50, tabletsCount: 500, price: 450.00, originalPrice: 750.00, discountPercentage: 40, freeDelivery: true, bonusStrips: 2, bonusLabel: '+2 Free Strips' }
    ]
  },
  {
    id: 'rem-pain-o-soma-500',
    name: 'Pain O Soma 350mg Tablets (Carisoprodol)',
    brand: 'Pain O Soma (Hab Pharma / Soma Generic)',
    genericName: 'Carisoprodol',
    category: 'Pain Relief',
    legalCategory: 'POM',
    basePrice: 13.00,
    originalPrice: 13.00,
    rating: 4.95,
    reviewCount: 670,
    inStock: true,
    stockCount: 840,
    strength: '350mg',
    format: 'Tablets',
    unitsPerStrip: 10,
    stripSize: '10 Tablets / Blister Strip',
    activeIngredient: 'Carisoprodol 350mg',
    badge: 'Rapid Muscle Spasm & Pain Relief',
    sku: 'REM-SOMA-350',
    deliveryEstimate: 'Next-Day Royal Mail Tracked 24 Discreet Delivery',
    prescriptionRequired: false,
    bnfIndication: 'Acute, painful musculoskeletal conditions, severe muscle spasms, tension, and spinal injury discomfort',
    dosageAdult: 'Take 350mg orally three times daily and at bedtime with water.',
    usageInstructions: [
      'Take with water.',
      'Rapidly blocks interneuronal activity in the spinal cord and descending reticular formation to dissolve painful muscle rigidity.'
    ],
    cautions: [
      'May cause substantial sedation; do not drive or operate machinery.',
      'Limit continuous use to 2-3 weeks.'
    ],
    commonSideEffects: ['Muscular relaxation', 'Sedation', 'Lightheadedness'],
    description: 'Pain O Soma 350mg (Carisoprodol) from Hab Pharma. Priced per strip of 10 tablets. Highly effective central muscle relaxant for acute lumbar strain, severe muscle spasms, and tension relief.',
    packOptions: [
      { id: 'soma-1strip', label: '1 Strip (10 Tablets)', stripsCount: 1, tabletsCount: 10, price: 13.00, originalPrice: 13.00, discountPercentage: 0 },
      { id: 'soma-2strips', label: '2 Strips (20 Tablets)', stripsCount: 2, tabletsCount: 20, price: 25.00, originalPrice: 26.00, discountPercentage: 4 },
      { id: 'soma-3strips', label: '3 Strips (30 Tablets)', stripsCount: 3, tabletsCount: 30, price: 36.00, originalPrice: 39.00, discountPercentage: 8, popular: true },
      { id: 'soma-5strips', label: '5 Strips (50 Tablets)', stripsCount: 5, tabletsCount: 50, price: 58.00, originalPrice: 65.00, discountPercentage: 11 },
      { id: 'soma-10strips', label: '10 Strips (100 Tablets)', stripsCount: 10, tabletsCount: 100, price: 110.00, originalPrice: 130.00, discountPercentage: 15 },
      { id: 'soma-20strips', label: '20 Strips (200 Tablets)', stripsCount: 20, tabletsCount: 200, price: 200.00, originalPrice: 260.00, discountPercentage: 23 },
      { id: 'soma-30strips', label: '30 Strips (300 Tablets)', stripsCount: 30, tabletsCount: 300, price: 270.00, originalPrice: 390.00, discountPercentage: 31 },
      { id: 'soma-50strips', label: '50 Strips (500 Tablets - Free Delivery)', stripsCount: 50, tabletsCount: 500, price: 390.00, originalPrice: 650.00, discountPercentage: 40, freeDelivery: true }
    ]
  }
];

export const VERIFIED_REVIEWS: VerifiedCustomerReview[] = [
  {
    id: 'rev-1',
    author: 'David H.',
    location: 'Manchester, UK',
    rating: 5,
    date: '2 days ago',
    productPurchased: 'Zopiclone 7.5mg (4 Strips / 56 Tablets)',
    verifiedBuyer: true,
    title: 'Life saver for shift work insomnia',
    comment: 'I work rotating NHS night shifts and have suffered from chronic sleep disruption for 4 years. Ordered 4 strips on Tuesday afternoon, arrived Wednesday morning in totally unmarked plain packaging. Slept 8 solid hours without waking up once. 10/10 service.',
    category: 'Sleep Aids'
  },
  {
    id: 'rev-2',
    author: 'Sarah M.',
    location: 'Surrey, UK',
    rating: 5,
    date: '3 days ago',
    productPurchased: 'Sedil 5mg Tablets (3 Strips / 60 Tablets)',
    verifiedBuyer: true,
    title: 'Genuinely helped my severe panic attacks',
    comment: 'Authentic Sedil Diazepam with clean scorelines. Fast bank transfer was verified within 5 minutes on WhatsApp and tracked through Royal Mail Special Delivery. Discreet, respectful, and professional.',
    category: 'Anxiety & Calm'
  },
  {
    id: 'rev-3',
    author: 'Dr. Marcus L.',
    location: 'London, UK',
    rating: 5,
    date: '5 days ago',
    productPurchased: 'Modafinil 200mg (5 Strips / 50 Tablets)',
    verifiedBuyer: true,
    title: 'Genuine Sun Pharma Modalert',
    comment: 'As an academic researcher working tight publication deadlines, Modalert provides unparalleled sustained focus without jitteriness or crashes. PureSleep Pharma is easily the most reliable UK dispensary I have used.',
    category: 'Nootropics & Focus'
  },
  {
    id: 'rev-4',
    author: 'Robert P.',
    location: 'Birmingham, UK',
    rating: 5,
    date: '1 week ago',
    productPurchased: 'Rivotril 2mg Tablets (3 Strips / 30 Tablets)',
    verifiedBuyer: true,
    title: 'Original Roche Rivotril - Top Quality',
    comment: 'Cross-scored authentic Roche Rivotril in sealed blister strips. Arrived in a completely plain brown cardboard box. Excellent for suppressing nocturnal anxiety and getting restful sleep.',
    category: 'Anxiety & Calm'
  },
  {
    id: 'rev-5',
    author: 'Claire T.',
    location: 'Edinburgh, Scotland',
    rating: 5,
    date: '1 week ago',
    productPurchased: 'Tramadol HCl 100mg (3 Strips / 30 Capsules)',
    verifiedBuyer: true,
    title: 'Rapid relief for severe sciatica',
    comment: 'GP waiting times were weeks. PureSleep Pharma got authentic Tramadol to my door in Edinburgh within 24 hours. The pain relief allowed me to walk and sleep normally again.',
    category: 'Pain Relief'
  },
  {
    id: 'rev-6',
    author: 'James K.',
    location: 'Bristol, UK',
    rating: 5,
    date: '2 weeks ago',
    productPurchased: 'Zolpidem 10mg (2 Strips / 28 Tablets)',
    verifiedBuyer: true,
    title: 'Asleep in 15 minutes, zero morning fog',
    comment: 'Takes effect exactly when promised. Ordered with cryptocurrency and received rapid next-day dispatch. Fast, frictionless, top tier customer support.',
    category: 'Sleep Aids'
  },
  {
    id: 'rev-7',
    author: 'Michael B.',
    location: 'Leeds, UK',
    rating: 5,
    date: '2 weeks ago',
    productPurchased: 'Pain O Soma 500mg (3 Strips / 30 Tablets)',
    verifiedBuyer: true,
    title: 'Instant relief for lumbar muscle spasm',
    comment: 'Severe back strain had me couch-bound. Pain O Soma relaxed the spinal muscles within an hour. Excellent communication on Telegram.',
    category: 'Pain Relief'
  },
  {
    id: 'rev-8',
    author: 'Emma W.',
    location: 'Oxford, UK',
    rating: 5,
    date: '3 weeks ago',
    productPurchased: 'Ritalin 20mg (3 Strips / 30 Tablets)',
    verifiedBuyer: true,
    title: 'Unmatched clarity and ADHD focus',
    comment: 'Legitimate Novartis product. Helped me power through intense exam revisions without losing train of thought. Highly recommended UK pharmacy.',
    category: 'Nootropics & Focus'
  }
];

export const FREQUENTLY_ASKED_QUESTIONS = [
  {
    question: 'How are medications packaged and priced per strip?',
    answer: 'All our medications are priced and calculated starting from 1 blister strip (typically 10 or 14 tablets/capsules per strip). You can order single strips (1 Strip starter) or multi-strip bulk packs (2, 3, 5, 10 strips) for significant volume savings. Every blister strip is factory sealed in original pharmaceutical foil.'
  },
  {
    question: 'How fast is UK delivery and what will the package look like?',
    answer: 'All orders are dispatched via Royal Mail Tracked 24 Express (£12.00 flat rate) for guaranteed next-day discrete delivery. We ship in 100% discrete, unmarked plain packaging with zero logos, sender labels, or pharmaceutical mentions. Your privacy is completely protected.'
  },
  {
    question: 'Do I need to send a physical GP prescription?',
    answer: 'No. Our in-house GPhC registered independent prescribers review your clinical order questionnaire digitally upon checkout. If eligible, your medication is approved and dispensed immediately without needing to visit a doctor surgery.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept Instant UK Direct Bank Transfer (Faster Payments / BACS) and Cryptocurrency (Bitcoin BTC, Tether USDT TRC-20, and Ethereum ETH).'
  },
  {
    question: 'How do Multi-Strip discounts and Auto-Refill work?',
    answer: 'The more strips you order (e.g. 2, 3, 5, 10 strips), the greater your savings (up to 35% discount). Selecting "Auto-Refill & Save" applies an additional 10% discount on every recurring order scheduled every 30, 60, or 90 days. You can pause, adjust, or cancel anytime in 1 click.'
  },
  {
    question: 'Are all medications 100% genuine and UK/EU batch tested?',
    answer: 'Yes. All pharmaceuticals are sourced directly from authorized wholesale distributors, blister-sealed in original manufacturer foil packaging with verifiable batch codes and expiration dates.'
  },
  {
    question: 'How do I order or get live support on WhatsApp / Telegram?',
    answer: 'You can reach us on WhatsApp at 07877 180391 (https://wa.me/message/DCDJEBZXRXSHJ1) or directly on Telegram at @bossofbenzoo (https://t.me/bossofbenzoo). This connects you with our dispensary team for custom orders, fast inquiries, payment verification, and rapid discreet dispatch.'
  }
];

export const COUPON_CODES: CouponDiscount[] = [
  {
    code: 'WELCOME15',
    type: 'percentage',
    value: 15,
    minSpend: 20,
    description: '15% Off Your First Order at PureSleep Pharma'
  },
  {
    code: 'PURESLEEP10',
    type: 'percentage',
    value: 10,
    minSpend: 15,
    description: '10% Sitewide Discount on All Medications'
  },
  {
    code: 'RESTEASY10',
    type: 'percentage',
    value: 10,
    minSpend: 15,
    description: '10% Sitewide Discount on All Medications'
  },
  {
    code: 'FREEDEL',
    type: 'fixed',
    value: 12.00,
    minSpend: 35,
    description: 'Free Royal Mail Tracked 24 Express Shipping'
  }
];

export const LOYALTY_TIERS: LoyaltyTier[] = [
  {
    name: 'Bronze',
    minSpend: 0,
    discountPercent: 2,
    color: '#cd7f32',
    perks: ['2% Automatic Cashback', 'Standard Dispatch Priority', 'Discreet Packaging']
  },
  {
    name: 'Silver',
    minSpend: 100,
    discountPercent: 5,
    color: '#94a3b8',
    perks: ['5% Automatic Cashback', 'Free Royal Mail 48 Delivery', 'Dedicated Support']
  },
  {
    name: 'Gold',
    minSpend: 250,
    discountPercent: 8,
    color: '#fbbf24',
    perks: ['8% VIP Discount', 'Free Royal Mail Tracked 24 Express', 'Priority Dispensing Queue']
  },
  {
    name: 'Platinum',
    minSpend: 500,
    discountPercent: 10,
    color: '#10b981',
    perks: ['10% Permanent Discount', 'Free Next-Day 1pm Delivery', '24/7 Dedicated Concierge Pharmacist']
  }
];
