// This file is meant to be used on the client side
import type { UseFormReturn } from 'react-hook-form';
import type { FieldValues } from 'react-hook-form';
import type { Toast } from '@/hooks/use-toast';

// Client-side authenticator for ImageKit
export const authenticator = async () => {
    try {
        const response = await fetch('/api/imagekit/auth');
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Request failed with status ${response.status}: ${errorText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("ImageKit Authentication request failed:", error);
        throw new Error(`Authentication request failed: ${error instanceof Error ? error.message : String(error)}`);
    }
};


export const onUploadError = (err: any, toast: ReturnType<typeof Toast>) => {
    console.error("Upload error:", err);
    toast({ variant: 'destructive', title: 'Upload Failed', description: err.message || 'There was an error uploading the image.' });
};

export const onUploadSuccess = <T extends FieldValues>(
    res: any,
    form: UseFormReturn<T>,
    urlField: keyof T,
    idField: keyof T,
    toast: ReturnType<typeof Toast>
) => {
    // Annoying that UseFormReturn doesn't have a generic `setValue` that can take a keyof T
    (form.setValue as any)(urlField, res.url);
    (form.setValue as any)(idField, res.fileId);
    toast({ title: 'Upload Success', description: 'Image has been uploaded.' });
};
