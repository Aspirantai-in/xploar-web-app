import { userProfileService } from '../user-profile';
import { apiClient } from '../client';

// Mock the apiClient
jest.mock('../client', () => ({
    apiClient: {
        post: jest.fn(),
        get: jest.fn(),
        put: jest.fn(),
    },
}));

describe('UserProfileService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('updateProfilePicture', () => {
        it('should upload profile picture successfully', async () => {
            // Mock file
            const mockFile = new File(['test image content'], 'test-image.jpg', {
                type: 'image/jpeg',
            });

            // Mock API response
            const mockResponse = {
                success: true,
                message: 'Profile picture updated successfully',
                data: {
                    profilePictureUrl: 'https://example.com/profile-picture.jpg',
                },
                timestamp: '2025-01-15T10:00:00Z',
                requestId: 'req_123',
            };

            (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

            // Call the service
            const result = await userProfileService.updateProfilePicture(mockFile);

            // Verify the result
            expect(result).toEqual({
                profilePictureUrl: 'https://example.com/profile-picture.jpg',
            });

            // Verify API call
            expect(apiClient.post).toHaveBeenCalledWith(
                '/api/user-profile/picture',
                expect.any(FormData)
            );

            // Verify FormData content
            const formDataCall = (apiClient.post as jest.Mock).mock.calls[0];
            const formData = formDataCall[1] as FormData;
            expect(formData.get('image')).toBe(mockFile);
        });

        it('should handle API error', async () => {
            // Mock file
            const mockFile = new File(['test image content'], 'test-image.jpg', {
                type: 'image/jpeg',
            });

            // Mock API error response
            const mockErrorResponse = {
                success: false,
                message: 'File size too large',
                data: null,
                timestamp: '2025-01-15T10:00:00Z',
                requestId: 'req_123',
            };

            (apiClient.post as jest.Mock).mockResolvedValue(mockErrorResponse);

            // Call the service and expect it to throw
            await expect(
                userProfileService.updateProfilePicture(mockFile)
            ).rejects.toThrow('File size too large');
        });

        it('should handle network error', async () => {
            // Mock file
            const mockFile = new File(['test image content'], 'test-image.jpg', {
                type: 'image/jpeg',
            });

            // Mock network error
            const mockError = new Error('Network error');
            (apiClient.post as jest.Mock).mockRejectedValue(mockError);

            // Call the service and expect it to throw
            await expect(
                userProfileService.updateProfilePicture(mockFile)
            ).rejects.toThrow('Failed to update profile picture');
        });
    });
});
