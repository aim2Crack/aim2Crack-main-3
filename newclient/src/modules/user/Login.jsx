import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/images/user/Logo enlarged-03.png'
import { useFormik } from 'formik';
import * as yup from 'yup';
// import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth"

// import PasswordReset from './ResetPass'

import undraw from '../../assets/images/user/undraw_Questions_re_1fy7.svg'
import google_logo from '../../assets/images/user/flat-color-icons_google.svg'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faUser, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'


import './Login.css'

function Login() {
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const formInitialValues = {
    userOrEmail: '',
    password: '',
  };


  // Validation schema
  const formValidationSchema = yup.object().shape({
    userOrEmail: yup.string().required('Email or username is required').max(30, 'Email not greater than 30 character'),
    password: yup.string().required('Password is required').min(4, 'Password must be at least 4 characters').max(20, 'Password not greater than 20 character'),
  });

  const { handleChange, values, errors } = useFormik({
    initialValues: formInitialValues,
    validationSchema: formValidationSchema,
    onSubmit: (values) => {
      console.log(values)
    }
  })

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isButtonEnabled = values.userOrEmail.length >= 4 && values.password.length >= 4;

  // const [data, setData] = useState('')
  // const [password, setPassword] = useState('')
  const navigate = useNavigate(); // Access the navigate function

  const handleTogglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const loginData = {
      usernameOrEmail: values.userOrEmail,
      password: values.password,
    };
  
    try {
      const response = await fetch('http://127.0.0.1:7000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });
      console.log(response)
      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem('token', token);
        navigate('/summary'); // Redirect to the dashboard or desired page
      } else if (response.status === 401) {
        setMessage('Invalid username or password.');
      } else if (response.status === 403) {
        setMessage('Please verify email. Check registered mail inbox!!');
      } else {
        setMessage('An error occurred during login. Please try again later.');
      }
    } catch (error) {
      console.error('Login request failed:', error);
      setMessage('An error occurred during login. Please try again later.');
    }
  };
      
  // // sign in with google
  // async function handleSignInWIthGoogle(){
  //   const auth = getAuth()
  //   const provider = new GoogleAuthProvider()
  //   try {
  //     const userSignInResult = await signInWithPopup(auth, provider)
  //     const user = userSignInResult.user
  //     return await user.getIdToken()
  //   }catch (e){
  //     console.log("user not registered")
  //   }

  // }

  return (

    <div>
      
      <Link
        to="/homePage"
        id="a__home"
      >
        <FontAwesomeIcon icon={faHouse} />
      </Link>
      <div className="login-container">
        <div className="content-section">
          <div>
            <img src={logo} alt="logo" className='login-logo' />
          </div>
        {message && (
      <div className={`alert ${submitted ? 'success' : 'error'}`}>
  {message}
</div>
)}
          <div className="border">
            <h1>Login Now</h1>

            <form onSubmit={handleSubmit} method="POST" className="login-form_method">
              <input
                type="hidden"
              />

              <fieldset className="login-form-group">
                <div className="login-form-group">
                  <div className="login-info">
                    <FontAwesomeIcon className='icon' icon={faUser} />
                    <input
                      type="text"
                      name="userOrEmail"
                      autoFocus
                      autoCapitalize="none"
                      autoComplete="username"
                      maxLength="30"
                      // required
                      value={values.userOrEmail}
                      placeholder="Username / Email id"
                      onChange={handleChange}
                    />

                  </div>
                  <span className='login-error'>{errors.email} </span>
                </div>
                <div className="login-form-group">
                  <div className="login-info login-info-pass">
                    <FontAwesomeIcon className='icon' icon={faLock} />
                    <input
                      type={isPasswordVisible ? 'text' : 'password'}
                      name="password"
                      autoComplete="current-password"
                      required
                      placeholder="Password"
                      onChange={handleChange}
                      value={values.password}
                    />

                    <span onClick={handleTogglePasswordVisibility}>
                      {isPasswordVisible ? <FontAwesomeIcon className='icon' icon={faEye} /> : <FontAwesomeIcon className='icon' icon={faEyeSlash} />}
                    </span>


                  </div>
                  <span className='login-error' >{errors.password} </span>
                </div>
              </fieldset>
              <div className="login-form-group">
                <small className="forgot_password">
                  <a href="/forgot-password">Forgot Password</a>
                </small>
              </div>

              <button type="submit"
                style={{ backgroundColor: isButtonEnabled ? '#00c6a7' : 'grey' }}
                disabled={!isButtonEnabled}
                className="login-btn-outline-info"
              >LOG IN</button>
              <button className=" login-btn-outline-info login-google-btn" >
                <div className='login-google'>

                  <img src={google_logo} alt="google" />
                  <span>Login with Google</span>
                </div>
              </button>
            </form>
            {/* <button className=" login-btn-outline-info" onClick={handleSignInWIthGoogle}>SIGN IN WITH GOOGLE</button> */}

          </div>
        </div>
        <div className="login-left_panel">
          <div className="border-top login-pt-3">
            <small >
              <h3>Newbie ?</h3>
              <p>Chill !! Make your Aim2Crack Account now!!</p>
              <div className="sign_up">
                <Link to="/register">Sign Up </Link>
              </div>
            </small>
          </div>
          <img
            src={undraw}
            alt="imge"
            className="undraw"
          />
        </div>
      </div>

    </div>
  );
};

export default Login