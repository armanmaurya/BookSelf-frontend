"use client";
import Image from "next/image";
import { IoPersonSharp } from "react-icons/io5";
import { FaPen } from "react-icons/fa6";
import { useRef, useState } from "react";
import AvatarEditor from "react-avatar-editor";
import { API_ENDPOINT } from "@/app/utils";

export const EditableProfilePicture = ({ src }: { src: string }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const editorRef = useRef<AvatarEditor>(null);

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImage(ev.target?.result as string);
        setEditorOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (editorRef.current) {
      const canvas = editorRef.current.getImageScaledToCanvas();
      canvas.toBlob(
        async (blob) => {
          if (blob) {
            // Prepare FormData for upload
            const formData = new FormData();
            formData.append("profile", blob, "profile.jpg");

            try {
              const response = await fetch(
                API_ENDPOINT.uploadProfilePicture.url,
                {
                  method: API_ENDPOINT.uploadProfilePicture.method,
                  body: formData,
                  credentials: "include",
                  
                },
                
              );
              if (!response.ok) throw new Error("Upload failed");
              // Optionally, get the new image URL from the response
              // const data = await response.json();
              // setPreview(data.url || URL.createObjectURL(blob));
              setPreview(URL.createObjectURL(blob));
            } catch (err) {
              // Optionally, show error feedback
              alert("Failed to upload profile picture.");
            }
          }
        },
        "image/jpeg",
        0.95
      );
      setEditorOpen(false);
    }
  };

  return (
    <div className="relative rounded-full flex-shrink-0 group w-32 h-32">
      <div className="border-2 border-neutral-200 dark:border-neutral-700 rounded-full w-full h-full overflow-hidden">
        {preview || src ? (
          <Image
            src={preview || src}
            alt="Profile picture"
            fill
            className="object-cover rounded-full overflow-hidden"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-neutral-100 dark:bg-neutral-800">
            <IoPersonSharp className="text-neutral-400 dark:text-neutral-500 text-4xl" />
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <button
        className="absolute left-1/2 bottom-0 -translate-x-1/2 bg-neutral-800 bg-opacity-90 rounded-full p-2 text-white hover:bg-neutral-700 transition-all transform hover:scale-105 shadow-md"
        type="button"
        onClick={handleEditClick}
        aria-label="Edit profile picture"
      >
        <FaPen size={14} />
      </button>

      {/* Enhanced Crop Editor Modal */}
      {editorOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-xl overflow-hidden w-full max-w-md">
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="text-lg font-medium text-neutral-900 dark:text-white">
                Edit Profile Picture
              </h3>
            </div>

            <div className="p-4 flex justify-center">
              <AvatarEditor
                ref={editorRef}
                image={image!}
                width={300}
                height={300}
                border={40}
                borderRadius={150}
                scale={scale}
                color={[30, 30, 30, 0.6]} // RGBA
                style={{ width: "100%", height: "auto" }}
              />
            </div>

            <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
              <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Zoom
                </label>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.1"
                  value={scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
                  onClick={() => setEditorOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                  onClick={handleSave}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
