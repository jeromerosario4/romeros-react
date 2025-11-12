// src/components/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MetaData from '../Layout/MetaData';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { 
  createUserWithEmailAndPassword, 
  updateProfile, 
  signInWithPopup, 
  GoogleAuthProvider, 
  FacebookAuthProvider 
} from "firebase/auth";
import { auth } from "../../firebase";

const Register = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
  });
  const { name, email, password } = user;

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input changes
  const onChange = e => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Handle email/password registration
  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      await updateProfile(firebaseUser, { displayName: name });

      localStorage.setItem("user", JSON.stringify({
        uid: firebaseUser.uid,
        name: firebaseUser.displayName,
        email: firebaseUser.email,
      }));

      toast.success("Registration successful!", { position: 'bottom-right' });
      navigate('/');

    } catch (error) {
      console.error("Firebase Registration Error:", error);
      toast.error(error.message, { position: 'bottom-right' });
    } finally {
      setLoading(false);
    }
  };

  // Sign in with Google
  const googleSignIn = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      localStorage.setItem("user", JSON.stringify({
        uid: firebaseUser.uid,
        name: firebaseUser.displayName || firebaseUser.email,
        email: firebaseUser.email,
      }));

      toast.success("Logged in with Google!", { position: 'bottom-right' });
      navigate('/');
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      toast.error(error.message, { position: 'bottom-right' });
    } finally {
      setLoading(false);
    }
  };

  // Sign in with Facebook
  const facebookSignIn = async () => {
    setLoading(true);
    try {
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      localStorage.setItem("user", JSON.stringify({
        uid: firebaseUser.uid,
        name: firebaseUser.displayName || firebaseUser.email,
        email: firebaseUser.email,
      }));

      toast.success("Logged in with Facebook!", { position: 'bottom-right' });
      navigate('/');
    } catch (error) {
      console.error("Facebook Sign-In Error:", error);
      toast.error(error.message, { position: 'bottom-right' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MetaData title={'Register User'} />
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form className="shadow-lg" onSubmit={submitHandler}>
            <h1 className="mb-3">Register</h1>

            <div className="form-group">
              <label htmlFor="name_field">Name</label>
              <input
                type="text"
                id="name_field"
                className="form-control"
                name='name'
                value={name}
                onChange={onChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email_field">Email</label>
              <input
                type="email"
                id="email_field"
                className="form-control"
                name='email'
                value={email}
                onChange={onChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password_field">Password</label>
              <input
                type="password"
                id="password_field"
                className="form-control"
                name='password'
                value={password}
                onChange={onChange}
                required
              />
            </div>

            <button
              id="register_button"
              type="submit"
              className="btn btn-block py-3"
              disabled={loading}
            >
              {loading ? 'REGISTERING...' : 'REGISTER'}
            </button>
          </form>

          <hr />

          <div className="social-login mt-3">
            <button
              onClick={googleSignIn}
              className="btn btn-danger btn-block py-2 mb-2"
              disabled={loading}
            >
              Sign in with Google
            </button>

          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
