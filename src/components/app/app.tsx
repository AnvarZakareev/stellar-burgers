import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader } from '@components';
import { Preloader } from '@ui';
import { useEffect } from 'react';
import { ImportsNotUsedAsValues } from 'typescript';

const App = () => {
  useEffect(() => {}, []);

  /** TODO: взять переменные из стора */
  const isIngredientsLoading = false;
  const ingredients = [];
  const error = null;

  return (
    <div className={styles.app}>
      <AppHeader />
      {/* {isIngredientsLoading ? (
        <Preloader />
      ) : error ? (
        <div className={`${styles.error} text text_type_main-medium pt-4`}>
          {error}
        </div>
      ) : ingredients.length > 0 ? ( */}
      <Routes
      // location={}
      >
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
      </Routes>
      {/* ) : (
        // <ConstructorPage />
        <div className={`${styles.title} text text_type_main-medium pt-4`}>
          Нет игредиентов
        </div>
      )} */}
    </div>
  );
};

export default App;
