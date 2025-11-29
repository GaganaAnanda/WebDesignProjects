import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from '@redux-devtools/extension';
import authReducer from './reducers/authReducer';
import userReducer from './reducers/userReducer';
import jobReducer from './reducers/jobReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  users: userReducer,
  jobs: jobReducer
});

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;
