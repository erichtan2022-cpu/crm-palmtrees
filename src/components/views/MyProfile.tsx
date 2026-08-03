import React, { useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { updateProfileAvatar } from '@/hooks/useData';
import { Camera, Mail, Shield, Check } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const ROLE_COLORS: Record<string, string> = {
  admin: '#2D5016',
  teacher: '#4A7C2F',
  staff: '#D2A679',
  parent: '#8B4513',
};

const MyProfile: React.FC = () => {
  const { currentUser, refreshUser } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  if (!currentUser) return null;

  const pickPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    handleUpload(file);
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    const url = await updateProfileAvatar(currentUser.id, file);
    setUploading(false);
    if (url) {
      await refreshUser();
      setPreview(null);
      toast.success('Profile photo updated!');
    } else {
      toast.error('Could not upload photo. Please try again.');
    }
  };

  const avatarSrc = preview || currentUser.avatar || `https://i.pravatar.cc/200?u=${encodeURIComponent(currentUser.email)}`;

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
        <h2 className="text-lg font-bold mb-6" style={{ color: '#2D5016' }}>My Profile</h2>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative shrink-0">
            <img
              src={avatarSrc}
              alt={currentUser.name}
              className="w-28 h-28 rounded-3xl object-cover ring-4 ring-stone-100 shadow-md"
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="absolute -bottom-2 -right-2 bg-green-800 text-white p-2.5 rounded-full shadow-lg hover:bg-green-900 transition disabled:opacity-60"
              title="Change photo"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={pickPhoto} className="hidden" />
          </div>

          <div className="flex-1 space-y-4 w-full">
            <div>
              <label className="text-xs font-medium text-stone-500 uppercase">Name</label>
              <div className="text-lg font-bold text-stone-800 mt-0.5">{currentUser.name}</div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-stone-500 uppercase">Email</label>
                <div className="text-sm text-stone-700 mt-0.5 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-stone-400" />
                  {currentUser.email}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-stone-500 uppercase">Role</label>
                <div className="mt-0.5 flex items-center gap-2">
                  <span
                    className="text-xs px-2.5 py-1 rounded-full font-medium text-white capitalize"
                    style={{ background: ROLE_COLORS[currentUser.role] || '#78716c' }}
                  >
                    {currentUser.role}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-stone-100">
          <div className="flex items-start gap-3 text-sm text-stone-600">
            <Shield className="w-5 h-5 text-green-800 shrink-0 mt-0.5" />
            <div>
              <span className="font-medium text-stone-800">Your photo is visible to your team.</span> Click the camera icon
              above your photo to upload a new one. The photo is stored securely and updates instantly across the CRM.
            </div>
          </div>
        </div>

        {uploading && (
          <div className="mt-4 flex items-center gap-2 text-sm text-green-800">
            <div className="w-4 h-4 rounded-full border-2 border-green-800 border-t-transparent animate-spin" />
            Uploading photo…
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
