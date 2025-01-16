import { AdminModalProps, User } from '@/types';
import { getCookie } from '@/utils/cookie';
import {  useState } from 'react';

export default function AdminModal({
    closeModal,
    selectedUser,
    setUsers,
    setModalVisible,
    actionType,
}: 
    AdminModalProps
) {
    const [processing, setProcessing] = useState<boolean>(false);

    const handleDeleteUser = async (id: string) => {
        const token = getCookie('token');
        setProcessing(true);

        try {
            const response = await fetch(`http://localhost:8080/api/admin/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error('Failed to delete user');

                setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
                setModalVisible(false);
                setProcessing(false);
        } catch (error) {
            console.error('Error:', error);
            setProcessing(false);
        }
    };

    const handleChangeRole = async (selectedUser: User) => {
        const token = getCookie('token');
        setProcessing(true);

        try {
            const response = await fetch(`http://localhost:8080/api/admin/role`, {
                method: 'PATCH',
                headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                userId: selectedUser.id,
                isAdmin: !selectedUser.isAdmin,
                }),
            });

            if (!response.ok) throw new Error('Failed to change user role');
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                user.id === selectedUser.id
                    ? { ...user, isAdmin: !user.isAdmin }
                    : user,
                ),
            );
            setModalVisible(false);
            setProcessing(false);
        } catch (error) {
            console.error('Error:', error);
            setProcessing(false);
        }
    };

    return (
        <>
            <div
                className="fixed text-black inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50"
                onClick={closeModal} 
            >
                <div
                    className="bg-white p-6 rounded-lg shadow-lg max-w-sm"
                    onClick={(e) => e.stopPropagation()} 
                >
                    <h2 className="text-lg font-bold mb-4">
                        {actionType === 'delete'
                        ? 'Confirm User Deletion'
                        : 'Confirm Role Change'}
                    </h2>
                    <p className="mb-4">
                        Are you sure you want to{' '}
                        {actionType === 'delete'
                        ? `delete user "${selectedUser.username}"?`
                        : `change the role of "${selectedUser.username}"?`}
                    </p>
                    <div className="flex justify-end space-x-4">
                        <button
                            onClick={closeModal}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        >
                        Cancel
                        </button>
                        <button
                        onClick={() =>
                            actionType === 'delete'
                            ? handleDeleteUser(selectedUser.id)
                            : handleChangeRole(selectedUser)
                        }
                        disabled={processing}
                        className={`px-4 py-2 rounded text-white transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed ${
                            actionType === 'delete'
                            ? 'bg-red-500 hover:bg-red-600'
                            : 'bg-blue-500 hover:bg-blue-600'
                        }`}
                        >
                        {processing ? 'Loading' : 'Confirm'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
