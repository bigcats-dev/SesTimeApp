module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      'babel-preset-expo',
      '@babel/preset-flow'       // ← เพิ่มตรงนี้
    ],
    plugins: [
      'react-native-worklets/plugin', // ← เปลี่ยนจาก reanimated เป็น worklets
    ],
  };
};
