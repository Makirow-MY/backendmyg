// pages/auth/signup.js

import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast, { ToastBar } from "react-hot-toast";


export default function SignUp() {

  const {data: session, status} = useSession()
  const [form, setForm]  = useState({
    email: '',
    password:'',
    fullName: "",
    phoneNumber: '',
    Country: '',
  });
  const router = useRouter();

  const [nameErr, setNameErr] = useState("")
  const [emailErr, setEmailErr] = useState("")
  const [passErr, setPassErr] = useState("")
    const [phoneNumberErr, setphoneNumberErr] = useState("")
  const [CountryErr, setCountryErr] = useState("")

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

  const handleSubmit = async (e) =>{
     e.preventDefault();
toast.loading("Creating User...")
     setTimeout(() => {
      
      if (form.fullName === ""  || form.email === ""  || form.password === "") {
     
        if (form.fullName === ""  && form.email === ""  && form.password === "") {
          setNameErr("Full Name Is Missing!")
          setEmailErr("Email Adress is Missing")
          setPassErr("Password is Missing")
          setTimeout(() => {
            setNameErr("")
            setEmailErr("")
            setPassErr("")
          }, 2000);
        }
      else if (form.fullName === "") {
          setNameErr("Full Name Is Missing!")
          setTimeout(() => {
            setNameErr("")
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
  
        }
  

     }, 5000);
    

  const res = await fetch(`/api/auth/signup`, {
    method: 'POST',
    headers: {'Content-type':'application/json'},
    body: JSON.stringify({
      email: form.email,
      password: form.password,
      fullName: form.fullName,
      Country: form.Country,
      phoneNumber: form.phoneNumber,
      image: `https://ui-avatars.com/api/?name=${encodeURIComponent(form.fullName)}&background=random`
      
      //`https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/${Math.floor(Math.random() * 99)}.jpg`
  })
  })

  const data = await res.json();
  if (data.error && !data.success) {
    toast.dismiss()
     toast.error(data.message)
  }

  else{
    toast.dismiss()
    toast.success(data.message)
      window.localStorage.setItem("UserId", data.data.id)
        window.localStorage.setItem("UserEmail", data.data.email);
window.localStorage.setItem("UserName", data.data.fullname);
 window.localStorage.setItem("UserImage", data.data.image)
//  window.localStorage.setItem("UserId", data.data.id)
     
      router.push("/auth/signin")
  }


    

}
  
  return (
    <div  style={{height: '100vh',width: '100%',  padding: '0px', margin: 0}}>
    <div className="loginform">
      <div className="heading">Sign Up Create Admin</div>
    
    <form className="form" onSubmit={handleSubmit}>
        <input name="fullName" value={form.fullName} onChange={(e) => handleOnchange(e)} type="text" placeholder="Full Name" className={`input ${nameErr === "" ? "" : "error" }`}  />
     {
       nameErr !== "" &&  ( <p className="err">{nameErr}</p>)
     } 
        <input name="email" value={form.email} onChange={(e) => handleOnchange(e)} type="email" placeholder="Email Address" className={`input ${emailErr === "" ? "" : "error"}`}  />
        {
       emailErr !== "" &&  ( <p className="err">{emailErr}</p>)
     }
        <input name="password" value={form.password} onChange={(e) => handleOnchange(e)} type="password" placeholder="Password" className={`input ${passErr === "" ? "" : "error"}`}  />
        {
       passErr !== "" &&  ( <p className="err">{passErr}</p>)
     }
      <input name="phoneNumber" value={form.phoneNumber} onChange={(e) => handleOnchange(e)} type="text" placeholder="Phone Number" className={`input ${phoneNumberErr === "" ? "" : "error" }`}  />
     {
       phoneNumberErr !== "" &&  ( <p className="err">{phoneNumberErr}</p>)
     } 
       <input name="Country" value={form.Country} onChange={(e) => handleOnchange(e)} type="text" placeholder="Country" className={`input ${CountryErr === "" ? "" : "error" }`}  />
     {
      CountryErr !== "" &&  ( <p className="err">{CountryErr}</p>)
     } 
        <button type="submit" className="login-button">Sign Up</button>
        <p className="opti">Already having an admin account? <a onClick={() =>{
          window.localStorage.setItem("Randomword", "I want to login")
        }} href="/auth/signin">Login Here</a></p>
    </form>
    </div>
    </div>
   
  );
}

// export default function singup(){
//   return <>

//     <h1>You Don't Have permision to Signup To this Admin Dashboard</h1>
  
//   </>
// }