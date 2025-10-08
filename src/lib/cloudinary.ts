
import { Readable } from 'stream';

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export interface CloudinaryUploadOptions {
  folder?: string;
  transformation?: any;
  public_id?: string;
  overwrite?: boolean;
  resource_type?: 'image' | 'video' | 'raw' | 'auto';
}


export const uploadImageCloudinary = async (file : any, setIsLoading : any) => {
    console.log(setIsLoading, 'set loaidng')
    if (file) {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "mernchatapp");
      formData.append("cropping", true);
      try {
        const result = await fetch(
          `https://api.cloudinary.com/v1_1/daadraj4k/image/upload/`,
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await result.json();
        setIsLoading(false);
        console.log(data, "res from coudinary");
        return data.secure_url;
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    }
  };

