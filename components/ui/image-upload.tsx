"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, Trash, Loader2 } from "lucide-react";
import Image from "next/image";
import { uploadImage } from "@/app/actions/analytics"; // Reusing existing action

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    disabled?: boolean;
}

export function ImageUpload({
    value,
    onChange,
    disabled
}: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);

    const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const result = await uploadImage(formData);
            if (result.success && result.url) {
                onChange(result.url);
            } else {
                console.error("Upload failed", result.error);
                // Optionally show error toast here but parent context might be better
            }
        } catch (error) {
            console.error("Upload error", error);
        } finally {
            setIsUploading(false);
        }
    };

    const onRemove = () => {
        onChange("");
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-4">
                {value && (
                    <div className="relative h-[200px] w-[200px] overflow-hidden rounded-md">
                        <div className="absolute top-2 right-2 z-10">
                            <Button
                                type="button"
                                onClick={onRemove}
                                variant="destructive"
                                size="icon"
                            >
                                <Trash className="h-4 w-4" />
                            </Button>
                        </div>
                        <Image
                            fill
                            className="object-cover"
                            alt="Image"
                            src={value}
                        />
                    </div>
                )}
                {(!value || value === "") && (
                    <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-border rounded-lg hover:bg-muted/30 transition min-h-[200px] min-w-[200px]">
                        <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                {isUploading ? (
                                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                ) : (
                                    <ImagePlus className="w-8 h-8 text-muted-foreground mb-2" />
                                )}
                                <p className="mb-2 text-sm text-foreground">
                                    <span className="font-semibold text-primary">Clique para enviar</span>
                                </p>
                                <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF</p>
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={onUpload}
                                disabled={disabled || isUploading}
                            />
                        </label>
                    </div>
                )}
            </div>
        </div>
    );
}
