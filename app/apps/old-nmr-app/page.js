"use client";
import React, { useState, useEffect, useMemo, useCallback } from 'react';

// NMR data from Fulmer et al. (2010) and Babij et al. (2016)
// Prioritizing Babij et al. where overlap exists.
const nmrData = [
  // Solvent Residual Peaks (from Babij et al. for common solvents)
  {
    "impurity": "solvent residual peak",
    "atomLabel": "",
    "multiplicity": "",
    "type": "H",
    "shifts": {
      "CDCl3": "7.26",
      "acetone-d6": "2.05",
      "DMSO-d6": "2.50",
      "CD3CN": "1.94",
      "CD3OD": "3.31",
      "D2O": "4.79"
    }
  },
  {
    "impurity": "solvent residual peak",
    "atomLabel": "",
    "multiplicity": "",
    "type": "C",
    "shifts": {
      "CDCl3": "77.06±0.03",
      "acetone-d6": "29.82±0.01\n206.03±0.10",
      "DMSO-d6": "39.53±0.05",
      "CD3CN": "1.32±0.01\n118.26±0.03",
      "CD3OD": "49.03±0.01",
      "D2O": "" // No C-NMR residual for D2O in this paper
    }
  },
  // Water
  {
    "impurity": "water",
    "atomLabel": "OH",
    "multiplicity": "S",
    "type": "H",
    "shifts": {
      "CDCl3": "1.56",
      "acetone-d6": "2.84",
      "DMSO-d6": "3.33",
      "CD3CN": "2.13",
      "CD3OD": "4.87",
      "D2O": ""
    }
  },
  // Acetic Acid
  {
    "impurity": "acetic acid",
    "atomLabel": "CH3",
    "multiplicity": "S",
    "type": "H",
    "shifts": {
      "CDCl3": "2.10",
      "acetone-d6": "1.96",
      "DMSO-d6": "1.91",
      "CD3CN": "1.96",
      "CD3OD": "1.99",
      "D2O": "2.08"
    }
  },
  {
    "impurity": "acetic acid",
    "atomLabel": "CO",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "175.99",
      "acetone-d6": "172.31",
      "DMSO-d6": "171.93",
      "CD3CN": "173.21",
      "CD3OD": "175.11",
      "D2O": "177.21"
    }
  },
  {
    "impurity": "acetic acid",
    "atomLabel": "CH3",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "20.81",
      "acetone-d6": "20.51",
      "DMSO-d6": "20.95",
      "CD3CN": "20.73",
      "CD3OD": "20.56",
      "D2O": "21.03"
    }
  },
  // Acetic Anhydride
  {
    "impurity": "acetic anhydride",
    "atomLabel": "CH3",
    "multiplicity": "S",
    "type": "H",
    "shifts": {
      "CDCl3": "2.23",
      "acetone-d6": "2.21",
      "DMSO-d6": "2.22",
      "CD3CN": "2.18",
      "CD3OD": "",
      "D2O": ""
    }
  },
  {
    "impurity": "acetic anhydride",
    "atomLabel": "CO",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "166.38",
      "acetone-d6": "167.44",
      "DMSO-d6": "166.89",
      "CD3CN": "168.02",
      "CD3OD": "b", // "b" indicates not determined due to reactivity
      "D2O": "b"
    }
  },
  {
    "impurity": "acetic anhydride",
    "atomLabel": "CH3",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "22.15",
      "acetone-d6": "22.05",
      "DMSO-d6": "21.90",
      "CD3CN": "22.45",
      "CD3OD": "b",
      "D2O": "b"
    }
  },
  // Acetone (from Babij et al.)
  {
    "impurity": "acetone",
    "atomLabel": "CH3",
    "multiplicity": "S",
    "type": "H",
    "shifts": {
      "CDCl3": "2.17",
      "acetone-d6": "2.09",
      "DMSO-d6": "2.09",
      "CD3CN": "2.08",
      "CD3OD": "2.15",
      "D2O": "2.22"
    }
  },
  {
    "impurity": "acetone",
    "atomLabel": "CO",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "207.07",
      "acetone-d6": "205.87",
      "DMSO-d6": "206.31",
      "CD3CN": "207.43",
      "CD3OD": "209.67",
      "D2O": "215.94"
    }
  },
  {
    "impurity": "acetone",
    "atomLabel": "CH3",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "30.92",
      "acetone-d6": "30.60",
      "DMSO-d6": "30.56",
      "CD3CN": "30.91",
      "CD3OD": "30.67",
      "D2O": "30.89"
    }
  },
  // Acetonitrile (from Babij et al.)
  {
    "impurity": "acetonitrile",
    "atomLabel": "CH3",
    "multiplicity": "S",
    "type": "H",
    "shifts": {
      "CDCl3": "2.10",
      "acetone-d6": "2.05",
      "DMSO-d6": "2.07",
      "CD3CN": "1.96",
      "CD3OD": "2.03",
      "D2O": "2.06"
    }
  },
  {
    "impurity": "acetonitrile",
    "atomLabel": "CN",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "116.43",
      "acetone-d6": "117.60",
      "DMSO-d6": "117.91",
      "CD3CN": "118.26",
      "CD3OD": "118.06",
      "D2O": "119.68"
    }
  },
  {
    "impurity": "acetonitrile",
    "atomLabel": "CH3",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "1.89",
      "acetone-d6": "1.12",
      "DMSO-d6": "1.03",
      "CD3CN": "1.79",
      "CD3OD": "0.85",
      "D2O": "1.47"
    }
  },
  // iso-amyl acetate
  {
    "impurity": "iso-amyl acetate",
    "atomLabel": "OCH2",
    "multiplicity": "t, 6.8",
    "type": "H",
    "shifts": {
      "CDCl3": "4.10",
      "acetone-d6": "4.05",
      "DMSO-d6": "4.02",
      "CD3CN": "4.05",
      "CD3OD": "4.09",
      "D2O": "4.14"
    }
  },
  {
    "impurity": "iso-amyl acetate",
    "atomLabel": "CH3CO",
    "multiplicity": "S",
    "type": "H",
    "shifts": {
      "CDCl3": "2.05",
      "acetone-d6": "1.97",
      "DMSO-d6": "1.99",
      "CD3CN": "1.97",
      "CD3OD": "2.01",
      "D2O": "2.07"
    }
  },
  {
    "impurity": "iso-amyl acetate",
    "atomLabel": "CH",
    "multiplicity": "nonet, 6.7",
    "type": "H",
    "shifts": {
      "CDCl3": "1.68",
      "acetone-d6": "1.69",
      "DMSO-d6": "1.64",
      "CD3CN": "1.67",
      "CD3OD": "1.69",
      "D2O": "1.67"
    }
  },
  {
    "impurity": "iso-amyl acetate",
    "atomLabel": "CH2CH",
    "multiplicity": "q, 6.9",
    "type": "H",
    "shifts": {
      "CDCl3": "1.50",
      "acetone-d6": "1.52",
      "DMSO-d6": "1.45",
      "CD3CN": "1.49",
      "CD3OD": "1.51",
      "D2O": "1.53"
    }
  },
  {
    "impurity": "iso-amyl acetate",
    "atomLabel": "(CH3)2",
    "multiplicity": "d, 6.6",
    "type": "H",
    "shifts": {
      "CDCl3": "0.92",
      "acetone-d6": "0.91",
      "DMSO-d6": "0.88",
      "CD3CN": "0.91",
      "CD3OD": "0.93",
      "D2O": "0.89"
    }
  },
  {
    "impurity": "iso-amyl acetate",
    "atomLabel": "CO",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "172.15",
      "acetone-d6": "171.02",
      "DMSO-d6": "170.28",
      "CD3CN": "171.91",
      "CD3OD": "173.08",
      "D2O": ""
    }
  },
  {
    "impurity": "iso-amyl acetate",
    "atomLabel": "OCH2",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "63.56",
      "acetone-d6": "63.23",
      "DMSO-d6": "62.18",
      "CD3CN": "63.71",
      "CD3OD": "64.22",
      "D2O": ""
    }
  },
  {
    "impurity": "iso-amyl acetate",
    "atomLabel": "CH2CH",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "37.29",
      "acetone-d6": "38.18",
      "DMSO-d6": "36.83",
      "CD3CN": "38.16",
      "CD3OD": "38.53",
      "D2O": ""
    }
  },
  {
    "impurity": "iso-amyl acetate",
    "atomLabel": "CH",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "25.09",
      "acetone-d6": "25.77",
      "DMSO-d6": "24.47",
      "CD3CN": "25.90",
      "CD3OD": "26.27",
      "D2O": ""
    }
  },
  {
    "impurity": "iso-amyl acetate",
    "atomLabel": "(CH3)2",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "22.45",
      "acetone-d6": "22.71",
      "DMSO-d6": "22.20",
      "CD3CN": "22.74",
      "CD3OD": "22.82",
      "D2O": "22.71"
    }
  },
  {
    "impurity": "iso-amyl acetate",
    "atomLabel": "CH3CO",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "21.05",
      "acetone-d6": "20.80",
      "DMSO-d6": "20.64",
      "CD3CN": "21.17",
      "CD3OD": "20.87",
      "D2O": ""
    }
  },
  // iso-amyl alcohol
  {
    "impurity": "iso-amyl alcohol",
    "atomLabel": "CH2OH",
    "multiplicity": "td, 6.8, 5.2",
    "type": "H",
    "shifts": {
      "CDCl3": "3.68, t(6.8)",
      "acetone-d6": "3.56",
      "DMSO-d6": "3.41",
      "CD3CN": "3.51",
      "CD3OD": "3.57, t (6.9)",
      "D2O": "3.64, t (6.8)"
    }
  },
  {
    "impurity": "iso-amyl alcohol",
    "atomLabel": "OH",
    "multiplicity": "t, 5.2",
    "type": "H",
    "shifts": {
      "CDCl3": "3.34",
      "acetone-d6": "3.34",
      "DMSO-d6": "4.29",
      "CD3CN": "2.40",
      "CD3OD": "",
      "D2O": ""
    }
  },
  {
    "impurity": "iso-amyl alcohol",
    "atomLabel": "CH",
    "multiplicity": "nonet, 6.7",
    "type": "H",
    "shifts": {
      "CDCl3": "1.72",
      "acetone-d6": "1.73",
      "DMSO-d6": "1.65",
      "CD3CN": "1.67",
      "CD3OD": "1.71",
      "D2O": "1.67"
    }
  },
  {
    "impurity": "iso-amyl alcohol",
    "atomLabel": "CH2CH",
    "multiplicity": "q, 6.8",
    "type": "H",
    "shifts": {
      "CDCl3": "1.47",
      "acetone-d6": "1.39",
      "DMSO-d6": "1.31",
      "CD3CN": "1.37",
      "CD3OD": "1.42",
      "D2O": "1.44"
    }
  },
  {
    "impurity": "iso-amyl alcohol",
    "atomLabel": "CH3",
    "multiplicity": "d, 6.7",
    "type": "H",
    "shifts": {
      "CDCl3": "0.92",
      "acetone-d6": "0.89",
      "DMSO-d6": "0.85",
      "CD3CN": "0.89",
      "CD3OD": "0.91",
      "D2O": "0.90"
    }
  },
  {
    "impurity": "iso-amyl alcohol",
    "atomLabel": "CHOH",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "61.36",
      "acetone-d6": "60.72 [60.59]",
      "DMSO-d6": "58.91",
      "CD3CN": "60.94",
      "CD3OD": "61.28",
      "D2O": "60.82"
    }
  },
  {
    "impurity": "iso-amyl alcohol",
    "atomLabel": "CH2CH",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "41.79",
      "acetone-d6": "42.80 [42.75]",
      "DMSO-d6": "41.54",
      "CD3CN": "42.66",
      "CD3OD": "42.70",
      "D2O": "40.96"
    }
  },
  {
    "impurity": "iso-amyl alcohol",
    "atomLabel": "CH",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "24.74",
      "acetone-d6": "25.43",
      "DMSO-d6": "24.18",
      "CD3CN": "25.56",
      "CD3OD": "25.86",
      "D2O": "24.65"
    }
  },
  {
    "impurity": "iso-amyl alcohol",
    "atomLabel": "CH3",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "22.62",
      "acetone-d6": "22.98",
      "DMSO-d6": "22.52",
      "CD3CN": "22.96",
      "CD3OD": "23.02",
      "D2O": "22.39"
    }
  },
  // Anisole
  {
    "impurity": "anisole",
    "atomLabel": "CH (3,5)",
    "multiplicity": "m",
    "type": "H",
    "shifts": {
      "CDCl3": "7.32-7.27",
      "acetone-d6": "7.31-7.25",
      "DMSO-d6": "7.31-7.26",
      "CD3CN": "7.32-7.27",
      "CD3OD": "7.28-7.22",
      "D2O": "7.40, t (8.0)"
    }
  },
  {
    "impurity": "anisole",
    "atomLabel": "CH (2,4,6)",
    "multiplicity": "m",
    "type": "H",
    "shifts": {
      "CDCl3": "6.97-6.89",
      "acetone-d6": "6.96-6.89",
      "DMSO-d6": "6.94-6.90",
      "CD3CN": "6.96-6.90",
      "CD3OD": "6.92-6.87",
      "D2O": "7.09-7.03"
    }
  },
  {
    "impurity": "anisole",
    "atomLabel": "OCH3",
    "multiplicity": "S",
    "type": "H",
    "shifts": {
      "CDCl3": "3.81",
      "acetone-d6": "3.78",
      "DMSO-d6": "3.75",
      "CD3CN": "3.77",
      "CD3OD": "3.77",
      "D2O": "3.854"
    }
  },
  {
    "impurity": "anisole",
    "atomLabel": "C (1)",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "159.59",
      "acetone-d6": "160.71",
      "DMSO-d6": "159.30",
      "CD3CN": "160.74",
      "CD3OD": "161.15",
      "D2O": ""
    }
  },
  {
    "impurity": "anisole",
    "atomLabel": "CH (3,5)",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "129.44",
      "acetone-d6": "130.21",
      "DMSO-d6": "129.40",
      "CD3CN": "130.48",
      "CD3OD": "130.41",
      "D2O": ""
    }
  },
  {
    "impurity": "anisole",
    "atomLabel": "CH (4)",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "120.67",
      "acetone-d6": "121.25",
      "DMSO-d6": "120.41",
      "CD3CN": "121.52",
      "CD3OD": "121.59",
      "D2O": ""
    }
  },
  {
    "impurity": "anisole",
    "atomLabel": "CH (2,6)",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "113.93",
      "acetone-d6": "114.68",
      "DMSO-d6": "113.87",
      "CD3CN": "114.85",
      "CD3OD": "114.91",
      "D2O": ""
    }
  },
  {
    "impurity": "anisole",
    "atomLabel": "OCH3",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "55.14",
      "acetone-d6": "55.34",
      "DMSO-d6": "54.87",
      "CD3CN": "55.76",
      "CD3OD": "55.56",
      "D2O": ""
    }
  },
  // Benzyl alcohol
  {
    "impurity": "benzyl alcohol",
    "atomLabel": "CH",
    "multiplicity": "m",
    "type": "H",
    "shifts": {
      "CDCl3": "7.38-7.28",
      "acetone-d6": "7.37-7.29",
      "DMSO-d6": "7.36-7.28",
      "CD3CN": "7.37-7.30",
      "CD3OD": "7.36-7.30",
      "D2O": "7.47-7.37"
    }
  },
  {
    "impurity": "benzyl alcohol",
    "atomLabel": "CH2",
    "multiplicity": "d, 5.9",
    "type": "H",
    "shifts": {
      "CDCl3": "4.63 [4.62, s]",
      "acetone-d6": "4.63",
      "DMSO-d6": "4.49",
      "CD3CN": "4.57",
      "CD3OD": "4.59, s",
      "D2O": "4.65,s"
    }
  },
  {
    "impurity": "benzyl alcohol",
    "atomLabel": "OH",
    "multiplicity": "t, 5.9",
    "type": "H",
    "shifts": {
      "CDCl3": "1.64",
      "acetone-d6": "4.16",
      "DMSO-d6": "5.16",
      "CD3CN": "3.14",
      "CD3OD": "",
      "D2O": ""
    }
  },
  {
    "impurity": "benzyl alcohol",
    "atomLabel": "C (1)",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "140.98",
      "acetone-d6": "143.42 [143.39]",
      "DMSO-d6": "142.44",
      "CD3CN": "143.17",
      "CD3OD": "142.74",
      "D2O": "140.84"
    }
  },
  {
    "impurity": "benzyl alcohol",
    "atomLabel": "CH (3,5)",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "128.54",
      "acetone-d6": "128.92",
      "DMSO-d6": "127.92",
      "CD3CN": "129.26",
      "CD3OD": "129.37",
      "D2O": "129.34"
    }
  },
  {
    "impurity": "benzyl alcohol",
    "atomLabel": "CH (4)",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "127.61",
      "acetone-d6": "127.55",
      "DMSO-d6": "126.50",
      "CD3CN": "127.97",
      "CD3OD": "128.28",
      "D2O": "128.43"
    }
  },
  {
    "impurity": "benzyl alcohol",
    "atomLabel": "CH (2,6)",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "126.98",
      "acetone-d6": "127.35",
      "DMSO-d6": "126.31",
      "CD3CN": "127.69",
      "CD3OD": "128.01",
      "D2O": "128.06"
    }
  },
  {
    "impurity": "benzyl alcohol",
    "atomLabel": "CH2",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "65.31",
      "acetone-d6": "64.68 [64.55]",
      "DMSO-d6": "62.82",
      "CD3CN": "64.79",
      "CD3OD": "65.28",
      "D2O": "64.51"
    }
  },
  // n-butanol
  {
    "impurity": "n-butanol",
    "atomLabel": "CH2OH",
    "multiplicity": "td, 6.5, 5.3",
    "type": "H",
    "shifts": {
      "CDCl3": "3.65, t (6.7)",
      "acetone-d6": "3.53 [3.52, t]",
      "DMSO-d6": "3.38",
      "CD3CN": "3.48",
      "CD3OD": "3.54, t (6.5)",
      "D2O": "3.61, t (6.6)"
    }
  },
  {
    "impurity": "n-butanol",
    "atomLabel": "CH2CH2OH",
    "multiplicity": "m",
    "type": "H",
    "shifts": {
      "CDCl3": "1.60-1.52",
      "acetone-d6": "1.51-1.44",
      "DMSO-d6": "1.43-1.25",
      "CD3CN": "1.49-1.42",
      "CD3OD": "1.55-1.47",
      "D2O": "1.57-1.50"
    }
  },
  {
    "impurity": "n-butanol",
    "atomLabel": "CH2CH3",
    "multiplicity": "m",
    "type": "H",
    "shifts": {
      "CDCl3": "1.44-1.35",
      "acetone-d6": "1.41-1.32",
      "DMSO-d6": "1.43-1.25",
      "CD3CN": "1.39-1.29",
      "CD3OD": "1.43-1.33",
      "D2O": "1.40-1.30"
    }
  },
  {
    "impurity": "n-butanol",
    "atomLabel": "OH",
    "multiplicity": "t, 5.3",
    "type": "H",
    "shifts": {
      "CDCl3": "3.35",
      "acetone-d6": "1.20, br s",
      "DMSO-d6": "4.31",
      "CD3CN": "2.43",
      "CD3OD": "",
      "D2O": ""
    }
  },
  {
    "impurity": "n-butanol",
    "atomLabel": "CH3",
    "multiplicity": "t, 7.3",
    "type": "H",
    "shifts": {
      "CDCl3": "0.94",
      "acetone-d6": "0.90",
      "DMSO-d6": "0.86",
      "CD3CN": "0.91",
      "CD3OD": "0.93",
      "D2O": "0.91"
    }
  },
  {
    "impurity": "n-butanol",
    "atomLabel": "CH2OH",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "62.76",
      "acetone-d6": "62.15 [62.01]",
      "DMSO-d6": "60.31",
      "CD3CN": "62.35",
      "CD3OD": "62.71",
      "D2O": "62.17"
    }
  },
  {
    "impurity": "n-butanol",
    "atomLabel": "CH2CH2OH",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "34.91",
      "acetone-d6": "35.93 [35.88]",
      "DMSO-d6": "34.63",
      "CD3CN": "35.80",
      "CD3OD": "35.84",
      "D2O": "34.06"
    }
  },
  {
    "impurity": "n-butanol",
    "atomLabel": "CH2CH3",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "18.92",
      "acetone-d6": "19.72",
      "DMSO-d6": "18.56",
      "CD3CN": "19.80",
      "CD3OD": "20.04",
      "D2O": "18.97"
    }
  },
  {
    "impurity": "n-butanol",
    "atomLabel": "CH3",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "13.86",
      "acetone-d6": "14.20",
      "DMSO-d6": "13.75",
      "CD3CN": "14.24",
      "CD3OD": "14.24",
      "D2O": "13.66"
    }
  },
  // iso-butanol
  {
    "impurity": "iso-butanol",
    "atomLabel": "CH2OH",
    "multiplicity": "dd, 6.5, 5.5",
    "type": "H",
    "shifts": {
      "CDCl3": "3.41",
      "acetone-d6": "3.29",
      "DMSO-d6": "3.15",
      "CD3CN": "3.25",
      "CD3OD": "3.31-3.29,m",
      "D2O": "3.38, d (6.6)"
    }
  },
  {
    "impurity": "iso-butanol",
    "atomLabel": "CH",
    "multiplicity": "nonet, 6.6",
    "type": "H",
    "shifts": {
      "CDCl3": "1.77",
      "acetone-d6": "1.68",
      "DMSO-d6": "1.60",
      "CD3CN": "1.66",
      "CD3OD": "1.70",
      "D2O": "1.75"
    }
  },
  {
    "impurity": "iso-butanol",
    "atomLabel": "OH",
    "multiplicity": "t, 5.5",
    "type": "H",
    "shifts": {
      "CDCl3": "3.45",
      "acetone-d6": "1.30",
      "DMSO-d6": "4.40",
      "CD3CN": "2.50",
      "CD3OD": "",
      "D2O": ""
    }
  },
  {
    "impurity": "iso-butanol",
    "atomLabel": "CH3",
    "multiplicity": "d, 6.7",
    "type": "H",
    "shifts": {
      "CDCl3": "0.92",
      "acetone-d6": "0.87",
      "DMSO-d6": "0.82",
      "CD3CN": "0.86",
      "CD3OD": "0.90",
      "D2O": "0.89"
    }
  },
  {
    "impurity": "iso-butanol",
    "atomLabel": "CH2",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "69.80",
      "acetone-d6": "69.46 [69.33]",
      "DMSO-d6": "67.83",
      "CD3CN": "69.53",
      "CD3OD": "69.95",
      "D2O": "69.27"
    }
  },
  {
    "impurity": "iso-butanol",
    "atomLabel": "CH",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "30.87",
      "acetone-d6": "31.74 [31.71]",
      "DMSO-d6": "30.53",
      "CD3CN": "31.73",
      "CD3OD": "31.93",
      "D2O": "30.37"
    }
  },
  {
    "impurity": "iso-butanol",
    "atomLabel": "CH3",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "18.86",
      "acetone-d6": "19.36",
      "DMSO-d6": "19.09",
      "CD3CN": "19.32",
      "CD3OD": "19.38",
      "D2O": "18.83"
    }
  },
  // tert-butanol (from Babij et al.)
  {
    "impurity": "tert-butanol",
    "atomLabel": "CH3",
    "multiplicity": "S",
    "type": "H",
    "shifts": {
      "CDCl3": "1.27",
      "acetone-d6": "1.18 [1.18]",
      "DMSO-d6": "1.11",
      "CD3CN": "1.17",
      "CD3OD": "1.22",
      "D2O": "1.25"
    }
  },
  {
    "impurity": "tert-butanol",
    "atomLabel": "OH",
    "multiplicity": "S",
    "type": "H",
    "shifts": {
      "CDCl3": "3.22",
      "acetone-d6": "3.22",
      "DMSO-d6": "4.18",
      "CD3CN": "2.39",
      "CD3OD": "",
      "D2O": ""
    }
  },
  {
    "impurity": "tert-butanol",
    "atomLabel": "C",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "69.15",
      "acetone-d6": "68.16 [68.03]",
      "DMSO-d6": "66.88",
      "CD3CN": "68.74",
      "CD3OD": "69.40",
      "D2O": "70.36"
    }
  },
  {
    "impurity": "tert-butanol",
    "atomLabel": "CH3",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "31.25",
      "acetone-d6": "31.61 [31.57]",
      "DMSO-d6": "30.38",
      "CD3CN": "30.68",
      "CD3OD": "30.91",
      "D2O": "30.29"
    }
  },
  // n-butyl acetate
  {
    "impurity": "n-butyl acetate",
    "atomLabel": "OCH2",
    "multiplicity": "t, 6.7",
    "type": "H",
    "shifts": {
      "CDCl3": "4.07",
      "acetone-d6": "4.02",
      "DMSO-d6": "3.99",
      "CD3CN": "4.02",
      "CD3OD": "4.05",
      "D2O": "4.12"
    }
  },
  {
    "impurity": "n-butyl acetate",
    "atomLabel": "CH3CO",
    "multiplicity": "S",
    "type": "H",
    "shifts": {
      "CDCl3": "2.05",
      "acetone-d6": "1.97",
      "DMSO-d6": "1.99",
      "CD3CN": "1.97",
      "CD3OD": "2.01",
      "D2O": "2.09"
    }
  },
  {
    "impurity": "n-butyl acetate",
    "atomLabel": "OCH2CH2",
    "multiplicity": "m",
    "type": "H",
    "shifts": {
      "CDCl3": "1.62-1.55",
      "acetone-d6": "1.64-1.57",
      "DMSO-d6": "1.57-1.50",
      "CD3CN": "1.61-1.54",
      "CD3OD": "1.64-1.57",
      "D2O": "1.67-1.60"
    }
  },
  {
    "impurity": "n-butyl acetate",
    "atomLabel": "CH2CH3",
    "multiplicity": "m",
    "type": "H",
    "shifts": {
      "CDCl3": "1.43-1.34",
      "acetone-d6": "1.42-1.33",
      "DMSO-d6": "1.37-1.27",
      "CD3CN": "1.41-1.32",
      "CD3OD": "1.44-1.34",
      "D2O": "1.42-1.33"
    }
  },
  {
    "impurity": "n-butyl acetate",
    "atomLabel": "CH3",
    "multiplicity": "t, 7.4",
    "type": "H",
    "shifts": {
      "CDCl3": "0.94",
      "acetone-d6": "0.92",
      "DMSO-d6": "0.89",
      "CD3CN": "0.92",
      "CD3OD": "0.94",
      "D2O": "0.91"
    }
  },
  {
    "impurity": "n-butyl acetate",
    "atomLabel": "CO",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "171.20",
      "acetone-d6": "170.94",
      "DMSO-d6": "170.27",
      "CD3CN": "171.73",
      "CD3OD": "173.04",
      "D2O": "175.46"
    }
  },
  {
    "impurity": "n-butyl acetate",
    "atomLabel": "OCH2",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "64.36",
      "acetone-d6": "64.44",
      "DMSO-d6": "63.40",
      "CD3CN": "64.84",
      "CD3OD": "65.44",
      "D2O": "66.12"
    }
  },
  {
    "impurity": "n-butyl acetate",
    "atomLabel": "OCH2CH2",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "30.70",
      "acetone-d6": "31.50",
      "DMSO-d6": "30.12",
      "CD3CN": "31.52",
      "CD3OD": "31.84",
      "D2O": "30.46"
    }
  },
  {
    "impurity": "n-butyl acetate",
    "atomLabel": "CH3CO",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "20.99",
      "acetone-d6": "20.76",
      "DMSO-d6": "20.60",
      "CD3CN": "21.12",
      "CD3OD": "20.83",
      "D2O": "21.06"
    }
  },
  {
    "impurity": "n-butyl acetate",
    "atomLabel": "CH2CH3",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "19.16",
      "acetone-d6": "19.77",
      "DMSO-d6": "18.54",
      "CD3CN": "19.87",
      "CD3OD": "20.18",
      "D2O": "19.07"
    }
  },
  {
    "impurity": "n-butyl acetate",
    "atomLabel": "CH2CH3",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "13.71",
      "acetone-d6": "13.94",
      "DMSO-d6": "13.44",
      "CD3CN": "14.02",
      "CD3OD": "14.03",
      "D2O": "13.51"
    }
  },
  // iso-butyl acetate
  {
    "impurity": "iso-butyl acetate",
    "atomLabel": "CH2",
    "multiplicity": "d, 6.7",
    "type": "H",
    "shifts": {
      "CDCl3": "3.85",
      "acetone-d6": "3.81",
      "DMSO-d6": "3.79",
      "CD3CN": "3.81",
      "CD3OD": "3.84",
      "D2O": "3.91"
    }
  },
  {
    "impurity": "iso-butyl acetate",
    "atomLabel": "CH3CO",
    "multiplicity": "S",
    "type": "H",
    "shifts": {
      "CDCl3": "2.06",
      "acetone-d6": "1.99",
      "DMSO-d6": "2.01",
      "CD3CN": "1.99",
      "CD3OD": "2.03",
      "D2O": "2.11"
    }
  },
  {
    "impurity": "iso-butyl acetate",
    "atomLabel": "CH",
    "multiplicity": "nonet, 6.7",
    "type": "H",
    "shifts": {
      "CDCl3": "1.92",
      "acetone-d6": "1.89",
      "DMSO-d6": "1.87",
      "CD3CN": "1.90",
      "CD3OD": "1.92",
      "D2O": "1.94"
    }
  },
  {
    "impurity": "iso-butyl acetate",
    "atomLabel": "(CH3)2",
    "multiplicity": "d, 6.7",
    "type": "H",
    "shifts": {
      "CDCl3": "0.93",
      "acetone-d6": "0.91",
      "DMSO-d6": "0.88",
      "CD3CN": "0.91",
      "CD3OD": "0.93",
      "D2O": "0.93"
    }
  },
  {
    "impurity": "iso-butyl acetate",
    "atomLabel": "CO",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "171.19",
      "acetone-d6": "170.89",
      "DMSO-d6": "170.28",
      "CD3CN": "171.71",
      "CD3OD": "173.00",
      "D2O": "175.52"
    }
  },
  {
    "impurity": "iso-butyl acetate",
    "atomLabel": "CH2",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "70.63",
      "acetone-d6": "70.71",
      "DMSO-d6": "69.61",
      "CD3CN": "71.02",
      "CD3OD": "71.73",
      "D2O": "72.22"
    }
  },
  {
    "impurity": "iso-butyl acetate",
    "atomLabel": "CH",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "27.71",
      "acetone-d6": "28.49",
      "DMSO-d6": "27.16",
      "CD3CN": "28.61",
      "CD3OD": "28.95",
      "D2O": "27.70"
    }
  },
  {
    "impurity": "iso-butyl acetate",
    "atomLabel": "CH3CO",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "20.93",
      "acetone-d6": "20.69",
      "DMSO-d6": "20.57",
      "CD3CN": "21.05",
      "CD3OD": "20.76",
      "D2O": "20.99"
    }
  },
  {
    "impurity": "iso-butyl acetate",
    "atomLabel": "(CH3)2",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "19.08",
      "acetone-d6": "19.26",
      "DMSO-d6": "18.79",
      "CD3CN": "19.29",
      "CD3OD": "19.36",
      "D2O": "18.77"
    }
  },
  // Chlorobenzene
  {
    "impurity": "chlorobenzene",
    "atomLabel": "CH",
    "multiplicity": "m",
    "type": "H",
    "shifts": {
      "CDCl3": "7.36-7.22",
      "acetone-d6": "7.42-7.31",
      "DMSO-d6": "7.45-7.32",
      "CD3CN": "7.41-7.29",
      "CD3OD": "7.37-7.25",
      "D2O": "7.46-7.33"
    }
  },
  {
    "impurity": "chlorobenzene",
    "atomLabel": "C (1)",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "134.29",
      "acetone-d6": "134.63",
      "DMSO-d6": "133.00",
      "CD3CN": "134.74",
      "CD3OD": "135.31",
      "D2O": ""
    }
  },
  {
    "impurity": "chlorobenzene",
    "atomLabel": "CH (3,5)",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "129.71",
      "acetone-d6": "130.94",
      "DMSO-d6": "130.20",
      "CD3CN": "131.10",
      "CD3OD": "131.00",
      "D2O": ""
    }
  },
  {
    "impurity": "chlorobenzene",
    "atomLabel": "CH (2,6)",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "128.62",
      "acetone-d6": "129.30",
      "DMSO-d6": "128.30",
      "CD3CN": "129.45",
      "CD3OD": "129.56",
      "D2O": ""
    }
  },
  {
    "impurity": "chlorobenzene",
    "atomLabel": "CH (4)",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "126.43",
      "acetone-d6": "127.65",
      "DMSO-d6": "126.92",
      "CD3CN": "127.83",
      "CD3OD": "127.73",
      "D2O": ""
    }
  },
  // Cyclohexane
  {
    "impurity": "cyclohexane",
    "atomLabel": "CH2",
    "multiplicity": "S",
    "type": "H",
    "shifts": {
      "CDCl3": "1.43",
      "acetone-d6": "1.43",
      "DMSO-d6": "1.40",
      "CD3CN": "1.44",
      "CD3OD": "1.45",
      "D2O": ""
    }
  },
  {
    "impurity": "cyclohexane",
    "atomLabel": "CH2",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "26.94",
      "acetone-d6": "27.51",
      "DMSO-d6": "26.33",
      "CD3CN": "27.63",
      "CD3OD": "27.96",
      "D2O": ""
    }
  },
  // Cyclohexanone (from Babij et al.)
  {
    "impurity": "cyclohexanone",
    "atomLabel": "CH2 (2,6)",
    "multiplicity": "t, 7",
    "type": "H",
    "shifts": {
      "CDCl3": "2.33",
      "acetone-d6": "2.27",
      "DMSO-d6": "2.25",
      "CD3CN": "2.27",
      "CD3OD": "2.34",
      "D2O": "2.40"
    }
  },
  {
    "impurity": "cyclohexanone",
    "atomLabel": "CH2 (3,5)",
    "multiplicity": "m",
    "type": "H",
    "shifts": {
      "CDCl3": "1.86-1.84",
      "acetone-d6": "1.79-1.83",
      "DMSO-d6": "1.74-1.78",
      "CD3CN": "1.79-1.84",
      "CD3OD": "1.85-1.87",
      "D2O": "1.85-1.90"
    }
  },
  {
    "impurity": "cyclohexanone",
    "atomLabel": "CH2 (4)",
    "multiplicity": "m",
    "type": "H",
    "shifts": {
      "CDCl3": "1.74-1.70",
      "acetone-d6": "1.70-1.74",
      "DMSO-d6": "1.64-1.66",
      "CD3CN": "1.67-1.72",
      "CD3OD": "1.74-1.76",
      "D2O": "1.70-1.75"
    }
  },
  {
    "impurity": "cyclohexanone",
    "atomLabel": "CO",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "212.57",
      "acetone-d6": "210.36",
      "DMSO-d6": "210.63",
      "CD3CN": "211.99",
      "CD3OD": "214.69",
      "D2O": "221.22"
    }
  },
  {
    "impurity": "cyclohexanone",
    "atomLabel": "CH2 (2,6)",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "41.97",
      "acetone-d6": "42.24",
      "DMSO-d6": "41.32",
      "CD3CN": "42.44",
      "CD3OD": "42.61",
      "D2O": "42.02"
    }
  },
  {
    "impurity": "cyclohexanone",
    "atomLabel": "CH2 (3,5)",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "27.00",
      "acetone-d6": "27.68",
      "DMSO-d6": "26.46",
      "CD3CN": "27.80",
      "CD3OD": "28.16",
      "D2O": "27.50"
    }
  },
  {
    "impurity": "cyclohexanone",
    "atomLabel": "CH2 (4)",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "24.97",
      "acetone-d6": "25.59",
      "DMSO-d6": "24.32",
      "CD3CN": "25.62",
      "CD3OD": "25.86",
      "D2O": "24.77"
    }
  },
  // Cyclopentyl methyl ether (CPME)
  {
    "impurity": "cyclopentyl methyl ether",
    "atomLabel": "CH",
    "multiplicity": "m",
    "type": "H",
    "shifts": {
      "CDCl3": "3.82-3.78",
      "acetone-d6": "3.77-3.73",
      "DMSO-d6": "3.76-3,71",
      "CD3CN": "3.78-3.74",
      "CD3OD": "3.85-3.80",
      "D2O": "3.99-3.94"
    }
  },
  {
    "impurity": "cyclopentyl methyl ether",
    "atomLabel": "OCH3",
    "multiplicity": "S",
    "type": "H",
    "shifts": {
      "CDCl3": "3.28",
      "acetone-d6": "3.19",
      "DMSO-d6": "3.15",
      "CD3CN": "3.19",
      "CD3OD": "3.26",
      "D2O": "3.30"
    }
  },
  {
    "impurity": "cyclopentyl methyl ether",
    "atomLabel": "CH2",
    "multiplicity": "m",
    "type": "H",
    "shifts": {
      "CDCl3": "1.74-1.50",
      "acetone-d6": "1.72-1.44",
      "DMSO-d6": "1.67-1.42",
      "CD3CN": "1.70-1.48",
      "CD3OD": "1.77-1.50",
      "D2O": "1.86-1.51"
    }
  },
  {
    "impurity": "cyclopentyl methyl ether",
    "atomLabel": "CH",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "83.03",
      "acetone-d6": "83.35",
      "DMSO-d6": "81.92",
      "CD3CN": "83.62",
      "CD3OD": "84.47",
      "D2O": "84.4"
    }
  },
  {
    "impurity": "cyclopentyl methyl ether",
    "atomLabel": "CH3",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "56.30",
      "acetone-d6": "56.18",
      "DMSO-d6": "55.47",
      "CD3CN": "56.38",
      "CD3OD": "56.55",
      "D2O": "56.04"
    }
  },
  {
    "impurity": "cyclopentyl methyl ether",
    "atomLabel": "CH2 (2,5)",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "31.97",
      "acetone-d6": "32.51",
      "DMSO-d6": "31.35",
      "CD3CN": "32.63",
      "CD3OD": "32.85",
      "D2O": "31.87"
    }
  },
  {
    "impurity": "cyclopentyl methyl ether",
    "atomLabel": "CH2 (3,4)",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "23.55",
      "acetone-d6": "24.14",
      "DMSO-d6": "23.05",
      "CD3CN": "24.28",
      "CD3OD": "24.45",
      "D2O": "23.61"
    }
  },
  // p-cymene (4-iso-propyltoluene)
  {
    "impurity": "p-cymene (4-iso-propyltoluene)",
    "atomLabel": "ArH",
    "multiplicity": "m",
    "type": "H",
    "shifts": {
      "CDCl3": "7.14-7.09",
      "acetone-d6": "7.13-7.07",
      "DMSO-d6": "7.12-7.07",
      "CD3CN": "7.14-7.09",
      "CD3OD": "7.09-7.04",
      "D2O": ""
    }
  },
  {
    "impurity": "p-cymene (4-iso-propyltoluene)",
    "atomLabel": "CH(CH3)2",
    "multiplicity": "sept, 6.9",
    "type": "H",
    "shifts": {
      "CDCl3": "2.87",
      "acetone-d6": "2.85",
      "DMSO-d6": "2.83",
      "CD3CN": "2.86",
      "CD3OD": "2.83",
      "D2O": ""
    }
  },
  {
    "impurity": "p-cymene (4-iso-propyltoluene)",
    "atomLabel": "Ar-CH3",
    "multiplicity": "S",
    "type": "H",
    "shifts": {
      "CDCl3": "2.32",
      "acetone-d6": "2.27",
      "DMSO-d6": "2.25",
      "CD3CN": "2.28",
      "CD3OD": "2.27",
      "D2O": ""
    }
  },
  {
    "impurity": "p-cymene (4-iso-propyltoluene)",
    "atomLabel": "(CH3)2",
    "multiplicity": "d, 6.9",
    "type": "H",
    "shifts": {
      "CDCl3": "1.24",
      "acetone-d6": "1.20",
      "DMSO-d6": "1.17",
      "CD3CN": "1.20",
      "CD3OD": "1.21",
      "D2O": ""
    }
  },
  {
    "impurity": "p-cymene (4-iso-propyltoluene)",
    "atomLabel": "C (4)",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "145.89",
      "acetone-d6": "146.54",
      "DMSO-d6": "145.22",
      "CD3CN": "146.91",
      "CD3OD": "146.99",
      "D2O": ""
    }
  },
  {
    "impurity": "p-cymene (4-iso-propyltoluene)",
    "atomLabel": "C (1)",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "135.14",
      "acetone-d6": "135.70",
      "DMSO-d6": "134.46",
      "CD3CN": "136.16",
      "CD3OD": "136.15",
      "D2O": ""
    }
  },
  {
    "impurity": "p-cymene (4-iso-propyltoluene)",
    "atomLabel": "CH (2,6)",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "128.98",
      "acetone-d6": "129.71",
      "DMSO-d6": "128.72",
      "CD3CN": "129.91",
      "CD3OD": "129.90",
      "D2O": ""
    }
  },
  {
    "impurity": "p-cymene (4-iso-propyltoluene)",
    "atomLabel": "CH (3,5)",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "126.28",
      "acetone-d6": "126.99",
      "DMSO-d6": "125.98",
      "CD3CN": "127.23",
      "CD3OD": "127.19",
      "D2O": ""
    }
  },
  {
    "impurity": "p-cymene (4-iso-propyltoluene)",
    "atomLabel": "CH(CH3)2",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "33.70",
      "acetone-d6": "34.40",
      "DMSO-d6": "32.92",
      "CD3CN": "34.48",
      "CD3OD": "34.98",
      "D2O": ""
    }
  },
  {
    "impurity": "p-cymene (4-iso-propyltoluene)",
    "atomLabel": "(CH3)2",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "24.10",
      "acetone-d6": "24.40",
      "DMSO-d6": "23.89",
      "CD3CN": "24.41",
      "CD3OD": "24.55",
      "D2O": ""
    }
  },
  {
    "impurity": "p-cymene (4-iso-propyltoluene)",
    "atomLabel": "Ar-CH3",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "20.95",
      "acetone-d6": "20.94",
      "DMSO-d6": "20.48",
      "CD3CN": "21.00",
      "CD3OD": "21.03",
      "D2O": ""
    }
  },
  // Dichloromethane (from Babij et al.)
  {
    "impurity": "dichloromethane",
    "atomLabel": "CH2",
    "multiplicity": "S",
    "type": "H",
    "shifts": {
      "CDCl3": "5.30",
      "acetone-d6": "5.63",
      "DMSO-d6": "5.76",
      "CD3CN": "5.44",
      "CD3OD": "5.49",
      "D2O": ""
    }
  },
  {
    "impurity": "dichloromethane",
    "atomLabel": "CH2",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "53.52",
      "acetone-d6": "54.95",
      "DMSO-d6": "54.84",
      "CD3CN": "55.32",
      "CD3OD": "54.78",
      "D2O": ""
    }
  },
  // Dimethyl carbonate
  {
    "impurity": "dimethyl carbonate",
    "atomLabel": "CH3",
    "multiplicity": "S",
    "type": "H",
    "shifts": {
      "CDCl3": "3.79",
      "acetone-d6": "3.72",
      "DMSO-d6": "3.69",
      "CD3CN": "3.72",
      "CD3OD": "3.74",
      "D2O": "3.69"
    }
  },
  {
    "impurity": "dimethyl carbonate",
    "atomLabel": "CO",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "156.45",
      "acetone-d6": "157.04",
      "DMSO-d6": "155.76",
      "CD3CN": "157.26",
      "CD3OD": "157.91",
      "D2O": "163.96"
    }
  },
  {
    "impurity": "dimethyl carbonate",
    "atomLabel": "CH3",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "54.89",
      "acetone-d6": "54.95",
      "DMSO-d6": "54.63",
      "CD3CN": "55.39",
      "CD3OD": "55.25",
      "D2O": "55.81"
    }
  },
  // Dimethyl sulfoxide (from Babij et al.)
  {
    "impurity": "dimethyl sulfoxide",
    "atomLabel": "CH3",
    "multiplicity": "S",
    "type": "H",
    "shifts": {
      "CDCl3": "2.62",
      "acetone-d6": "2.52",
      "DMSO-d6": "2.54",
      "CD3CN": "2.50",
      "CD3OD": "2.65",
      "D2O": "2.71"
    }
  },
  {
    "impurity": "dimethyl sulfoxide",
    "atomLabel": "CH3",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "40.76",
      "acetone-d6": "41.23",
      "DMSO-d6": "40.45",
      "CD3CN": "41.31",
      "CD3OD": "40.45",
      "D2O": "39.39"
    }
  },
  // DMPU (1,3-Dimethyl-3,4,5,6-tetrahydro-2(1H)-pyrimidinone)
  {
    "impurity": "DMPU",
    "atomLabel": "NCH2",
    "multiplicity": "m",
    "type": "H",
    "shifts": {
      "CDCl3": "3.25-3.22",
      "acetone-d6": "3.25-3.22",
      "DMSO-d6": "3.20-3.17",
      "CD3CN": "3.22-3.19",
      "CD3OD": "3.30-3.27",
      "D2O": "3.30-3.27"
    }
  },
  {
    "impurity": "DMPU",
    "atomLabel": "NCH3",
    "multiplicity": "S",
    "type": "H",
    "shifts": {
      "CDCl3": "2.92",
      "acetone-d6": "2.92",
      "DMSO-d6": "2.75",
      "CD3CN": "2.81",
      "CD3OD": "2.88",
      "D2O": "2.86"
    }
  },
  {
    "impurity": "DMPU",
    "atomLabel": "CH2",
    "multiplicity": "m",
    "type": "H",
    "shifts": {
      "CDCl3": "1.97-1.92",
      "acetone-d6": "2.00-1.94",
      "DMSO-d6": "1.90-1.84",
      "CD3CN": "1.94-1.88",
      "CD3OD": "2.00-1.94",
      "D2O": "1.98-1.92"
    }
  },
  {
    "impurity": "DMPU",
    "atomLabel": "CO",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "156.85",
      "acetone-d6": "156.97",
      "DMSO-d6": "155.89",
      "CD3CN": "157.54",
      "CD3OD": "158.90",
      "D2O": "158.99"
    }
  },
  {
    "impurity": "DMPU",
    "atomLabel": "NCH2",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "47.93",
      "acetone-d6": "48.57",
      "DMSO-d6": "47.31",
      "CD3CN": "48.69",
      "CD3OD": "48.92",
      "D2O": "48.24"
    }
  },
  {
    "impurity": "DMPU",
    "atomLabel": "CH3",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "35.67",
      "acetone-d6": "35.60",
      "DMSO-d6": "35.11",
      "CD3CN": "35.81",
      "CD3OD": "35.96",
      "D2O": "35.91"
    }
  },
  {
    "impurity": "DMPU",
    "atomLabel": "CH2",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "22.24",
      "acetone-d6": "23.13",
      "DMSO-d6": "21.76",
      "CD3CN": "23.10",
      "CD3OD": "23.04",
      "D2O": "21.80"
    }
  },
  // Ethanol (from Babij et al.)
  {
    "impurity": "ethanol",
    "atomLabel": "CH3",
    "multiplicity": "t, 7.0",
    "type": "H",
    "shifts": {
      "CDCl3": "1.24",
      "acetone-d6": "1.12 [1.12]",
      "DMSO-d6": "1.06",
      "CD3CN": "1.11",
      "CD3OD": "1.17",
      "D2O": "1.19"
    }
  },
  {
    "impurity": "ethanol",
    "atomLabel": "CH2",
    "multiplicity": "qd, 7.0, 5.2",
    "type": "H",
    "shifts": {
      "CDCl3": "3.72, q (7.0)",
      "acetone-d6": "3.57 [3.57, q]",
      "DMSO-d6": "3.44",
      "CD3CN": "3.54",
      "CD3OD": "3.60, q (7.1)",
      "D2O": "3.66, q (7.1)"
    }
  },
  {
    "impurity": "ethanol",
    "atomLabel": "OH",
    "multiplicity": "t, 5.2",
    "type": "H",
    "shifts": {
      "CDCl3": "3.39",
      "acetone-d6": "1.42, br s",
      "DMSO-d6": "4.35",
      "CD3CN": "2.47",
      "CD3OD": "",
      "D2O": ""
    }
  },
  {
    "impurity": "ethanol",
    "atomLabel": "CH2",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "58.28",
      "acetone-d6": "57.76 [57.72]",
      "DMSO-d6": "56.07",
      "CD3CN": "57.96",
      "CD3OD": "58.26",
      "D2O": "58.05"
    }
  },
  {
    "impurity": "ethanol",
    "atomLabel": "CH3",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "18.41",
      "acetone-d6": "18.87 [18.82]",
      "DMSO-d6": "18.51",
      "CD3CN": "18.80",
      "CD3OD": "18.40",
      "D2O": "17.47"
    }
  },
  // Ethyl acetate (from Babij et al.)
  {
    "impurity": "ethyl acetate",
    "atomLabel": "CH3CO",
    "multiplicity": "S",
    "type": "H",
    "shifts": {
      "CDCl3": "2.05",
      "acetone-d6": "1.97",
      "DMSO-d6": "1.99",
      "CD3CN": "1.97",
      "CD3OD": "2.01",
      "D2O": "2.07"
    }
  },
  {
    "impurity": "ethyl acetate",
    "atomLabel": "CH2CH3",
    "multiplicity": "q, 7",
    "type": "H",
    "shifts": {
      "CDCl3": "4.12",
      "acetone-d6": "4.05",
      "DMSO-d6": "4.03",
      "CD3CN": "4.06",
      "CD3OD": "4.09",
      "D2O": "4.14"
    }
  },
  {
    "impurity": "ethyl acetate",
    "atomLabel": "CH2CH3",
    "multiplicity": "t, 7",
    "type": "H",
    "shifts": {
      "CDCl3": "1.26",
      "acetone-d6": "1.20",
      "DMSO-d6": "1.17",
      "CD3CN": "1.20",
      "CD3OD": "1.24",
      "D2O": "1.24"
    }
  },
  {
    "impurity": "ethyl acetate",
    "atomLabel": "CO",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "171.36",
      "acetone-d6": "170.96",
      "DMSO-d6": "170.31",
      "CD3CN": "171.68",
      "CD3OD": "172.89",
      "D2O": "175.26"
    }
  },
  {
    "impurity": "ethyl acetate",
    "atomLabel": "CH2",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "60.49",
      "acetone-d6": "60.56",
      "DMSO-d6": "59.74",
      "CD3CN": "60.98",
      "CD3OD": "61.50",
      "D2O": "62.32"
    }
  },
  {
    "impurity": "ethyl acetate",
    "atomLabel": "CH3CO",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "21.04",
      "acetone-d6": "20.83",
      "DMSO-d6": "20.68",
      "CD3CN": "21.16",
      "CD3OD": "20.88",
      "D2O": "21.15"
    }
  },
  {
    "impurity": "ethyl acetate",
    "atomLabel": "CH2CH3",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "14.19",
      "acetone-d6": "14.50",
      "DMSO-d6": "14.40",
      "CD3CN": "14.54",
      "CD3OD": "14.49",
      "D2O": "13.92"
    }
  },
  // L-ethyl lactate
  {
    "impurity": "L-ethyl lactate",
    "atomLabel": "CH",
    "multiplicity": "q, 6.9",
    "type": "H",
    "shifts": {
      "CDCl3": "4.30-4.22, m",
      "acetone-d6": "4.24-4.09, m",
      "DMSO-d6": "4.14-4.08, m",
      "CD3CN": "4.21-4.11, m",
      "CD3OD": "4.22",
      "D2O": "4.40"
    }
  },
  {
    "impurity": "L-ethyl lactate",
    "atomLabel": "CH2",
    "multiplicity": "q, 7.1",
    "type": "H",
    "shifts": {
      "CDCl3": "4.25",
      "acetone-d6": "4.24-4.09, m",
      "DMSO-d6": "4.08",
      "CD3CN": "4.21-4.11, m",
      "CD3OD": "4.18",
      "D2O": "4.23"
    }
  },
  {
    "impurity": "L-ethyl lactate",
    "atomLabel": "OH",
    "multiplicity": "d, 5.5",
    "type": "H",
    "shifts": {
      "CDCl3": "2.79",
      "acetone-d6": "2.79",
      "DMSO-d6": "5.35",
      "CD3CN": "3.33",
      "CD3OD": "",
      "D2O": ""
    }
  },
  {
    "impurity": "L-ethyl lactate",
    "atomLabel": "CH3CH",
    "multiplicity": "d, 6.9",
    "type": "H",
    "shifts": {
      "CDCl3": "1.42",
      "acetone-d6": "1.32",
      "DMSO-d6": "1.24",
      "CD3CN": "1.31",
      "CD3OD": "1.36",
      "D2O": "1.41"
    }
  },
  {
    "impurity": "L-ethyl lactate",
    "atomLabel": "CH3CH2",
    "multiplicity": "t, 7.1",
    "type": "H",
    "shifts": {
      "CDCl3": "1.23",
      "acetone-d6": "1.31",
      "DMSO-d6": "1.19",
      "CD3CN": "1.23",
      "CD3OD": "1.27",
      "D2O": "1.28"
    }
  },
  {
    "impurity": "L-ethyl lactate",
    "atomLabel": "CO",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "175.70",
      "acetone-d6": "175.57 [175.54]",
      "DMSO-d6": "174.49",
      "CD3CN": "175.96",
      "CD3OD": "176.41",
      "D2O": "177.14"
    }
  },
  {
    "impurity": "L-ethyl lactate",
    "atomLabel": "CH",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "66.78",
      "acetone-d6": "67.43 [67.32]",
      "DMSO-d6": "65.91",
      "CD3CN": "67.57",
      "CD3OD": "67.90",
      "D2O": "67.37"
    }
  },
  {
    "impurity": "L-ethyl lactate",
    "atomLabel": "CH2",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "61.63",
      "acetone-d6": "61.17",
      "DMSO-d6": "59.90",
      "CD3CN": "61.74",
      "CD3OD": "61.98",
      "D2O": "62.84"
    }
  },
  {
    "impurity": "L-ethyl lactate",
    "atomLabel": "CH3CH",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "20.41",
      "acetone-d6": "20.78 [20.72]",
      "DMSO-d6": "20.30",
      "CD3CN": "20.77",
      "CD3OD": "20.59",
      "D2O": "19.80"
    }
  },
  {
    "impurity": "L-ethyl lactate",
    "atomLabel": "CH3CH2",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "14.18",
      "acetone-d6": "14.48",
      "DMSO-d6": "14.04",
      "CD3CN": "14.52",
      "CD3OD": "14.52",
      "D2O": "13.91"
    }
  },
  // Ethylene glycol
  {
    "impurity": "ethylene glycol",
    "atomLabel": "CH2",
    "multiplicity": "S",
    "type": "H",
    "shifts": {
      "CDCl3": "3.76",
      "acetone-d6": "3.58-3.54, m",
      "DMSO-d6": "3.40-3.38, m",
      "CD3CN": "3.52-3.50, m",
      "CD3OD": "3.59",
      "D2O": "3,67"
    }
  },
  {
    "impurity": "ethylene glycol",
    "atomLabel": "OH",
    "multiplicity": "",
    "type": "H",
    "shifts": {
      "CDCl3": "2.28, br s",
      "acetone-d6": "2.28, br s",
      "DMSO-d6": "4.46-4.43",
      "CD3CN": "2.72-2.69",
      "CD3OD": "",
      "D2O": ""
    }
  },
  {
    "impurity": "ethylene glycol",
    "atomLabel": "CH2",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "63.79",
      "acetone-d6": "64.28 [64.15]",
      "DMSO-d6": "62.76",
      "CD3CN": "64.22",
      "CD3OD": "64.30",
      "D2O": "63.17"
    }
  },
  // Ethyl tert-butyl ether (ETBE)
  {
    "impurity": "ethyl tert-butyl ether",
    "atomLabel": "CH2",
    "multiplicity": "q, 7.0",
    "type": "H",
    "shifts": {
      "CDCl3": "3.41",
      "acetone-d6": "3.37",
      "DMSO-d6": "3.33",
      "CD3CN": "3.38",
      "CD3OD": "3.45",
      "D2O": "3.54"
    }
  },
  {
    "impurity": "ethyl tert-butyl ether",
    "atomLabel": "(CH3)3",
    "multiplicity": "S",
    "type": "H",
    "shifts": {
      "CDCl3": "1.14",
      "acetone-d6": "1.20",
      "DMSO-d6": "1.12",
      "CD3CN": "1.14",
      "CD3OD": "1.19",
      "D2O": "1.23"
    }
  },
  {
    "impurity": "ethyl tert-butyl ether",
    "atomLabel": "CH3",
    "multiplicity": "t, 7.0",
    "type": "H",
    "shifts": {
      "CDCl3": "1.17",
      "acetone-d6": "1.06",
      "DMSO-d6": "1.04",
      "CD3CN": "1.07",
      "CD3OD": "1.13",
      "D2O": "1.15"
    }
  },
  {
    "impurity": "ethyl tert-butyl ether",
    "atomLabel": "C",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "72.56",
      "acetone-d6": "72.57",
      "DMSO-d6": "71.88",
      "CD3CN": "72.95",
      "CD3OD": "74.13",
      "D2O": "75.28"
    }
  },
  {
    "impurity": "ethyl tert-butyl ether",
    "atomLabel": "CH2",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "56.79",
      "acetone-d6": "57.06",
      "DMSO-d6": "56.03",
      "CD3CN": "57.32",
      "CD3OD": "57.95",
      "D2O": "57.88"
    }
  },
  {
    "impurity": "ethyl tert-butyl ether",
    "atomLabel": "(CH3)3",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "27.64",
      "acetone-d6": "27.86",
      "DMSO-d6": "27.39",
      "CD3CN": "27.89",
      "CD3OD": "27.86",
      "D2O": "27.16"
    }
  },
  {
    "impurity": "ethyl tert-butyl ether",
    "atomLabel": "CH3",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "16.35",
      "acetone-d6": "16.66",
      "DMSO-d6": "16.17",
      "CD3CN": "16.72",
      "CD3OD": "16.47",
      "D2O": "15.66"
    }
  },
  // Formic acid
  {
    "impurity": "formic acid",
    "atomLabel": "HCO",
    "multiplicity": "S",
    "type": "H",
    "shifts": {
      "CDCl3": "8.03",
      "acetone-d6": "8.11",
      "DMSO-d6": "8.14",
      "CD3CN": "8.03",
      "CD3OD": "8.07",
      "D2O": "8.26"
    }
  },
  {
    "impurity": "formic acid",
    "atomLabel": "CO",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "165.40",
      "acetone-d6": "162.29",
      "DMSO-d6": "162.86",
      "CD3CN": "162.57",
      "CD3OD": "164.41",
      "D2O": "166.31"
    }
  },
  // Glycol diacetate
  {
    "impurity": "glycol diacetate",
    "atomLabel": "CH2",
    "multiplicity": "S",
    "type": "H",
    "shifts": {
      "CDCl3": "4.27",
      "acetone-d6": "4.24",
      "DMSO-d6": "4.19",
      "CD3CN": "4.21",
      "CD3OD": "4.25",
      "D2O": "4.34"
    }
  },
  {
    "impurity": "glycol diacetate",
    "atomLabel": "CH3",
    "multiplicity": "S",
    "type": "H",
    "shifts": {
      "CDCl3": "2.09",
      "acetone-d6": "2.01",
      "DMSO-d6": "2.02",
      "CD3CN": "2.01",
      "CD3OD": "2.04",
      "D2O": "2.12"
    }
  },
  {
    "impurity": "glycol diacetate",
    "atomLabel": "CO",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "170.76",
      "acetone-d6": "170.84",
      "DMSO-d6": "170.15",
      "CD3CN": "171.52",
      "CD3OD": "172.55",
      "D2O": "174.71"
    }
  },
  {
    "impurity": "glycol diacetate",
    "atomLabel": "CH2",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "62.21",
      "acetone-d6": "62.81",
      "DMSO-d6": "61.85",
      "CD3CN": "63.04",
      "CD3OD": "63.48",
      "D2O": "63.42"
    }
  },
  {
    "impurity": "glycol diacetate",
    "atomLabel": "CH3",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "20.80",
      "acetone-d6": "20.63",
      "DMSO-d6": "20.51",
      "CD3CN": "20.98",
      "CD3OD": "20.65",
      "D2O": "20.84"
    }
  },
  // n-heptane
  {
    "impurity": "n-heptane",
    "atomLabel": "CH2",
    "multiplicity": "m",
    "type": "H",
    "shifts": {
      "CDCl3": "1.32-1.24",
      "acetone-d6": "1.33-1.25",
      "DMSO-d6": "1.30-1.22",
      "CD3CN": "1.33-1.25",
      "CD3OD": "1.34-1.24",
      "D2O": "1.33-1.23"
    }
  },
  {
    "impurity": "n-heptane",
    "atomLabel": "CH3",
    "multiplicity": "t, 6.8",
    "type": "H",
    "shifts": {
      "CDCl3": "0.88",
      "acetone-d6": "0.88",
      "DMSO-d6": "0.86",
      "CD3CN": "0.89",
      "CD3OD": "0.90",
      "D2O": "0.87"
    }
  },
  {
    "impurity": "n-heptane",
    "atomLabel": "CH2(3,5)",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "31.91",
      "acetone-d6": "32.61",
      "DMSO-d6": "31.17",
      "CD3CN": "32.67",
      "CD3OD": "33.06",
      "D2O": ""
    }
  },
  {
    "impurity": "n-heptane",
    "atomLabel": "CH2(4)",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "29.04",
      "acetone-d6": "29.74",
      "DMSO-d6": "28.27",
      "CD3CN": "29.80",
      "CD3OD": "30.17",
      "D2O": ""
    }
  },
  {
    "impurity": "n-heptane",
    "atomLabel": "CH2 (2,6)",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "22.71",
      "acetone-d6": "23.33",
      "DMSO-d6": "22.00",
      "CD3CN": "23.45",
      "CD3OD": "23.75",
      "D2O": ""
    }
  },
  {
    "impurity": "n-heptane",
    "atomLabel": "CH3",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "14.11",
      "acetone-d6": "14.33",
      "DMSO-d6": "13.84",
      "CD3CN": "14.41",
      "CD3OD": "14.44",
      "D2O": ""
    }
  },
  // iso-propanol (from Babij et al.)
  {
    "impurity": "iso-propanol",
    "atomLabel": "CH",
    "multiplicity": "sept, 6.1",
    "type": "H",
    "shifts": {
      "CDCl3": "4.03, sept (6.1)",
      "acetone-d6": "3.95-3.84, m",
      "DMSO-d6": "3.77",
      "CD3CN": "3.86",
      "CD3OD": "3.92, sept (6.1)",
      "D2O": "4.02, sept (6.2)"
    }
  },
  {
    "impurity": "iso-propanol",
    "atomLabel": "CH3",
    "multiplicity": "d, 6.1",
    "type": "H",
    "shifts": {
      "CDCl3": "1.21",
      "acetone-d6": "1.10 [1.10",
      "DMSO-d6": "1.04",
      "CD3CN": "1.09",
      "CD3OD": "1.15",
      "D2O": "1.18"
    }
  },
  {
    "impurity": "iso-propanol",
    "atomLabel": "OH",
    "multiplicity": "d, 4.3",
    "type": "H",
    "shifts": {
      "CDCl3": "3.39",
      "acetone-d6": "3.39",
      "DMSO-d6": "4.34",
      "CD3CN": "2.51",
      "CD3OD": "",
      "D2O": ""
    }
  },
  {
    "impurity": "iso-propanol",
    "atomLabel": "CH",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "64.50",
      "acetone-d6": "63.74 [63.60]",
      "DMSO-d6": "64.92",
      "CD3CN": "64.30",
      "CD3OD": "64.71",
      "D2O": "64.88"
    }
  },
  {
    "impurity": "iso-propanol",
    "atomLabel": "CH3",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "25.14",
      "acetone-d6": "25.77 [25.72]",
      "DMSO-d6": "25.43",
      "CD3CN": "25.55",
      "CD3OD": "25.27",
      "D2O": "24.38"
    }
  },
  // iso-propyl acetate
  {
    "impurity": "iso-propyl acetate",
    "atomLabel": "CH",
    "multiplicity": "sept, 6.3",
    "type": "H",
    "shifts": {
      "CDCl3": "4.99",
      "acetone-d6": "4.91",
      "DMSO-d6": "4.86",
      "CD3CN": "4.91",
      "CD3OD": "4.95",
      "D2O": "4.98"
    }
  },
  {
    "impurity": "iso-propyl acetate",
    "atomLabel": "CH3CO",
    "multiplicity": "S",
    "type": "H",
    "shifts": {
      "CDCl3": "2.02",
      "acetone-d6": "1.94",
      "DMSO-d6": "1.96",
      "CD3CN": "1.94",
      "CD3OD": "1.99",
      "D2O": "2.07"
    }
  },
  {
    "impurity": "iso-propyl acetate",
    "atomLabel": "(CH3)2",
    "multiplicity": "d, 6.3",
    "type": "H",
    "shifts": {
      "CDCl3": "1.23",
      "acetone-d6": "1.19",
      "DMSO-d6": "1.17",
      "CD3CN": "1.19",
      "CD3OD": "1.22",
      "D2O": "1.25"
    }
  },
  {
    "impurity": "iso-propyl acetate",
    "atomLabel": "CO",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "170.63",
      "acetone-d6": "170.38",
      "DMSO-d6": "169.72",
      "CD3CN": "171.16",
      "CD3OD": "172.52",
      "D2O": "174.77"
    }
  },
  {
    "impurity": "iso-propyl acetate",
    "atomLabel": "CH",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "67.64",
      "acetone-d6": "67.74",
      "DMSO-d6": "66.89",
      "CD3CN": "68.23",
      "CD3OD": "69.08",
      "D2O": "70.28"
    }
  },
  {
    "impurity": "iso-propyl acetate",
    "atomLabel": "(CH3)2",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "21.84",
      "acetone-d6": "22.00",
      "DMSO-d6": "21.53",
      "CD3CN": "22.06",
      "CD3OD": "22.03",
      "D2O": "21.44"
    }
  },
  {
    "impurity": "iso-propyl acetate",
    "atomLabel": "CH3CO",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "21.42",
      "acetone-d6": "21.19",
      "DMSO-d6": "21.00",
      "CD3CN": "21.55",
      "CD3OD": "21.28",
      "D2O": "21.53"
    }
  },
  // Methanol (from Babij et al.)
  {
    "impurity": "methanol",
    "atomLabel": "CH3",
    "multiplicity": "S",
    "type": "H",
    "shifts": {
      "CDCl3": "3.49",
      "acetone-d6": "3.31 [3.30]",
      "DMSO-d6": "3.17",
      "CD3CN": "3.28",
      "CD3OD": "3.34, s",
      "D2O": "3.36, s"
    }
  },
  {
    "impurity": "methanol",
    "atomLabel": "OH",
    "multiplicity": "q, 5.3",
    "type": "H",
    "shifts": {
      "CDCl3": "3.12",
      "acetone-d6": "1.05, br s",
      "DMSO-d6": "4.10",
      "CD3CN": "2.17",
      "CD3OD": "",
      "D2O": ""
    }
  },
  {
    "impurity": "methanol",
    "atomLabel": "CH3",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "50.41",
      "acetone-d6": "49.81 [49.66]",
      "DMSO-d6": "48.59",
      "CD3CN": "49.90",
      "CD3OD": "49.86",
      "D2O": "49.50"
    }
  },
  // Methyl acetate
  {
    "impurity": "methyl acetate",
    "atomLabel": "OCH3",
    "multiplicity": "S",
    "type": "H",
    "shifts": {
      "CDCl3": "3.67",
      "acetone-d6": "3.59",
      "DMSO-d6": "3.57",
      "CD3CN": "3.60",
      "CD3OD": "3.64",
      "D2O": "3.69"
    }
  },
  {
    "impurity": "methyl acetate",
    "atomLabel": "CH3CO",
    "multiplicity": "S",
    "type": "H",
    "shifts": {
      "CDCl3": "2.06",
      "acetone-d6": "1.98",
      "DMSO-d6": "2.00",
      "CD3CN": "1.99",
      "CD3OD": "2.02",
      "D2O": "2.09"
    }
  },
  {
    "impurity": "methyl acetate",
    "atomLabel": "CO",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "171.48",
      "acetone-d6": "171.29",
      "DMSO-d6": "170.73",
      "CD3CN": "172.08",
      "CD3OD": "173.21",
      "D2O": "175.64"
    }
  },
  {
    "impurity": "methyl acetate",
    "atomLabel": "OCH3",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "51.58",
      "acetone-d6": "51.51",
      "DMSO-d6": "51.17",
      "CD3CN": "51.97",
      "CD3OD": "52.04",
      "D2O": "52.77"
    }
  },
  {
    "impurity": "methyl acetate",
    "atomLabel": "CH3CO",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "20.67",
      "acetone-d6": "20.45",
      "DMSO-d6": "20.40",
      "CD3CN": "20.81",
      "CD3OD": "20.50",
      "D2O": "20.73"
    }
  },
  // Methyl cyclohexane
  {
    "impurity": "methyl cyclohexane",
    "atomLabel": "CH",
    "multiplicity": "m",
    "type": "H",
    "shifts": {
      "CDCl3": "1.70-1.60",
      "acetone-d6": "1.70-1.59",
      "DMSO-d6": "1.67-1.57",
      "CD3CN": "1.71-1.59",
      "CD3OD": "1.72-1.61",
      "D2O": ""
    }
  },
  {
    "impurity": "methyl cyclohexane",
    "atomLabel": "CH2, CH",
    "multiplicity": "m",
    "type": "H",
    "shifts": {
      "CDCl3": "1.39-1.07",
      "acetone-d6": "1.39-1.06",
      "DMSO-d6": "1.38-1.03",
      "CD3CN": "1.40-1.08",
      "CD3OD": "1.40-1.09",
      "D2O": ""
    }
  },
  {
    "impurity": "methyl cyclohexane",
    "atomLabel": "CH3",
    "multiplicity": "d, 6.6",
    "type": "H",
    "shifts": {
      "CDCl3": "0.86",
      "acetone-d6": "0.86",
      "DMSO-d6": "0.84",
      "CD3CN": "0.86",
      "CD3OD": "0.87",
      "D2O": ""
    }
  },
  {
    "impurity": "methyl cyclohexane",
    "atomLabel": "CHCH",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "35.51",
      "acetone-d6": "36.12",
      "DMSO-d6": "34.96",
      "CD3CN": "36.19",
      "CD3OD": "36.58",
      "D2O": ""
    }
  },
  {
    "impurity": "methyl cyclohexane",
    "atomLabel": "CH",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "32.79",
      "acetone-d6": "33.47",
      "DMSO-d6": "32.20",
      "CD3CN": "33.56",
      "CD3OD": "33.99",
      "D2O": ""
    }
  },
  {
    "impurity": "methyl cyclohexane",
    "atomLabel": "CH",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "26.50",
      "acetone-d6": "27.09",
      "DMSO-d6": "25.91",
      "CD3CN": "27.21",
      "CD3OD": "27.52",
      "D2O": ""
    }
  },
  {
    "impurity": "methyl cyclohexane",
    "atomLabel": "CH2",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "26.40",
      "acetone-d6": "26.97",
      "DMSO-d6": "25.86",
      "CD3CN": "27.09",
      "CD3OD": "27.40",
      "D2O": ""
    }
  },
  {
    "impurity": "methyl cyclohexane",
    "atomLabel": "CH3",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "22.91",
      "acetone-d6": "23.16",
      "DMSO-d6": "22.71",
      "CD3CN": "23.22",
      "CD3OD": "23.30",
      "D2O": ""
    }
  },
  // Methyl ethyl ketone
  {
    "impurity": "methyl ethyl ketone",
    "atomLabel": "CH3CO",
    "multiplicity": "S",
    "type": "H",
    "shifts": {
      "CDCl3": "2.14",
      "acetone-d6": "2.07",
      "DMSO-d6": "2.07",
      "CD3CN": "2.06",
      "CD3OD": "2.12",
      "D2O": "2.19"
    }
  },
  {
    "impurity": "methyl ethyl ketone",
    "atomLabel": "CH2",
    "multiplicity": "q, 7",
    "type": "H",
    "shifts": {
      "CDCl3": "2.46",
      "acetone-d6": "2.45",
      "DMSO-d6": "2.43",
      "CD3CN": "2.43",
      "CD3OD": "2.50",
      "D2O": "3.18"
    }
  },
  {
    "impurity": "methyl ethyl ketone",
    "atomLabel": "CH2CH3",
    "multiplicity": "t, 7",
    "type": "H",
    "shifts": {
      "CDCl3": "1.06",
      "acetone-d6": "0.96",
      "DMSO-d6": "0.91",
      "CD3CN": "0.96",
      "CD3OD": "1.01",
      "D2O": "1.26"
    }
  },
  {
    "impurity": "methyl ethyl ketone",
    "atomLabel": "CO",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "209.56",
      "acetone-d6": "208.30",
      "DMSO-d6": "208.72",
      "CD3CN": "209.88",
      "CD3OD": "212.16",
      "D2O": "218.43"
    }
  },
  {
    "impurity": "methyl ethyl ketone",
    "atomLabel": "CH2",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "36.89",
      "acetone-d6": "36.75",
      "DMSO-d6": "35.83",
      "CD3CN": "37.09",
      "CD3OD": "37.34",
      "D2O": "37.27"
    }
  },
  {
    "impurity": "methyl ethyl ketone",
    "atomLabel": "CH3CO",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "29.49",
      "acetone-d6": "29.30",
      "DMSO-d6": "29.26",
      "CD3CN": "29.60",
      "CD3OD": "29.39",
      "D2O": "29.49"
    }
  },
  {
    "impurity": "methyl ethyl ketone",
    "atomLabel": "CH2CH3",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "7.86",
      "acetone-d6": "8.03",
      "DMSO-d6": "7.61",
      "CD3CN": "7.14",
      "CD3OD": "8.09",
      "D2O": "7.87"
    }
  },
  // Methyl iso-butyl ketone (MIBK)
  {
    "impurity": "methyl iso-butyl ketone",
    "atomLabel": "CH2",
    "multiplicity": "d, 7.0",
    "type": "H",
    "shifts": {
      "CDCl3": "2.31",
      "acetone-d6": "2.30",
      "DMSO-d6": "2.30",
      "CD3CN": "2.29",
      "CD3OD": "2.35",
      "D2O": "2.43"
    }
  },
  {
    "impurity": "methyl iso-butyl ketone",
    "atomLabel": "CH",
    "multiplicity": "nonet, 6.8",
    "type": "H",
    "shifts": {
      "CDCl3": "2.13",
      "acetone-d6": "2.12-2.02, m",
      "DMSO-d6": "1.99",
      "CD3CN": "2.08-2.02, m",
      "CD3OD": "2.09",
      "D2O": "2.08"
    }
  },
  {
    "impurity": "methyl iso-butyl ketone",
    "atomLabel": "CH3CO",
    "multiplicity": "S",
    "type": "H",
    "shifts": {
      "CDCl3": "2.12",
      "acetone-d6": "2.06",
      "DMSO-d6": "2.06",
      "CD3CN": "2.05",
      "CD3OD": "2.11",
      "D2O": "2.21"
    }
  },
  {
    "impurity": "methyl iso-butyl ketone",
    "atomLabel": "(CH3)2",
    "multiplicity": "d, 6.7",
    "type": "H",
    "shifts": {
      "CDCl3": "0.92",
      "acetone-d6": "0.88",
      "DMSO-d6": "0.85",
      "CD3CN": "0.88",
      "CD3OD": "0.91",
      "D2O": "0.90"
    }
  },
  {
    "impurity": "methyl iso-butyl ketone",
    "atomLabel": "CO",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "208.83",
      "acetone-d6": "207.75",
      "DMSO-d6": "208.02",
      "CD3CN": "209.34",
      "CD3OD": "211.70",
      "D2O": "218.10"
    }
  },
  {
    "impurity": "methyl iso-butyl ketone",
    "atomLabel": "CH2",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "52.82",
      "acetone-d6": "52.80",
      "DMSO-d6": "51.74",
      "CD3CN": "53.04",
      "CD3OD": "53.41",
      "D2O": "52.96"
    }
  },
  {
    "impurity": "methyl iso-butyl ketone",
    "atomLabel": "CH3CO",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "30.34",
      "acetone-d6": "30.15",
      "DMSO-d6": "29.98",
      "CD3CN": "30.43",
      "CD3OD": "30.27",
      "D2O": "30.24"
    }
  },
  {
    "impurity": "methyl iso-butyl ketone",
    "atomLabel": "CH",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "24.66",
      "acetone-d6": "25.05",
      "DMSO-d6": "23.83",
      "CD3CN": "25.28",
      "CD3OD": "25.70",
      "D2O": "25.13"
    }
  },
  {
    "impurity": "methyl iso-butyl ketone",
    "atomLabel": "(CH3)2",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "22.55",
      "acetone-d6": "22.73",
      "DMSO-d6": "22.23",
      "CD3CN": "22.75",
      "CD3OD": "22.82",
      "D2O": "22.26"
    }
  },
  // Methyl tert-butyl ether (MTBE)
  {
    "impurity": "methyl tert-butyl ether",
    "atomLabel": "OCH3",
    "multiplicity": "S",
    "type": "H",
    "shifts": {
      "CDCl3": "3.22",
      "acetone-d6": "3.13",
      "DMSO-d6": "3.08",
      "CD3CN": "3.13",
      "CD3OD": "3.20",
      "D2O": "3.22"
    }
  },
  {
    "impurity": "methyl tert-butyl ether",
    "atomLabel": "CCH3",
    "multiplicity": "S",
    "type": "H",
    "shifts": {
      "CDCl3": "1.19",
      "acetone-d6": "1.13",
      "DMSO-d6": "1.11",
      "CD3CN": "1.14",
      "CD3OD": "1.15",
      "D2O": "1.21"
    }
  },
  {
    "impurity": "methyl tert-butyl ether",
    "atomLabel": "C",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "72.87",
      "acetone-d6": "72.81",
      "DMSO-d6": "72.04",
      "CD3CN": "73.17",
      "CD3OD": "74.32",
      "D2O": "75.62"
    }
  },
  {
    "impurity": "methyl tert-butyl ether",
    "atomLabel": "OCH3",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "49.45",
      "acetone-d6": "49.35",
      "DMSO-d6": "48.70",
      "CD3CN": "49.52",
      "CD3OD": "49.66",
      "D2O": "49.37"
    }
  },
  {
    "impurity": "methyl tert-butyl ether",
    "atomLabel": "CCH3",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "26.99",
      "acetone-d6": "27.24",
      "DMSO-d6": "26.79",
      "CD3CN": "27.28",
      "CD3OD": "27.22",
      "D2O": "26.60"
    }
  },
  // 2-methyl tetrahydrofuran
  {
    "impurity": "2-methyl tetrahydrofuran",
    "atomLabel": "CH",
    "multiplicity": "dp, 7.9, 6.1",
    "type": "H",
    "shifts": {
      "CDCl3": "3.94",
      "acetone-d6": "3.83",
      "DMSO-d6": "3.82",
      "CD3CN": "3.85",
      "CD3OD": "3.95",
      "D2O": "4.03"
    }
  },
  {
    "impurity": "2-methyl tetrahydrofuran",
    "atomLabel": "OCHAHB",
    "multiplicity": "td, 7.7, 5.9",
    "type": "H",
    "shifts": {
      "CDCl3": "3.89",
      "acetone-d6": "3.78",
      "DMSO-d6": "3.75",
      "CD3CN": "3.79",
      "CD3OD": "3.86",
      "D2O": "3.88"
    }
  },
  {
    "impurity": "2-methyl tetrahydrofuran",
    "atomLabel": "OCHAHB",
    "multiplicity": "td, 8.0, 6.3",
    "type": "H",
    "shifts": {
      "CDCl3": "3.71",
      "acetone-d6": "3.58",
      "DMSO-d6": "3.55",
      "CD3CN": "3.60",
      "CD3OD": "3.70",
      "D2O": "3.74"
    }
  },
  {
    "impurity": "2-methyl tetrahydrofuran",
    "atomLabel": "Hc, HD, HE",
    "multiplicity": "m",
    "type": "H",
    "shifts": {
      "CDCl3": "2.03-1.81",
      "acetone-d6": "2.00-1.75",
      "DMSO-d6": "1.97-1.72",
      "CD3CN": "2.00-1.76",
      "CD3OD": "2.06-1.85",
      "D2O": "2.11-1.86"
    }
  },
  {
    "impurity": "2-methyl tetrahydrofuran",
    "atomLabel": "HF",
    "multiplicity": "ddt, 11.7, 8.8, 7.6",
    "type": "H",
    "shifts": {
      "CDCl3": "1.41",
      "acetone-d6": "1.34",
      "DMSO-d6": "1.31",
      "CD3CN": "1.35",
      "CD3OD": "1.42, dq",
      "D2O": "1.47, dq"
    }
  },
  {
    "impurity": "2-methyl tetrahydrofuran",
    "atomLabel": "CH3",
    "multiplicity": "d, 6.1",
    "type": "H",
    "shifts": {
      "CDCl3": "1.23",
      "acetone-d6": "1.14",
      "DMSO-d6": "1.12",
      "CD3CN": "1.15",
      "CD3OD": "1.20",
      "D2O": "1.23"
    }
  },
  {
    "impurity": "2-methyl tetrahydrofuran",
    "atomLabel": "CH",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "75.23",
      "acetone-d6": "75.50",
      "DMSO-d6": "74.21",
      "CD3CN": "75.78",
      "CD3OD": "76.75",
      "D2O": "76.81"
    }
  },
  {
    "impurity": "2-methyl tetrahydrofuran",
    "atomLabel": "CH2O",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "67.72",
      "acetone-d6": "67.87",
      "DMSO-d6": "66.65",
      "CD3CN": "68.10",
      "CD3OD": "68.68",
      "D2O": "68.13"
    }
  },
  {
    "impurity": "2-methyl tetrahydrofuran",
    "atomLabel": "CH2CH",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "33.11",
      "acetone-d6": "33.80",
      "DMSO-d6": "32.62",
      "CD3CN": "33.85",
      "CD3OD": "34.05",
      "D2O": "32.93"
    }
  },
  {
    "impurity": "2-methyl tetrahydrofuran",
    "atomLabel": "CH2CH2O",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "25.92",
      "acetone-d6": "26.47",
      "DMSO-d6": "25.32",
      "CD3CN": "26.59",
      "CD3OD": "26.77",
      "D2O": "25.77"
    }
  },
  {
    "impurity": "2-methyl tetrahydrofuran",
    "atomLabel": "CH3",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "20.97",
      "acetone-d6": "21.29",
      "DMSO-d6": "20.81",
      "CD3CN": "21.34",
      "CD3OD": "21.14",
      "D2O": "20.34"
    }
  },
  // Pyridine (from Babij et al.)
  {
    "impurity": "pyridine",
    "atomLabel": "CH (2,6)",
    "multiplicity": "m",
    "type": "H",
    "shifts": {
      "CDCl3": "8.62-8.61",
      "acetone-d6": "8.59-8.57",
      "DMSO-d6": "8.59-8.57",
      "CD3CN": "8.58-8.56",
      "CD3OD": "8.54-8.52",
      "D2O": "8.54-8.52"
    }
  },
  {
    "impurity": "pyridine",
    "atomLabel": "CH (4)",
    "multiplicity": "tt, 7.6, 1.8",
    "type": "H",
    "shifts": {
      "CDCl3": "7.68",
      "acetone-d6": "7.76",
      "DMSO-d6": "7.79",
      "CD3CN": "7.73",
      "CD3OD": "7.85",
      "D2O": "7.91-7.86, m"
    }
  },
  {
    "impurity": "pyridine",
    "atomLabel": "CH (3,5)",
    "multiplicity": "m",
    "type": "H",
    "shifts": {
      "CDCl3": "7.30-7.26",
      "acetone-d6": "7.36-7.33",
      "DMSO-d6": "7.40-7,37",
      "CD3CN": "7.34-7.31",
      "CD3OD": "7.45-7.42",
      "D2O": "7.48-7.45"
    }
  },
  {
    "impurity": "pyridine",
    "atomLabel": "CH (2,6)",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "149.90",
      "acetone-d6": "150.67",
      "DMSO-d6": "149.54",
      "CD3CN": "150.78",
      "CD3OD": "150.12",
      "D2O": "149.16"
    }
  },
  {
    "impurity": "pyridine",
    "atomLabel": "CH (4)",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "135.89",
      "acetone-d6": "136.57",
      "DMSO-d6": "136.01",
      "CD3CN": "136.91",
      "CD3OD": "138.38",
      "D2O": "138.21"
    }
  },
  {
    "impurity": "pyridine",
    "atomLabel": "CH (3,5)",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "123.71",
      "acetone-d6": "124.54",
      "DMSO-d6": "123.80",
      "CD3CN": "124.77",
      "CD3OD": "125.56",
      "D2O": "125.04"
    }
  },
  // Sulfolane
  {
    "impurity": "sulfolane",
    "atomLabel": "CH2SO2",
    "multiplicity": "m",
    "type": "H",
    "shifts": {
      "CDCl3": "3.05-3.02",
      "acetone-d6": "2.97-2.93",
      "DMSO-d6": "3.01-2.97",
      "CD3CN": "2.96-2.92",
      "CD3OD": "3.03-2.99",
      "D2O": "3.19-3.15"
    }
  },
  {
    "impurity": "sulfolane",
    "atomLabel": "CH2",
    "multiplicity": "m",
    "type": "H",
    "shifts": {
      "CDCl3": "2.25-2.21",
      "acetone-d6": "2.21-2.17",
      "DMSO-d6": "2.09-2.05",
      "CD3CN": "2.16-2.12",
      "CD3OD": "2.21-2.18",
      "D2O": "2.26-2.22"
    }
  },
  {
    "impurity": "sulfolane",
    "atomLabel": "CH2SO2",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "51.16",
      "acetone-d6": "51.60",
      "DMSO-d6": "50.51",
      "CD3CN": "51.86",
      "CD3OD": "52.04",
      "D2O": "51.58"
    }
  },
  {
    "impurity": "sulfolane",
    "atomLabel": "CH2",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "22.79",
      "acetone-d6": "23.31",
      "DMSO-d6": "22.07",
      "CD3CN": "23.38",
      "CD3OD": "23.68",
      "D2O": "22.84"
    }
  },
  // tert-amyl methyl ether (TAME)
  {
    "impurity": "tert-amyl methyl ether",
    "atomLabel": "OCH3",
    "multiplicity": "S",
    "type": "H",
    "shifts": {
      "CDCl3": "3.18",
      "acetone-d6": "3.10",
      "DMSO-d6": "3.05",
      "CD3CN": "3.10",
      "CD3OD": "3.17",
      "D2O": "3.20"
    }
  },
  {
    "impurity": "tert-amyl methyl ether",
    "atomLabel": "CH2",
    "multiplicity": "q, 7.5",
    "type": "H",
    "shifts": {
      "CDCl3": "1.46",
      "acetone-d6": "1.49",
      "DMSO-d6": "1.42",
      "CD3CN": "1.46",
      "CD3OD": "1.51",
      "D2O": "1.55"
    }
  },
  {
    "impurity": "tert-amyl methyl ether",
    "atomLabel": "(CH3)2",
    "multiplicity": "S",
    "type": "H",
    "shifts": {
      "CDCl3": "1.07",
      "acetone-d6": "1.13",
      "DMSO-d6": "1.05",
      "CD3CN": "1.08",
      "CD3OD": "1.13",
      "D2O": "1.17"
    }
  },
  {
    "impurity": "tert-amyl methyl ether",
    "atomLabel": "CH2CH3",
    "multiplicity": "t, 7.5",
    "type": "H",
    "shifts": {
      "CDCl3": "0.87",
      "acetone-d6": "0.82",
      "DMSO-d6": "0.79",
      "CD3CN": "0.83",
      "CD3OD": "0.86",
      "D2O": "0.85"
    }
  },
  {
    "impurity": "tert-amyl methyl ether",
    "atomLabel": "C",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "74.77",
      "acetone-d6": "74.73",
      "DMSO-d6": "73.85",
      "CD3CN": "75.16",
      "CD3OD": "76.46",
      "D2O": "77.73"
    }
  },
  {
    "impurity": "tert-amyl methyl ether",
    "atomLabel": "OCH3",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "49.04",
      "acetone-d6": "48.96",
      "DMSO-d6": "48.29",
      "CD3CN": "49.16",
      "CD3OD": "49.32",
      "D2O": "48.92"
    }
  },
  {
    "impurity": "tert-amyl methyl ether",
    "atomLabel": "CH2",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "32.14",
      "acetone-d6": "32.91",
      "DMSO-d6": "31.65",
      "CD3CN": "32.90",
      "CD3OD": "32.99",
      "D2O": "31.69"
    }
  },
  {
    "impurity": "tert-amyl methyl ether",
    "atomLabel": "(CH3)2",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "24.50",
      "acetone-d6": "24.73",
      "DMSO-d6": "24.20",
      "CD3CN": "24.83",
      "CD3OD": "24.83",
      "D2O": "24.24"
    }
  },
  {
    "impurity": "tert-amyl methyl ether",
    "atomLabel": "CH2CH3",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "8.22",
      "acetone-d6": "8.40",
      "DMSO-d6": "8.00",
      "CD3CN": "8.53",
      "CD3OD": "8.47",
      "D2O": "8.14"
    }
  },
  // Tetrahydrofuran (from Babij et al.)
  {
    "impurity": "tetrahydrofuran",
    "atomLabel": "CH2O",
    "multiplicity": "m",
    "type": "H",
    "shifts": {
      "CDCl3": "3.76-3.73",
      "acetone-d6": "3.64-3.61",
      "DMSO-d6": "3.62-3.59",
      "CD3CN": "3.66-3.63",
      "CD3OD": "3.74-3.71",
      "D2O": "3.78-3.74"
    }
  },
  {
    "impurity": "tetrahydrofuran",
    "atomLabel": "CH2",
    "multiplicity": "m",
    "type": "H",
    "shifts": {
      "CDCl3": "1.87-1.84",
      "acetone-d6": "1.81-1.77",
      "DMSO-d6": "1.78-1.75",
      "CD3CN": "1.82-1.79",
      "CD3OD": "1.88-1.85",
      "D2O": "1.91-1.88"
    }
  },
  {
    "impurity": "tetrahydrofuran",
    "atomLabel": "CH2O",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "68.00",
      "acetone-d6": "68.07",
      "DMSO-d6": "67.07",
      "CD3CN": "68.32",
      "CD3OD": "68.82",
      "D2O": "68.45"
    }
  },
  {
    "impurity": "tetrahydrofuran",
    "atomLabel": "CH2",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "25.68",
      "acetone-d6": "26.19",
      "DMSO-d6": "25.19",
      "CD3CN": "26.30",
      "CD3OD": "26.50",
      "D2O": "25.63"
    }
  },
  // Toluene (from Babij et al.)
  {
    "impurity": "toluene",
    "atomLabel": "CH3",
    "multiplicity": "S",
    "type": "H",
    "shifts": {
      "CDCl3": "2.36",
      "acetone-d6": "2.31",
      "DMSO-d6": "2.30",
      "CD3CN": "2.33",
      "CD3OD": "2.32",
      "D2O": "2.35"
    }
  },
  {
    "impurity": "toluene",
    "atomLabel": "CH (3,5)",
    "multiplicity": "m",
    "type": "H",
    "shifts": {
      "CDCl3": "7.28-7.24",
      "acetone-d6": "7.26-7.22",
      "DMSO-d6": "7.27-7.23",
      "CD3CN": "7.27-7.23",
      "CD3OD": "7.23-7.19",
      "D2O": "7.36-7.33"
    }
  },
  {
    "impurity": "toluene",
    "atomLabel": "CH (2,4,6)",
    "multiplicity": "m",
    "type": "H",
    "shifts": {
      "CDCl3": "7.18-7.14",
      "acetone-d6": "7.18-7.12",
      "DMSO-d6": "7.19-7.13",
      "CD3CN": "7.20-7.13",
      "CD3OD": "7.16-7.09",
      "D2O": "7.29-7.22"
    }
  },
  {
    "impurity": "toluene",
    "atomLabel": "C(1)",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "137.88",
      "acetone-d6": "138.49",
      "DMSO-d6": "137.26",
      "CD3CN": "138.94",
      "CD3OD": "138.93",
      "D2O": ""
    }
  },
  {
    "impurity": "toluene",
    "atomLabel": "CH (2,6)",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "129.05",
      "acetone-d6": "129.75",
      "DMSO-d6": "128.81",
      "CD3CN": "129.95",
      "CD3OD": "129.94",
      "D2O": ""
    }
  },
  {
    "impurity": "toluene",
    "atomLabel": "CH (3,5)",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "128.24",
      "acetone-d6": "129.03",
      "DMSO-d6": "128.11",
      "CD3CN": "129.16",
      "CD3OD": "129.23",
      "D2O": ""
    }
  },
  {
    "impurity": "toluene",
    "atomLabel": "CH(4)",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "125.31",
      "acetone-d6": "126.11",
      "DMSO-d6": "125.22",
      "CD3CN": "126.29",
      "CD3OD": "126.32",
      "D2O": ""
    }
  },
  {
    "impurity": "toluene",
    "atomLabel": "CH3",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "21.45",
      "acetone-d6": "21.41",
      "DMSO-d6": "20.95",
      "CD3CN": "21.50",
      "CD3OD": "21.51",
      "D2O": ""
    }
  },
  // o-xylene
  {
    "impurity": "o-xylene",
    "atomLabel": "CH",
    "multiplicity": "m",
    "type": "H",
    "shifts": {
      "CDCl3": "7.14-7.08",
      "acetone-d6": "7.14-7.04",
      "DMSO-d6": "7.14-7.04",
      "CD3CN": "7.15-7.05",
      "CD3OD": "7.10-7.01",
      "D2O": ""
    }
  },
  {
    "impurity": "o-xylene",
    "atomLabel": "CH3",
    "multiplicity": "S",
    "type": "H",
    "shifts": {
      "CDCl3": "2.26",
      "acetone-d6": "2.23",
      "DMSO-d6": "2.21",
      "CD3CN": "2.25",
      "CD3OD": "2.24",
      "D2O": ""
    }
  },
  {
    "impurity": "o-xylene",
    "atomLabel": "C (1,2)",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "136.49",
      "acetone-d6": "137.03",
      "DMSO-d6": "135.91",
      "CD3CN": "137.51",
      "CD3OD": "137.37",
      "D2O": ""
    }
  },
  {
    "impurity": "o-xylene",
    "atomLabel": "CH (3,6)",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "129.59",
      "acetone-d6": "130.28",
      "DMSO-d6": "129.29",
      "CD3CN": "130.46",
      "CD3OD": "130.47",
      "D2O": ""
    }
  },
  {
    "impurity": "o-xylene",
    "atomLabel": "CH (4,5)",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "125.79",
      "acetone-d6": "126.58",
      "DMSO-d6": "125.61",
      "CD3CN": "126.78",
      "CD3OD": "126.81",
      "D2O": ""
    }
  },
  {
    "impurity": "o-xylene",
    "atomLabel": "CH3",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "19.71",
      "acetone-d6": "19.68",
      "DMSO-d6": "19.24",
      "CD3CN": "19.79",
      "CD3OD": "19.77",
      "D2O": ""
    }
  },
  // m-xylene
  {
    "impurity": "m-xylene",
    "atomLabel": "CH (5)",
    "multiplicity": "t, 7.5",
    "type": "H",
    "shifts": {
      "CDCl3": "7.15",
      "acetone-d6": "7.11",
      "DMSO-d6": "7.13",
      "CD3CN": "7.13",
      "CD3OD": "7.08",
      "D2O": "7.24"
    }
  },
  {
    "impurity": "m-xylene",
    "atomLabel": "CH (2,4,6)",
    "multiplicity": "m",
    "type": "H",
    "shifts": {
      "CDCl3": "7.00-6.96",
      "acetone-d6": "6.99-6.94",
      "DMSO-d6": "6.99-6.95",
      "CD3CN": "7.01-6.96",
      "CD3OD": "6.97-6.92",
      "D2O": "7.14-7.07"
    }
  },
  {
    "impurity": "m-xylene",
    "atomLabel": "CH3",
    "multiplicity": "S",
    "type": "H",
    "shifts": {
      "CDCl3": "2.32",
      "acetone-d6": "2.27",
      "DMSO-d6": "2.26",
      "CD3CN": "2.28",
      "CD3OD": "2.27",
      "D2O": "2.31"
    }
  },
  {
    "impurity": "m-xylene",
    "atomLabel": "C (1,3)",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "137.78",
      "acetone-d6": "138.34",
      "DMSO-d6": "137.07",
      "CD3CN": "138.80",
      "CD3OD": "138.79",
      "D2O": ""
    }
  },
  {
    "impurity": "m-xylene",
    "atomLabel": "CH (2)",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "129.91",
      "acetone-d6": "130.52",
      "DMSO-d6": "129.51",
      "CD3CN": "130.71",
      "CD3OD": "130.70",
      "D2O": ""
    }
  },
  {
    "impurity": "m-xylene",
    "atomLabel": "CH (5)",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "128.15",
      "acetone-d6": "128.93",
      "DMSO-d6": "127.98",
      "CD3CN": "129.16",
      "CD3OD": "129.13",
      "D2O": ""
    }
  },
  {
    "impurity": "m-xylene",
    "atomLabel": "CH (4,6)",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "126.04",
      "acetone-d6": "126.78",
      "DMSO-d6": "125.83",
      "CD3CN": "126.95",
      "CD3OD": "126.99",
      "D2O": ""
    }
  },
  {
    "impurity": "m-xylene",
    "atomLabel": "CH3",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "21.33",
      "acetone-d6": "21.32",
      "DMSO-d6": "20.83",
      "CD3CN": "21.40",
      "CD3OD": "21.42",
      "D2O": ""
    }
  },
  // p-xylene
  {
    "impurity": "p-xylene",
    "atomLabel": "CH",
    "multiplicity": "S",
    "type": "H",
    "shifts": {
      "CDCl3": "7.06",
      "acetone-d6": "7.05",
      "DMSO-d6": "7.05",
      "CD3CN": "7.06",
      "CD3OD": "7.02",
      "D2O": "7.18"
    }
  },
  {
    "impurity": "p-xylene",
    "atomLabel": "CH3",
    "multiplicity": "S",
    "type": "H",
    "shifts": {
      "CDCl3": "2.31",
      "acetone-d6": "2.26",
      "DMSO-d6": "2.24",
      "CD3CN": "2.27",
      "CD3OD": "2.26",
      "D2O": "2.30"
    }
  },
  {
    "impurity": "p-xylene",
    "atomLabel": "C (1,4)",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "134.67",
      "acetone-d6": "135.27",
      "DMSO-d6": "134.03",
      "CD3CN": "135.68",
      "CD3OD": "135.71",
      "D2O": ""
    }
  },
  {
    "impurity": "p-xylene",
    "atomLabel": "CH (2,3,5,6)",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "128.92",
      "acetone-d6": "129.65",
      "DMSO-d6": "128.69",
      "CD3CN": "129.85",
      "CD3OD": "129.84",
      "D2O": ""
    }
  },
  {
    "impurity": "p-xylene",
    "atomLabel": "CH3",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "20.94",
      "acetone-d6": "20.94",
      "DMSO-d6": "20.49",
      "CD3CN": "21.00",
      "CD3OD": "21.02",
      "D2O": ""
    }
  },
  // Ethylbenzene
  {
    "impurity": "ethylbenzene",
    "atomLabel": "CH (3,5)",
    "multiplicity": "m",
    "type": "H",
    "shifts": {
      "CDCl3": "7.30-7.26",
      "acetone-d6": "7.29-7.25",
      "DMSO-d6": "7.29-7.26",
      "CD3CN": "7.30-7.25",
      "CD3OD": "7.26-7.22",
      "D2O": ""
    }
  },
  {
    "impurity": "ethylbenzene",
    "atomLabel": "CH (2,6)",
    "multiplicity": "m",
    "type": "H",
    "shifts": {
      "CDCl3": "7.22-7.19",
      "acetone-d6": "7.23-7.15",
      "DMSO-d6": "7.22-7.14",
      "CD3CN": "7.23-7.21",
      "CD3OD": "7.18-7.16",
      "D2O": ""
    }
  },
  {
    "impurity": "ethylbenzene",
    "atomLabel": "CH (4)",
    "multiplicity": "m",
    "type": "H",
    "shifts": {
      "CDCl3": "7.17-7.13",
      "acetone-d6": "7.23-7.15",
      "DMSO-d6": "7.22-7.14",
      "CD3CN": "7.19-7.14",
      "CD3OD": "7.14-7.10",
      "D2O": ""
    }
  },
  {
    "impurity": "ethylbenzene",
    "atomLabel": "CH2",
    "multiplicity": "q, 7.6",
    "type": "H",
    "shifts": {
      "CDCl3": "2.63",
      "acetone-d6": "2.65",
      "DMSO-d6": "2.60",
      "CD3CN": "2.63",
      "CD3OD": "2.62",
      "D2O": ""
    }
  },
  {
    "impurity": "ethylbenzene",
    "atomLabel": "CH3",
    "multiplicity": "t, 7.6",
    "type": "H",
    "shifts": {
      "CDCl3": "1.20",
      "acetone-d6": "1.24",
      "DMSO-d6": "1.17",
      "CD3CN": "1.21",
      "CD3OD": "1.21",
      "D2O": ""
    }
  },
  {
    "impurity": "ethylbenzene",
    "atomLabel": "C (1)",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "144.25",
      "acetone-d6": "144.99",
      "DMSO-d6": "143.65",
      "CD3CN": "145.42",
      "CD3OD": "145.48",
      "D2O": ""
    }
  },
  {
    "impurity": "ethylbenzene",
    "atomLabel": "CH (3,5)",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "128.31",
      "acetone-d6": "129.12",
      "DMSO-d6": "128.18",
      "CD3CN": "129.34",
      "CD3OD": "129.33",
      "D2O": ""
    }
  },
  {
    "impurity": "ethylbenzene",
    "atomLabel": "CH (2,6)",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "127.85",
      "acetone-d6": "128.59",
      "DMSO-d6": "127.63",
      "CD3CN": "128.81",
      "CD3OD": "128.80",
      "D2O": ""
    }
  },
  {
    "impurity": "ethylbenzene",
    "atomLabel": "CH (4)",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "125.58",
      "acetone-d6": "126.40",
      "DMSO-d6": "125.50",
      "CD3CN": "126.59",
      "CD3OD": "126.62",
      "D2O": ""
    }
  },
  {
    "impurity": "ethylbenzene",
    "atomLabel": "CH2",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "28.89",
      "acetone-d6": "29.43",
      "DMSO-d6": "28.11",
      "CD3CN": "29.50",
      "CD3OD": "29.89",
      "D2O": ""
    }
  },
  {
    "impurity": "ethylbenzene",
    "atomLabel": "CH3",
    "multiplicity": "S",
    "type": "C",
    "shifts": {
      "CDCl3": "15.60",
      "acetone-d6": "16.08",
      "DMSO-d6": "15.55",
      "CD3CN": "16.17",
      "CD3OD": "16.25",
      "D2O": ""
    }
  }
];

