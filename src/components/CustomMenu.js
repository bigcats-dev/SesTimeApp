import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Portal, Card, Divider, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function CustomMenu({ anchorText, items, onSelect }) {
  const [visible, setVisible] = useState(false);
  return (
    <View>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: '#7d7d7dff', 
          paddingVertical: 10,
          paddingHorizontal: 16,
          borderRadius: 20,
          backgroundColor: '#ece6efff',
        }}
      >
        <Text style={{ fontSize: 16 }}>{anchorText}</Text>
        <MaterialCommunityIcons name="chevron-down" size={22} color="#ef1b27" />
      </TouchableOpacity>

      {visible && (
        <Portal>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setVisible(false)}
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.3)',
            }}
          />
          <Card
            style={{
              position: 'absolute',
              top: 200,
              left: 30,
              right: 30,
              borderRadius: 12,
              elevation: 4,
              backgroundColor: 'white',
            }}
          >
            {items.map(({id, name}, index) => (
              <React.Fragment key={index}>
                <TouchableOpacity
                  onPress={() => {
                    onSelect({id, name});
                    setVisible(false);
                  }}
                  style={{ padding: 16 }}
                >
                  <Text style={{fontSize: 16}}>{name}</Text>
                </TouchableOpacity>
                {index < items.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </Card>
        </Portal>
      )}
    </View>
  );
}
