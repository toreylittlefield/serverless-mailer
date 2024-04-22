import type { ResultSet } from '@libsql/client';

type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

/**
 * table schema
 */
export type Template = {
  id: number;
  name: string;
  template: string;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * input for creating a template
 */
export type TemplateInput = Pick<Template, 'name' | 'template'>;

/**
 * response from executing a query on the Templates table
 */
export type Results = Prettify<
  Omit<ResultSet, 'rows' | 'lastInsertRowid'> & {
    lastInsertRowid: number | undefined;
    rows: Template[];
  }
>;
