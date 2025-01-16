import { TransProps, User } from '@/types';
import { jwtDecode } from 'jwt-decode';
import { DashboardData, DecodedToken, LoginResponse, PlayGameResponse } from '@/types';
import { getCookie } from '@/utils/cookie';

export const fetchBalance = async (): Promise<number> => {
  const token = getCookie('token');
  const response = await fetch('https://mini-gaming-backend.onrender.com/api/wallet/balance', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch balance');
  }

  const data = await response.json();
  return data.balance;
};

export const playGame = async (
  amount: number,
  coinFace: 'head' | 'tail',
): Promise<PlayGameResponse> => {
  if (amount <= 0) {
    throw new Error('Amount must be greater than 0.');
  }

  if (!coinFace) {
    throw new Error('Coin face must be selected.');
  }

  const clientSeed = Math.random().toString(36).substring(2, 15);
  const token = getCookie('token');

  const response = await fetch('https://mini-gaming-backend.onrender.com/api/game/play', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ amount, clientSeed, coinFace }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'An error occurred while playing the game.');
  }

  return {
    balance: data.balance,
    outcome: data.outcome,
  };
};

export const fetchDashboardData = async (): Promise<DashboardData> => {
  const token: string = getCookie('token');
  const decodedToken: DecodedToken = jwtDecode(token);

  const usersResponse = await fetch('https://mini-gaming-backend.onrender.com/api/admin', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

  const usersData = await usersResponse.json();
  if (!usersResponse.ok) {
    throw new Error(usersData.error || 'Failed to fetch users');
  }

  const analyticsResponse = await fetch('https://mini-gaming-backend.onrender.com/api/admin/analytics', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

  const analyticsData = await analyticsResponse.json();
  if (!analyticsResponse.ok) {
    throw new Error(analyticsData.error || 'Failed to fetch analytics');
  }

  return {
    users: usersData,
    analytics: analyticsData,
    adminId: decodedToken.id,
  };
};

export const loginUser = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  const response = await fetch('https://mini-gaming-backend.onrender.com/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Login failed');
  }

  return data;
};

export const registerUser = async (
  username: string,
  password: string
): Promise<void> => {
  const response = await fetch('https://mini-gaming-backend.onrender.com/api/users/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Registration failed');
  }
};



export const fetchTransactions = async (
  token: string,
  offset: number,
  limit: number
): Promise<{ transactions: TransProps[]; hasMore: boolean }> => {
  const response = await fetch(
    `https://mini-gaming-backend.onrender.com/api/wallet/transactions?limit=${limit}&offset=${offset}`,
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch transactions: ${response.statusText}`);
  }

  const data = await response.json();

  return {
    transactions: data.transactions,
    hasMore: data.transactions.length === limit,
  };
};

export const handleWalletAction = async (
  action: 'deposit' | 'withdraw',
  amount: number
): Promise<{ balance: number }> => {
  const token = getCookie('token');
  if (!token) throw new Error('No token provided');

  const response = await fetch(`https://mini-gaming-backend.onrender.com/api/wallet/${action}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ amount }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to process request');
  }

  return response.json();
};


export const handleDeleteUser = async (id: string, setUsers: Function, setModalVisible: Function) => {
  const token = getCookie('token');

  try {
    const response = await fetch(`https://mini-gaming-backend.onrender.com/api/admin/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error('Failed to delete user');

    setUsers((prevUsers: User[]) => prevUsers.filter((user) => user.id !== id));
    setModalVisible(false);
  } catch (error) {
    console.error('Error:', error);
  }
};

export const handleChangeRole = async (selectedUser: User, setUsers: Function, setModalVisible: Function) => {
  const token = getCookie('token');

  try {
    const response = await fetch(`https://mini-gaming-backend.onrender.com/api/admin/role`, {
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

    setUsers((prevUsers: User[]) =>
      prevUsers.map((user) =>
        user.id === selectedUser.id ? { ...user, isAdmin: !user.isAdmin } : user
      )
    );
    setModalVisible(false);
  } catch (error) {
    console.error('Error:', error);
  }
};
