import React, { useState } from 'react';
import { Input } from 'antd';
import { KeyOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import './Auth.css';
import { setAuthentication } from '../../components/auth/auth';
import { Loading } from '../../components/Loading/Loading';
import { ErrorMessage, SuccessMessage } from '../../components/Messages/Messages';
import { GoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import scriptjs from 'scriptjs'


export const Login = (props) => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    email: '',
    password: '',

  });

  const { email, password } = userData;

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  }


  const onFinish = async () => {
    window.scrollTo(0, 0);
    setLoading(true);
    await axios.post('/api/users/login', { email, password }).then(res => {
      setLoading(false);
      if (res.status === 200) {
        setAuthentication(res.data, res.data.token);
        SuccessMessage(res.data.successMessage);
        props.history.push('/');
        window.location.reload();
      }
      else if (res.status === 201) {
        ErrorMessage(res.data.errorMessage);
      }
      else {
        ErrorMessage(res.data.errorMessage);
      }
    })

  };

  //Google Login
  const responseGoogle = response => {
    console.log(response);
  };

  const googleLogin = async (response) => {
    console.log(response);
    await axios.post(`/api/users/google-login`, { idToken: response.tokenId }).then(res => {
      if (res.status === 200) {
        console.log(res);
        SuccessMessage(res.data.successMessage);
        setAuthentication(res.data, res.data.token);
        props.history.push('/');
        window.location.reload();
      }
      else {
        ErrorMessage(res.data.errorMessage);
      }
    })
  }


  //Facebook Login
  const responseFacebook = async (response) => {
    await axios.post(`/api/users/facebook-login`, { userID: response.userID, accessToken: response.accessToken }).then(res => {
      if (res.status === 200) {
        console.log(res);
        SuccessMessage(res.data.successMessage);
        setAuthentication(res.data, res.data.token);
        props.history.push('/');
        window.location.reload();
      }
      else {
        ErrorMessage(res.data.errorMessage);
      }
    })
  };

  scriptjs.get('https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js', () => {
    const params = {
      clientId: 'app.example.com',
      redirectURI: 'https://www.example.com/apple/callback',
      scope: 'name email',
    };
    window.AppleID.auth.init(params);
  });

  return (
    <>
      <Helmet>
        <title>Login</title>
      </Helmet>
      {
        loading
          ?
          <Loading />
          :
          <>
            <div className='auth'>
              <div className='auth-inner'>
                <div className='text-center'>
                  <div className='header'>
                    <Link to="/login">Login</Link>
                  </div>
                  <div className='mt-2 login-providers'>
                    <div className='item'>
                      <GoogleLogin
                        clientId="149692579477-glurbqoge42mtbabv0l3ahm58juic1u4.apps.googleusercontent.com"
                        buttonText="Continue With Google"
                        onSuccess={googleLogin}
                        onFailure={responseGoogle}
                        cookiePolicy={'single_host_origin'}
                      />
                    </div>
                    <div className='item'>
                      <FacebookLogin
                        appId='190485236351543'
                        autoLoad={false}
                        // autoLoad={true}
                        icon="fa-facebook"
                        fields="name,email,picture"
                        callback={responseFacebook}
                        textButton='Continue With Facebook'
                      />
                    </div>
                    <div className='item'>
                      <button className='btn apple-btn' onClick={() => window.AppleID.auth.signIn()}>
                        <img src='/assets/apple.png' alt='apple' /> Continue with Apple
                      </button>
                    </div>
                  </div>
                  <form onSubmit={onFinish} className='p-4 pb-0'>
                    <div className="floating-label-group mb-3">
                      <Input name='email' onChange={handleChange} size='small' placeholder="Email or Username" prefix={<UserOutlined />} />
                    </div>
                    <div className="floating-label-group">
                      <Input.Password name='password' type='password' onChange={handleChange} size="small" placeholder="Password" prefix={<KeyOutlined />} />
                    </div>
                    <div className='d-flex justify-content-between mt-2'>
                      <div>
                        <label className="form-check-label float-left mt-1 ml-2">
                          <input className="form-check-input" type="checkbox" /> Remember
                        </label>
                      </div>
                      <div>
                        <Link className='pass' to='/reset-password'>Lost Password?</Link>
                      </div>
                    </div>
                    <div className='submit-btn-container'>
                      <button type='submit' className='btn my-2 mt-3 w-100'>
                        Login
                      </button>
                    </div>
                  </form>
                  <div className='mt-2'>
                    <p>
                      New to Website?<Link to='/signup' className='pass mx-2'>Register</Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
      }
    </>

  );
}
