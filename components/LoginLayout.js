import { useSession } from "next-auth/react";
import { useRouter } from "next/router";



export default function LoginLayout({children}) {
  const userID =  window.localStorage.getItem("UserId")
  const userRand =  window.localStorage.getItem("Randomword")
   const userName =  window.localStorage.getItem("userName")
    const {data: session, status} = useSession();

  //  console.log("seesion data", session)

    if (status === 'loading') {
           return <div className="full-h flex flex-center">
            <div className="loading-bar">Loading</div>
           </div>
    }

    const router = useRouter()

    if (!session && (userID || userRand)) {
       router.push('/auth/signin');
        return null;
    }

    if (!session && (!userID && !userRand)) {
       router.push('/auth/signup');
         return null;
     }

    if (session) {
     // console.log("Session", session)
        window.localStorage.setItem("UserEmail", session.user.email)
        window.localStorage.setItem("UserName",  session.user.name)
        window.localStorage.setItem("UserImage", session.user.image)
        return   <>
        
        {children}
        
        </>;
    }


}