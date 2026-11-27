export const COMBINE_CHALLENGES = [
  {
    id: 'nacl',
    formula: 'NaCl',
    compoundName: 'Natrium Klorida',
    everydayName: 'Garam Dapur',
    iconKey: 'salt',
    reactionType: 'ionic',
    hint: 'Natrium (Na) memiliki nomor atom 11 (11 Proton, 12 Neutron, 11 Elektron). Klorin (Cl) memiliki nomor atom 17 (17 Proton, 18 Neutron, 17 Elektron).',
    whyMixed: 'Logam Natrium yang reaktif menyerahkan 1 elektron valensinya ke Klorin agar keduanya stabil membentuk kristal garam yang gurih!',
    slots: [
      { targetZ: 11, sym: 'Na', nameId: 'Natrium', enName: 'Sodium', allowNeutrons: [12], chargeRequired: null },
      { targetZ: 17, sym: 'Cl', nameId: 'Klorin', enName: 'Chlorine', allowNeutrons: [18, 20], chargeRequired: null },
    ],
  },
  {
    id: 'h2o',
    formula: 'H2O',
    compoundName: 'Hidrogen Monoksida',
    everydayName: 'Air Minum',
    iconKey: 'water',
    reactionType: 'covalent',
    hint: 'Hidrogen (H) adalah unsur paling ringan (#1: 1 Proton, 0 Neutron, 1 Elektron). Oksigen (O) bernomor atom 8 (8 Proton, 8 Neutron, 8 Elektron).',
    whyMixed: 'Dua atom Hidrogen berbagi elektron dengan 1 atom Oksigen membentuk molekul berbentuk V yang menjadi sumber air minum!',
    slots: [
      { targetZ: 1, sym: 'H', nameId: 'Hidrogen', enName: 'Hydrogen', allowNeutrons: [0, 1], chargeRequired: null },
      { targetZ: 8, sym: 'O', nameId: 'Oksigen', enName: 'Oxygen', allowNeutrons: [8], chargeRequired: null },
    ],
  },
  {
    id: 'mgo',
    formula: 'MgO',
    compoundName: 'Magnesium Oksida',
    everydayName: 'Abu Pijar Kembang Api',
    iconKey: 'magnet',
    reactionType: 'ionic',
    hint: 'Magnesium (Mg) nomor atom 12 (12 Proton, 12 Neutron, 12 Elektron netral). Oksigen (O) bernomor atom 8 (8 Proton, 8 Neutron, 8 Elektron).',
    whyMixed: 'Ketika pita Magnesium dibakar, ia melepaskan 2 elektron ke Oksigen udara, memancarkan cahaya putih terang dan menghasilkan MgO!',
    slots: [
      { targetZ: 12, sym: 'Mg', nameId: 'Magnesium', enName: 'Magnesium', allowNeutrons: [12], chargeRequired: null },
      { targetZ: 8, sym: 'O', nameId: 'Oksigen', enName: 'Oxygen', allowNeutrons: [8], chargeRequired: null },
    ],
  },
  {
    id: 'lif',
    formula: 'LiF',
    compoundName: 'Litium Fluorida',
    everydayName: 'Baterai & Lensa Optik',
    iconKey: 'battery',
    reactionType: 'ionic',
    hint: 'Litium (Li) nomor atom 3 (3 Proton, 4 Neutron, 3 Elektron). Fluorin (F) bernomor atom 9 (9 Proton, 10 Neutron, 9 Elektron).',
    whyMixed: 'Litium memberikan 1 elektron terluarnya kepada Fluorin (unsur paling elektronegatif!), membentuk kristal ionik super kuat.',
    slots: [
      { targetZ: 3, sym: 'Li', nameId: 'Litium', enName: 'Lithium', allowNeutrons: [4], chargeRequired: null },
      { targetZ: 9, sym: 'F', nameId: 'Fluorin', enName: 'Fluorine', allowNeutrons: [10], chargeRequired: null },
    ],
  },
];

