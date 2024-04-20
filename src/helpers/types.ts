/**
 * table schema
 */
export type Template = {
  id: number;
  name: string;
  template: string;
  created_at: Date;
  updated_at: Date;
};

/**
 * input for creating a template
 */
export type TemplateInput = Pick<Template, 'name' | 'template'>;
