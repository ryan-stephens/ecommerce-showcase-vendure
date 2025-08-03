import { InitialData, LanguageCode } from '@vendure/core';

export const initialData: InitialData = {
    defaultLanguage: LanguageCode.en,
    defaultZone: 'US',
    countries: [
        { name: 'United States', code: 'US', zone: 'US' },
        { name: 'Canada', code: 'CA', zone: 'US' },
        { name: 'United Kingdom', code: 'GB', zone: 'Europe' },
        { name: 'Germany', code: 'DE', zone: 'Europe' },
        { name: 'France', code: 'FR', zone: 'Europe' },
        { name: 'Australia', code: 'AU', zone: 'Oceania' },
    ],
    taxRates: [
        { name: 'Standard Tax', percentage: 8.5 },
        { name: 'Reduced Tax', percentage: 5 },
        { name: 'Zero Tax', percentage: 0 },
    ],
    shippingMethods: [
        { name: 'Standard Shipping', price: 500 }, // $5.00 in cents
        { name: 'Express Shipping', price: 1000 }, // $10.00 in cents
        { name: 'Free Shipping', price: 0 },
    ],
    paymentMethods: [
        {
            name: 'Standard Payment',
            handler: {
                code: 'dummy-payment-handler',
                arguments: [],
            },
        },
    ],
    collections: [
        {
            name: 'Electronics',
            slug: 'electronics',
            description: 'Electronic devices and gadgets',
            filters: [
                {
                    code: 'facet-value-filter',
                    args: [
                    ],
                },
            ],
        },
        {
            name: 'Clothing',
            slug: 'clothing',
            description: 'Apparel and fashion items',
            filters: [
                {
                    code: 'facet-value-filter',
                    arguments: [
                        {
                            name: 'facetValueNames',
                            value: '["clothing"]',
                        },
                        {
                            name: 'containsAny',
                            value: 'false',
                        },
                    ],
                },
            ],
        },
        {
            name: 'Home & Garden',
            slug: 'home-garden',
            description: 'Home improvement and garden supplies',
            filters: [
                {
                    code: 'facet-value-filter',
                    arguments: [
                        {
                            name: 'facetValueNames',
                            value: '["home-garden"]',
                        },
                        {
                            name: 'containsAny',
                            value: 'false',
                        },
                    ],
                },
            ],
        },
    ],
};
