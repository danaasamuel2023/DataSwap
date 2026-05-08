'use client';

import BundlePurchaseScreen from '../components/bundle-purchase-screen';

const config = {
  id: 'at',
  shortName: 'AT iShare',
  title: 'AT iShare Bundles',
  subtitle: 'Affordable iShare bundles for any AT number.',
  network: 'AT_PREMIUM',
  availabilityKey: 'ishare',
  logoLabel: 'AT',
  accent: {
    tile: '#DC2626',
    tileText: '#FFFFFF',
    soft: '#FFE5E5',
    text: '#7A0000',
    ring: 'rgba(220,38,38,.25)',
    button: ['#DC2626', '#F87171'],
  },
  phonePattern: /^\d{10}$/,
  phoneHint: '10-digit AT number',
  phoneError: 'Enter a valid 10-digit phone number.',
  phoneNoteSmall: 'Any 10-digit Ghana number.',
  bundles: [
    { capacity: '1',  mb: '1000',  price: '3.95',  network: 'AT_PREMIUM' },
    { capacity: '2',  mb: '2000',  price: '8.35',  network: 'AT_PREMIUM' },
    { capacity: '3',  mb: '3000',  price: '13.25', network: 'AT_PREMIUM' },
    { capacity: '4',  mb: '4000',  price: '16.50', network: 'AT_PREMIUM' },
    { capacity: '5',  mb: '5000',  price: '19.50', network: 'AT_PREMIUM' },
    { capacity: '6',  mb: '6000',  price: '23.50', network: 'AT_PREMIUM' },
    { capacity: '8',  mb: '8000',  price: '30.50', network: 'AT_PREMIUM' },
    { capacity: '10', mb: '10000', price: '38.50', network: 'AT_PREMIUM' },
    { capacity: '12', mb: '12000', price: '45.50', network: 'AT_PREMIUM' },
    { capacity: '15', mb: '15000', price: '57.50', network: 'AT_PREMIUM' },
    { capacity: '25', mb: '25000', price: '95.00', network: 'AT_PREMIUM' },
    { capacity: '30', mb: '30000', price: '115.00', network: 'AT_PREMIUM' },
    { capacity: '40', mb: '40000', price: '151.00', network: 'AT_PREMIUM' },
    { capacity: '50', mb: '50000', price: '190.00', network: 'AT_PREMIUM' },
  ],
};

export default function AtPage() {
  return <BundlePurchaseScreen config={config} />;
}
