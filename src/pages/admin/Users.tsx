import { useEffect, useState } from 'react'
import { collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore'
import { db } from '../../config/firebase'
import type { User } from '../../types'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { format } from 'date-fns'

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'))
        const querySnapshot = await getDocs(q)

        const usersData: User[] = []
        querySnapshot.forEach((doc) => {
          usersData.push({ id: doc.id, ...doc.data() } as User)
        })

        setUsers(usersData)
      } catch (error) {
        console.error('Error fetching users:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-neutral-100">Manage Users</h1>
        <div className="relative inline-flex items-center">
          <input
            type="text"
            placeholder="Search users..."
            className="pl-10 pr-4 py-2 text-xs font-semibold bg-neutral-900 border border-neutral-800 rounded-full text-neutral-100 placeholder-neutral-300 focus:outline-none focu:ring-2 focu:ring-blue-500 focus:border-transparent"
          />
          <svg
            className="absolute left-4 top-[9px] h-4 w-4 text-neutral-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <div className="bg-neutral-900 rounded-xl shadow-lg overflow-hidden border border-neutral-800">
        <table className="min-w-full divide-y divide-neutral-700">
          <thead className="bg-neutral-900">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 tracking-wider">
                <div className="flex items-center">
                  Name
                  <button className="ml-1">
                    <svg className="w-3 h-3 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </button>
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 tracking-wider">Email</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 tracking-wider">Phone</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 tracking-wider">
                <div className="flex items-center">
                  Joined
                  <button className="ml-1">
                    <svg className="w-3 h-3 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </button>
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 tracking-wider">Role</th>
              <th className="px-6 py-4 text-center text-xs font-medium text-neutral-400 tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-neutral-900 divide-y divide-neutral-800">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-neutral-750 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-neutral-700 flex items-center justify-center text-neutral-400">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-neutral-100">{user.name}</div>
                      <div className="text-xs text-neutral-400">@{user.email || 'user'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-neutral-300">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-neutral-400">{user.phone || '-'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-neutral-400">
                    {user.createdAt
                      ? format(
                        user.createdAt instanceof Timestamp
                          ? user.createdAt.toDate()
                          : new Date(user.createdAt),
                        'MMM dd, yyyy'
                      )
                      : 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.admin
                    ? 'bg-emerald-900/30 text-emerald-300'
                    : 'bg-blue-900/30 text-blue-300'
                    }`}>
                    {user.admin ? 'Admin' : 'User'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium">
                  <button className="py-1.5 px-4 bg-neutral-100 rounded-full text-neutral-800 hover:bg-neutral-950 hover:text-neutral-100 mr-4">
                    Edit
                  </button>
                  <button className="py-1.5 px-4 bg-neutral-100 rounded-full text-neutral-800 hover:bg-neutral-950 hover:text-neutral-100">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {/* <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-neutral-400">
          Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of <span className="font-medium">24</span> users
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 rounded-md bg-neutral-800 text-neutral-400 border border-neutral-700 hover:bg-neutral-700 disabled:opacity-50">
            Previous
          </button>
          <button className="px-3 py-1 rounded-md bg-neutral-800 text-neutral-400 border border-neutral-700 hover:bg-neutral-700 disabled:opacity-50">
            Next
          </button>
        </div>
      </div> */}
    </div>
  )
}
