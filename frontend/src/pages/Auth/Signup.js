import React, { useState } from 'react';
import { Checkbox, Form, Input } from 'antd';
import axios from 'axios';
import { ContactsOutlined, KeyOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { SuccessMessage, ErrorMessage } from '../../components/Messages/Messages';
import { Loading } from '../../components/Loading/Loading';
import './Auth.css';


export const Signup = (props) => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState('');

  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confimPassword: '',
    phone: ''
  });

  const { fullName, username, email, password } = userData;

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    })
  }


  const handleImageChange = (e) => {
    setFile(
      e.target.files[0]
    );
  }


  const onFinish = async (e) => {
    window.scrollTo(0, 0);
    setLoading(true);
    let data = new FormData();
    data.append('fullName', fullName);
    data.append('email', email);
    data.append('username', username);
    data.append('password', password);
    data.append('file', file);

    await axios.post('/api/users/signup', data).then(res => {
      setLoading(false);
      if (res.status === 200) {
        SuccessMessage(res.data.successMessage);
        setTimeout(() => {
          props.history.push('/login')

        }, 2000);
      }
      else if (res.status === 201) {
        ErrorMessage(res.data.errorMessage);
      }
      else {
        ErrorMessage(res.data.errorMessage);
      }
    })

  };


  return (
    <div>
      <Helmet>
        <title>Signup</title>
      </Helmet>
      {
        loading
          ?
          <Loading />
          :
          <>
            <div className='auth signup'>
              <div className='auth-inner'>
                <div className='text-center'>
                  <div className='header'>
                    <Link to="/signup">Signup</Link>
                  </div>
                  <Form
                    name="basic"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    className='p-4 pt-2 pb-2'
                  >
                    <div>
                      <span class="btn btn-file">
                        {
                          file ?
                            <img src={file && URL.createObjectURL(file)} alt='user' width='100' className = 'rounded-circle' />
                            :
                            <img src='/assets/user.png' alt='user' width='100' />
                        }
                        <input type="file" required name='file' onChange={handleImageChange} />
                      </span>
                    </div>
                    <div className="floating-label-group">
                      <Form.Item
                        name="Full Name"
                        rules={[{ required: true, message: 'Please input your Full Name!' }]}
                      >
                        <Input name='fullName' onChange={handleChange} size='small' placeholder="Full Name" prefix={<ContactsOutlined />} />
                      </Form.Item>
                    </div>
                    <div className="floating-label-group">
                      <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                      >
                        <Input name='username' type='text' onChange={handleChange} size="small" placeholder="Username" prefix={<UserOutlined />} />
                      </Form.Item>
                    </div>
                    <div className="floating-label-group">
                      <Form.Item
                        name="email"
                        rules={[
                          {
                            type: 'email',
                            message: 'The input is not valid E-mail!',
                          },
                          {
                            required: true,
                            message: 'Please input your E-mail!',
                          },
                        ]}
                      >
                        <Input name='email' onChange={handleChange} size='small' placeholder="Email" prefix={<MailOutlined />} />
                      </Form.Item>
                    </div>
                    <div className="floating-label-group">
                      <Form.Item
                        name="password"
                        rules={[
                          {
                            required: true,
                            message: 'Please input your password!',
                          },
                        ]}
                        hasFeedback
                      >
                        <Input.Password type='password' name='password' onChange={handleChange} size="small" placeholder="Password" prefix={<KeyOutlined />} />
                      </Form.Item>
                    </div>
                    <div className="floating-label-group">
                      <Form.Item
                        name="confirm"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                          {
                            required: true,
                            message: 'Please confirm your password!',
                          },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                              }
                              return Promise.reject(new Error("Passwords don't match!"));
                            },
                          }),
                        ]}
                      >
                        <Input.Password name='confimPassword' onChange={handleChange} size='small' placeholder="Re-Enter Password" prefix={<KeyOutlined />} />
                      </Form.Item>
                    </div>
                    <div className='mx-1 terms'>
                      <div><Checkbox>I agree to the <a href='https://canvas.mit.edu/courses/4415/pages/about-your-instructors' target = '_blank'>Terms and Conditions </a></Checkbox></div>
                    </div>
                    <div className='submit-btn-container'>
                      <button type='submit' className='btn mt-3 w-100'>
                        Create Account
                      </button>
                      <p className='mt-2 mb-0'>
                        Already Have Account? <Link to='/login' className='pass'>Login</Link>
                      </p>
                    </div>
                  </Form>
                  <div>
                  </div>
                </div>
              </div>
            </div>
          </>
      }
    </div>
  );
};
