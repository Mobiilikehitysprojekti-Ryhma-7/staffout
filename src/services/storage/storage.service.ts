import { supabase } from '../../config/supabaseConfig';
import { auth } from '../../config/firebaseConfig';
import { decode } from 'base64-arraybuffer';

export const uploadAvatar = async (base64: any) => {
  const uid = auth.currentUser?.uid;
    const avatar = decode(base64);
  const { data, error } = await supabase
    .storage
    .from('avatars')
    .upload(`${uid}.jpg`, avatar, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
        upsert: true,
    });
  if (error) throw new Error(error.message);
  return data;
};

export const getAvatarURL = async (path: string) => {
  const { data } = supabase
  .storage
  .from('avatars')
  .getPublicUrl(path)
  return data.publicUrl+'?t='+Date.now(); 
}
