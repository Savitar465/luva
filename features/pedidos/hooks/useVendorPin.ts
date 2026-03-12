'use client';

import { useCallback, useState } from 'react';

const DEFAULT_VENDOR_PIN = 'VEND-01';
const VENDOR_PIN_STORAGE_KEY = 'luva.vendor_pin';

function readStoredVendorPin() {
  if (typeof globalThis === 'undefined' || !('localStorage' in globalThis)) {
    return DEFAULT_VENDOR_PIN;
  }

  return globalThis.localStorage.getItem(VENDOR_PIN_STORAGE_KEY)?.trim().toUpperCase() || DEFAULT_VENDOR_PIN;
}

export function useVendorPin() {
  const [vendorPin, setVendorPin] = useState(readStoredVendorPin);
  const [vendorPinInput, setVendorPinInput] = useState(readStoredVendorPin);

  const persistVendorPin = useCallback(() => {
    const normalizedPin = vendorPinInput.trim().toUpperCase() || DEFAULT_VENDOR_PIN;

    globalThis.localStorage?.setItem(VENDOR_PIN_STORAGE_KEY, normalizedPin);
    setVendorPin(normalizedPin);
    setVendorPinInput(normalizedPin);

    return normalizedPin;
  }, [vendorPinInput]);

  return {
    vendorPin,
    vendorPinInput,
    setVendorPinInput,
    persistVendorPin,
    isHydrated: true,
  };
}


