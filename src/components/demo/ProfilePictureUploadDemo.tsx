'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { userProfileService } from '@/lib/api';

export default function ProfilePictureUploadDemo() {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadResult, setUploadResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('Image size should be less than 5MB');
            return;
        }

        uploadProfilePicture(file);
    };

    const uploadProfilePicture = async (file: File) => {
        setIsUploading(true);
        setError(null);
        setUploadResult(null);

        try {
            const response = await userProfileService.updateProfilePicture(file);
            setUploadResult(`Profile picture uploaded successfully! URL: ${response.profilePictureUrl}`);

            // Clear the file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to upload profile picture');
        } finally {
            setIsUploading(false);
        }
    };

    const handleUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Profile Picture Upload Demo
            </h2>

            <p className="text-gray-600 mb-6">
                This demo showcases the profile picture upload functionality using the
                <code className="bg-gray-100 px-2 py-1 rounded">POST /api/user-profile/picture</code> API.
            </p>

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
            />

            {/* Upload button */}
            <Button
                onClick={handleUploadClick}
                disabled={isUploading}
                className="w-full mb-4"
            >
                {isUploading ? (
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Uploading...
                    </div>
                ) : (
                    'Select & Upload Image'
                )}
            </Button>

            {/* File requirements */}
            <div className="text-sm text-gray-500 mb-4">
                <p>• Supported formats: JPG, PNG, GIF, WebP</p>
                <p>• Maximum size: 5MB</p>
            </div>

            {/* Success message */}
            {uploadResult && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-md mb-4">
                    <p className="text-green-800 text-sm">{uploadResult}</p>
                </div>
            )}

            {/* Error message */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md mb-4">
                    <p className="text-red-800 text-sm">{error}</p>
                </div>
            )}

            {/* API endpoint info */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                <h3 className="font-semibold text-blue-900 mb-2">API Endpoint</h3>
                <p className="text-blue-800 text-sm">
                    <strong>POST</strong> /api/user-profile/picture
                </p>
                <p className="text-blue-700 text-xs mt-1">
                    Accepts multipart form data with an 'image' field containing the image file.
                </p>
            </div>
        </div>
    );
}
