import { useUpdateRecord } from "@/hooks/update-record";
import { getCroppedImg } from "@/lib/utils";
import { UserType } from "@/schemas";
import { Check, Edit, X } from "lucide-react";
import { useRef, useState } from "react";
import Cropper from "react-easy-crop";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import UserAvatar from "./user-avatar";

export default function ProfileImage({
  user,
  textColor,
}: {
  user: UserType;
  textColor?: string;
}) {
  console.log("🚀 ~ textColor:", textColor);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [tempAvatarUrl, setTempAvatarUrl] = useState<string | null>(null);
  const updateRecord = useUpdateRecord();

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const handleAvatarUpdate = async (newUrl: string) => {
    try {
      const file = fileInputRef.current?.files?.[0];
      if (!file) return;
      const formData = new FormData();
      formData.append("image", file);
      const res = await updateRecord.mutateAsync({
        model: "User",
        recordId: user?.id,
        data: formData,
      });
      console.log("🚀 ~ handleAvatarUpdate ~ res:", res);
      toast.success("Profile image updated successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error");
    } finally {
      user.image = newUrl;
      setIsEditingAvatar(false);
      setTempAvatarUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
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

        <div className="mt-4 sm:mt-0 sm:ml-2 mb-5">
          <Link to={`/profile/${user?.username}`}>
            <h1 className="text-xl font-bold capitalize rounded-t-sm px-2 bg-white">
              {user?.display_name || user?.username}
            </h1>
          </Link>
          <p className="text-gray-500 dark:text-gray-400 px-2">
            @{user?.username}
          </p>
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
