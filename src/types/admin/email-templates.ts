export interface TemplateVariable {
  key: string;
  description: string;
  example: string;
}

export interface EmailTemplate {
  id?: string;
  key: string;
  name: string;
  subject: string;
  body: string;
  variables: TemplateVariable[];
  updatedAt?: string;
}
