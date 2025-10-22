import React from 'react';
import { Portal, Dialog, Paragraph, Button } from 'react-native-paper';

const ConfirmDialog = ({
  visible,
  onDismiss,
  onConfirm,
  title = 'ยืนยันการกระทำ',
  message = 'คุณแน่ใจหรือไม่ว่าต้องการดำเนินการนี้?'
}) => {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>
          <Paragraph>{message}</Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>ยกเลิก</Button>
          <Button onPress={onConfirm}>ยืนยัน</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default React.memo(ConfirmDialog);
