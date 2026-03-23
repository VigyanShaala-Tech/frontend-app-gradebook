import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { AppProvider } from '@edx/frontend-platform/react';

import { FooterSlot } from '@edx/frontend-component-footer';
import Header from '@edx/frontend-component-header';

import store from 'data/store';
import GradebookPage from 'containers/GradebookPage';
import './App.scss';
import Head from './head/Head';
import { useState, useEffect } from 'react';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';
import RestrictionPage from './components/restriction-page/RestrictionPage';

const RestrictionWrapper = () => {
  const [hasProfileCompleted, setHasProfileCompleted] = useState(true);
  const [canAccessPage, setCanAccessPage] = useState(true);

  useEffect(() => {
    const { LMS_BASE_URL } = getConfig();

    const loadProfileCompletion = async () => {
      try {
        const client = getAuthenticatedHttpClient();
        const { data } = await client.get(`${LMS_BASE_URL}/profile/progress/?role=student`);
        if (data?.percentage === 100) {
          setHasProfileCompleted(true);
        } else {
          setHasProfileCompleted(false);
        }
        setCanAccessPage(data.hidden);

      } catch (err) {
        console.error('Failed to load profile progress:', err);
        setHasProfileCompleted(false);
      }
    };

    loadProfileCompletion();
  }, []);

  if (!hasProfileCompleted && !canAccessPage) {
    return <RestrictionPage />;
  }
};

const App = () => (
  <AppProvider store={store}>
    <RestrictionWrapper />
    <Head />
    <div>
      <Header />
      <main>
        <Routes>
          <Route
            path="/:courseId"
            element={<GradebookPage />}
          />
        </Routes>
      </main>
      <FooterSlot />
    </div>
  </AppProvider>
);

export default App;
