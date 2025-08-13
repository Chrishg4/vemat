// src/pages/CurrentReadingsPage.jsx
import React from 'react';
import GaugeDisplay from '../components/GaugeDisplay';

export default function CurrentReadingsPage() {
  return (
    <div className="p-4">
      <GaugeDisplay />
    </div>
  );
}