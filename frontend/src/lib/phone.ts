export interface NormalizedSaudiPhone {
  local: string;    // 05XXXXXXXX
  e164: string;     // +9665XXXXXXXX
  digitsWithCountryCode: string; // 9665XXXXXXXX
}

const TEST_PHONE = "055000000";

export function normalizeSaudiPhone(raw: string): NormalizedSaudiPhone | null {
  const stripped = raw.replace(/\D/g, "");

  // Test phone whitelist
  if (stripped === TEST_PHONE) {
    return {
      local: "055000000",
      e164: "+966055000000",
      digitsWithCountryCode: "966055000000",
    };
  }

  let national: string | null = null;

  if (stripped.startsWith("966") && stripped.length === 12) {
    national = stripped.slice(3); // 9665XXXXXXXX -> 5XXXXXXXX
  } else if (stripped.startsWith("0") && stripped.length === 10) {
    national = stripped.slice(1); // 05XXXXXXXX -> 5XXXXXXXX
  } else if (stripped.length === 9) {
    national = stripped; // 5XXXXXXXX
  }

  if (!national) return null;
  if (!/^5[0-9]{8}$/.test(national)) return null;

  return {
    local: "0" + national,
    e164: "+966" + national,
    digitsWithCountryCode: "966" + national,
  };
}

export function isValidSaudiPhone(raw: string): boolean {
  return normalizeSaudiPhone(raw) !== null;
}
