'use server';

import fs from 'fs/promises';
import path from 'path';

// --- ANALYTICS ---

const ANALYTICS_FILE = path.join(process.cwd(), 'app/data/analytics.json');
const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads');

export async function incrementPageView() {
    try {
        const data = await getAnalytics();
        data.pageViews += 1;
        data.uniqueVisitors += Math.random() > 0.8 ? 1 : 0; // Simple simulation for uniques
        await fs.writeFile(ANALYTICS_FILE, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Error tracking page view:', err);
    }
}

export async function incrementClick(type: 'cta' | 'project' | 'contact') {
    try {
        const data = await getAnalytics();
        switch (type) {
            case 'cta':
                data.ctaClicks += 1;
                break;
            case 'project':
                data.projectClicks += 1;
                break;
            case 'contact':
                data.contactClicks += 1;
                break;
        }
        await fs.writeFile(ANALYTICS_FILE, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Error tracking click:', err);
    }
}

export async function getAnalytics() {
    try {
        const content = await fs.readFile(ANALYTICS_FILE, 'utf-8');
        return JSON.parse(content);
    } catch (err) {
        // If file doesn't exist or is corrupt, return defaults
        return {
            pageViews: 0,
            uniqueVisitors: 0,
            ctaClicks: 0,
            projectClicks: 0,
            contactClicks: 0,
            recentActivity: []
        };
    }
}

// --- UPLOADS (MOCK FUNCTION FOR BUCKET ) ---

export async function uploadImage(formData: FormData) {
    try {
        const file = formData.get('file') as File;
        if (!file) {
            throw new Error('No file uploaded');
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        // Create meaningful filename
        const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;

        // In production (AWS S3 / R2):
        // await s3.putObject({ Bucket: '...', Key: filename, Body: buffer });
        // const url = `https://bucket-url/${filename}`;

        // LOCAL FALLBACK (Simulation):
        const filePath = path.join(UPLOAD_DIR, filename);
        await fs.writeFile(filePath, buffer);
        const url = `/uploads/${filename}`;

        return { success: true, url };
    } catch (error) {
        console.error('Upload error:', error);
        return { success: false, error: 'Failed to upload image' };
    }
}
