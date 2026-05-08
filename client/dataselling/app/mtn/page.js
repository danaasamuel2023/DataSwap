'use client';

import BundlePurchaseScreen from '../components/bundle-purchase-screen';

const config = {
  id: 'mtn',
  title: 'MTN Data Bundles',
  subtitle: 'Non-expiry bundles delivered straight to any MTN number.',
  network: 'mtn',
  availabilityKey: 'mtn',
  logoLabel: 'MTN',
  logoBg: '#FFCB05',
  logoFg: '#0A1628',
  accent: {
    soft: '#FFF7D6',
    text: '#7A5800',
    ring: 'rgba(245,158,11,.25)',
    button: ['#F59E0B', '#FFCB05'],
  },
  phonePattern: /^(024|054|055|059|025|053)\d{7}$/,
  phoneHint: '024XXXXXXX, 054XXXXXXX…',
  phoneError: 'Enter a valid MTN Ghana number.',
  phoneNoteSmall: 'Accepts 024, 054, 055, 059, 025, 053.',
  bundles: [
    { capacity: '1',  mb: '1000',   price: '4.50',  network: 'mtn' },
    { capacity: '2',  mb: '2000',   price: '9.20',  network: 'mtn' },
    { capacity: '3',  mb: '3000',   price: '13.50', network: 'mtn' },
    { capacity: '4',  mb: '4000',   price: '18.60', network: 'mtn' },
    { capacity: '5',  mb: '5000',   price: '23.50', network: 'mtn' },
    { capacity: '6',  mb: '6000',   price: '27.00', network: 'mtn' },
    { capacity: '8',  mb: '8000',   price: '35.50', network: 'mtn' },
    { capacity: '10', mb: '10000',  price: '43.50', network: 'mtn' },
    { capacity: '15', mb: '15000',  price: '62.50', network: 'mtn' },
    { capacity: '20', mb: '20000',  price: '83.00', network: 'mtn' },
    { capacity: '25', mb: '25000',  price: '105.00', network: 'mtn' },
    { capacity: '30', mb: '30000',  price: '129.00', network: 'mtn' },
    { capacity: '40', mb: '40000',  price: '166.00', network: 'mtn' },
    { capacity: '50', mb: '50000',  price: '207.20', network: 'mtn' },
    { capacity: '100',mb: '100000', price: '407.20', network: 'mtn' },
  ],
};

export default function MtnPage() {
  return <BundlePurchaseScreen config={config} />;
}
