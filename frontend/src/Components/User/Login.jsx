    import React, { useState } from 'react';
    import { Link, useNavigate, useLocation } from 'react-router-dom';
    import MetaData from '../Layout/MetaData';
    import { toast } from 'react-toastify';
    import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
    import { auth } from "../../firebase";

    const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const redirect = location.search ? new URLSearchParams(location.search).get('redirect') : '';

    // ✅ Replace with this
    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            // Store user info including "Joined On"
            localStorage.setItem("user", JSON.stringify({
                uid: firebaseUser.uid,
                name: firebaseUser.displayName || firebaseUser.email,
                email: firebaseUser.email,
                createdAt: firebaseUser.metadata?.creationTime || new Date().toISOString(),
                photoURL: firebaseUser.photoURL || null
            }));

            window.dispatchEvent(new Event('userChanged'));
            toast.success("Login successful!", { position: 'bottom-right' });
            navigate(redirect ? `/${redirect}` : "/");
        } catch (error) {
            toast.error(error.message, { position: 'bottom-right' });
        } finally {
            setLoading(false);
        }
    };

    // ✅ Replace with this
    const googleLogin = async () => {
        setLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const firebaseUser = result.user;

            // Store user info including "Joined On"
            localStorage.setItem("user", JSON.stringify({
                uid: firebaseUser.uid,
                name: firebaseUser.displayName || firebaseUser.email,
                email: firebaseUser.email,
                createdAt: firebaseUser.metadata?.creationTime || new Date().toISOString(),
                photoURL: firebaseUser.photoURL || null
            }));

            window.dispatchEvent(new Event('userChanged'));
            toast.success("Logged in with Google!", { position: 'bottom-right' });
            navigate('/');
        } catch (error) {
            toast.error(error.message, { position: 'bottom-right' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        <MetaData title="Login" />
        <div className="row wrapper">
            <div className="col-10 col-lg-5">
            <form className="shadow-lg" onSubmit={submitHandler}>
                <h1 className="mb-3">Login</h1>

                <div className="form-group">
                <label>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="form-control" required />
                </div>

                <div className="form-group">
                <label>Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="form-control" required />
                </div>

                <Link to="/password/forgot" className="float-right mb-4">Forgot Password?</Link>

                <button type="submit" className="btn btn-block py-3" disabled={loading}>
                {loading ? 'LOGGING IN...' : 'LOGIN'}
                </button>

                <div className="mt-3">
                <button type="button" onClick={googleLogin} className="btn btn-danger btn-block py-2" disabled={loading}>
                    Login with Google
                </button>
                </div>

                <Link to="/register" className="float-right mt-3">New User?</Link>
            </form>
            </div>
        </div>
        </>
    );
    };

    export default Login;