import { BaseClient } from "./base-client.js";
import { convertHtmlToMarkdown } from "../converters/html-to-markdown.js";
import type {
  MevzuatSearchRequest,
  ApiResponse,
  SearchResponseData,
  DocumentContentData,
  GerekceContentData,
  ArticleTreeData,
  MaddeNode,
  DocOutput,
  ArticleOutput,
  GerekceOutput,
} from "../types/mevzuat.js";

export class MevzuatClient extends BaseClient {
  constructor() {
    super("https://bedesten.adalet.gov.tr/mevzuat");
  }

  async searchDocuments(
    request: MevzuatSearchRequest
  ): Promise<ApiResponse<SearchResponseData>> {
    return this.post<ApiResponse<SearchResponseData>>(
      "/searchDocuments",
      request
    );
  }

  async getDocumentAsMarkdown(mevzuatId: string): Promise<DocOutput> {
    const body = {
      data: { documentType: "MEVZUAT", id: mevzuatId },
      applicationName: "UyapMevzuat",
    };

    const response = await this.post<ApiResponse<DocumentContentData>>(
      "/getDocumentContent",
      body
    );

    if (response.metadata?.FMTY !== "SUCCESS") {
      throw new Error(
        response.metadata?.FMTE ?? "Failed to fetch document content"
      );
    }

    const data = response.data;
    if (!data?.content) {
      throw new Error("No content returned from API");
    }

    const html = Buffer.from(data.content, "base64").toString("utf-8");
    const mimeType = data.mimeType ?? data.mimetype ?? "text/html";

    return {
      mevzuatId,
      markdownContent: convertHtmlToMarkdown(html),
      mimeType,
    };
  }

  async getArticleAsMarkdown(maddeId: string): Promise<ArticleOutput> {
    const body = {
      data: { documentType: "MADDE", id: maddeId },
      applicationName: "UyapMevzuat",
    };

    const response = await this.post<ApiResponse<DocumentContentData>>(
      "/getDocumentContent",
      body
    );

    if (response.metadata?.FMTY !== "SUCCESS") {
      throw new Error(
        response.metadata?.FMTE ?? "Failed to fetch article content"
      );
    }

    const data = response.data;
    if (!data?.content) {
      throw new Error("No content returned from API");
    }

    const html = Buffer.from(data.content, "base64").toString("utf-8");
    const mimeType = data.mimeType ?? data.mimetype ?? "text/html";

    return {
      maddeId,
      markdownContent: convertHtmlToMarkdown(html),
      mimeType,
    };
  }

  async getArticleTree(
    mevzuatId: string
  ): Promise<{ tree: MaddeNode[]; totalNodes: number }> {
    const body = {
      data: { mevzuatId },
      applicationName: "UyapMevzuat",
    };

    const response = await this.post<ApiResponse<ArticleTreeData>>(
      "/mevzuatMaddeTree",
      body
    );

    if (response.metadata?.FMTY !== "SUCCESS") {
      throw new Error(
        response.metadata?.FMTE ?? "Failed to fetch article tree"
      );
    }

    const data = response.data;
    const children = data?.children ?? [];

    return {
      tree: children,
      totalNodes: countNodes(children),
    };
  }

  async getGerekce(gerekceId: string): Promise<GerekceOutput> {
    const body = {
      data: { gerekceId },
      applicationName: "UyapMevzuat",
    };

    const response = await this.post<ApiResponse<GerekceContentData>>(
      "/getGerekceContent",
      body
    );

    if (response.metadata?.FMTY !== "SUCCESS") {
      throw new Error(
        response.metadata?.FMTE ?? "Failed to fetch gerekce content"
      );
    }

    const data = response.data;
    if (!data?.content) {
      throw new Error("No content returned from API");
    }

    const html = Buffer.from(data.content, "base64").toString("utf-8");
    const mimeType = data.mimetype ?? data.mimeType ?? "text/html";

    return {
      gerekceId,
      mevzuatId: data.mevzuatId,
      markdownContent: convertHtmlToMarkdown(html),
      mimeType,
    };
  }
}

function countNodes(nodes: MaddeNode[]): number {
  let count = 0;
  for (const node of nodes) {
    count += 1;
    if (node.children?.length) {
      count += countNodes(node.children);
    }
  }
  return count;
}
