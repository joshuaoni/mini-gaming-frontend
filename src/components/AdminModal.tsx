import { handleChangeRole, handleDeleteUser } from '@/services';
import { AdminModalProps, User } from '@/types';
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

    const handleDelete = async (id: string) => {
        setProcessing(true);
        await handleDeleteUser(id, setUsers, setModalVisible);
        setProcessing(false);
    };

    const handleRoleChange = async (user: User) => {
        setProcessing(true);
        await handleChangeRole(user, setUsers, setModalVisible);
        setProcessing(false);
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
                            ? handleDelete(selectedUser.id)
                            : handleRoleChange(selectedUser)
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
