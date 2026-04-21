import React, { useEffect, useRef, useState } from "react";
import { ETargetObject } from "../types/Company";
import { Avatar } from "./avatar";
import { useQuery } from "@tanstack/react-query";
import { currentUserQuery } from "../reactQuery/userQuery";
import { CustomLoader } from "./customLoader";

interface Props {
  previewURL: string | null;
  targetType: ETargetObject;
  selectedFile: File | null;
  onChangeSelectedFile: (value: File | null) => void;
  onChangePreviewURL: (value: string | null) => void;
}

export const UploadAvatarOrLogo: React.FC<Props> = ({
  previewURL,
  targetType,
  selectedFile,
  onChangePreviewURL,
  onChangeSelectedFile,
}) => {
  const [currentPicture, setCurrentPicture] = useState("");
  const { data: currentUser, isLoading } = useQuery(currentUserQuery);
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

  useEffect(() => {
    switch (targetType) {
      case ETargetObject.User:
        setCurrentPicture(
          currentUser?.avatar ?? "https://i.imgur.com/aX3x1wT.png"
        );
        break;
      case ETargetObject.Company:
        // setCurrentPicture(
        //   currentCompany?.logotype || "https://i.imgur.com/5MRjPJ9.png"
        // );
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    <CustomLoader loaderSize={10} paddingY={10} />;
  }

  return (
    <>
      <Avatar
        size={150}
        source={previewURL || currentPicture || ""}
        altText="avatar"
      />
      {selectedFile && (
        <button
          onClick={handleCancelUpload}
          className="pointer w-10 h-10 bg-slate-700 rounded-full p-2 absolute 
      left-0 top-[100px] border-2 border-slate-500"
        >
          <img src="https://i.imgur.com/KpD60ma.png" alt="Cancel Upload" />
        </button>
      )}
      <div className="relative">
        <button
          onClick={handleClick}
          className="pointer w-12 h-12 bg-sky-600 rounded-full p-2 absolute right-2 top-5"
        >
          <img src="https://i.imgur.com/ccmMXRa.png" alt="Upload Icon" />
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
