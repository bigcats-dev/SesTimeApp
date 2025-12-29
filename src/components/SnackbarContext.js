// SnackbarContext.js
import React, { createContext, useContext, useState } from 'react';
import { Snackbar } from 'react-native-paper';

const SnackbarContext = createContext();

export const useSnackbar = () => useContext(SnackbarContext);

export const SnackbarProvider = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [action, setAction] = useState(null);

  const showSnackbar = (msg, act = null) => {
    setMessage(msg);
    setAction(act);
    setVisible(true);
  };

  const hideSnackbar = () => setVisible(false);

  return (
    <SnackbarContext.Provider value={{ showSnackbar, hideSnackbar }}>
      {children}
      <Snackbar
        visible={visible}
        onDismiss={hideSnackbar}
        action={action}
        duration={3000}
      >
        {message}
      </Snackbar>
    </SnackbarContext.Provider>
  );
};