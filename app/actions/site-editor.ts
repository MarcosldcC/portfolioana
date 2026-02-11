'use server';

import fs from 'fs/promises';
import path from 'path';

const DATA_FILE_PATH = path.join(process.cwd(), 'app/data/site-content.json');

export async function getSiteContent() {
    try {
        const fileContent = await fs.readFile(DATA_FILE_PATH, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error('Error reading site content:', error);
        return null;
    }
}

export async function updateSiteContent(newData: any) {
    try {
        await fs.writeFile(DATA_FILE_PATH, JSON.stringify(newData, null, 2), 'utf-8');
        return { success: true };
    } catch (error) {
        console.error('Error updating site content:', error);
        return { success: false, error: (error as Error).message };
    }
}
