import { populate } from '@vendure/core/cli';
import { bootstrap } from '@vendure/core';
import { config } from './vendure-config';
import * as path from 'path';

/**
 * This script populates the Vendure database with official test data from @vendure/create.
 * This includes professional product catalog, images, and complete e-commerce setup.
 * 
 * Based on official Vendure documentation:
 * https://docs.vendure.io/guides/developer-guide/importing-data/#populating-test-data
 */
async function populateDatabase() {
    console.log('🚀 Starting database population with official Vendure test data...');
    
    try {
        console.log('📦 Using official @vendure/create test data assets...');
        console.log('🖼️  This includes professional product images and realistic data');
        
        // Create a modified config for population
        const populateConfig = {
            ...config,
            // Use port 3005 to avoid conflict with running server on port 3000
            apiOptions: {
                ...config.apiOptions,
                port: 3005,
            },
            // Enable asset importing from @vendure/create
            importExportOptions: {
                importAssetsDir: path.join(
                    require.resolve('@vendure/create/assets/products.csv'),
                    '../images'
                ),
            },
            // Ensure database synchronization during population
            dbConnectionOptions: {
                ...config.dbConnectionOptions,
                synchronize: true
            }
        };
        
        // Populate with official Vendure test data
        const app = await populate(
            () => bootstrap(populateConfig),
            require('@vendure/create/assets/initial-data.json'),
            require.resolve('@vendure/create/assets/products.csv')
        );
        
        console.log('✅ Database population completed successfully!');
        console.log('🏪 Your Vendure store now has:');
        console.log('   - Complete product catalog with professional images');
        console.log('   - Countries, zones, and tax rates configured');
        console.log('   - Shipping methods and payment options set up');
        console.log('   - Product collections and categories');
        console.log('   - Realistic inventory and pricing');
        console.log('   - Administrator roles and permissions');
        console.log('');
        console.log('🎉 You can now access your admin panel and see the populated data!');
        console.log('Admin URL: https://g08o44oc8w4ks0ww84k88c88.greatplainsgrowery.com:3001/admin');
        console.log('');
        console.log('📝 Note: You may need to rebuild the search index in the admin UI');
        console.log('   Go to Products → Click the three dots next to search → Rebuild index');
        
        // Close the application
        await app.close();
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Error populating database:', error);
        console.error('');
        console.error('💡 Troubleshooting tips:');
        console.error('   - Ensure your database is empty (drop all tables)');
        console.error('   - Check database connection settings');
        console.error('   - Verify @vendure/create is installed');
        process.exit(1);
    }
}

// Run the population script
populateDatabase();
