import 'i18next';
import type common from '../locales/ru/common.json';
import type home from '../locales/ru/home.json';
import type catalog from '../locales/ru/catalog.json';
import type products from '../locales/ru/products.json';
import type test from '../locales/ru/test.json';

export interface Resources {
  common: typeof common;
  home: typeof home;
  catalog: typeof catalog;
  products: typeof products;
  test: typeof test;
}

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: Resources;
  }
}
