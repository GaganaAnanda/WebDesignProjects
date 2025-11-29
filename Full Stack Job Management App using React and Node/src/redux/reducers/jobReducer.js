import {
  FETCH_JOBS_REQUEST,
  FETCH_JOBS_SUCCESS,
  FETCH_JOBS_FAILURE,
  CREATE_JOB_REQUEST,
  CREATE_JOB_SUCCESS,
  CREATE_JOB_FAILURE,
  CLEAR_JOB_MESSAGE
} from '../actions/types';

const initialState = {
  jobs: [],
  loading: false,
  error: null,
  message: null,
  createdJob: null
};

const jobReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_JOBS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case FETCH_JOBS_SUCCESS:
      return {
        ...state,
        jobs: action.payload,
        loading: false,
        error: null
      };
    case FETCH_JOBS_FAILURE:
      return {
        ...state,
        jobs: [],
        loading: false,
        error: action.payload
      };
    case CREATE_JOB_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        message: null
      };
    case CREATE_JOB_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        message: action.payload.message,
        createdJob: action.payload.job,
        jobs: [action.payload.job, ...state.jobs]
      };
    case CREATE_JOB_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        message: null
      };
    case CLEAR_JOB_MESSAGE:
      return {
        ...state,
        message: null,
        error: null
      };
    default:
      return state;
  }
};

export default jobReducer;
