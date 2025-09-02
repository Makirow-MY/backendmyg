import axios from "axios";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaArrowLeft, FaUserCircle } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";

export default function Setting() {
  const router = useRouter();
  const { data: session } = useSession();
  const [userID, setUserID] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "+237651497070",
    image: "",
    Country: "Cameroon",
    token: "",
  });

  // Load initial user data from localStorage
  useEffect(() => {
    const storedUserID = window.localStorage.getItem("UserId");
    const storedEmail = window.localStorage.getItem("UserEmail");
    const storedName = window.localStorage.getItem("UserName");
    const storedImage = `https://ui-avatars.com/api/?name=${storedName}&background=random`;

    setUserID(storedUserID || "");
    setUserData((prev) => ({
      ...prev,
      email: storedEmail || "",
      fullName: storedName || "",
      image: storedImage || "",
    }));
  }, []);

  // Fetch user data from backend
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userData.email) return; // Skip if no email
      try {
        const res = await axios.post(`/api/auth/signup`, { userEmail: userData.email });
        console.log("User Data", res.data);
        if (res.data.error && !res.data.success) {
          toast.dismiss();
          toast.error(res.data.message);
        } else {
          const { _id, ...fetchedData } = res.data.data;
          window.localStorage.setItem("UserId", _id);
          window.localStorage.setItem("UserEmail", fetchedData.email);
          window.localStorage.setItem("UserName", fetchedData.fullName);
          window.localStorage.setItem("UserImage",  `https://ui-avatars.com/api/?name=${fetchedData.fullName}&background=random`);
          setUserData((prev) => ({
            ...prev,
            ...fetchedData,
          }));
        }
      } catch (error) {
        toast.error("Failed to fetch user data");
        console.error(error);
      }
    };
    fetchUserData();
  }, [userData.email]);

  // Handle input changes dynamically
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission to update user data
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`/api/auth/signup`, {
        userEmail: userData.email,
        ...userData,
      });
      if (res.data.success) {
        toast.success("Profile updated successfully!");
        window.localStorage.setItem("UserName", userData.fullName);
        window.localStorage.setItem("UserEmail", userData.email);
        window.localStorage.setItem("UserImage", `https://ui-avatars.com/api/?name=${userData.fullName}&background=random`);
        setUserData((prev) => ({
          ...prev,
          ...res.data.data,
        }));
        // setShowEdit(false)
        router.push("/profile"); // Redirect to home after update
      } else {
        toast.error(res.data.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error("Server error during update");
      console.error(error);
    }
  };

  // Fields to display and edit (excluding sensitive fields like password and token)
  const editableFields = Object.keys(userData).filter(
    (key) => key !== "password" && key !== "token" && key !== "_id" && key !== "image" && key !== "createdAt" && key !== "updatedAt" && key !== "__v"
  );

  if (session) {
    return (
      <>
        <div className="page">
          <div className="dashboard-header">
            <div>
              <h2><span>My Profile</span></h2>
              <p>User Information</p>
            </div>
            <div className="filter-select">
              <button
              onClick={() => {
                      signOut();
                      router.push("/auth/signin");
                    }}
                     style={{background: "rgba(255, 0, 0, 0.3)", fontSize: '16px' ,border: "none", padding:" 1rem 2rem", color: "#fff", cursor: "pointer", borderRadius:'10px'}}>
               logout
              </button>
              </div>
          </div>

          <div className="cosmic-contact-display">
            {userData.email ? (
              <>
                <div className="cosmic-card">
                  <div className="stellar-header">
                    <h1 className="cosmic-title">Computer Engineer</h1>
                    <div className="stellar-decoration"></div>
                  </div>

                  <div className="galaxy-grid">
                    <div className="nebula-bg" style={{ width: '250px', height: '200px' }}>
                      <img
                        src={`https://ui-avatars.com/api/?name=${userData.fullName}&background=random`}
                        alt={userData.fullName}
                        className="project-preview-image"
                      />
                    </div>

                    <div className="info-column nebula-bg">
                      {editableFields.map((key) => (
                        <p key={key}>
                          <span className="glowing-label">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span>
                          <span className="cosmic-text">{userData[key] || "N/A"}</span>
                        </p>
                      ))}
                    </div>
                  </div>

                   { !showEdit && <div className="cosmic-section">
                    <p onClick={() =>  setShowEdit(!showEdit)} className="pulsing-label trtr" style={{ cursor: 'pointer', width: 'auto' }}>Edit Profile</p>
                  </div>}

                 { showEdit &&  <form className="addWebsiteform" onSubmit={handleSubmit}>
                    <p className="pulsing-label" style={{ cursor: 'pointer', width: 'auto', textAlign:'center' }}>UPDATE INFOR</p>
                    {editableFields.map((key) => (
                      <div className="w-100 flex flex-col flex-left mb-2" key={key}>
                        <label htmlFor={key}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} {key === "fullName" ? "*" : ""}</label>
                        <input
                          className="input"
                          required={key === "fullName" || key === "email"}
                          name={key}
                          value={userData[key] || ""}
                          onChange={handleInputChange}
                          type={key === "email" ? "email" : key === "phoneNumber" ? "tel" : "text"}
                          id={key}
                          placeholder={`Enter ${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}`}
                        />
                      </div>
                    ))}
                    <div className="w-100 mb-2">
                      <button type="submit" className="w-100 addwebbtn flex-center">Save</button>
                    </div>
                  </form>}

                  <div className="stellar-footer"></div>
                </div>
              </>
            ) : (
              <div className="cosmic-empty">
                <div className="empty-message">No project information available</div>
                <div className="empty-stars"></div>
              </div>
            )}
            <div className="buttonClass">
              <a href="/" className="button"><FaArrowLeft /> Dashboard</a>
            </div>
          </div>

        </div>
      </>
    );
  }
  return null;
}