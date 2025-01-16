import { Dispatch, SetStateAction } from "react";

export interface User {
  id: string;
  username: string;
  createdAt: string;
  balance: number;
  isAdmin: boolean;
}

export interface Analytics {
  totalTransactions: number;
  transactionsInLast24h: number;
  transactionsByType: {
    deposit: number;
    withdrawal: number;
    game: number;
  };
  topDepositors: {
    username: string;
    totalWon: number;
  }[];
  totalDeposits: number;
  totalWithdrawals: number;
  totalGamesPlayed: number;
  averageTransactionAmount: number;
}

export interface DecodedToken {
  id: string;
}

export interface TransProps {
  id: number;
  type: 'game' | 'deposit' | 'withdrawal';
  amount: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminTableProps {
  users: User[];
  currentAdminId: string | null;
  openModal: (user: User, type: 'delete' | 'changeRole') => void;
}

export interface AdminModalProps {
  selectedUser: User;
  closeModal: () => void;
  actionType: string;
  setUsers: Dispatch<SetStateAction<User[]>>;
  setModalVisible: Dispatch<SetStateAction<boolean>>;
}

export interface LoaderProps {
  width: string;
  height: string;
  border: string;
  marginLeft: string;
  marginRight: string;
}

export interface WalletBalanceProps {
  balance: number;
  setBalance: Dispatch<SetStateAction<number>>;
}

export interface PlayGameResponse {
  balance: number;
  outcome: string;
  message?: string;
}

export interface DashboardData {
  users: User[];
  analytics: Analytics;
  adminId: string;
}

export interface LoginResponse {
  token: string;
  user: {
    isAdmin: boolean;
  };
}