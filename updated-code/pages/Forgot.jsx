  import { ethers } from "ethers";
  import { useState, useEffect,useContext } from "react";
  import { useRouter } from "next/router";

  import assets from "../assets";
  import accountIcon from '../assets/account.png'
  import Image from "next/image";
  import { ChatAppContect } from "../Context/ChatAppContext";
  import Style from "../Components/Forgot/Forgot.module.css";
  import images from "../assets";
  function Forgot() {
    const [seedPhrase, setSeedPhrase] = useState("");
    const [exists, setExists] = useState(false);
    const [userAddress, setUserAddress] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [password, setPassword] = useState("");
    const [cpassword, setCPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const router = useRouter();
    const { loading, createAccount,changePassword,isUserLoggedIn} = useContext(ChatAppContect);

    const validatePassword = (password) => {
      const hasNumber = /\d/;
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
      if (!hasNumber.test(password) || !hasSpecialChar.test(password)) {
        setPasswordError("Password must contain a number and a special character.");
      } else {
        setPasswordError("");
      }
    };
  
    const checkSameOldPassword = (newPassword, oldPassword) => {
      if (newPassword === oldPassword) {
        return "New password cannot be the same as the old password.";
      }
      return "";
    };
    const samePassword = (password, cpassword) => {
      if (password !== cpassword) {
        setPasswordError("Passwords do not match.");
      } else {
        setPasswordError("");
      }
    };
  
    const handlePasswordChange = (e) => {
      const newPassword = e.target.value;
      setPassword(newPassword);
      const error = validatePassword(newPassword) || checkSameOldPassword(newPassword, oldPassword) || samePassword(newPassword, cpassword);
      setPasswordError(error);
    };
  
    const handleCPasswordChange = (e) => {
      const newCPassword = e.target.value;
      setCPassword(newCPassword);
      if(password !== oldPassword){

        if (newCPassword !== password) {
          setPasswordError("New passwords do not match.");
        } else {
          setPasswordError(validatePassword(newCPassword));
        }
      }
      else {
        setPasswordError("New password cannot be the same as the old password.");
      }
    };
  
    const handleOldPasswordChange = (e) => {
      const newOldPassword = e.target.value;
      setOldPassword(newOldPassword);
    };
  
    const handleSubmit = async () => {
      if (!userAddress || !password || passwordError || !cpassword || !oldPassword) {
        setPasswordError("Please fill in all required fields correctly.");
        return;
      }
      else {
        setPasswordError("");
        try {
          await changePassword({userAddress, cpassword, oldPassword });
        } catch (error) {
          console.error("Error in handleSubmit:", error);
        }
    }
    };
  
    const togglePasswordVisibility = () => {
      setPasswordVisible(!passwordVisible);
    };
  
    const isSubmitDisabled = !userAddress || !password || passwordError || !cpassword || !oldPassword ;
    
    const floatingLabelStyles = {
      position: "absolute",
      top: 0,
      left: 0,
      height: "100%",
      padding: "1rem 0.75rem",
      pointerEvents: "none",
      border: "1px solid transparent",
      transformOrigin: "0 0",
      transition: "opacity 0.3s ease, transform 0.3s ease",
      opacity: 0.5,
    };
    
    const floatingLabelActiveStyles = {
      transform: "translateY(-20px)",
      fontSize: "12px",
      opacity: 1,
    };

    useEffect(() => {
      //setMnemVisible(false);
    }, []);

    return (
      <section
        className="section-bg"
        style={{
          // backgroundImage: "url('/Background.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          margin: "0",
          height: "100vh",
        }}
      >
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-8 col-lg-6 col-xl-5">
              <div
                className="card bg-white text-black"
                style={{
                  borderRadius: "20px",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
                }}
              >
                <div className="card-body p-5 text-center">
                    <div>
                      <div className="mb-md-5 mt-md-4 pb-10">
                        <h2 className="fw-bold mb-2 text-uppercase">
                          Chat App Reset Password
                        </h2>
                        <p className="text-black-50 mb-5 mt-5">
                          Reset your password by entering your seed words seperated by a space
                        </p>

                        <div className="form-floating mb-3">
                          <label
                            htmlFor="Address"
                            className={`text-black ${
                              userAddress ? "active" : ""
                            }`}
                            style={{ display: "flex", alignItems: "center",transition: "all 0.3s ease"
                              , ...floatingLabelStyles,...(userAddress ? floatingLabelActiveStyles : {}),
                            }}
                          >
                            Address
                          </label>
                          <input
                            type="text"
                            id="Address"
                            className="form-control form-control-lg"
                            value={userAddress}
                            placeholder=" "
                            onChange={(e) => setUserAddress(e.target.value)}
                            required
                            style={{
                              borderRadius: "10px",
                              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
                              transition: "all 0.3s ease",
                              background: `url(${accountIcon}) no-repeat 10px center / auto 20px`,
                              paddingLeft: '20px',
                              paddingBottom: '30px',
                            }}
                            onFocus={(e) =>
                              (e.target.style.boxShadow =
                                "0px 0px 8px rgba(0, 0, 0, 0.4)")
                            }
                            onBlur={(e) =>
                              (e.target.style.boxShadow =
                                "0px 2px 4px rgba(0, 0, 0, 0.25)")
                            }
                          />
                        </div>
                        <div className="form-floating mb-3">
                        <label htmlFor="OldPassword" className={`text-black ${
                          oldPassword ? "active" : ""
                        }`}
                        style={{ display: "flex", alignItems: "center",transition: "all 0.3s ease"
                          , ...floatingLabelStyles,...(oldPassword ? floatingLabelActiveStyles : {}),
                        }}>Old Password</label>
                        <input
                          type={passwordVisible ? "text" : "password"}
                          id="OldPassword"
                          className="form-control form-control-lg"
                          value={oldPassword}
                          placeholder=" "
                          onChange={handleOldPasswordChange}
                          required
                          style={{
                            borderRadius: '10px',
                            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
                            transition: 'all 0.3s ease',
                            background: `url(${accountIcon}) no-repeat 10px center / auto 20px`,
                            paddingLeft: '20px',
                            paddingBottom: '30px',
                          }}
                          onFocus={(e) => e.target.style.boxShadow = '0px 0px 8px rgba(0, 0, 0, 0.4)'}
                          onBlur={(e) => e.target.style.boxShadow = '0px 2px 4px rgba(0, 0, 0, 0.25)'}
                        />
                        </div>

                        <div className="form-floating mb-3">
                        <label htmlFor="Password" 
                        className={`text-black ${
                          password ? "active" : ""
                        }`}
                        style={{ display: "flex", alignItems: "center",transition: "all 0.3s ease"
                          , ...floatingLabelStyles,...(password ? floatingLabelActiveStyles : {}),
                        }}>New Password</label>
                        <input
                          type={passwordVisible ? "text" : "password"}
                          id="Password"
                          className="form-control form-control-lg"
                          value={password}
                          placeholder=" "
                          onChange={handlePasswordChange}
                          required
                          style={{
                            borderRadius: '10px',
                            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
                            transition: 'all 0.3s ease',
                            background: `url(${accountIcon}) no-repeat 10px center / auto 20px`,
                            paddingLeft: '20px',
                            paddingBottom: '30px',
                          }}
                          onFocus={(e) => e.target.style.boxShadow = '0px 0px 8px rgba(0, 0, 0, 0.4)'}
                          onBlur={(e) => e.target.style.boxShadow = '0px 2px 4px rgba(0, 0, 0, 0.25)'}
                        />
                        <button
                          type="button"
                          className={Style.toggle_password}
                          onClick={togglePasswordVisibility}
                          style={{
                            position: "absolute",
                            right: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          {passwordVisible ? (
                            <Image src={images.eye_close} alt="hide password" width={30} height={30} />
                          ) : (
                            <Image src={images.eye_open} alt="show password" width={30} height={30} />
                          )}
                        </button>
                        </div>

                        <div className="form-floating mb-3">
                        <label htmlFor="CPassword" className={`text-black ${
                          cpassword ? "active" : ""
                        }`}
                        style={{ display: "flex", alignItems: "center",transition: "all 0.3s ease"
                          , ...floatingLabelStyles,...(cpassword ? floatingLabelActiveStyles : {}),
                        }}>Confirm Password</label>
                        <input
                          type={passwordVisible ? "text" : "password"}
                          id="CPassword"
                          className="form-control form-control-lg"
                          value={cpassword}
                          placeholder=" "
                          onChange={handleCPasswordChange}
                          required
                          style={{
                            borderRadius: '10px',
                            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
                            transition: 'all 0.3s ease',
                            background: `url(${accountIcon}) no-repeat 10px center / auto 20px`,
                            paddingLeft: '20px',
                            paddingBottom: '30px',
                          }}
                          onFocus={(e) => e.target.style.boxShadow = '0px 0px 8px rgba(0, 0, 0, 0.4)'}
                          onBlur={(e) => e.target.style.boxShadow = '0px 2px 4px rgba(0, 0, 0, 0.25)'}
                        />
                        </div>

                        {passwordError && (<p className={Style.error}>{passwordError}</p>)}
                        <br></br>
                        <button
                          className="btn btn-lg px-5"
                          type="submit"
                          onClick={handleSubmit}
                          style={{
                            backgroundColor: "#FB723F",
                            border: "none",
                            color: "#fff",
                            padding: "10px 20px",
                            borderRadius: "8px",
                            transition: "all 0.3s ease",
                          }}
                          disabled={isSubmitDisabled}
                          onMouseEnter={(e) =>
                            (e.target.style.backgroundColor = "#F64A0B")
                          }
                          onMouseLeave={(e) =>
                            (e.target.style.backgroundColor = "#FB723F")
                          }
                        >
                          Confirm changes
                        </button>
                        <br></br>
                        <a className="btn btn-lg px-5" href={isUserLoggedIn ? "/" : "/login"}>
                        <button
                          style={{
                            backgroundColor: "#000000",
                            border: "none",
                            color: "#fff",
                            padding: "10px 94px",
                            borderRadius: "8px",
                            transition: "all 0.3s ease",
                          }} onMouseEnter={(e) =>
                            (e.target.style.backgroundColor = "#FB723F")
                          }
                          onMouseLeave={(e) =>
                            (e.target.style.backgroundColor = "#000000")
                          }>
                          Cancel 
                        </button>
                        </a>
                      </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  export default Forgot;