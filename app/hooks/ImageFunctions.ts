import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { uploadImageToFirebase } from './firebaseFunctions';


/**
 * 
 * @param storagePath 
 * @returns 
 */
const handleImageSelection = async (storagePath: string, userName: string) => {
    try {
      // Step 1: Pick an image
      const imageUri = await pickImage();
      if (!imageUri) return null;
  
      // Step 2: Save image locally
      const localPath = await saveImageLocally(imageUri, userName);
      if (!localPath) return null;
  
      // Step 3: Upload image to Firebase
      const downloadURL = await uploadImageToFirebase(localPath, storagePath);
  
      return { localPath, downloadURL };
    } catch (error) {
      console.error('Error handling image selection:', error);
      return null;
    }
  };

  /**
   * 
   * @param imageUri 
   * @returns 
   */
  const saveImageLocally = async (imageUri: string, userName: string): Promise<string | null> => {
    try {
      const fileName = `${userName}.png`;
      if (!fileName) return null;
  
      const localPath = `${FileSystem.documentDirectory}${fileName}`;
      
      // Copy image to local directory
      await FileSystem.copyAsync({ from: imageUri, to: localPath });
  
      console.log('Image saved locally at:', localPath);
      return localPath;
    } catch (error) {
      console.error('Error saving image locally:', error);
      return null;
    }
  };

  /**
   * 
   * @returns 
   */
  const pickImage = async (): Promise<string | null> => {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission denied');
      return null;
    }
  
    // Launch image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images', // Updated method
      allowsEditing: true,
      quality: 1,
    });
  
    if (!result.canceled && result.assets.length > 0) {
      return result.assets[0].uri; // Return the selected image URI
    }
  
    return null;
  };

/**
 * Get the local file path of a saved image.
 * @param fileName - The name of the image file (e.g., 'user_171234567890.jpg').
 * @returns The full file path.
 */
const getLocalImagePath = (fileName: string): string => {
    return `${FileSystem.documentDirectory}${fileName}`;
  };

const checkIfImageExists = async (fileName: string): Promise<boolean> => {
    const filePath = getLocalImagePath(fileName);
    const fileInfo = await FileSystem.getInfoAsync(filePath);
    return fileInfo.exists;
};

export {handleImageSelection, getLocalImagePath, checkIfImageExists};

const defaultValue = {

}
export default defaultValue;