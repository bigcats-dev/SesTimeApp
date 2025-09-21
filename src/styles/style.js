import { StyleSheet } from 'react-native'; 
// #ef1b27
export default StyleSheet.create({ 
 
  //login
  containerLogin: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',  
    paddingHorizontal: 32,
  },
  titleLogin: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ff3b30',  
    marginBottom: 40,
    textAlign: 'center',
  },
  inputLog: {
    width: '100%',
    marginBottom: 20,
    backgroundColor: '#2c2c2c',  
    color: '#fff',  
  },
  buttonLog: {
    width: '100%',
    paddingVertical: 10,
    backgroundColor: '#ff3b30',  
    borderRadius: 8,
  },
  // Dashboard
  appbar: {
    backgroundColor: '#1e1e1e', 
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#121212', 
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  cardMenu: {
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
    marginBottom: 16,
    // Shadow iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    // Shadow Android
    elevation: 6,
  },
  cardText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

