import { getCroppedImg } from "@/lib/utils";
import { UserType } from "@/schemas";
import { Check, Edit, X } from "lucide-react";
import { useRef, useState } from "react";
import Cropper from "react-easy-crop";
import { Button } from "./ui/button";
import UserAvatar from "./user-avatar";

export default function ProfileImage({ user }: { user: UserType }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [tempAvatarUrl, setTempAvatarUrl] = useState<string | null>(null);
  const [finalAvatar, setFinalAvatar] = useState<string | null>(null);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const handleAvatarUpdate = (newUrl: string) => {
    setFinalAvatar(newUrl);
    user.image = newUrl;
    setIsEditingAvatar(false);
    setTempAvatarUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempAvatarUrl(reader.result as string);
        setIsEditingAvatar(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropConfirm = async () => {
    if (!tempAvatarUrl || !croppedAreaPixels) return;
    const croppedImage = await getCroppedImg(tempAvatarUrl, croppedAreaPixels);
    handleAvatarUpdate(croppedImage);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-end">
        <div
          className="relative bg-amber-100 rounded-full group w-[125px] h-[125px] cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <UserAvatar user={user} size={125} />

          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-black text-white bg-opacity-40 flex items-center justify-center rounded-b-full opacity-0 group-hover:opacity-75 transition-opacity duration-300">
            <div className="flex items-center gap-1 text-xs">
              <Edit size={13} />
              <span>Edit Profile</span>
            </div>
          </div>

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </div>

        <div className="mt-4 sm:mt-0 sm:ml-4 mb-5">
          <h1 className="text-2xl font-bold capitalize">
            {user?.display_name || user?.username}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">@{user?.username}</p>
        </div>
      </div>

      {/* Crop Modal */}
      {isEditingAvatar && tempAvatarUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="relative w-[90vw] max-w-md h-[60vh] bg-white p-4 rounded shadow-md flex flex-col items-center">
            <div className="relative w-full h-full">
              <Cropper
                image={tempAvatarUrl}
                crop={crop}
                zoom={zoom}
                aspect={1 / 1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, croppedPixels) =>
                  setCroppedAreaPixels(croppedPixels)
                }
              />
            </div>
            <div className="flex gap-4 mt-4">
              <Button
                className="px-4 py-2 bg-green-600"
                onClick={handleCropConfirm}
              >
                <Check className="mr-1" size={16} /> Confirm
              </Button>
              <Button
                className="px-4 py-2"
                onClick={() => {
                  setIsEditingAvatar(false);
                  setTempAvatarUrl(null);
                }}
              >
                <X className="mr-1" size={16} /> Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
