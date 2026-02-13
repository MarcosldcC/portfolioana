"use client";

import { useEffect } from "react";

interface ThemeStylesProps {
    theme?: {
        colors?: Record<string, string>;
        sections?: Record<string, any>;
    };
}

export function ThemeStyles({ theme }: ThemeStylesProps) {
    if (!theme || !theme.colors) return null;

    const { colors } = theme;

    const cssVariables = Object.entries(colors)
        .map(([key, value]) => `--color-${key}: ${value};`)
        .join("\n");

    return (
        <style dangerouslySetInnerHTML={{
            __html: `
        :root {
          ${cssVariables}
        }
      `
        }} />
    );
}
