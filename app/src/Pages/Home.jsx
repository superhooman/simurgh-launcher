import React, {useState, useEffect} from 'react';
import {Tabs, Typography, Progress, Button, Upload, Card, message} from 'antd';
import {UploadOutlined, SaveOutlined, DeleteOutlined} from '@ant-design/icons';
import {getUser, getToken, request, setToken} from '../utils/api';
import Skinview3d from 'react-skinview3d';

const ipc = require('electron').ipcRenderer;

const {Title} = Typography;
const {TabPane} = Tabs;

const statusToLabel = {
	init: 'Launch',
	downloading: 'Downloading',
	launched: 'Launched',
	launching: 'Launching'
};

const getSkin = skin => {
	return `https://mc.uenify.com/skin/${skin}`;
};

const getCape = cape => {
	return `https://mc.uenify.com/cape/${cape}`;
};

export default () => {
	const [state, setState] = useState({
		status: 'init'
	});

	const [user, setUser] = useState(getUser());

	const [loading, setLoading] = useState(false);
	const [skin, setSkin] = useState(null);

	useEffect(() => {
		ipc.on('setState', (event, message) => {
			setState(message);
		});
	}, []);

	const beforeUpload = file => {
		const isPng = file.type === 'image/png';
		if (!isPng) {
			message.error('You can only upload PNG file!');
		}

		const isLt2M = file.size / 1024 / 1024 < 2;
		if (!isLt2M) {
			message.error('Image must smaller than 2MB!');
		}

		return isPng && isLt2M;
	};

	const handleChange = info => {
		if (info.file.status === 'uploading') {
			setLoading(true);
			return;
		}

		if (info.file.status === 'done') {
			setLoading(false);
			setSkin(info.file.response.skin);
		}
	};

	const saveSkin = () => {
		request({
			url: 'api/user/changeSkin',
			method: 'POST',
			data: {
				texture: skin
			}
		}).then(res => {
			if (res.data && res.data.success) {
				setSkin(null);
				const user = {
					...getUser(),
					skin: skin.file
				};
				setUser(user);
				setToken(user, getToken(), true);
				message.success('Skin setted');
			}
		});
	};

	return (
		<div className="Home">
			<div className="header">
				<Title level={4}>Logged as {user.username}</Title>
			</div>
			<Tabs defaultActiveKey="1">
				<TabPane
					key="1" tab={
						<span className="tab">
							Home
						</span>
					}
				>
					<div className="container launch">
						<div className="launch-button">
							<Button
								type="primary" loading={state.status === 'downloading' || state.status === 'launching'} disabled={state.status === 'launched'}
								shape="round" size="large" onClick={() => {
									setState({
										status: 'launching'
									});
									ipc.send('launch', getUser());
								}}
							>
								{statusToLabel[state.status]}
							</Button>
						</div>
						{state.status === 'downloading' ? (
							<div className="progress">
								<p>{state.name}</p>
								<Progress status={state.percent === 100 ? 'active' : null} percent={state.percent}/>
							</div>) : null}
					</div>
				</TabPane>
				<TabPane
					key="2" tab={
						<span className="tab">
							Profile
						</span>
					}
				>
					<div className="container profile">
						<Card
							style={{width: 300}}
							cover={<div className="skin"><Skinview3d width="300" height="280" capeUrl={getCape(user.cape)} skinUrl={skin ? getSkin(skin.file) : getSkin(user.skin)}/></div>}
							actions={
								(skin ? [<SaveOutlined key="1" onClick={saveSkin}/>, <DeleteOutlined key="2" onClick={() => setSkin(null)}/>] : [<Upload
									key="1"
									name="file"
									showUploadList={false}
									customRequest={async info => {
										const data = new FormData();
										data.append('skin', info.file);
										return request({
											url: 'api/texture/uploadSkin',
											method: 'POST',
											data
										}).then(res => {
											if (res.data && res.data.success) {
												info.onSuccess(res.data);
											} else {
												message.error(res.data.message);
											}
										});
									}}
									beforeUpload={beforeUpload}
									onChange={handleChange}>
									<UploadOutlined loading={loading}/>
								</Upload>])
							}
						/>

						<div className="footer">
							<Button
								block
								type="danger" onClick={() => {
									localStorage.clear();
									window.location.reload();
								}}
							>Logout
							</Button>
						</div>
					</div>
				</TabPane>
			</Tabs>
		</div>
	);
};