export const BATTLE_PROGRESS_TRACKS = [
  { id: 'proton', label: 'Identitas Unsur (Proton)' },
  { id: 'neutron', label: 'Massa & Isotop (Neutron)' },
  { id: 'valence', label: 'Valensi, Awan Kuantum & Ikatan' },
  { id: 'charge', label: 'Muatan Listrik (Elektron & Ion)' },
];

export const QUIZ_QUESTIONS = [
  {
    id: 'q1',
    trackId: 'valence',
    prompt: 'Berdasarkan konfigurasi elektron Magnesium (2, 8, 2), mengapa sifat kimianya demikian?',
    options: [
      'Cenderung menangkap 6 elektron agar kulit ketiganya penuh menjadi 8.',
      'Mudah melepaskan 2 elektron terluar agar kulit di bawahnya stabil (oktet).',
      'Tidak bisa bereaksi sama sekali karena seluruh kulitnya sudah penuh.',
      'Membentuk ion negatif Mg²⁻ saat bertemu dengan gas Oksigen.',
    ],
    correctIndex: 1,
    explanation: 'Magnesium memiliki 2 elektron valensi. Melepas 2 elektron lebih mudah daripada menarik 6 elektron sehingga membentuk ion Mg²⁺.',
  },
  {
    id: 'q2',
    trackId: 'proton',
    prompt: 'Partikel manakah di dalam inti atom yang menentukan identitas suatu unsur (misalnya Membedakan Natrium #11 dari Magnesium #12)?',
    options: [
      'Jumlah Neutron di dalam inti atom',
      'Jumlah Elektron pada kulit terdalam',
      'Jumlah Proton bermuatan positif (+) di inti atom',
      'Total seluruh partikel bermuatan negatif',
    ],
    correctIndex: 2,
    explanation: 'Nomor atom sama dengan jumlah Proton. Mengubah jumlah Proton berarti mengubah unsur tersebut menjadi unsur yang berbeda.',
  },
  {
    id: 'q3',
    trackId: 'neutron',
    prompt: 'Karbon-12 (6 Proton, 6 Neutron) dan Karbon-14 (6 Proton, 8 Neutron) adalah dua isotop Karbon. Apa yang berubah di antara keduanya?',
    options: [
      'Nomor atom dan nama unsurnya ikut berubah.',
      'Massa atomnya berubah karena jumlah Neutron berbeda.',
      'Muatan listrik totalnya menjadi positif.',
      'Jumlah elektron valensinya bertambah 2 buah.',
    ],
    correctIndex: 1,
    explanation: 'Isotop memiliki jumlah Proton yang sama (unsur tetap sama), tetapi jumlah Neutron berbeda sehingga massa atomnya berbeda.',
  },
  {
    id: 'q4',
    trackId: 'charge',
    prompt: 'Natrium (Na) memiliki 11 Proton dan melepaskan 1 Elektron ke Klorin agar stabil. Apa muatan ion Natrium sekarang?',
    options: [
      'Ion positif Na⁺ (+1) karena tersisa 10 Elektron',
      'Ion negatif Na⁻ (-1) karena menerima 1 Proton',
      'Tetap netral (0) karena jumlah Neutron tidak berubah',
      'Bermuatan +2 karena melepas kulit kedua',
    ],
    correctIndex: 0,
    explanation: '11 Proton (+11) dikurangi 10 Elektron (-10) menghasilkan muatan bersih +1, ditulis sebagai kation Na⁺.',
  },
  {
    id: 'q5',
    trackId: 'valence',
    prompt: 'Mengapa Gas Helium (2 e⁻) dan Neon (2, 8 e⁻) aman digunakan di balon serta lampu karena sulit meledak atau bereaksi?',
    options: [
      'Massa intinya jauh lebih berat daripada besi.',
      'Tidak memiliki Proton di dalam intinya.',
      'Kulit elektron terluarnya sudah terisi penuh sehingga stabil.',
      'Seluruh elektronnya bergerak dengan kecepatan cahaya.',
    ],
    correctIndex: 2,
    explanation: 'Gas mulia seperti Helium dan Neon memiliki kulit valensi penuh sehingga tidak perlu melepas atau menangkap elektron.',
  },
];
