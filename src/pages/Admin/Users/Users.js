/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { notification, Spin, Table, Input, Space, Button, ConfigProvider } from 'antd';
import es_ES from 'antd/es/locale/es_ES';
import { SearchOutlined, ExportOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import jwtDecode from 'jwt-decode';
import XLSX from 'xlsx';
import { ExportSheet } from 'react-xlsx-sheet';
import { useHistory } from "react-router-dom";

import Socket from '../../../utils/socket';
import { getUsersApi, changeRoleApi, deleteUserApi } from '../../../api/user';
import { getAccessTokenApi } from '../../../api/auth';

import './Users.scss';

const userHeaders = [
    { title: 'ID', dataIndex: '_id' },
    { title: 'Nombre', dataIndex: 'name' },
    { title: 'Apellido', dataIndex: 'lastname' },
    { title: 'Correo', dataIndex: 'email' },
    { title: 'Teléfono', dataIndex: 'phone' },
    { title: 'Empresa', dataIndex: 'enterprise' },
    { title: 'Cargo', dataIndex: 'position' },
    { title: 'Sector', dataIndex: 'sector' },
    { title: 'Rol', dataIndex: 'role' },
    { title: 'Día y hora de registro', dataIndex: 'signUpTime' },
    { title: 'Último inicio de sesión', dataIndex: 'signInTime' },
    { title: 'Última conexión sala de espera', dataIndex: 'waitingRoomTime' },
    { title: 'Última conexión stream', dataIndex: 'streamTime' },
    // { title: 'Última conexión stream 2', dataIndex: 'streamTime2' }
];

let searchInput = "";

export default function Users() {

    const history = useHistory();
    
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [usersData, setUsersData] = useState([]);

    useEffect(() => {
        try {
            setLoading(true);
            let interval;
            const token = getAccessTokenApi();
            if (token === null) {
                history.push("/dashboard/iniciarsesion");
            } else {
                const decodedToken = jwtDecode(token);
                if (decodedToken.role !== 'Admin') {
                    history.push("/dashboard/iniciarsesion");
                } else {
                    const user = {
                        id: decodedToken.id,
                        route: window.location.pathname
                    }
                    Socket.emit('UPDATE_ROUTE', user);
                    interval = setInterval(() => {
                        getUsers(token);
                    }, 5000);
                }
            }
            return () => clearInterval(interval);
        } catch (error) {
            history.push("/dashboard/iniciarsesion");
        }
    }, []);

    const getUsers = async (token) => {
        await getUsersApi(token).then(resp => {
            const arrayUsers = [];
            if (!resp.ok) {
                notification["error"]({
                    message: resp.message
                });
            } else {
                resp.users.forEach(item => {
                    const element = {
                        ...item,
                        key: item._id
                    }
                    arrayUsers.push(element);
                });
            }
            setUsersData(arrayUsers);
            setLoading(false);
        });
    }

    const getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        searchInput = node;
                    }}
                    placeholder={'Buscar'}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Buscar
                    </Button>
                    <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Limpiar
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex]
            ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
            : '',
            onFilterDropdownVisibleChange: visible => {
                if (visible) {
                    setTimeout(() => searchInput.select(), 100);
                }
            },
            render: text =>
                searchedColumn === dataIndex ? (
                    <Highlighter
                        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                        searchWords={[searchText]}
                        autoEscape
                        textToHighlight={text ? text.toString() : ''}
                    />
                ) : (
                    text
                ),
    });

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = clearFilters => {
        clearFilters();
        setSearchText('');
    };

    const changeRole = async user => {
        setLoading(true);
        const token = getAccessTokenApi();
        await changeRoleApi(user._id, token).then(resp => {
            if (!resp.ok) {
                notification["error"]({
                    message: resp.message
                });
            } else {
                notification["success"]({
                    message: resp.message
                });
            }
            getUsers(token);
        });
    }

    const deleteUser = async user => {
        setLoading(true);
        const token = getAccessTokenApi();
        await deleteUserApi(user._id, token).then(resp => {
            if (!resp.ok) {
                notification["error"]({
                    message: resp.message
                });
            } else {
                notification["success"]({
                    message: resp.message
                });
            }
            getUsers(token);
        });
    }

    const columns = [
        {
            title: 'Correo',
            dataIndex: 'email',
            key: 'email',
            fixed: 'left',
            width: 150,
            ...getColumnSearchProps('email'),
        },
        {
            title: 'ID',
            dataIndex: '_id',
            key: '_id',
            width: 150,
            ...getColumnSearchProps('_id'),
        },
        {
            title: 'Nombre',
            dataIndex: 'name',
            key: 'name',
            width: 150,
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Apellido',
            dataIndex: 'lastname',
            key: 'lastname',
            width: 150,
            ...getColumnSearchProps('lastname'),
        },
        {
            title: 'Teléfono',
            dataIndex: 'phone',
            key: 'phone',
            width: 150,
            ...getColumnSearchProps('phone'),
        },
        {
            title: 'Empresa',
            dataIndex: 'enterprise',
            key: 'enterprise',
            width: 150,
            ...getColumnSearchProps('enterprise'),
        },
        {
            title: 'Cargo',
            dataIndex: 'position',
            key: 'position',
            width: 150,
            ...getColumnSearchProps('position'),
        },
        {
            title: 'Sector',
            dataIndex: 'sector',
            key: 'sector',
            width: 150,
            ...getColumnSearchProps('sector'),
        },
        {
            title: 'Rol',
            dataIndex: 'role',
            key: 'role',
            width: 150,
            filters: [
                {
                    text: 'Administrador',
                    value: 'Admin',
                },
                {
                    text: 'Usuario',
                    value: 'User',
                }
            ],
            onFilter: (value, record) => record.role.indexOf(value) === 0
        },
        {
            title: 'Día y hora de registro',
            dataIndex: 'signUpTime',
            key: 'signUpTime',
            width: 150,
            sorter: (a, b) => a.signUpTime.length - b.signUpTime.length,
        },
        {
            title: 'Último inicio de sesión',
            dataIndex: 'signInTime',
            key: 'signInTime',
            width: 150,
            sorter: (a, b) => a.signInTime.length - b.signInTime.length,
        },
        {
            title: 'Última conexión sala de espera',
            dataIndex: 'waitingRoomTime',
            key: 'waitingRoomTime',
            width: 150,
            sorter: (a, b) => a.waitingRoomTime.length - b.waitingRoomTime.length,
        },
        {
            title: 'Última conexión stream',
            dataIndex: 'streamTime',
            key: 'streamTime',
            width: 150,
            sorter: (a, b) => a.streamTime.length - b.streamTime.length,
        },
        {
            title: 'Opción',
            key: 'operation',
            fixed: 'right',
            width: 200,
            render: (text, record) => (
				<>
					{record.role === 'User'
					?
                        <>
                            <a onClick={() => changeRole(record)}>Cambiar Rol</a> / <a onClick={() => deleteUser(record)}>Eliminar</a>
                        </>
					:
						<>
                            <a onClick={() => changeRole(record)}>Cambiar Rol</a>
						</>
					}
				</>
			)
        },
    ];

    return (
        <ConfigProvider locale={es_ES}>
            <Spin spinning={loading} size="large" tip="Cargando...">
                <div className="users">
                    <h1 className="title">Listado de usuarios</h1>
                    <Table columns={columns} dataSource={usersData} bordered pagination={true} scroll={{ x: 1500, y: 300 }} sticky />
                    <ExportSheet
                        header={userHeaders}
                        fileName={`lista_usuarios`}
                        dataSource={usersData}
                        xlsx={XLSX}
                    >
                        <Button className="_btn" style={{position: 'absolute', bottom: '20px'}} icon={<ExportOutlined />} type="danger">Exportar participantes</Button>
                    </ExportSheet>
                </div>
            </Spin>
        </ConfigProvider>
    )
}