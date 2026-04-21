import React, { useRef } from "react";
import { Avatar } from "./avatar";
import defaultPicture from '../assets/images/item_company_icon_default.png';
import addPicture from '../assets/images/add_picture.png';
import cancelPicture from "../assets/images/cancel_upload.png";

interface Props {
  previewURL: string | null;
  selectedFile: File | null;
  onChangeSelectedFile: (value: File | null) => void;
  onChangePreviewURL: (value: string | null) => void;
}

export const UploadLogoToNewCompany: React.FC<Props> = ({
  previewURL,
  selectedFile,
  onChangePreviewURL,
  onChangeSelectedFile,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleCancelUpload = () => {
    onChangeSelectedFile(null);
    onChangePreviewURL(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      onChangeSelectedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        onChangePreviewURL(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };


  return (
    <>
      <Avatar
        size={150}
        source={previewURL || defaultPicture}
        altText="avatar"
        padding={20}
      />
      {selectedFile && (
        <button
          onClick={handleCancelUpload}
          className="pointer w-10 h-10 bg-slate-700 rounded-full p-2 absolute 
      left-0 top-[100px] border-2 border-slate-500"
        >
          <img src={cancelPicture} alt="Cancel Upload" />
        </button>
      )}
      <div className="relative">
        <button
          onClick={handleClick}
          className="pointer w-12 h-12 bg-sky-600 rounded-full p-2 absolute right-2 top-5"
        >
          <img src={addPicture} alt="Upload Icon" />
        </button>
        <input
          type="file"
          accept="image/jpeg, image/png"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </div>
    </>
  );
};
