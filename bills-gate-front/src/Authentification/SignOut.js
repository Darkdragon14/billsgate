import * as React from 'react';
import { useLogto } from '@logto/react';

export default function SignOut() {
  const { signOut } = useLogto();

  return (
    <button onClick={() => signOut('http://172.23.155.94:3000/login')}>
      Sign out
    </button>
  );
}