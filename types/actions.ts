/** Solana Actions (Blinks) response types per spec */

export interface ActionParameter {
  name: string;
  label: string;
  required?: boolean;
}

export interface ActionLink {
  label: string;
  href: string;
  parameters?: ActionParameter[];
}

export interface ActionGetResponse {
  type: "action";
  title: string;
  description: string;
  icon?: string;
  label?: string;
  links?: ActionLink[];
  links_v2?: ActionLink[];
}

export interface ActionPostRequest {
  account: string[];
  data?: Record<string, unknown>;
}

export interface ActionPostResponse {
  transaction: string; // base64
  message?: string;
  redirect?: string;
}

export interface ActionError {
  message: string;
}
