import { useEffect } from 'react';
import { useSignInMutation } from '../redux/apis/auth.api';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const DemoAutoLogin = () => {
  const [signIn] = useSignInMutation();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {

    if (!user) {
      const autoLogin = async () => {
        try {
          await signIn({
            email: 'demo@energy-platform.com',
            password: 'password123'
          }).unwrap();
          console.log('Demo user auto-logged in successfully');
        } catch (error) {
          console.error('Auto-login failed:', error);
        }
      };


      const timer = setTimeout(autoLogin, 1000);
      return () => clearTimeout(timer);
    }
  }, [signIn, user]);

  return null;
};

export default DemoAutoLogin;