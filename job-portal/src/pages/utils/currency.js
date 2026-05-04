
// ─── Single source of truth ───────────────────────────────────────────────────
// Every currency lives here exactly once as { code, symbol, region }.
// SUPPORTED_CURRENCIES and CURRENCY_SYMBOLS are both derived from this —
// so adding or removing a currency requires changing only one place.

const CURRENCY_REGISTRY = Object.freeze([
  // Global majors
  { code: "USD", symbol: "$",     region: "Global"      },
  { code: "EUR", symbol: "€",     region: "Global"      },
  { code: "GBP", symbol: "£",     region: "Global"      },
  { code: "JPY", symbol: "¥",     region: "Global"      },
  { code: "CHF", symbol: "CHF",   region: "Global"      },
  { code: "CNY", symbol: "¥",     region: "Global"      },

  // Americas
  { code: "CAD", symbol: "$",     region: "Americas"    },
  { code: "MXN", symbol: "$",     region: "Americas"    },
  { code: "BRL", symbol: "R$",    region: "Americas"    },
  { code: "ARS", symbol: "$",     region: "Americas"    },
  { code: "CLP", symbol: "$",     region: "Americas"    },

  // Africa
  { code: "NGN", symbol: "₦",     region: "Africa"      },
  { code: "ZAR", symbol: "R",     region: "Africa"      },
  { code: "KES", symbol: "KSh",   region: "Africa"      },
  { code: "GHS", symbol: "₵",     region: "Africa"      },
  { code: "EGP", symbol: "£",     region: "Africa"      },

  // Asia
  { code: "INR", symbol: "₹",     region: "Asia"        },
  { code: "PKR", symbol: "₨",     region: "Asia"        },
  { code: "BDT", symbol: "৳",     region: "Asia"        },
  { code: "SGD", symbol: "$",     region: "Asia"        },
  { code: "HKD", symbol: "$",     region: "Asia"        },
  { code: "KRW", symbol: "₩",     region: "Asia"        },
  { code: "IDR", symbol: "Rp",    region: "Asia"        },
  { code: "THB", symbol: "฿",     region: "Asia"        },
  { code: "MYR", symbol: "RM",    region: "Asia"        },
  { code: "PHP", symbol: "₱",     region: "Asia"        },

  // Middle East
  { code: "AED", symbol: "د.إ",   region: "Middle East" },
  { code: "SAR", symbol: "﷼",     region: "Middle East" },
  { code: "QAR", symbol: "﷼",     region: "Middle East" },
  { code: "KWD", symbol: "د.ك",   region: "Middle East" },

  // Oceania
  { code: "AUD", symbol: "$",     region: "Oceania"     },
  { code: "NZD", symbol: "$",     region: "Oceania"     },
]);

// ─── Derived exports (never manually maintained) ──────────────────────────────

/** All supported currency codes in regional order — e.g. ["USD", "EUR", ...] */
export const SUPPORTED_CURRENCIES = Object.freeze(
  CURRENCY_REGISTRY.map((c) => c.code)
);

/** Code → symbol lookup — e.g. { USD: "$", NGN: "₦", ... } */
export const CURRENCY_SYMBOLS = Object.freeze(
  Object.fromEntries(CURRENCY_REGISTRY.map((c) => [c.code, c.symbol]))
);

/** Code → region lookup — e.g. { NGN: "Africa", USD: "Global", ... } */
export const CURRENCY_REGIONS = Object.freeze(
  Object.fromEntries(CURRENCY_REGISTRY.map((c) => [c.code, c.region]))
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Returns the symbol for a currency code. Falls back to the code itself.
 * @example getCurrencySymbol("NGN") → "₦"
 * @example getCurrencySymbol("XYZ") → "XYZ"
 */
export const getCurrencySymbol = (code) => CURRENCY_SYMBOLS[code] ?? code;

/**
 * Formats a number into a compact salary string.
 * @example formatAmount(1500000, "NGN") → "₦1.5M"
 * @example formatAmount(250000,  "USD") → "$250K"
 */
export const formatAmount = (amount, code = "NGN") => {
  const symbol = getCurrencySymbol(code);
  if (amount >= 1_000_000) return `${symbol}${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000)     return `${symbol}${(amount / 1_000).toFixed(0)}K`;
  return `${symbol}${amount}`;
};

/**
 * Formats a salary range or single value.
 * @example formatSalary(200000, 500000, "NGN") → "₦200K - ₦500K"
 * @example formatSalary(null,   null,   "USD") → "Not specified"
 */
export const formatSalary = (min, max, code = "NGN") => {
  if (!min && !max) return "Not specified";
  if (min && max)   return `${formatAmount(min, code)} - ${formatAmount(max, code)}`;
  return formatAmount(min ?? max, code);
};

/**
 * Builds grouped option list for a <select> dropdown, grouped by region.
 * @example getCurrencyOptions() → [{ value: "NGN", label: "NGN (₦) — Africa" }, ...]
 */
export const getCurrencyOptions = () =>
  CURRENCY_REGISTRY.map(({ code, symbol, region }) => ({
    value: code,
    label: `${code} (${symbol})`,
    region,
  }));

/**
 * Returns options grouped by region — useful for <optgroup> dropdowns.
 * @example getGroupedCurrencyOptions() → { Global: [...], Africa: [...], ... }
 */
export const getGroupedCurrencyOptions = () =>
  CURRENCY_REGISTRY.reduce((groups, { code, symbol, region }) => {
    if (!groups[region]) groups[region] = [];
    groups[region].push({ value: code, label: `${code} (${symbol})` });
    return groups;
  }, {});


// export const CURRENCY_SYMBOLS = Object.freeze({
//   USD: "$",
//   EUR: "€",
//   GBP: "£",
//   JPY: "¥",
//   CHF: "CHF",
//   CNY: "¥",

//   // Americas
//   CAD: "$",
//   MXN: "$",
//   BRL: "R$",
//   ARS: "$",
//   CLP: "$",

//   // Africa
//   NGN: "₦",
//   ZAR: "R",
//   KES: "KSh",
//   GHS: "₵",
//   EGP: "£",

//   // Asia
//   INR: "₹",
//   PKR: "₨",
//   BDT: "৳",
//   SGD: "$",
//   HKD: "$",
//   KRW: "₩",
//   IDR: "Rp",
//   THB: "฿",
//   MYR: "RM",
//   PHP: "₱",

//   // Middle East
//   AED: "د.إ",
//   SAR: "﷼",
//   QAR: "﷼",
//   KWD: "د.ك",

//   // Oceania
//   AUD: "$",
//   NZD: "$",
// });

// export const SUPPORTED_CURRENCIES = Object.freeze([
//   // Global majors
//   "USD", "EUR", "GBP", "JPY", "CHF", "CNY",

//   // Americas
//   "CAD", "MXN", "BRL", "ARS", "CLP",

//   // Africa
//   "NGN", "ZAR", "KES", "GHS", "EGP",

//   // Asia
//   "INR", "PKR", "BDT", "SGD", "HKD",
//   "KRW", "IDR", "THB", "MYR", "PHP",

//   // Middle East
//   "AED", "SAR", "QAR", "KWD",

//   // Oceania
//   "AUD", "NZD",
// ]);