import React from "react";
import { Form, Input, Button, Checkbox, Typography, message } from 'antd';
import { request, setToken } from "../utils/api";

const { Title } = Typography;

export default ({history}) => {
    const layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
    };
    const tailLayout = {
        wrapperCol: {span: 24 },
    };
    const onFinish = values => {
        if(values.password !== values.password_repeat){
            return message.error("Passwords don't match")
        }
        request({
            url: "api/user/register",
            method: "POST",
            data: {
                username: values.username,
                password: values.password
            }
        }).then(res => {
            if(res.data && res.data.success){
                message.success("Successfully registered")
                history.push("/")
            }else if(res.data && res.data.message){
                message.error(res.data.message)
            }
        })
    };
    const onFinishFailed = errorInfo => {
        errorInfo.errorFields.forEach((error) => {
            message.error(error.errors[0])
        })
    };
    return(
        <div className="login">
            <Form
                {...layout}
                name="basic"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Title>Register</Title>
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: 'Username is required' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Password is required' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    label="Password repeat"
                    name="password_repeat"
                    rules={[{ required: true, message: 'Please repeat your password' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        Register
                    </Button>
                    <Button type="link" htmlType="button" onClick={() => history.push("/")}>
                        Login
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}