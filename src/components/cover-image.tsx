import { getCroppedImg } from "@/lib/utils";
import { UserType } from "@/schemas";
import { Check, X } from "lucide-react";
import { useRef, useState } from "react";
import Cropper from "react-easy-crop";
import { Button } from "./ui/button";

const CoverPhoto = ({ user }: { user: UserType }) => {
  const [isEditingCover, setIsEditingCover] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [finalCover, setFinalCover] = useState<string | null>(null);

  const handleCoverPhotoUpdate = (newCoverUrl: string) => {
    setFinalCover(newCoverUrl);
    setIsEditingCover(false);
    setTempImageUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImageUrl(reader.result as string);
        setIsEditingCover(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropConfirm = async () => {
    if (!tempImageUrl || !croppedAreaPixels) return;
    const croppedImage = await getCroppedImg(tempImageUrl, croppedAreaPixels);
    handleCoverPhotoUpdate(croppedImage);
  };

  return (
    <div>
      <div className="relative " style={{ overflow: "visible" }}>
        <div
          className="relative h-48 md:h-64 w-full overflow-hidden cursor-pointer group"
          onClick={() => fileInputRef.current?.click()}
        >
          <img
            src={finalCover || user?.cover || "/"}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-0 w-[150px] h-[30px] bg-gray-800 bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-white text-xs">Click to Edit Cover</span>
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

      {isEditingCover && tempImageUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="relative w-[90vw] h-[60vh] bg-white p-4 rounded shadow-md flex flex-col items-center">
            <div className="relative w-full h-full">
              <Cropper
                image={tempImageUrl}
                crop={crop}
                zoom={zoom}
                aspect={3 / 1}
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
                <Check /> Confirm
              </Button>
              <Button
                className="px-4 py-2"
                onClick={() => {
                  setIsEditingCover(false);
                  setTempImageUrl(null);
                }}
              >
                <X /> Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoverPhoto;
