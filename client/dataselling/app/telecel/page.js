'use client';

import BundlePurchaseScreen from '../components/bundle-purchase-screen';

const config = {
  id: 'telecel',
  shortName: 'Telecel',
  title: 'Telecel Data Bundles',
  subtitle: 'Fast bundles for any Telecel Ghana number.',
  network: 'TELECEL',
  availabilityKey: 'telecel',
  logoLabel: 'TC',
  accent: {
    tile: '#E60000',
    tileText: '#FFFFFF',
    soft: '#FFE5E5',
    text: '#7A0000',
    ring: 'rgba(230,0,0,.25)',
    button: ['#E60000', '#F97070'],
  },
  phonePattern: /^(020|050)\d{7}$/,
  phoneHint: '020XXXXXXX or 050XXXXXXX',
  phoneError: 'Enter a valid Telecel number.',
  phoneNoteSmall: 'Accepts 020 and 050.',
  bundles: [
    { capacity: '5',  mb: '5000',   price: '26.00',  network: 'TELECEL' },
    { capacity: '8',  mb: '8000',   price: '40.00',  network: 'TELECEL' },
    { capacity: '10', mb: '10000',  price: '50.00',  network: 'TELECEL' },
    { capacity: '15', mb: '15000',  price: '71.00',  network: 'TELECEL' },
    { capacity: '20', mb: '20000',  price: '90.00',  network: 'TELECEL' },
    { capacity: '25', mb: '25000',  price: '112.00', network: 'TELECEL' },
    { capacity: '30', mb: '30000',  price: '129.00', network: 'TELECEL' },
    { capacity: '40', mb: '40000',  price: '170.00', network: 'TELECEL' },
    { capacity: '50', mb: '50000',  price: '208.00', network: 'TELECEL' },
    { capacity: '100',mb: '100000', price: '360.00', network: 'TELECEL' },
  ],
};

export default function TelecelPage() {
  return <BundlePurchaseScreen config={config} />;
}
