"use client";

import Register from "@/app/authentication/components/Register";
import Background from "@/app/components/background";
import { Footer } from "@/app/components/Footer";
import AuthProvider from "@/app/hooks/AuthProvider";

export default function Page() {
  return (
    <>
      <Background />
      <AuthProvider>
        <Register />

        <div className='footer'>
          <Footer />
        </div>
      </AuthProvider>
    </>
  );
}
