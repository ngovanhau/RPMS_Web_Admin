import { create } from 'zustand';
import { User } from '@/types/types';

interface AccountStore {
  accounts: User[]; // Danh sách các tài khoản (User)
  accountManageByBuilding: User[]; // Danh sách tài khoản quản lý theo building
  addAccount: (account: User) => void; // Hàm thêm tài khoản
  addAccounts: (accounts: User[]) => void; // Hàm thêm nhiều tài khoản
  setAccountManageByBuilding: (accounts: User[]) => void; // Hàm cập nhật accountManageByBuilding
  updateAccount: (username: string, updatedAccount: Partial<User>) => void; // Hàm cập nhật tài khoản
  removeAccount: (username: string) => void; // Hàm xóa tài khoản
  clearAccounts: () => void; // Hàm xóa tất cả tài khoản
  getAccountByUsername: (username: string) => User | undefined; // Hàm lấy tài khoản theo username
}

const useAccountStore = create<AccountStore>((set, get) => ({
  accounts: [],
  accountManageByBuilding: [],

  addAccount: (account: User): void =>
    set((state) => ({
      accounts: account.role !== "USER" ? [...state.accounts, account] : state.accounts,
    })),

  addAccounts: (newAccounts: User[]): void =>
    set((state) => {
      const filteredAccounts = newAccounts.filter((account) => account.role !== "USER");
      const uniqueAccountsMap = new Map<string, User>();
      state.accounts.forEach((account) => uniqueAccountsMap.set(account.username, account));
      filteredAccounts.forEach((account) => uniqueAccountsMap.set(account.username, account));

      return {
        accounts: Array.from(uniqueAccountsMap.values()),
      };
    }),

    setAccountManageByBuilding: (accounts: User[]): void =>
      set(() => ({
        accountManageByBuilding: [...accounts], 
      })),

  updateAccount: (username: string, updatedAccount: Partial<User>): void =>
    set((state) => ({
      accounts: state.accounts.map((account) =>
        account.username === username
          ? { ...account, ...updatedAccount, role: updatedAccount.role !== "USER" ? updatedAccount.role : account.role }
          : account
      ),
    })),

  removeAccount: (username: string): void =>
    set((state) => ({
      accounts: state.accounts.filter((account) => account.username !== username),
    })),

  clearAccounts: (): void =>
    set(() => ({
      accounts: [],
      accountManageByBuilding: [],
    })),

  getAccountByUsername: (username: string): User | undefined => {
    const accounts = get().accounts;
    return accounts.find((account) => account.username === username);
  },
}));

export default useAccountStore;
