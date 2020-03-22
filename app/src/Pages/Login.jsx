import React from "react";
import { Form, Input, Button, Checkbox, Typography, message } from 'antd';
import { request, setToken } from "../utils/api";

const { Title } = Typography;

export default ({ history, onDone }) => {
    const layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
    };
    const tailLayout = {
        wrapperCol: {span: 24 },
    };
    const onFinish = values => {
        request({
            url: "api/user/login",
            method: "POST",
            data: {
                username: values.username,
                password: values.password
            }
        }).then(res => {
            if (res.data && res.data.success) {
                message.success("Successfully logged")
                setToken({
                    username: values.username,
                    password: values.password,
                    skin: res.data.skin,
                    cape: res.data.cape
                }, res.data.token, values.remember);
                onDone(true)
            } else if (res.data && res.data.message) {
                message.error(res.data.message)
            }
        })
    };
    const onFinishFailed = errorInfo => {
        errorInfo.errorFields.forEach((error) => {
            message.error(error.errors[0])
        })
    };
    return (
        <div className="login">
            <Form
                {...layout}
                name="basic"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Title>Login</Title>
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

                <Form.Item {...tailLayout} name="remember" valuePropName="checked">
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        Login
                    </Button>
                    <Button type="link" htmlType="button" onClick={() => history.push("/register")}>
                        Register
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}