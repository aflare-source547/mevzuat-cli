import type { MevzuatTur } from "../enums/legislation-types.js";

export interface MevzuatSearchData {
  pageSize: number;
  pageNumber: number;
  sortFields: string[];
  sortDirection: string;
  phrase?: string;
  mevzuatAdi?: string;
  mevzuatNo?: string;
  mevzuatTurList?: MevzuatTur[];
  basliktaAra?: boolean;
  tamCumle?: boolean;
  resmiGazeteTarihiStart?: string;
  resmiGazeteTarihiEnd?: string;
  resmiGazeteSayisi?: string;
}

export interface MevzuatSearchRequest {
  data: MevzuatSearchData;
  applicationName: string;
  paging: boolean;
}

export interface MevzuatTurInfo {
  id: number;
  name: string;
  description?: string;
}

export interface MevzuatDocument {
  mevzuatId: string;
  mevzuatNo: string | number;
  mevzuatAdi: string;
  mevzuatTur?: MevzuatTurInfo;
  mevzuatTertip?: string | number;
  gerekceId?: string;
  ekler?: string[];
  resmiGazeteTarihi?: string;
  resmiGazeteSayisi?: string;
  url?: string;
  mukerrer?: string;
}

export interface MaddeNode {
  maddeId?: string | number;
  maddeNo?: string | number;
  title?: string;
  description?: string;
  maddeBaslik?: string;
  gerekceId?: string | number;
  children: MaddeNode[];
}

export interface ApiResponse<T> {
  data?: T;
  metadata?: {
    FMTY?: string;
    FMTE?: string;
  };
}

export interface SearchResponseData {
  mevzuatList: MevzuatDocument[];
  total: number;
  start: number;
}

export interface DocumentContentData {
  content: string;
  mimeType?: string;
  mimetype?: string;
}

export interface GerekceContentData {
  gerekceId?: string;
  mevzuatId?: string;
  content: string;
  mimeType?: string;
  mimetype?: string;
}

export interface ArticleTreeData {
  children: MaddeNode[];
}

export interface SearchOutput {
  documents: MevzuatDocument[];
  totalRecords: number;
  requestedPage: number;
  pageSize: number;
  filteredTypes?: MevzuatTur[];
  error?: string;
}

export interface DocOutput {
  mevzuatId: string;
  markdownContent: string;
  mimeType: string;
}

export interface ArticleOutput {
  maddeId: string;
  markdownContent: string;
  mimeType: string;
}

export interface TreeOutput {
  mevzuatId: string;
  totalNodes: number;
  tree: MaddeNode[];
}

export interface GerekceOutput {
  gerekceId: string;
  mevzuatId?: string;
  markdownContent: string;
  mimeType: string;
}
