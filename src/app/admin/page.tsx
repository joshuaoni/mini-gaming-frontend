'use client';

import { useState, useEffect } from 'react';
import Loader from '@/components/Loader';
import NavBar from '@/components/NavBar';
import AdminAnalytics from '@/components/AdminAnalytics';
import AdminTable from '@/components/AdminTable';
import AdminModal from '@/components/AdminModal';
import { Analytics, DecodedToken, User } from '@/types';
import { fetchDashboardData } from '@/services';

export default function AdminDashboard() {
    const [users, setUsers] = useState<User[]>([]);
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [actionType, setActionType] = useState<'delete' | 'changeRole' | null>(null,);
    const [currentAdminId, setCurrentAdminId] = useState<string | null>(null);

    useEffect(() => {
        const loadDashboardData = async () => {
            setLoading(true);

            try {
                const { users, analytics, adminId } = await fetchDashboardData();
                setUsers(users);
                setAnalytics(analytics);
                setCurrentAdminId(adminId);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    const openModal = (user: User, type: 'delete' | 'changeRole') => {
        setSelectedUser(user);
        setActionType(type);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedUser(null);
        setActionType(null);
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <NavBar />

            <div className="p-8 mt-16">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    Admin Dashboard
                </h1>

                {loading ? (
                    <>
                    <p className="mt-36"></p>
                    <Loader
                        height="50px"
                        width="50px"
                        border="5px"
                        marginLeft="0px"
                        marginRight="0px"
                    />
                    </>
                ) : (
                    <>
                    <AdminAnalytics analytics={analytics} />

                    <AdminTable
                        users={users}
                        currentAdminId={currentAdminId}
                        openModal={openModal}
                    />
                    </>
                )}
            </div>

            {modalVisible && selectedUser && actionType && (
            <AdminModal
                closeModal={closeModal}
                selectedUser={selectedUser}
                actionType={actionType}
                setUsers={setUsers}
                setModalVisible={setModalVisible}
            />
            )}
        </div>
    );
}
