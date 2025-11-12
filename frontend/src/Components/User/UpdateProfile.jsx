import React, { useState, useEffect } from 'react';
import MetaData from '../Layout/MetaData';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateProfile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('/images/default_avatar.jpg');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Load current user info from localStorage
  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem('user'));
    if (localUser) {
      setName(localUser.name || '');
      setEmail(localUser.email || '');
      setAddress(localUser.address || '');
      setAvatarPreview(localUser.photoURL || '/images/default_avatar.jpg');
      setAvatar(localUser.photoURL || null);
    }
  }, []);

  // Handle avatar file change
  const onChangeAvatar = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(reader.result); // store base64 for simplicity
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Update profile handler
  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);

    const localUser = JSON.parse(localStorage.getItem('user')) || {};
    const updatedUser = {
      ...localUser,
      name,
      email,
      address,
      photoURL: avatar || localUser.photoURL,
    };

    // Save to localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));

    // Notify other components (Header/Profile)
    window.dispatchEvent(new Event('userChanged'));

    toast.success('Profile updated successfully!', { position: 'bottom-right' });
    setLoading(false);
    navigate('/me', { replace: true });
  };

  return (
    <>
      <MetaData title="Update Profile" />

      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form
            className="shadow-lg"
            onSubmit={submitHandler}
            encType="multipart/form-data"
          >
            <h1 className="mt-2 mb-5">Update Profile</h1>

            <div className="form-group">
              <label htmlFor="name_field">Name</label>
              <input
                type="text"
                id="name_field"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email_field">Email</label>
              <input
                type="email"
                id="email_field"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="address_field">Address</label>
              <input
                type="text"
                id="address_field"
                className="form-control"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="avatar_upload">Avatar</label>
              <div className="d-flex align-items-center">
                <div>
                  <figure className="avatar mr-3 item-rtl">
                    <img
                      src={avatarPreview}
                      className="rounded-circle"
                      alt="Avatar Preview"
                      width="50"
                      height="50"
                    />
                  </figure>
                </div>
                <div className="custom-file">
                  <input
                    type="file"
                    name="avatar"
                    className="custom-file-input"
                    id="customFile"
                    accept="image/*"
                    onChange={onChangeAvatar}
                  />
                  <label className="custom-file-label" htmlFor="customFile">
                    Choose Avatar
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn update-btn btn-block mt-4 mb-3"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdateProfile;
