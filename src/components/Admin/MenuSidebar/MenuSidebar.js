import React from 'react';

import { Link, withRouter } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { HomeOutlined, UserOutlined, HistoryOutlined, ClockCircleOutlined, QuestionOutlined, TagOutlined, ScheduleOutlined } from '@ant-design/icons';

import './MenuSidebar.scss';

function MenuSidebar(props) {

    const { menuCollapsed, location } = props; 
    const { Sider } = Layout;

    return (
        <Sider className="admin-sider" collapsed={menuCollapsed}>
            <Menu theme="dark" mode="inline" defaultSelectedKeys={[location.pathname]}>
                <Menu.Item key="/dashboard">
                    <Link to={"/dashboard"}>
                        <HomeOutlined />
                        <span className="nav-text">Home</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="/dashboard/tiemporeal">
                    <Link to={"/dashboard/tiemporeal"}>
                        <ClockCircleOutlined />
                        <span className="nav-text">Tiempo Real</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="/dashboard/historial">
                    <Link to={"/dashboard/historial"}>
                        <HistoryOutlined />
                        <span className="nav-text">Historial de conexión</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="/dashboard/usuarios">
                    <Link to={"/dashboard/usuarios"}>
                        <UserOutlined />
                        <span className="nav-text">Usuarios</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="/dashboard/preguntas">
                    <Link to={"/dashboard/preguntas"}>
                        <QuestionOutlined />
                        <span className="nav-text">Preguntas</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="/dashboard/eventos">
                    <Link to={"/dashboard/eventos"}>
                        <TagOutlined />
                        <span className="nav-text">Eventos</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="/dashboard/agenda">
                    <Link to={"/dashboard/agenda"}>
                        <ScheduleOutlined />
                        <span className="nav-text">Conexiones charla</span>
                    </Link>
                </Menu.Item>
                {/* <Menu.Item key="/dashboard/opciones">
                    <Link to={"/dashboard/opciones"}>
                        <SettingOutlined />
                        <span className="nav-text">Opciones</span>
                    </Link>
                </Menu.Item> */}
            </Menu>
        </Sider>
    );
}

export default withRouter(MenuSidebar);