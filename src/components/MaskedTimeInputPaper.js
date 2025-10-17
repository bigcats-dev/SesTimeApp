import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import { TextInput } from 'react-native-paper';

export default function MaskedTimeInputPaper({ label, time, setTime }) {
  return (
    <TextInput
      label={label}
      value={time}
      onChangeText={setTime}
      keyboardType="numeric"
      render={(inputProps) => (
        <TextInputMask
          {...inputProps}
          type={'custom'}
          options={{ mask: '99:99' }}
          value={time}
          onChangeText={setTime}
        />
      )}
    />
  );
}