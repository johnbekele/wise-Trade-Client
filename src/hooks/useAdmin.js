import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE_URL } from '../config/config';

const fetchAllUsers = async () => {
  const response = await axios.get(`${API_BASE_URL}/admin/users`);
  return response.data;
};

const fetchUserById = async (userId) => {
  const response = await axios.get(`${API_BASE_URL}/admin/users/${userId}`);
  return response.data;
};

const createUser = async (userData) => {
  const response = await axios.post(`${API_BASE_URL}/admin/users`, userData);
  return response.data;
};

const updateUser = async ({ userId, userData }) => {
  const response = await axios.put(`${API_BASE_URL}/admin/users/${userId}`, userData);
  return response.data;
};

const updateUserPassword = async ({ userId, newPassword }) => {
  const response = await axios.put(`${API_BASE_URL}/admin/users/${userId}/password`, {
    new_password: newPassword
  });
  return response.data;
};

const toggleAiAccess = async ({ userId, blocked }) => {
  const response = await axios.put(`${API_BASE_URL}/admin/users/${userId}/block-ai?blocked=${blocked}`);
  return response.data;
};

const deleteUser = async (userId) => {
  const response = await axios.delete(`${API_BASE_URL}/admin/users/${userId}`);
  return response.data;
};

const fetchAdminStats = async () => {
  const response = await axios.get(`${API_BASE_URL}/admin/stats`);
  return response.data;
};

export function useAllUsers() {
  return useQuery({
    queryKey: ['adminUsers'],
    queryFn: fetchAllUsers,
    staleTime: 30000,
    retry: 1,
  });
}

export function useUser(userId) {
  return useQuery({
    queryKey: ['adminUser', userId],
    queryFn: () => fetchUserById(userId),
    enabled: !!userId,
    staleTime: 30000,
  });
}

export function useAdminStats() {
  return useQuery({
    queryKey: ['adminStats'],
    queryFn: fetchAdminStats,
    staleTime: 60000,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUser,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      queryClient.invalidateQueries({ queryKey: ['adminUser', variables.userId] });
    },
  });
}

export function useUpdatePassword() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUserPassword,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['adminUser', variables.userId] });
    },
  });
}

export function useToggleAiAccess() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleAiAccess,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      queryClient.invalidateQueries({ queryKey: ['adminUser', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
    },
  });
}