// Updated solvent data with full names and formulas
const solvents = [
  { short: "CDCl3", full: "Chloroform-d", formula: "CDCl3" },
  { short: "acetone-d6", full: "Acetone-d6", formula: "(CD3)2CO" },
  { short: "DMSO-d6", full: "Dimethyl Sulfoxide-d6", formula: "(CD3)2SO" },
  { short: "CD3CN", full: "Acetonitrile-d3", formula: "CD3CN" },
  { short: "CD3OD", full: "Methanol-d4", formula: "CD3OD" },
  { short: "D2O", full: "Deuterium Oxide", formula: "D2O" }
];

// Utility function to debounce input for search
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// New component for simple spectrum visualization
const NMRSpectrumViewer = ({ data, solventShortName, nmrType }) => {
  if (!data || data.length === 0) {
    return <p className="text-center text-gray-500 py-4">No {nmrType === 'H' ? '¹H' : '¹³C'} NMR spectrum data to display.</p>;
  }

  const relevantData = data.filter(row => row.type === nmrType && row.shifts[solventShortName] && row.shifts[solventShortName] !== "");

  if (relevantData.length === 0) {
    return <p className="text-center text-gray-500 py-4">No {nmrType === 'H' ? '¹H' : '¹³C'} NMR spectrum data available for this combination.</p>;
  }

  // Determine min/max ppm for scaling
  let minPpm = Infinity;
  let maxPpm = -Infinity;

  relevantData.forEach(row => {
    const shiftStr = row.shifts[solventShortName];
    if (shiftStr) {
      // Split by non-numeric characters to handle ranges like "7.30-7.26" or "3.68, t(6.8)"
      const parts = shiftStr.split(/[^0-9.-]+/).map(s => parseFloat(s.trim())).filter(s => !isNaN(s));
      parts.forEach(p => {
        if (p < minPpm) minPpm = p;
        if (p > maxPpm) maxPpm = p;
      });
    }
  });

  // Add some padding to the min/max ppm range for better visualization
  const padding = (maxPpm - minPpm) * 0.1 || (nmrType === 'H' ? 1 : 20); // 10% padding or default
  minPpm = Math.max(0, minPpm - padding); // Ensure ppm doesn't go below 0
  maxPpm = maxPpm + padding;

  const svgWidth = 800; // Fixed width for SVG
  const svgHeight = 150; // Height for spectrum
  const baselineY = svgHeight - 30; // Y-position of the baseline
  const peakHeight = 40; // Height of the peaks
  const labelOffset = 10; // Offset for labels above/below peaks

  // Function to map ppm to SVG x-coordinate (reversed scale)
  const ppmToX = (ppm) => {
    // Map ppm from [minPpm, maxPpm] to [svgWidth, 0]
    return svgWidth - (((ppm - minPpm) / (maxPpm - minPpm)) * svgWidth);
  };

  return (
    <div className="bg-gray-50 rounded-xl shadow-md p-4 mb-8">
      <h3 className="text-xl font-semibold text-gray-700 px-4 py-3 bg-blue-100 rounded-t-xl">
        {nmrType === 'H' ? '¹H' : '¹³C'} NMR Spectrum Visualization
      </h3>
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto">
          {/* Baseline */}
          <line x1="0" y1={baselineY} x2={svgWidth} y2={baselineY} stroke="#374151" strokeWidth="2" />

          {/* Peaks */}
          {relevantData.map((row, index) => {
            const shiftStr = row.shifts[solventShortName];
            if (!shiftStr) return null;

            // Handle ranges or single values for plotting
            let plotPpm;
            let displayShift;
            if (shiftStr.includes('-')) {
              const [start, end] = shiftStr.split('-').map(s => parseFloat(s.trim())).filter(s => !isNaN(s));
              plotPpm = (start + end) / 2; // Plot at the center of the range
              displayShift = shiftStr; // Show the full range
            } else {
              plotPpm = parseFloat(shiftStr.split(/[^0-9.-]+/)[0]); // Take the first number if there's text
              displayShift = shiftStr;
            }

            if (isNaN(plotPpm)) return null;

            const xPos = ppmToX(plotPpm);

            return (
              <g key={index}>
                {/* Peak Line */}
                <line
                  x1={xPos}
                  y1={baselineY}
                  x2={xPos}
                  y2={baselineY - peakHeight}
                  stroke="#1D4ED8"
                  strokeWidth="2"
                />
                {/* Atom Label */}
                <text
                  x={xPos}
                  y={baselineY - peakHeight - labelOffset - 20} // Position above multiplicity
                  textAnchor="middle"
                  fontSize="9"
                  fill="#4B5563"
                  fontWeight="bold"
                >
                  {row.atomLabel || 'N/A'}
                </text>
                {/* Multiplicity Label */}
                <text
                  x={xPos}
                  y={baselineY - peakHeight - labelOffset - 5} // Above chemical shift
                  textAnchor="middle"
                  fontSize="9"
                  fill="#4B5563"
                >
                  {row.multiplicity}
                </text>
                {/* Chemical Shift Label */}
                <text
                  x={xPos}
                  y={baselineY - peakHeight - labelOffset + 10} // Adjusted for better visibility
                  textAnchor="middle"
                  fontSize="10"
                  fill="#1D4ED8"
                  fontWeight="bold"
                >
                  {displayShift}
                </text>
              </g>
            );
          })}

          {/* X-axis labels (simple ticks) */}
          {Array.from({ length: 11 }).map((_, i) => {
            // Calculate tick ppm for reversed scale
            const tickPpm = maxPpm - (maxPpm - minPpm) * (i / 10);
            const tickX = ppmToX(tickPpm);
            return (
              <g key={`tick-${i}`}>
                <line x1={tickX} y1={baselineY} x2={tickX} y2={baselineY + 5} stroke="#374151" strokeWidth="1" />
                <text x={tickX} y={baselineY + 15} textAnchor="middle" fontSize="8" fill="#374151">
                  {tickPpm.toFixed(1)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <p className="text-sm text-gray-500 mt-2 text-center">
        Note: This is a simplified representation. Multiplets are shown as single lines with multiplicity and atom labels.
      </p>
    </div>
  );
};


// Main App Component
const App = () => {
  const [activeTab, setActiveTab] = useState('table'); // 'table', 'solvent', 'impurity', or 'combo'
  const [activeNMRType, setActiveNMRType] = useState('H'); // 'H' for Proton, 'C' for Carbon
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedSolventShort, setHighlightedSolventShort] = useState(null);
  const [mathJaxLoaded, setMathJaxLoaded] = useState(false);
  const [selectedSolventForDetails, setSelectedSolventForDetails] = useState(null);
  const [selectedImpurityForDetails, setSelectedImpurityForDetails] = useState(null);

  // State for the new Combo Mode
  const [selectedComboSolvent, setSelectedComboSolvent] = useState(null);
  const [selectedComboImpurity, setSelectedComboImpurity] = useState(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Load MathJax script once on component mount
  useEffect(() => {
    if (window.MathJax) {
      setMathJaxLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
    script.async = true;
    script.onload = () => {
      window.MathJax.startup = {
        ready: () => {
          window.MathJax.startup.defaultReady();
          setMathJaxLoaded(true);
          window.MathJax.typesetPromise();
        }
      };
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Trigger MathJax typesetting when relevant data or tab changes
  useEffect(() => {
    if (mathJaxLoaded) {
      window.MathJax.typesetPromise();
    }
  }, [mathJaxLoaded, activeTab, activeNMRType, debouncedSearchTerm, selectedSolventForDetails, selectedImpurityForDetails, highlightedSolventShort, selectedComboSolvent, selectedComboImpurity]);

  // Filtered data based on active NMR type and search term
  const filteredTableData = useMemo(() => {
    const dataForType = nmrData.filter(row => row.type === activeNMRType);
    if (!debouncedSearchTerm) {
      return dataForType;
    }
    const lowerCaseSearchTerm = debouncedSearchTerm.toLowerCase();
    return dataForType.filter(row =>
      row.impurity.toLowerCase().includes(lowerCaseSearchTerm) ||
      row.atomLabel.toLowerCase().includes(lowerCaseSearchTerm) ||
      row.multiplicity.toLowerCase().includes(lowerCaseSearchTerm) ||
      Object.values(row.shifts).some(shift =>
        shift && shift.toLowerCase().includes(lowerCaseSearchTerm)
      )
    );
  }, [debouncedSearchTerm, activeNMRType]);

  // Filtered data for the detailed solvent view (shows both H and C if available)
  const filteredSolventDetailsData = useMemo(() => {
    if (!selectedSolventForDetails) {
      return [];
    }
    // For solvent details, show all available NMR types for that solvent
    return nmrData.filter(row => row.shifts[selectedSolventForDetails] && row.shifts[selectedSolventForDetails] !== "");
  }, [selectedSolventForDetails]);

  const currentDetailedSolvent = useMemo(() => {
    return solvents.find(s => s.short === selectedSolventForDetails);
  }, [selectedSolventForDetails]);

  // Unique impurities for the Impurity Mode cards
  const uniqueImpurities = useMemo(() => {
    const impurities = new Set();
    nmrData.forEach(row => impurities.add(row.impurity));
    return Array.from(impurities).sort();
  }, []);

  // Filtered data for the detailed impurity view (shows both H and C for that impurity)
  const filteredImpurityDetailsData = useMemo(() => {
    if (!selectedImpurityForDetails) {
      return [];
    }
    // For impurity details, show all available NMR types for that impurity
    return nmrData.filter(row => row.impurity === selectedImpurityForDetails);
  }, [selectedImpurityForDetails]);

  // --- Combo Mode Logic ---

  // Get impurities available for a selected solvent
  const getImpuritiesForSolvent = useCallback((solventShortName) => {
    const impuritiesInSolvent = new Set();
    nmrData.forEach(row => {
      if (row.shifts[solventShortName] && row.shifts[solventShortName] !== "") {
        impuritiesInSolvent.add(row.impurity);
      }
    });
    return Array.from(impuritiesInSolvent).sort();
  }, []);

  // Data for the combo result view
  const comboResultData = useMemo(() => {
    if (!selectedComboSolvent || !selectedComboImpurity) {
      return [];
    }
    return nmrData.filter(row =>
      row.impurity === selectedComboImpurity &&
      row.shifts[selectedComboSolvent] &&
      row.shifts[selectedComboSolvent] !== ""
    );
  }, [selectedComboSolvent, selectedComboImpurity]);

  const resetComboMode = () => {
    setSelectedComboSolvent(null);
    setSelectedComboImpurity(null);
  };

  const handleSolventSelectInCombo = (solventShortName) => {
    setSelectedComboSolvent(solventShortName);
    setSelectedComboImpurity(null); // Reset impurity when solvent changes
  };

  const handleImpuritySelectInCombo = (impurityName) => {
    setSelectedComboImpurity(impurityName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-4 font-inter text-gray-800">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl p-6 md:p-8">
        <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-6">
          NMR Chemical Shift Explorer
        </h1>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => { setActiveTab('table'); resetComboMode(); setSelectedSolventForDetails(null); setSelectedImpurityForDetails(null); setHighlightedSolventShort(null); }}
            className={`px-6 py-3 rounded-l-xl text-lg font-semibold transition-all duration-300
              ${activeTab === 'table' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Table View
          </button>
          <button
            onClick={() => { setActiveTab('solvent'); resetComboMode(); setSelectedSolventForDetails(null); setSelectedImpurityForDetails(null); setHighlightedSolventShort(null); }}
            className={`px-6 py-3 text-lg font-semibold transition-all duration-300
              ${activeTab === 'solvent' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Solvent Mode
          </button>
          <button
            onClick={() => { setActiveTab('impurity'); resetComboMode(); setSelectedSolventForDetails(null); setSelectedImpurityForDetails(null); setHighlightedSolventShort(null); }}
            className={`px-6 py-3 text-lg font-semibold transition-all duration-300
              ${activeTab === 'impurity' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Impurity Mode
          </button>
          <button
            onClick={() => { setActiveTab('combo'); resetComboMode(); setSelectedSolventForDetails(null); setSelectedImpurityForDetails(null); setHighlightedSolventShort(null); }}
            className={`px-6 py-3 rounded-r-xl text-lg font-semibold transition-all duration-300
              ${activeTab === 'combo' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Solvent/Impurity Combo
          </button>
        </div>

        {activeTab === 'table' && (
          <div className="table-view">
            {/* NMR Type Selection */}
            <div className="flex justify-center mb-6 gap-4">
              <button
                onClick={() => setActiveNMRType('H')}
                className={`px-5 py-2 rounded-lg text-md font-medium transition-all duration-300
                  ${activeNMRType === 'H' ? 'bg-green-600 text-white shadow-md' : 'bg-green-200 text-green-800 hover:bg-green-300'}`}
              >
                ¹H NMR
              </button>
              <button
                onClick={() => setActiveNMRType('C')}
                className={`px-5 py-2 rounded-lg text-md font-medium transition-all duration-300
                  ${activeNMRType === 'C' ? 'bg-green-600 text-white shadow-md' : 'bg-green-200 text-green-800 hover:bg-green-300'}`}
              >
                ¹³C NMR
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
              {/* Search Bar */}
              <input
                type="text"
                placeholder="Search impurity, atom label, multiplicity, or any shift..."
                className="flex-grow p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* NMR Data Table */}
            <div className="overflow-x-auto bg-gray-50 rounded-xl shadow-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider rounded-tl-xl">Impurity</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Atom Label</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Multiplicity</th>
                    {solvents.map(solvent => (
                      <th
                        key={solvent.short}
                        className={`px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider
                          ${highlightedSolventShort === solvent.short ? 'bg-blue-200' : ''}`}
                      >
                        {solvent.short} (ppm)
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTableData.length > 0 ? (
                    filteredTableData.map((row, index) => (
                      <tr key={index} className="hover:bg-blue-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.impurity}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{row.atomLabel}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{row.multiplicity}</td>
                        {solvents.map(solvent => (
                          <td
                            key={solvent.short}
                            className={`px-4 py-4 whitespace-nowrap text-sm font-semibold cursor-pointer
                              ${highlightedSolventShort === solvent.short ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}`}
                            onClick={() => setHighlightedSolventShort(solvent.short)}
                          >
                            {row.shifts[solvent.short] || 'N/A'}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3 + solvents.length} className="px-6 py-4 text-center text-gray-500">No data found for your search or selected NMR type.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-500 mt-4 text-center">
              Click on any chemical shift value to highlight its solvent column. Scroll horizontally to view all solvent data.
            </p>
          </div>
        )}

        {activeTab === 'solvent' && (
          <div className="solvent-mode">
            {!selectedSolventForDetails ? (
              <>
                <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">Select a Deuterated Solvent</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {solvents.map(solvent => (
                    <div
                      key={solvent.short}
                      onClick={() => setSelectedSolventForDetails(solvent.short)}
                      className="bg-white border border-blue-300 rounded-xl shadow-lg p-6 text-center cursor-pointer
                                 hover:bg-blue-50 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      <h3 className="text-xl font-semibold text-blue-800 mb-2">{solvent.full}</h3>
                      <p className="text-gray-600 text-lg">{solvent.formula}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="solvent-details">
                <button
                  onClick={() => setSelectedSolventForDetails(null)}
                  className="mb-6 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg shadow-sm hover:bg-gray-300 transition-all duration-300"
                >
                  &larr; Back to Solvents
                </button>
                <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">
                  NMR Data for {currentDetailedSolvent?.full} ({currentDetailedSolvent?.formula})
                </h2>

                <div className="overflow-x-auto bg-gray-50 rounded-xl shadow-md mb-8">
                  <h3 className="text-xl font-semibold text-gray-700 px-4 py-3 bg-blue-100 rounded-t-xl">¹H NMR Data</h3>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-blue-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Impurity</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Atom Label</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Multiplicity</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Chemical Shift (ppm)</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredSolventDetailsData.filter(row => row.type === 'H').length > 0 ? (
                        filteredSolventDetailsData.filter(row => row.type === 'H').map((row, index) => (
                          <tr key={index} className="hover:bg-blue-50">
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{row.impurity}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{row.atomLabel}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{row.multiplicity}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-600 font-semibold">
                              {row.shifts[selectedSolventForDetails]}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="px-6 py-4 text-center text-gray-500">No ¹H NMR data available for this solvent.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="overflow-x-auto bg-gray-50 rounded-xl shadow-md">
                  <h3 className="text-xl font-semibold text-gray-700 px-4 py-3 bg-purple-100 rounded-t-xl">¹³C NMR Data</h3>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-purple-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Impurity</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Atom Label</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Multiplicity</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Chemical Shift (ppm)</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredSolventDetailsData.filter(row => row.type === 'C').length > 0 ? (
                        filteredSolventDetailsData.filter(row => row.type === 'C').map((row, index) => (
                          <tr key={index} className="hover:bg-purple-50">
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{row.impurity}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{row.atomLabel}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{row.multiplicity}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-purple-600 font-semibold">
                              {row.shifts[selectedSolventForDetails]}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="px-6 py-4 text-center text-gray-500">No ¹³C NMR data available for this solvent.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'impurity' && (
          <div className="impurity-mode">
            {!selectedImpurityForDetails ? (
              <>
                <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">Select an Impurity</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {uniqueImpurities.map(impurityName => (
                    <div
                      key={impurityName}
                      onClick={() => setSelectedImpurityForDetails(impurityName)}
                      className="bg-white border border-purple-300 rounded-xl shadow-lg p-6 text-center cursor-pointer
                                 hover:bg-purple-50 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      <h3 className="text-xl font-semibold text-purple-800 mb-2">{impurityName}</h3>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="impurity-details">
                <button
                  onClick={() => setSelectedImpurityForDetails(null)}
                  className="mb-6 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg shadow-sm hover:bg-gray-300 transition-all duration-300"
                >
                  &larr; Back to Impurities
                </button>
                <h2 className="text-3xl font-bold text-purple-700 mb-6 text-center">
                  NMR Data for {selectedImpurityForDetails}
                </h2>

                <div className="overflow-x-auto bg-gray-50 rounded-xl shadow-md mb-8">
                  <h3 className="text-xl font-semibold text-gray-700 px-4 py-3 bg-blue-100 rounded-t-xl">¹H NMR Data</h3>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-blue-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Atom Label</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Multiplicity</th>
                        {solvents.map(solvent => (
                          <th
                            key={solvent.short}
                            className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                          >
                            {solvent.short} (ppm)
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredImpurityDetailsData.filter(row => row.type === 'H').length > 0 ? (
                        filteredImpurityDetailsData.filter(row => row.type === 'H').map((row, index) => (
                          <tr key={index} className="hover:bg-purple-50">
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{row.atomLabel}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{row.multiplicity}</td>
                            {solvents.map(solvent => (
                              <td
                                key={solvent.short}
                                className="px-4 py-4 whitespace-nowrap text-sm text-purple-600 font-semibold"
                              >
                                {row.shifts[solvent.short] || 'N/A'}
                              </td>
                            ))}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={2 + solvents.length} className="px-6 py-4 text-center text-gray-500">No ¹H NMR data available for this impurity.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="overflow-x-auto bg-gray-50 rounded-xl shadow-md mt-8">
                  <h3 className="text-xl font-semibold text-gray-700 px-4 py-3 bg-purple-100 rounded-t-xl">¹³C NMR Data</h3>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-purple-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Atom Label</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Multiplicity</th>
                        {solvents.map(solvent => (
                          <th
                            key={solvent.short}
                            className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                          >
                            {solvent.short} (ppm)
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredImpurityDetailsData.filter(row => row.type === 'C').length > 0 ? (
                        filteredImpurityDetailsData.filter(row => row.type === 'C').map((row, index) => (
                          <tr key={index} className="hover:bg-purple-50">
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{row.atomLabel}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{row.multiplicity}</td>
                            {solvents.map(solvent => (
                              <td
                                key={solvent.short}
                                className="px-4 py-4 whitespace-nowrap text-sm text-purple-600 font-semibold"
                              >
                                {row.shifts[solvent.short] || 'N/A'}
                              </td>
                            ))}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={2 + solvents.length} className="px-6 py-4 text-center text-gray-500">No ¹³C NMR data available for this impurity.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'combo' && (
          <div className="combo-mode">
            {!selectedComboSolvent && (
              <>
                <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">Select a Deuterated Solvent</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {solvents.map(solvent => (
                    <div
                      key={solvent.short}
                      onClick={() => handleSolventSelectInCombo(solvent.short)}
                      className="bg-white border border-blue-300 rounded-xl shadow-lg p-6 text-center cursor-pointer
                                 hover:bg-blue-50 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      <h3 className="text-xl font-semibold text-blue-800 mb-2">{solvent.full}</h3>
                      <p className="text-gray-600 text-lg">{solvent.formula}</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {selectedComboSolvent && !selectedComboImpurity && (
              <>
                <button
                  onClick={() => { setSelectedComboSolvent(null); }}
                  className="mb-6 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg shadow-sm hover:bg-gray-300 transition-all duration-300"
                >
                  &larr; Back to Solvents
                </button>
                <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
                  Select an Impurity for {solvents.find(s => s.short === selectedComboSolvent)?.full}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getImpuritiesForSolvent(selectedComboSolvent).length > 0 ? (
                    getImpuritiesForSolvent(selectedComboSolvent).map(impurityName => (
                      <div
                        key={impurityName}
                        onClick={() => handleImpuritySelectInCombo(impurityName)}
                        className="bg-white border border-purple-300 rounded-xl shadow-lg p-6 text-center cursor-pointer
                                   hover:bg-purple-50 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        <h3 className="text-xl font-semibold text-purple-800 mb-2">{impurityName}</h3>
                      </div>
                    ))
                  ) : (
                    <p className="col-span-full text-center text-gray-500">No impurities found for this solvent.</p>
                  )}
                </div>
              </>
            )}

            {selectedComboSolvent && selectedComboImpurity && (
              <div className="combo-results">
                <button
                  onClick={() => { setSelectedComboImpurity(null); }}
                  className="mb-6 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg shadow-sm hover:bg-gray-300 transition-all duration-300"
                >
                  &larr; Back to Impurity Selection
                </button>
                <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">
                  NMR Data for {selectedComboImpurity} in {solvents.find(s => s.short === selectedComboSolvent)?.full}
                </h2>

                <div className="overflow-x-auto bg-gray-50 rounded-xl shadow-md mb-8">
                  <h3 className="text-xl font-semibold text-gray-700 px-4 py-3 bg-blue-100 rounded-t-xl">¹H NMR Data Table</h3>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-blue-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Atom Label</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Multiplicity</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Chemical Shift (ppm)</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {comboResultData.filter(row => row.type === 'H').length > 0 ? (
                        comboResultData.filter(row => row.type === 'H').map((row, index) => (
                          <tr key={index} className="hover:bg-blue-50">
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{row.atomLabel}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{row.multiplicity}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-600 font-semibold">
                              {row.shifts[selectedComboSolvent]}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="px-6 py-4 text-center text-gray-500">No ¹H NMR data available for this combination.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="overflow-x-auto bg-gray-50 rounded-xl shadow-md mb-8">
                  <h3 className="text-xl font-semibold text-gray-700 px-4 py-3 bg-purple-100 rounded-t-xl">¹³C NMR Data Table</h3>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-purple-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Atom Label</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Multiplicity</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Chemical Shift (ppm)</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {comboResultData.filter(row => row.type === 'C').length > 0 ? (
                        comboResultData.filter(row => row.type === 'C').map((row, index) => (
                          <tr key={index} className="hover:bg-purple-50">
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{row.atomLabel}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{row.multiplicity}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-purple-600 font-semibold">
                              {row.shifts[selectedComboSolvent]}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="px-6 py-4 text-center text-gray-500">No ¹³C NMR data available for this combination.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* ¹H NMR Spectrum */}
                <NMRSpectrumViewer
                  data={comboResultData}
                  solventShortName={selectedComboSolvent}
                  nmrType="H"
                />

                {/* ¹³C NMR Spectrum */}
                <NMRSpectrumViewer
                  data={comboResultData}
                  solventShortName={selectedComboSolvent}
                  nmrType="C"
                />
              </div>
            )}
          </div>
        )}

        {/* References Section */}
        <div className="mt-12 pt-8 border-t border-gray-300 text-gray-700">
          <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center">References</h2>
          <ul className="list-disc list-inside space-y-2 text-md leading-relaxed">
            <li>
              Fulmer, G. R.; Miller, A. J. M.; Sherden, N. H.; Gottlieb, H. E.; Nudelman, A.; Stoltz, B. M.; Bercaw, J. E.; Goldberg, K. I.
              <span className="font-semibold italic"> Organometallics</span> <span className="font-bold">2010</span>, <span className="font-italic">29</span>, 2176-2179.
            </li>
            <li>
              Babij, N. R.; McCusker, E. O.; Whiteker, G. T.; Canturk, B.; Choy, N.; Creemer, L. C.; De Amicis, C. V.; Hewlett, N. M.; Johnson, P. L.; Knobelsdorf, J. A.; Li, F.; Lorsbach, B. A.; Nugent, B. M.; Ryan, S. J.; Smith, M. R.; Yang, Q.
              <span className="font-semibold italic"> Org. Process Res. Dev.</span> <span className="font-bold">2016</span>, <span className="font-italic">20</span>, 661-667.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;
