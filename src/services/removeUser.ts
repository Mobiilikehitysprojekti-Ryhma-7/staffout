import { auth } from '../config/firebaseConfig';
import { deleteUser } from 'firebase/auth';

export async function removeUser() {
const user = auth.currentUser;
if (user) {
deleteUser(user).then(() => {
  console.log("User deleted successfully");
}).catch((error) => {
  console.error("Error deleting user:", error);
});
}
}