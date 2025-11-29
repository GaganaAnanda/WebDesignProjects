import {
  FETCH_USERS_REQUEST,
  FETCH_USERS_SUCCESS,
  FETCH_USERS_FAILURE
} from '../actions/types';

const initialState = {
  users: [],
  loading: false,
  error: null
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USERS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case FETCH_USERS_SUCCESS:
      return {
        ...state,
        users: action.payload,
        loading: false,
        error: null
      };
    case FETCH_USERS_FAILURE:
      return {
        ...state,
        users: [],
        loading: false,
        error: action.payload
      };
    default:
      return state;
  }
};

export default userReducer;
