export type MevzuatTur =
  | "KANUN"
  | "CB_KARARNAME"
  | "YONETMELIK"
  | "CB_YONETMELIK"
  | "CB_KARAR"
  | "CB_GENELGE"
  | "KHK"
  | "TUZUK"
  | "KKY"
  | "UY"
  | "TEBLIGLER"
  | "MULGA";

export const ALL_MEVZUAT_TYPES: MevzuatTur[] = [
  "KANUN",
  "CB_KARARNAME",
  "YONETMELIK",
  "CB_YONETMELIK",
  "CB_KARAR",
  "CB_GENELGE",
  "KHK",
  "TUZUK",
  "KKY",
  "UY",
  "TEBLIGLER",
  "MULGA",
];

export const MEVZUAT_TYPE_DESCRIPTIONS: Record<MevzuatTur, string> = {
  KANUN: "Kanun (Laws)",
  CB_KARARNAME: "Cumhurbaskanligi Kararnamesi (Presidential Decrees)",
  YONETMELIK: "Bakanlar Kurulu Yonetmelikleri (Council of Ministers Regulations)",
  CB_YONETMELIK: "Cumhurbaskanligi Yonetmeligi (Presidential Regulations)",
  CB_KARAR: "Cumhurbaskanligi Karari (Presidential Decisions)",
  CB_GENELGE: "Cumhurbaskanligi Genelgesi (Presidential Circulars)",
  KHK: "Kanun Hukmunde Kararname (Decree Laws)",
  TUZUK: "Tuzuk (Statutes)",
  KKY: "Kurum ve Kurulus Yonetmelikleri (Institutional Regulations)",
  UY: "Universite Yonetmelikleri (University Regulations)",
  TEBLIGLER: "Tebligler (Communiques)",
  MULGA: "Mulga Kanunlar (Repealed Laws)",
};

export function isValidMevzuatTur(value: string): value is MevzuatTur {
  return ALL_MEVZUAT_TYPES.includes(value as MevzuatTur);
}
