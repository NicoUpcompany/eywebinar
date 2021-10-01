import React, { useState } from 'react';
import { Form, Input, Button, notification, Spin } from "antd";
import { UserOutlined } from '@ant-design/icons';
import { CometChat } from "@cometchat-pro/chat";
import jwtDecode from 'jwt-decode';
// import { useHistory } from "react-router-dom";

import { signInAdminApi } from '../../../api/user';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../../utils/constants';
import { COMETCHAT_CONSTANTS } from '../../../consts';

import './LoginForm.scss';

export default function LoginForm() {
    
    // const history = useHistory();

    const [inputs, setInputs] = useState({
        email: ""
    });
    const[loading, setLoading] = useState(false);

    const changeForm = e => {
        setInputs({
            ...inputs,
            [e.target.name]: e.target.value
        });
    };

    const login = async () => {
        setLoading(true);
        const result = await signInAdminApi(inputs);
        if (!result.ok) {
            notification["error"]({
                message: result.message
            });
            setLoading(false);
        } else {
            const { accessToken, refreshToken } = result;
            localStorage.setItem(ACCESS_TOKEN, accessToken);
            localStorage.setItem(REFRESH_TOKEN, refreshToken);
            const decodedToken = jwtDecode(accessToken);
            const user = new CometChat.User(decodedToken.id);
            const UID = decodedToken.id;
            const apiKey = COMETCHAT_CONSTANTS.AUTH_KEY;
            if (decodedToken.email.length > 0) {
                user.setName(`${decodedToken.name} ${decodedToken.lastname} | ${decodedToken.enterprise}`);
            }
            localStorage.setItem('userID', decodedToken.id);
            CometChat.createUser(user, COMETCHAT_CONSTANTS.AUTH_KEY).then(
                user => {
                    CometChat.login(UID, apiKey).then(
                        User => {
                            window.location.href = "/dashboard";
                            // history.push("/dashboard");
                        },
                        error => {
                            setLoading(false);
                            notification["error"]({
                                message: 'Ha ocurrido un error'
                            });
                        }
                    );
                    
                },error => {
                    if (error.details.uid[0] === 'The uid has already been taken.') {
                        CometChat.updateUser(user, COMETCHAT_CONSTANTS.AUTH_KEY).then(
                            user => {
                                CometChat.login(UID, apiKey).then(
                                    User => {
                                        window.location.href = "/dashboard";
                                        // history.push("/dashboard");
                                    },
                                    error => {
                                        setLoading(false);
                                        notification["error"]({
                                            message: 'Ha ocurrido un error'
                                        });
                                    }
                                );
                            }, error => {
                                CometChat.login(UID, apiKey).then(
                                    User => {
                                        window.location.href = "/dashboard";
                                        // history.push("/dashboard");
                                    },
                                    error => {
                                        setLoading(false);
                                        notification["error"]({
                                            message: 'Ha ocurrido un error'
                                        });
                                    }
                                );
                            }
                        )
                    } else {
                        setLoading(false);
                        notification["error"]({
                            message: 'Ocurrió un error'
                        });
                    }
                }
            )
        }
    };

    return (
        <Spin spinning={loading} size="large" tip="Cargando...">
            <Form className="login-form" onChange={changeForm} onFinish={login}>
                <Form.Item>
                    <Input
                        prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                        type="email"
                        name="email"
                        placeholder="Correo electronico"
                        className="login-form__input"
                    />
                </Form.Item>
                <Form.Item>
                    <Button htmlType="submit" className="login-form__button">
                        Entrar
                    </Button>
                </Form.Item>
            </Form>
        </Spin>
    )
}