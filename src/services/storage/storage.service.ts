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
  return data.publicUrl + '?t=' + Date.now();
}

export const uploadOrganizationAvatar = async (base64: any, oid: string) => {
  const avatar = decode(base64);
  const { data, error } = await supabase
    .storage
    .from('organizations')
    .upload(`${oid}.jpg`, avatar, {
      contentType: 'image/jpeg',
      cacheControl: '3600',
      upsert: true,
    });
  if (error) throw new Error(error.message);
  return data;
};

export const getOrganizationAvatarURL = async (path: string) => {
  const { data } = supabase
    .storage
    .from('organizations')
    .getPublicUrl(path)
  return data.publicUrl + '?t=' + Date.now();
}

export const uploadBenefitImage = async (base64: any, benefitId: string) => {
  const avatar = decode(base64);
  const { data, error } = await supabase
    .storage
    .from('benefits')
    .upload(`${benefitId}.jpg`, avatar, {
      contentType: 'image/jpeg',
      cacheControl: '3600',
      upsert: true,
    });

  if (error) throw new Error(error.message);
  return data;
};

export const getBenefitImageURL = async (path: string) => {
  const { data } = supabase
    .storage
    .from('benefits')
    .getPublicUrl(path)
  return data.publicUrl + '?t=' + Date.now();
}

export const uploadMessageImage = async (base64: any, messageId: string) => {
  const avatar = decode(base64);
  const { data, error } = await supabase
    .storage
    .from('messages')
    .upload(`${messageId}.jpg`, avatar, {
      contentType: 'image/jpeg',
      cacheControl: '3600',
      upsert: true,
    });

  if (error) throw new Error(error.message);
  return data;
};

export const getMessageImageURL = async (path: string) => {
  const { data } = supabase
    .storage
    .from('messages')
    .getPublicUrl(path)
  return data.publicUrl + '?t=' + Date.now();
}
