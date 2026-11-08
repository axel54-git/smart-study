/**
 * Utility for uploading images to ImgBB using the user's provided API key
 */
const IMGBB_API_KEY = 'eed7e072178a2e50be65f2f9c38d40b4';

export const uploadToImgBB = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn('ImgBB API returned non-OK response:', response.status, errText);
      throw new Error(`Upload failed with status ${response.status}`);
    }

    const data = await response.json();
    if (data && data.success && data.data) {
      return data.data.display_url || data.data.url;
    }

    throw new Error(data?.error?.message || 'Failed to parse ImgBB response');
  } catch (error) {
    console.error('Error uploading to ImgBB, falling back to local data URL:', error);
    // Graceful fallback to client-side data URL so the user is never blocked
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to read file locally'));
        }
      };
      reader.onerror = () => reject(new Error('File reading error'));
      reader.readAsDataURL(file);
    });
  }
};
