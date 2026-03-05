import { useReducer, useCallback, useEffect } from 'react';
import { message } from 'antd';
import { fetchUsers, createUser, updateUser, softDeleteUser } from '../services/usersApi';

// ─── Action Types ─────────────────────────────────────────────────
const ACTIONS = {
  FETCH_START: 'FETCH_START',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_ERROR: 'FETCH_ERROR',
  MUTATE_START: 'MUTATE_START',
  ADD_USER: 'ADD_USER',
  UPDATE_USER: 'UPDATE_USER',
  REMOVE_USER: 'REMOVE_USER',
  MUTATE_ERROR: 'MUTATE_ERROR',
  SET_GENDER_FILTER: 'SET_GENDER_FILTER',
};

// ─── Initial State ────────────────────────────────────────────────
const initialState = {
  users: [],
  loading: false,
  mutating: false,
  error: null,
  genderFilter: 'All',
};

// ─── Reducer ──────────────────────────────────────────────────────
function usersReducer(state, action) {
  switch (action.type) {
    case ACTIONS.FETCH_START:
      return { ...state, loading: true, error: null };

    case ACTIONS.FETCH_SUCCESS:
      return { ...state, loading: false, users: action.payload };

    case ACTIONS.FETCH_ERROR:
      return { ...state, loading: false, error: action.payload };

    case ACTIONS.MUTATE_START:
      return { ...state, mutating: true };

    case ACTIONS.ADD_USER:
      return {
        ...state,
        mutating: false,
        users: [action.payload, ...state.users],
      };

    case ACTIONS.UPDATE_USER:
      return {
        ...state,
        mutating: false,
        users: state.users.map((u) =>
          u.id === action.payload.id ? { ...u, ...action.payload } : u
        ),
      };

    case ACTIONS.REMOVE_USER:
      return {
        ...state,
        mutating: false,
        users: state.users.filter((u) => u.id !== action.payload),
      };

    case ACTIONS.MUTATE_ERROR:
      return { ...state, mutating: false };

    case ACTIONS.SET_GENDER_FILTER:
      return { ...state, genderFilter: action.payload };

    default:
      return state;
  }
}

// ─── Hook ─────────────────────────────────────────────────────────
export function useUsers() {
  const [state, dispatch] = useReducer(usersReducer, initialState);

  // Load users on mount
  const loadUsers = useCallback(async () => {
    dispatch({ type: ACTIONS.FETCH_START });
    try {
      const data = await fetchUsers();
      dispatch({ type: ACTIONS.FETCH_SUCCESS, payload: data });
    } catch (err) {
      dispatch({ type: ACTIONS.FETCH_ERROR, payload: err.message });
      message.error(`Failed to load users: ${err.message}`);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Add user
  const addUser = useCallback(async (userData) => {
    dispatch({ type: ACTIONS.MUTATE_START });
    try {
      const newUser = await createUser(userData);
      dispatch({ type: ACTIONS.ADD_USER, payload: newUser });
      message.success(`User "${newUser.name}" created successfully!`);
      return { success: true };
    } catch (err) {
      dispatch({ type: ACTIONS.MUTATE_ERROR });
      message.error(`Failed to create user: ${err.message}`);
      return { success: false, error: err.message };
    }
  }, []);

  // Edit user
  const editUser = useCallback(async (id, userData) => {
    dispatch({ type: ACTIONS.MUTATE_START });
    try {
      const updated = await updateUser(id, userData);
      dispatch({ type: ACTIONS.UPDATE_USER, payload: updated });
      message.success(`User "${updated.name}" updated successfully!`);
      return { success: true };
    } catch (err) {
      dispatch({ type: ACTIONS.MUTATE_ERROR });
      message.error(`Failed to update user: ${err.message}`);
      return { success: false, error: err.message };
    }
  }, []);

  // Soft delete user
  const deleteUser = useCallback(async (id, name) => {
    dispatch({ type: ACTIONS.MUTATE_START });
    try {
      await softDeleteUser(id);
      dispatch({ type: ACTIONS.REMOVE_USER, payload: id });
      message.success(`User "${name}" has been removed.`);
      return { success: true };
    } catch (err) {
      dispatch({ type: ACTIONS.MUTATE_ERROR });
      message.error(`Failed to delete user: ${err.message}`);
      return { success: false, error: err.message };
    }
  }, []);

  // Gender filter
  const setGenderFilter = useCallback((gender) => {
    dispatch({ type: ACTIONS.SET_GENDER_FILTER, payload: gender });
  }, []);

  // Derived: filtered users list
  const filteredUsers =
    state.genderFilter === 'All'
      ? state.users
      : state.users.filter((u) => u.gender === state.genderFilter);

  return {
    users: filteredUsers,
    allUsers: state.users,
    loading: state.loading,
    mutating: state.mutating,
    error: state.error,
    genderFilter: state.genderFilter,
    actions: { loadUsers, addUser, editUser, deleteUser, setGenderFilter },
  };
}
