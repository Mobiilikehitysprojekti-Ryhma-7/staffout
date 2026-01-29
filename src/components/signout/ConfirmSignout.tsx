import { Alert } from 'react-native';
import { handleSignOut } from '@/src/services/auth/auth.service';
export default function ConfirmSignout() {
  return (
    Alert.alert('Kirjaudu ulos', 'Haluatko varmasti kirjautua ulos?', [
         {
           text: 'Peruuta',
           style: 'cancel',
         },
         {text: 'OK', onPress: () => handleSignOut()},
    ])
  );
}
