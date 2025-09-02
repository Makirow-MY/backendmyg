// pages/auth/signin.js
import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast, { ToastBar } from "react-hot-toast";


export default function signin() {
  
   const {data: session, status} = useSession();
  const [form, setForm]  = useState({
    email: '',
    password:'',
    fullName: ""
  });
  const router = useRouter();

  const [emailErr, setEmailErr] = useState("")
  const [passErr, setPassErr] = useState("")
 const [Loading, setLoading] = useState(false)
 useEffect(()=>{
  if (status == 'authenticated') {
     router.push("/")
  }
   }, [status, router])

  const handleOnchange = (e) =>{
       setForm({
        ...form,
         [e.target.name]: e.target.value
       })
  }
 const  email = window.localStorage.getItem("UserEmail");
 const name = window.localStorage.getItem("UserName");
 const image = window.localStorage.getItem("UserImage")
  const handleSubmit = async (e) =>{

     e.preventDefault();
setLoading(true)
   
      
      if ( form.email === ""  || form.password === "") {
    
             if ( form.email === ""  && form.password === "") {
          setEmailErr("Email Adress is Missing")
          setPassErr("Password is Missing")
          setTimeout(() => {
            setEmailErr("")
            setPassErr("")
          }, 2000);
        }
     
      else  if (form.email === "") {
        setEmailErr("Email Adress is Missing")
        setTimeout(() => {
          setEmailErr("")
        }, 2000);
    }
  
    else  if (form.password === "") {
      setPassErr("Password is Missing")
      setTimeout(() => {
        setPassErr("")
      }, 2000);
  }
  toast.dismiss()
  toast.error("All Information Must Be Provided")
  

  return
        }
  

        toast.loading("Verifying Credentials")
    
setTimeout(async () => {
 
 
    try {


      const result = await signIn('credentials', {
        redirect: false,
        email: form.email,
        password: form.password
      })

      if (!result.error) {
      

        toast.dismiss()
        window.localStorage.setItem("UserEmail");
        toast.success(`Welcome Back ${form.email}`)
         router.push("/")
      }
      else{
        toast.dismiss()
        toast.error("Invalid Credentials, check again")
      }
     } catch (error) {
       toast.dismiss()
       toast.error(error.message)
     }

}, 3000);

  }
  return (
    <>
    <div className="overflow-hidden ">
    <div className="loginform">
      <div className="heading">Login Admin</div>
    
    <form className="form" onSubmit={handleSubmit}>
      
        <input name="email" value={form.email} onChange={(e) => handleOnchange(e)} type="email" placeholder="Email Address" className={`input ${emailErr === "" ? "" : "error"}`}  />
        {
       emailErr !== "" &&  ( <p className="err">{emailErr}</p>)
     }
        <input name="password" value={form.password} onChange={(e) => handleOnchange(e)} type="password" placeholder="Password" className={`input ${passErr === "" ? "" : "error"}`}  />
        {
       passErr !== "" &&  ( <p className="err">{passErr}</p>)
     }
        <button type="submit" className="login-button">Login</button>
        <p  className="opti">Don't yet have an admin account? <a onClick={() =>{
          window.localStorage.removeItem("Randomword")
        }} href="/auth/signup">Sign up</a></p>
    </form>
    </div>
    </div>
   
    </>
  );
}
