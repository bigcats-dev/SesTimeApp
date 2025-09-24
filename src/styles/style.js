import { StyleSheet } from 'react-native'; 
// #ef1b27
export default StyleSheet.create({ 
  //DrawerContent
 
  DrawerContent: {
    backgroundColor: '#1e1e1e',
    flex: 1,
    paddingLeft: 0
  }, 
  DrawerItemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingLeft: 0
  },
  DrawerItem:{ 
    color: '#fff',
    fontSize: 18, 
    paddingVertical: 4, 
    paddingLeft: 10
  },
 
 
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
    height: 60,
    marginBottom: 20,
    backgroundColor: '#2c2c2c',  
    color: '#fff',  
    borderRadius: 8,
  },
  buttonLog: {
    width: '100%', 
    backgroundColor: '#ff3b30',  
    borderRadius: 8,
  },
  labelStyleLog: {
    color: '#fff', 
    fontSize: 18,
    paddingVertical: 6,
    paddingHorizontal: 6,
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
  // Checkin 
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerCheckin: {
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  textCheckin: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
    color: '#333',
  },
  textH1: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 12,
    color: '#ff3b30', 
    marginBottom: 10
  },
  buttonCheck: {
    width: '80%', 
    backgroundColor: '#ff3b30',  
    borderRadius: 8,
    margin: "auto"
  },
  labelStyleCheck: {
    color: '#fff', 
    fontSize: 20,
    paddingVertical: 18,
    paddingVertical: 18,
  },

  
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  tipCard: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 2,
  },
  tipTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  tipDesc: {
    fontSize: 13,
    color: '#666',
  },

  // Leave  
 
  leaveCard: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8, 
    elevation: 6,
  },
  leaveType: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#ff3b30',
  },
  leaveText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },
  bottomBar: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  addButton: {
    borderRadius: 12,
    backgroundColor: '#ef1b27',
    paddingVertical: 6,
  },
  optleave:{ 
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ef1b27',
    backgroundColor: '#f0f5ff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    flexDirection: 'row', 
    marginBottom: 10,
  },
  inputleave: { 
    marginBottom: 0,
    backgroundColor: '#fff',  
    color: '#fff',  
    borderRadius: 8,
  },
});

