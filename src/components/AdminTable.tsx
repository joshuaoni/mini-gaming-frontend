import { AdminTableProps } from "@/types";
import Image from "next/image";

export default function AdminTable({
    users,
    currentAdminId,
    openModal,
}: 
    AdminTableProps
) {
    return (
        <>
          {users.length ? (
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Manage Users</h2>
          ) : (
            ''
          )}
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse shadow-lg rounded-lg text-black">
              {users.length ? (
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="p-4 text-left">Name</th>
                    <th className="p-4 text-left">Balance</th>
                    <th className="p-4 text-left">Role</th>
                    <th className="p-4 text-left">Actions</th>
                    <th className="p-4 text-left">Joined</th>
                  </tr>
                </thead>
              ) : (
                ''
              )}
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="odd:bg-gray-100 even:bg-gray-200 hover:bg-gray-300"
                  >
                    <td className="p-4">{user.username}</td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <Image
                          src="/btc.png"
                          alt="Bitcoin Icon"
                          width={18}
                          height={18}
                          className="mr-[2px] pb-[2px]"
                        />
                        {user.balance}
                      </div>
                    </td>
                    <td className="p-4">{user.isAdmin ? 'Admin' : 'User'}</td>
                    <td className="p-4">
                      {currentAdminId !== user.id && (
                        <>
                          <button
                            onClick={() => openModal(user, 'changeRole')}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
                          >
                            Change Role
                          </button>
                          <button
                            onClick={() => openModal(user, 'delete')}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                    <td className="p-4">{new Date(user.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      );
      
}
