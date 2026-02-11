'use client';

import { useEffect } from 'react';
import { incrementPageView } from '@/app/actions/analytics';

export function AnalyticsTracker() {
    useEffect(() => {
        // Fire pageview on mount (only once per session/visit simulation ideally, but simple here)
        incrementPageView();
    }, []);

    return null; // Renderless component
}
