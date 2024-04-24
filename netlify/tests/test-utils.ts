import type { Results, SendEmailParams } from '../../src/index.js';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

type Template = {
  id?: string;
  name?: string;
  template?: string;
};

type CreateRequestParams = {
  body?: Template | SendEmailParams | undefined;
  headers: Headers;
  method: Method;
  url: URL | string;
};

const createRequest = ({ body, headers, method, url }: CreateRequestParams): Request => {
  if (body) {
    return new Request(url, {
      method,
      headers,
      body: JSON.stringify(body),
    });
  } else {
    return new Request(url, {
      method,
      headers,
    });
  }
};

const createHeaders = (apiKey: string | undefined = process.env['API_KEY']): Headers => {
  const headers = new Headers();
  apiKey && headers.set('x-api-key', apiKey);
  headers.set('Content-Type', 'application/json');
  return headers;
};

type FunctionName = 'mailer' | 'template';
const FUNCTION_NAME = {
  mailer: 'mailer',
  template: 'template',
} as const satisfies Record<FunctionName, FunctionName>;

const createUrl = (functionName: FunctionName = FUNCTION_NAME.template) => {
  // NOTE: default port is 9999 from netlify, see the netlify.toml file
  const BASE_URL = process.env['URL'] || 'http://localhost:';
  const PORT = process.env['PORT'] || '9999';

  const path = `/.netlify/functions/${functionName}`;
  const url = new URL(path, `${BASE_URL}${BASE_URL.includes('localhost') ? PORT : ''}`);

  return url;
};

const deleteTemplateByName = async (name: string): Promise<Results> => {
  const url = createUrl();
  url.searchParams.set('name', name);
  const headers = createHeaders();
  const request = createRequest({ method: 'DELETE', headers, url });
  const response = await fetch(request);
  return (await response.json()) as Results;
};
const deleteTemplateById = async (id: string): Promise<Results> => {
  const url = createUrl();
  url.searchParams.set('id', id);
  const headers = createHeaders();
  const request = createRequest({ method: 'DELETE', headers, url });
  const response = await fetch(request);
  return (await response.json()) as Results;
};

const getTemplateById = async (id: string): Promise<Results> => {
  const url = createUrl();
  url.searchParams.set('id', id);
  const headers = createHeaders();
  const request = createRequest({ method: 'GET', headers, url });
  const response = await fetch(request);
  return (await response.json()) as Results;
};
const getTemplateByName = async (name: string): Promise<Results> => {
  const url = createUrl();
  url.searchParams.set('name', name);
  const headers = createHeaders();
  const request = createRequest({ method: 'GET', headers, url });
  const response = await fetch(request);
  return (await response.json()) as Results;
};
const postTemplate = async (name: string, template: string): Promise<Results> => {
  const url = createUrl();
  const headers = createHeaders();
  const request = createRequest({ method: 'POST', headers, url, body: { name, template } });
  const response = await fetch(request);
  return (await response.json()) as Results;
};
const putTemplateByName = async (name: string, template: string): Promise<Results> => {
  const url = createUrl();
  const headers = createHeaders();
  const request = createRequest({ method: 'PUT', headers, url, body: { name, template } });
  const response = await fetch(request);
  return (await response.json()) as Results;
};

const putTemplateById = async (id: string, template: string): Promise<Results> => {
  const url = createUrl();
  const headers = createHeaders();
  const request = createRequest({ method: 'PUT', headers, url, body: { id, template } });
  const response = await fetch(request);
  return (await response.json()) as Results;
};

/**
 * for send email function
 */
type SendEmailRequestParams = {
  body?: SendEmailParams;
  method?: Method;
  headers?: Headers;
};
const sendEmailRequest = async <TData>({
  body,
  headers,
  method = 'POST',
}: SendEmailRequestParams): Promise<{
  status: number;
  data: TData;
}> => {
  const url = createUrl(FUNCTION_NAME.mailer);
  const mergedHeaders = createHeaders();
  if (headers) {
    headers.forEach((value, key) => {
      mergedHeaders.set(key, value);
    });
  }
  const request = createRequest({ method: method, headers: mergedHeaders, url, body });
  const response = await fetch(request);
  return {
    status: response.status,
    data: (await response.json()) as TData,
  };
};

export {
  deleteTemplateByName,
  deleteTemplateById,
  getTemplateById,
  getTemplateByName,
  postTemplate,
  putTemplateByName,
  putTemplateById,
  sendEmailRequest,
};
