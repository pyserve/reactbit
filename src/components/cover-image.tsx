import { getCroppedImg } from "@/lib/utils";
import { UserType } from "@/schemas";
import { useRef, useState } from "react";
import Cropper from "react-easy-crop";

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
      <div className="relative" style={{ overflow: "visible" }}>
        <div
          className="h-48 md:h-64 w-full bg-gray-200 dark:bg-gray-800 overflow-hidden cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <img
            src={finalCover || user?.cover || "/"}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        </div>

        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </div>

      {/* Cropper Modal */}
      {isEditingCover && tempImageUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="relative w-[90vw] h-[60vh] bg-white p-4 rounded shadow-md flex flex-col items-center">
            <div className="relative w-full h-full">
              <Cropper
                image={tempImageUrl}
                crop={crop}
                zoom={zoom}
                aspect={3 / 1} // Adjust aspect ratio if needed
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, croppedPixels) =>
                  setCroppedAreaPixels(croppedPixels)
                }
              />
            </div>
            <div className="flex gap-4 mt-4">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={handleCropConfirm}
              >
                Confirm
              </button>
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded"
                onClick={() => {
                  setIsEditingCover(false);
                  setTempImageUrl(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoverPhoto;
