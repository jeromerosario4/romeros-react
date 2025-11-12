import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../Layout/Loader';
import MetaData from '../Layout/MetaData';

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});

  useEffect(() => {
    // Get user info from localStorage
    const localUser = localStorage.getItem('user');
    if (localUser) {
      setUser(JSON.parse(localUser));
    } else {
      setUser({});
    }
    setLoading(false);
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title="Your Profile" />

          <h2 className="mt-5 ml-5">My Profile</h2>
          <div className="row justify-content-around mt-5 user-info">
            {/* Avatar Section */}
            <div className="col-12 col-md-3 text-center">
              <figure className="avatar avatar-profile">
                <img
                  className="rounded-circle img-fluid"
                  src={user?.photoURL || '/images/default_avatar.png'}
                  alt={user?.name || 'User Avatar'}
                />
              </figure>

              <Link
                to="/me/update"
                id="edit_profile"
                className="btn btn-primary btn-block my-3"
              >
                Edit Profile
              </Link>
            </div>

            {/* User Info Section */}
            <div className="col-12 col-md-5">
              <h4>Full Name</h4>
              <p>{user?.name || '-'}</p>

              <h4>Email Address</h4>
              <p>{user?.email || '-'}</p>

              <h4>Joined On</h4>
              <p>
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : '-'}
              </p>

              <h4>Address</h4>
              <p>{user?.address || '-'}</p>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Profile;
